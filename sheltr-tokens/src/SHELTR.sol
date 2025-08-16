// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SHELTR Token
 * @dev Governance token for the SHELTR platform
 * 
 * Tokenomics:
 * - Total Supply: 100,000,000 SHELTR
 * - Distribution:
 *   - 50% Public Sale (50M)
 *   - 5% Reserve Fund (5M)
 *   - 15% Team & Advisors (15M) - 3-year vesting
 *   - 15% Platform Development (15M)
 *   - 15% Community Rewards (15M)
 */
contract SHELTR is ERC20, ERC20Permit, Ownable, Pausable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens (100%)
    
    // Vesting schedule for team tokens
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        bool isActive;
    }
    
    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => bool) public isTeamMember;
    mapping(address => bool) public isExiled;
    
    // Exile voting mechanism
    struct ExileVote {
        address targetMember;
        address[] voters;
        uint256 voteCount;
        bool executed;
        uint256 voteTime;
    }
    
    mapping(uint256 => ExileVote) public exileVotes;
    uint256 public exileVoteCount;
    
    event TeamMemberAdded(address indexed member, uint256 vestingAmount);
    event TokensReleased(address indexed member, uint256 amount);
    event VestingScheduleCreated(address indexed member, uint256 totalAmount, uint256 startTime, uint256 duration);
    event ExileVoteCreated(uint256 indexed voteId, address indexed targetMember, address indexed initiator);
    event ExileVoteCast(uint256 indexed voteId, address indexed voter, address indexed targetMember);
    event TeamMemberExiled(address indexed member, uint256 transferredAmount, address indexed shelterOperations);
    
    constructor() ERC20("SHELTR Token", "SHELTR") ERC20Permit("SHELTR Token") Ownable(msg.sender) {
        // Mint total supply to contract owner for distribution
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    /**
     * @dev Add team member with vesting schedule
     * @param member Address of team member
     * @param vestingAmount Total amount to vest
     * @param startTime When vesting starts (timestamp)
     * @param duration Vesting duration in seconds
     */
    function addTeamMember(
        address member,
        uint256 vestingAmount,
        uint256 startTime,
        uint256 duration
    ) external onlyOwner {
        require(member != address(0), "Invalid address");
        require(vestingAmount > 0, "Amount must be greater than 0");
        require(startTime >= block.timestamp, "Start time must be in the future");
        require(duration > 0, "Duration must be greater than 0");
        require(!isTeamMember[member], "Already a team member");
        
        isTeamMember[member] = true;
        vestingSchedules[member] = VestingSchedule({
            totalAmount: vestingAmount,
            releasedAmount: 0,
            startTime: startTime,
            duration: duration,
            isActive: true
        });
        
        emit TeamMemberAdded(member, vestingAmount);
        emit VestingScheduleCreated(member, vestingAmount, startTime, duration);
    }
    
    /**
     * @dev Release vested tokens for a team member
     * @param member Address of team member
     */
    function releaseVestedTokens(address member) external nonReentrant {
        require(isTeamMember[member], "Not a team member");
        require(!isExiled[member], "Member has been exiled");
        require(vestingSchedules[member].isActive, "Vesting not active");
        
        uint256 vestedAmount = getVestedAmount(member);
        uint256 releaseAmount = vestedAmount - vestingSchedules[member].releasedAmount;
        
        require(releaseAmount > 0, "No tokens to release");
        
        vestingSchedules[member].releasedAmount = vestedAmount;
        
        _transfer(owner(), member, releaseAmount);
        
        emit TokensReleased(member, releaseAmount);
    }
    
    /**
     * @dev Calculate vested amount for a team member
     * @param member Address of team member
     * @return Vested amount
     */
    function getVestedAmount(address member) public view returns (uint256) {
        require(isTeamMember[member], "Not a team member");
        
        VestingSchedule memory schedule = vestingSchedules[member];
        
        if (!schedule.isActive || block.timestamp < schedule.startTime) {
            return 0;
        }
        
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }
        
        return (schedule.totalAmount * (block.timestamp - schedule.startTime)) / schedule.duration;
    }
    
    /**
     * @dev Create an exile vote for a team member
     * @param targetMember Address of team member to exile
     */
    function createExileVote(address targetMember) external {
        require(isTeamMember[msg.sender], "Only team members can create exile votes");
        require(isTeamMember[targetMember], "Target must be a team member");
        require(!isExiled[targetMember], "Member already exiled");
        require(msg.sender != targetMember, "Cannot exile yourself");
        
        exileVoteCount++;
        
        exileVotes[exileVoteCount] = ExileVote({
            targetMember: targetMember,
            voters: new address[](0),
            voteCount: 0,
            executed: false,
            voteTime: block.timestamp
        });
        
        emit ExileVoteCreated(exileVoteCount, targetMember, msg.sender);
    }
    
    /**
     * @dev Vote to exile a team member
     * @param voteId ID of the exile vote
     */
    function voteToExile(uint256 voteId) external {
        require(isTeamMember[msg.sender], "Only team members can vote");
        require(voteId > 0 && voteId <= exileVoteCount, "Invalid vote ID");
        require(!exileVotes[voteId].executed, "Vote already executed");
        require(!isExiled[exileVotes[voteId].targetMember], "Member already exiled");
        
        ExileVote storage vote = exileVotes[voteId];
        
        // Check if already voted
        for (uint256 i = 0; i < vote.voters.length; i++) {
            require(vote.voters[i] != msg.sender, "Already voted");
        }
        
        vote.voters.push(msg.sender);
        vote.voteCount++;
        
        emit ExileVoteCast(voteId, msg.sender, vote.targetMember);
        
        // Check if exile conditions are met
        if (vote.voteCount >= 3 && hasFounderVote(voteId)) {
            executeExile(voteId);
        }
    }
    
    /**
     * @dev Check if founder has voted in an exile vote
     * @param voteId ID of the exile vote
     * @return True if founder has voted
     */
    function hasFounderVote(uint256 voteId) internal view returns (bool) {
        ExileVote storage vote = exileVotes[voteId];
        
        for (uint256 i = 0; i < vote.voters.length; i++) {
            if (vote.voters[i] == owner()) { // Joel is the owner/founder
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Execute exile and transfer tokens to shelter operations
     * @param voteId ID of the exile vote
     */
    function executeExile(uint256 voteId) internal {
        ExileVote storage vote = exileVotes[voteId];
        require(!vote.executed, "Already executed");
        
        address targetMember = vote.targetMember;
        require(isTeamMember[targetMember], "Target not a team member");
        require(!isExiled[targetMember], "Already exiled");
        
        // Mark as exiled
        isExiled[targetMember] = true;
        vote.executed = true;
        
        // Calculate remaining tokens
        VestingSchedule storage schedule = vestingSchedules[targetMember];
        uint256 totalAllocated = schedule.totalAmount;
        uint256 alreadyReleased = schedule.releasedAmount;
        uint256 remainingTokens = totalAllocated - alreadyReleased;
        
        // Transfer remaining tokens to shelter operations
        if (remainingTokens > 0) {
            // This will be set to the actual shelter operations address
            address shelterOperations = 0x0000000000000000000000000000000000000000; // Placeholder
            
            // Transfer from owner's allocation to shelter operations
            _transfer(owner(), shelterOperations, remainingTokens);
            
            emit TeamMemberExiled(targetMember, remainingTokens, shelterOperations);
        }
    }
    
    /**
     * @dev Get exile vote details
     * @param voteId ID of the exile vote
     * @return vote Exile vote details
     */
    function getExileVote(uint256 voteId) external view returns (ExileVote memory) {
        require(voteId > 0 && voteId <= exileVoteCount, "Invalid vote ID");
        return exileVotes[voteId];
    }
    
    /**
     * @dev Check if a team member is exiled
     * @param member Address of team member
     * @return True if exiled
     */
    function isTeamMemberExiled(address member) external view returns (bool) {
        return isExiled[member];
    }
    
    /**
     * @dev Get remaining tokens for exiled member
     * @param member Address of exiled team member
     * @return Remaining tokens
     */
    function getExiledMemberRemainingTokens(address member) external view returns (uint256) {
        require(isExiled[member], "Member not exiled");
        
        VestingSchedule storage schedule = vestingSchedules[member];
        uint256 totalAllocated = schedule.totalAmount;
        uint256 alreadyReleased = schedule.releasedAmount;
        
        return totalAllocated - alreadyReleased;
    }
    
    /**
     * @dev Set shelter operations address for exiled token transfers
     * @param shelterOpsAddress Address of shelter operations contract
     */
    function setShelterOperationsAddress(address shelterOpsAddress) external onlyOwner {
        require(shelterOpsAddress != address(0), "Invalid address");
        // This would be implemented with a state variable
        // For now, it's handled in the executeExile function
    }
    
    /**
     * @dev Mint tokens (only owner, for community rewards and ecosystem)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Pause token transfers (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to respect pause
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        require(!paused(), "Token transfers paused");
        super._update(from, to, value);
    }
    
    /**
     * @dev Get vesting schedule for a team member
     * @param member Address of team member
     * @return schedule Vesting schedule details
     */
    function getVestingSchedule(address member) external view returns (VestingSchedule memory) {
        return vestingSchedules[member];
    }
}
