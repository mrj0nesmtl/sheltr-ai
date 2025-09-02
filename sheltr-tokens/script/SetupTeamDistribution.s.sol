// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SHELTR.sol";

contract SetupTeamDistribution is Script {
    // Team member addresses (to be filled with actual addresses)
    address constant JOEL_Y = 0x1234567890123456789012345678901234567890; // Joel Y.
    address constant DOUG_K = 0x2345678901234567890123456789012345678901; // Doug K.
    address constant SASKO_D = 0x3456789012345678901234567890123456789012; // Sasko D.
    address constant ALEX_K = 0x4567890123456789012345678901234567890123; // Alex K.
    address constant ZAFFIA_L = 0x7890123456789012345678901234567890123456; // Zaffia L.
    address constant AMI_R = 0x8901234567890123456789012345678901234567; // Ami R.
    address constant MARC_R = 0x9012345678901234567890123456789012345678; // Marc R.
    address constant MORGAN_H = 0xA012345678901234567890123456789012345678; // Morgan H.
    address constant DOMINIQUE_L = 0xB012345678901234567890123456789012345678; // Dominique L.
    address constant SARA_S = 0xC012345678901234567890123456789012345678; // Sara S.
    address constant SEN_W = 0xD012345678901234567890123456789012345678; // Sen W.
    address constant ZEL_A = 0xD012345678901234567890123456789012345678; // Zel A.

    // Partner addresses
    address constant PARTNER_1 = 0xE012345678901234567890123456789012345678; // Strategic Partner 1
    address constant PARTNER_2 = 0xF012345678901234567890123456789012345678; // Strategic Partner 2
    
    // Total team allocation: 15M tokens (15% of 100M)
    uint256 public constant TOTAL_TEAM_ALLOCATION = 15_000_000 * 10**18;
    
    // Immediate allocations (no vesting) - Exact breakdown
    uint256 public constant JOEL_ALLOCATION = 3_000_000 * 10**18; // 3M (3% of total supply) - IMMEDIATE
    uint256 public constant DOUG_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply) - IMMEDIATE
    uint256 public constant ALEX_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply) - IMMEDIATE
    
    // Vesting allocations (3-year schedule) - Exact breakdown
    uint256 public constant SASKO_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant ZEL_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant ZAFFIA_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant AMI_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant MARC_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant MORGAN_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant DOMINIQUE_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant SARA_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    uint256 public constant SEN_ALLOCATION = 1_000_000 * 10**18; // 1M (1% of total supply)
    
    // Partner allocations
    uint256 public constant PARTNER_1_ALLOCATION = 1_000_000 * 10**18; // 1M tokens
    uint256 public constant PARTNER_2_ALLOCATION = 1_000_000 * 10**18; // 1M tokens
    
    // Vesting parameters
    uint256 public constant VESTING_START_TIME = 1767225600; // January 1, 2026
    uint256 public constant VESTING_DURATION = 1095 days; // 3 years
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Get SHELTR token address from deployment
        address sheltrTokenAddress = vm.envAddress("SHELTR_TOKEN_ADDRESS");
        SHELTR sheltrToken = SHELTR(sheltrTokenAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Setting up team and partner distributions...");
        console.log("Total Team Allocation: 15,000,000 SHELTR (15%)");
        console.log("");
        console.log("=== IMMEDIATE ALLOCATIONS (No Vesting) ===");
        console.log("Joel (Founder): 3,000,000 SHELTR - IMMEDIATE");
        console.log("Doug (CFO): 1,000,000 SHELTR - IMMEDIATE");
        console.log("Alex (COO): 1,000,000 SHELTR - IMMEDIATE");
        console.log("");
        console.log("=== VESTING ALLOCATIONS (3-Year Schedule) ===");
        console.log("Vesting Start: January 1, 2026");
        console.log("Vesting Duration: 3 years");
        console.log("Token Release Schedule:");
        console.log("  - December 2025: 33.3% of remaining tokens (after 3M pre-launch)");
        console.log("  - December 2026: 33.3% of remaining tokens");
        console.log("  - December 2027: 33.4% of remaining tokens");
        console.log("");
        
        // Immediate allocations (no vesting)
        console.log("=== IMMEDIATE ALLOCATIONS ===");
        
        addImmediateMember(sheltrToken, JOEL_Y, JOEL_ALLOCATION, "Joel Y. (CEO)");
        addImmediateMember(sheltrToken, DOUG_K, DOUG_ALLOCATION, "Doug K. (CFO)");
        addImmediateMember(sheltrToken, ALEX_K, ALEX_ALLOCATION, "Alex K. (COO)");
        
        // Vesting allocations (3-year schedule)
        console.log("=== VESTING ALLOCATIONS ===");
        
        addTeamMember(sheltrToken, SASKO_D, SASKO_ALLOCATION, "Sasko D. (Leadership)");
        addTeamMember(sheltrToken, ZELL_A, ZELL_ALLOCATION, "Zell A. (Leadership)");
        addTeamMember(sheltrToken, ZAFFIA_L, ZAFFIA_ALLOCATION, "Zaffia L. (Leadership)");
        addTeamMember(sheltrToken, AMI_R, AMI_ALLOCATION, "Ami R. (Leadership)");
        addTeamMember(sheltrToken, MARC_R, MARC_ALLOCATION, "Marc R. (Leadership)");
        addTeamMember(sheltrToken, MORGAN_H, MORGAN_ALLOCATION, "Morgan H. (Leadership)");
        addTeamMember(sheltrToken, DOMINIQUE_L, DOMINIQUE_ALLOCATION, "Dominique L. (Leadership)");
        addTeamMember(sheltrToken, SARA_S, SARA_ALLOCATION, "Sara S. (Leadership)");
        addTeamMember(sheltrToken, SEN_W, SEN_ALLOCATION, "Sen W. (Leadership)");
        
        console.log("");
        console.log("=== STRATEGIC PARTNERS ===");
        
        addTeamMember(sheltrToken, PARTNER_1, PARTNER_1_ALLOCATION, "Strategic Partner 1");
        addTeamMember(sheltrToken, PARTNER_2, PARTNER_2_ALLOCATION, "Strategic Partner 2");
        
        console.log("");
        console.log("=== DISTRIBUTION SUMMARY ===");
        console.log("Immediate Allocations: 3 members (5,000,000 SHELTR)");
        console.log("Vesting Allocations: 10 members (10,000,000 SHELTR)");
        console.log("Total Strategic Partners: 2");
        console.log("Total Allocation: 15,000,000 SHELTR");
        console.log("Vesting Schedule: 3-year linear vesting starting Jan 1, 2026");
        console.log("");
        console.log("Team distribution complete!");
        
        vm.stopBroadcast();
    }
    
    function addTeamMember(SHELTR token, address member, uint256 amount, string memory name) internal {
        token.addTeamMember(member, amount, VESTING_START_TIME, VESTING_DURATION);
        console.log("%s: %d SHELTR (3-year vesting)", name, amount / 10**18);
    }
    
    function addImmediateMember(SHELTR token, address member, uint256 amount, string memory name) internal {
        token.transfer(member, amount);
        console.log("%s: %d SHELTR (IMMEDIATE)", name, amount / 10**18);
    }
}
