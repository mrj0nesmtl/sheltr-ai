// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SHELTR.sol";

contract SHELTRTokenTest is Test {
    SHELTR public token;
    address public owner;
    address public teamMember;
    address public user;
    
    function setUp() public {
        owner = address(this);
        teamMember = address(0x123);
        user = address(0x456);
        
        token = new SHELTR();
    }
    
    function testInitialState() public {
        assertEq(token.name(), "SHELTR Token");
        assertEq(token.symbol(), "SHELTR");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), token.MAX_SUPPLY());
        assertEq(token.balanceOf(owner), token.MAX_SUPPLY());
        assertEq(token.owner(), owner);
    }
    
    function testAddTeamMember() public {
        uint256 vestingAmount = 10_000_000 * 10**18;
        uint256 startTime = block.timestamp + 30 days;
        uint256 duration = 365 days;
        
        token.addTeamMember(teamMember, vestingAmount, startTime, duration);
        
        assertTrue(token.isTeamMember(teamMember));
        
        SHELTR.VestingSchedule memory schedule = token.getVestingSchedule(teamMember);
        assertEq(schedule.totalAmount, vestingAmount);
        assertEq(schedule.startTime, startTime);
        assertEq(schedule.duration, duration);
        assertTrue(schedule.isActive);
    }
    
    function testFailAddTeamMemberTwice() public {
        uint256 vestingAmount = 10_000_000 * 10**18;
        uint256 startTime = block.timestamp + 30 days;
        uint256 duration = 365 days;
        
        token.addTeamMember(teamMember, vestingAmount, startTime, duration);
        
        // Should fail when trying to add the same member again
        vm.expectRevert("Already a team member");
        token.addTeamMember(teamMember, vestingAmount, startTime, duration);
    }
    
    function testVestingCalculation() public {
        uint256 vestingAmount = 100_000 * 10**18; // 100k tokens
        uint256 startTime = block.timestamp;
        uint256 duration = 365 days;
        
        token.addTeamMember(teamMember, vestingAmount, startTime, duration);
        
        // After 6 months (50% vested)
        vm.warp(startTime + 182 days);
        uint256 vestedAmount = token.getVestedAmount(teamMember);
        assertApproxEqRel(vestedAmount, vestingAmount / 2, 0.01e18); // Within 1%
        
        // After full duration (100% vested)
        vm.warp(startTime + duration);
        vestedAmount = token.getVestedAmount(teamMember);
        assertEq(vestedAmount, vestingAmount);
    }
    
    function testReleaseVestedTokens() public {
        uint256 vestingAmount = 100_000 * 10**18;
        uint256 startTime = block.timestamp;
        uint256 duration = 365 days;
        
        token.addTeamMember(teamMember, vestingAmount, startTime, duration);
        
        // Warp to 6 months
        vm.warp(startTime + 182 days);
        
        uint256 balanceBefore = token.balanceOf(teamMember);
        token.releaseVestedTokens(teamMember);
        uint256 balanceAfter = token.balanceOf(teamMember);
        
        assertGt(balanceAfter, balanceBefore);
        
        // Check that released amount is tracked
        SHELTR.VestingSchedule memory schedule = token.getVestingSchedule(teamMember);
        assertGt(schedule.releasedAmount, 0);
    }
    
    function testMintTokens() public {
        uint256 mintAmount = 1_000_000 * 10**18;
        uint256 balanceBefore = token.balanceOf(user);
        
        token.mint(user, mintAmount);
        
        uint256 balanceAfter = token.balanceOf(user);
        assertEq(balanceAfter, balanceBefore + mintAmount);
    }
    
    function testFailMintExceedsMaxSupply() public {
        // Since total supply is already at max, any mint should fail
        vm.expectRevert("Exceeds max supply");
        token.mint(user, 1);
    }
    
    function testBurnTokens() public {
        uint256 mintAmount = 1_000_000 * 10**18;
        token.mint(user, mintAmount);
        
        uint256 burnAmount = 500_000 * 10**18;
        uint256 balanceBefore = token.balanceOf(user);
        
        vm.prank(user);
        token.burn(burnAmount);
        
        uint256 balanceAfter = token.balanceOf(user);
        assertEq(balanceAfter, balanceBefore - burnAmount);
    }
    
    function testPauseAndUnpause() public {
        assertFalse(token.paused());
        
        token.pause();
        assertTrue(token.paused());
        
        token.unpause();
        assertFalse(token.paused());
    }
    
    function testFailTransferWhenPaused() public {
        uint256 amount = 1_000 * 10**18;
        token.mint(user, amount);
        
        token.pause();
        
        vm.prank(user);
        vm.expectRevert("Token transfers paused");
        token.transfer(owner, amount);
    }
    
    function testFailNonOwnerMint() public {
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, 1_000 * 10**18);
    }
    
    function testFailNonOwnerPause() public {
        vm.prank(user);
        vm.expectRevert();
        token.pause();
    }
}
