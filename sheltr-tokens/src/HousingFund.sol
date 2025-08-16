// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Housing Fund
 * @dev Manages pooled housing funds with individual participant tracking
 * 
 * Features:
 * - Pools all 15% housing allocations into one fund
 * - Tracks individual participant contributions
 * - Distributes yield proportionally to participants
 * - Supports multiple DeFi protocols for yield generation
 * - Allows participants to claim their earnings
 * - DeFi Strategy: 6-8% APY target growth
 * 
 * Use Cases:
 * - Emergency housing
 * - Transitional programs
 * - Permanent solutions
 * - Support services
 */
contract HousingFund is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Token contracts
    IERC20 public immutable usdcToken;
    IERC20 public immutable sheltrToken;
    
    // Fund management
    address public fundManager;
    address public smartFundDistributor;
    
    // Participant tracking
    struct ParticipantFund {
        uint256 totalContributed;    // Total USDC contributed
        uint256 totalEarned;         // Total yield earned
        uint256 lastClaimed;         // Last claim timestamp
        uint256 pendingRewards;      // Pending rewards to claim
        bool isActive;
    }
    
    mapping(address => ParticipantFund) public participantFunds;
    address[] public activeParticipants;
    
    // Fund statistics
    uint256 public totalFundValue;           // Total value in fund
    uint256 public totalYieldGenerated;      // Total yield generated
    uint256 public totalParticipants;        // Number of active participants
    
    // Yield distribution
    uint256 public lastYieldDistribution;    // Last distribution timestamp
    uint256 public yieldDistributionPeriod;  // How often to distribute yield (e.g., 30 days)
    
    // Events
    event ParticipantAdded(address indexed participant, uint256 amount);
    event YieldDistributed(uint256 totalYield, uint256 timestamp);
    event RewardsClaimed(address indexed participant, uint256 amount);
    event FundManagerUpdated(address indexed newManager);
    event SmartFundDistributorUpdated(address indexed newDistributor);
    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);
    
    constructor(
        address _usdcToken,
        address _sheltrToken,
        address _fundManager
    ) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_sheltrToken != address(0), "Invalid SHELTR address");
        require(_fundManager != address(0), "Invalid fund manager address");
        
        usdcToken = IERC20(_usdcToken);
        sheltrToken = IERC20(_sheltrToken);
        fundManager = _fundManager;
        yieldDistributionPeriod = 30 days; // Monthly distributions
    }
    
    /**
     * @dev Add participant contribution (called by SmartFundDistributor)
     * @param participant Address of the participant
     * @param amount Amount of USDC to add to housing fund
     */
    function addParticipantContribution(address participant, uint256 amount) external {
        require(msg.sender == smartFundDistributor, "Only SmartFundDistributor can call");
        require(participant != address(0), "Invalid participant address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from SmartFundDistributor to this contract
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update participant tracking
        if (!participantFunds[participant].isActive) {
            participantFunds[participant].isActive = true;
            activeParticipants.push(participant);
            totalParticipants++;
        }
        
        participantFunds[participant].totalContributed += amount;
        totalFundValue += amount;
        
        emit ParticipantAdded(participant, amount);
    }
    
    /**
     * @dev Distribute yield to all participants (called by fund manager)
     * @param yieldAmount Total yield amount to distribute
     */
    function distributeYield(uint256 yieldAmount) external {
        require(msg.sender == fundManager || msg.sender == owner(), "Not authorized");
        require(yieldAmount > 0, "Yield amount must be greater than 0");
        require(block.timestamp >= lastYieldDistribution + yieldDistributionPeriod, "Too early for distribution");
        
        // Ensure we have enough USDC to distribute
        require(usdcToken.balanceOf(address(this)) >= yieldAmount, "Insufficient USDC balance");
        
        uint256 totalContributed = 0;
        
        // Calculate total contributions for proportional distribution
        for (uint256 i = 0; i < activeParticipants.length; i++) {
            address participant = activeParticipants[i];
            if (participantFunds[participant].isActive) {
                totalContributed += participantFunds[participant].totalContributed;
            }
        }
        
        require(totalContributed > 0, "No active participants");
        
        // Distribute yield proportionally
        for (uint256 i = 0; i < activeParticipants.length; i++) {
            address participant = activeParticipants[i];
            if (participantFunds[participant].isActive) {
                uint256 participantShare = (yieldAmount * participantFunds[participant].totalContributed) / totalContributed;
                if (participantShare > 0) {
                    participantFunds[participant].pendingRewards += participantShare;
                    participantFunds[participant].totalEarned += participantShare;
                }
            }
        }
        
        totalYieldGenerated += yieldAmount;
        lastYieldDistribution = block.timestamp;
        
        emit YieldDistributed(yieldAmount, block.timestamp);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant whenNotPaused {
        require(participantFunds[msg.sender].isActive, "Not an active participant");
        
        uint256 pendingAmount = participantFunds[msg.sender].pendingRewards;
        require(pendingAmount > 0, "No rewards to claim");
        
        participantFunds[msg.sender].pendingRewards = 0;
        participantFunds[msg.sender].lastClaimed = block.timestamp;
        
        usdcToken.safeTransfer(msg.sender, pendingAmount);
        
        emit RewardsClaimed(msg.sender, pendingAmount);
    }
    
    /**
     * @dev Get participant fund information
     * @param participant Address of the participant
     * @return fund Participant fund details
     */
    function getParticipantFund(address participant) external view returns (ParticipantFund memory) {
        return participantFunds[participant];
    }
    
    /**
     * @dev Get pending rewards for a participant
     * @param participant Address of the participant
     * @return Pending rewards amount
     */
    function getPendingRewards(address participant) external view returns (uint256) {
        return participantFunds[participant].pendingRewards;
    }
    
    /**
     * @dev Get all active participants
     * @return Array of active participant addresses
     */
    function getActiveParticipants() external view returns (address[] memory) {
        return activeParticipants;
    }
    
    /**
     * @dev Update fund manager
     * @param newManager New fund manager address
     */
    function updateFundManager(address newManager) external onlyOwner {
        require(newManager != address(0), "Invalid address");
        fundManager = newManager;
        emit FundManagerUpdated(newManager);
    }
    
    /**
     * @dev Update SmartFund distributor address
     * @param newDistributor New distributor address
     */
    function updateSmartFundDistributor(address newDistributor) external onlyOwner {
        require(newDistributor != address(0), "Invalid address");
        smartFundDistributor = newDistributor;
        emit SmartFundDistributorUpdated(newDistributor);
    }
    
    /**
     * @dev Update yield distribution period
     * @param newPeriod New distribution period in seconds
     */
    function updateYieldDistributionPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Period must be greater than 0");
        yieldDistributionPeriod = newPeriod;
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
        emit EmergencyWithdraw(token, to, amount);
    }
    
    /**
     * @dev Get fund statistics
     * @return stats Fund statistics
     */
    function getFundStatistics() external view returns (
        uint256 _totalFundValue,
        uint256 _totalYieldGenerated,
        uint256 _totalParticipants,
        uint256 _lastYieldDistribution
    ) {
        return (totalFundValue, totalYieldGenerated, totalParticipants, lastYieldDistribution);
    }
}
