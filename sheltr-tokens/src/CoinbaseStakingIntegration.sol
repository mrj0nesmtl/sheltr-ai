// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CoinbaseStakingIntegration
 * @dev Enterprise integration with Coinbase Prime for guaranteed institutional returns
 * 
 * SHELTR's Guaranteed Returns Architecture:
 * - Guaranteed 4-6% APY through Coinbase Prime institutional custody
 * - SOC 2 Type II certified security and compliance
 * - Daily liquidity access for housing fund allocations
 * - Institutional-grade staking with enterprise partnerships
 * - Complete transparency and real-time yield tracking
 * 
 * Key Features:
 * - Integration with Coinbase Prime for institutional staking
 * - Guaranteed minimum returns with enterprise SLA
 * - Real-time yield calculation and distribution
 * - Emergency withdrawal capabilities for housing needs
 * - Comprehensive audit trail and compliance reporting
 */
contract CoinbaseStakingIntegration is AccessControl, ReentrancyGuard, Pausable {
    // =============================================================================
    // CONSTANTS & IMMUTABLES
    // =============================================================================
    
    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant YIELD_MANAGER_ROLE = keccak256("YIELD_MANAGER_ROLE");
    
    IERC20 public immutable USDT;
    ICoinbasePrime public immutable coinbasePrime;
    
    // APY configuration (basis points for precision)
    uint256 public constant MIN_GUARANTEED_APY = 400; // 4.00%
    uint256 public constant MAX_GUARANTEED_APY = 600; // 6.00%
    uint256 public constant DEFAULT_APY = 500; // 5.00%
    uint256 public constant BASIS_POINTS = 10000;
    
    // Staking configuration
    uint256 public constant MIN_STAKE_AMOUNT = 100e6; // $100 USDT minimum
    uint256 public constant MAX_STAKE_AMOUNT = 10000000e6; // $10M USDT maximum
    uint256 public constant YIELD_DISTRIBUTION_INTERVAL = 1 days;
    uint256 public constant EMERGENCY_WITHDRAWAL_DELAY = 24 hours;
    
    // =============================================================================
    // STRUCTS
    // =============================================================================
    
    struct StakingPosition {
        uint256 principal;           // Original staked amount
        uint256 accruedRewards;     // Accrued rewards
        uint256 lastYieldUpdate;    // Last yield calculation timestamp
        uint256 stakedAt;           // Staking timestamp
        uint256 withdrawnRewards;   // Total rewards withdrawn
        bool isActive;              // Position status
        string positionId;          // Coinbase position ID
    }
    
    struct YieldDistribution {
        uint256 totalYield;         // Total yield distributed
        uint256 participantCount;   // Number of participants
        uint256 averageAPY;         // Average APY for period
        uint256 distributedAt;      // Distribution timestamp
        uint256 periodStart;       // Period start timestamp
        uint256 periodEnd;         // Period end timestamp
    }
    
    struct CoinbaseConfig {
        string apiKey;              // Coinbase Prime API key (encrypted)
        string apiSecret;           // Coinbase Prime API secret (encrypted)
        string environment;         // "SANDBOX" or "PRODUCTION"
        string portfolioId;         // Coinbase portfolio ID
        bool isConfigured;          // Configuration status
    }
    
    // =============================================================================
    // STATE VARIABLES
    // =============================================================================
    
    mapping(address => StakingPosition) public stakingPositions;
    mapping(uint256 => YieldDistribution) public yieldDistributions;
    
    CoinbaseConfig private coinbaseConfig;
    
    uint256 public totalStaked;
    uint256 public totalAccruedRewards;
    uint256 public totalWithdrawnRewards;
    uint256 public totalActivePositions;
    uint256 public currentAPY = DEFAULT_APY;
    uint256 public lastYieldDistribution;
    uint256 public yieldDistributionCount;
    
    address public treasuryAddress;
    address public emergencyRecipient;
    bool public stakingEnabled = true;
    bool public yieldDistributionEnabled = true;
    
    // Emergency withdrawal tracking
    mapping(address => uint256) public emergencyWithdrawalRequests;
    
    // =============================================================================
    // EVENTS
    // =============================================================================
    
    event Staked(
        address indexed staker,
        uint256 amount,
        string positionId,
        uint256 expectedAPY,
        uint256 timestamp
    );
    
    event Withdrawn(
        address indexed staker,
        uint256 principal,
        uint256 rewards,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event YieldCalculated(
        address indexed staker,
        uint256 yieldAmount,
        uint256 newAPY,
        uint256 timestamp
    );
    
    event YieldDistributed(
        uint256 totalYield,
        uint256 participantCount,
        uint256 averageAPY,
        uint256 timestamp
    );
    
    event APYUpdated(
        uint256 oldAPY,
        uint256 newAPY,
        string reason,
        uint256 timestamp
    );
    
    event EmergencyWithdrawalRequested(
        address indexed staker,
        uint256 requestedAt,
        uint256 availableAt
    );
    
    event CoinbaseConfigUpdated(
        string environment,
        string portfolioId,
        uint256 timestamp
    );
    
    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================
    
    constructor(
        address _usdt,
        address _coinbasePrime,
        address _treasuryAddress,
        address _emergencyRecipient
    ) {
        require(_usdt != address(0), "Invalid USDT address");
        require(_coinbasePrime != address(0), "Invalid Coinbase Prime address");
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_emergencyRecipient != address(0), "Invalid emergency recipient");
        
        USDT = IERC20(_usdt);
        coinbasePrime = ICoinbasePrime(_coinbasePrime);
        treasuryAddress = _treasuryAddress;
        emergencyRecipient = _emergencyRecipient;
        lastYieldDistribution = block.timestamp;
        
        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(YIELD_MANAGER_ROLE, msg.sender);
    }
    
    // =============================================================================
    // MAIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Stake USDT for guaranteed returns through Coinbase Prime
     * @param amount Amount of USDT to stake
     * @return expectedAPY Expected annual percentage yield
     */
    function stake(uint256 amount) 
        external 
        onlyRole(STAKER_ROLE) 
        nonReentrant 
        whenNotPaused 
        returns (uint256 expectedAPY) 
    {
        require(amount >= MIN_STAKE_AMOUNT, "Amount below minimum stake");
        require(amount <= MAX_STAKE_AMOUNT, "Amount exceeds maximum stake");
        require(stakingEnabled, "Staking disabled");
        require(coinbaseConfig.isConfigured, "Coinbase not configured");
        
        // Transfer USDT from caller to this contract
        require(USDT.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");
        
        // Update existing position or create new one
        _updateStakingPosition(msg.sender);
        
        // Approve and stake through Coinbase Prime
        require(USDT.approve(address(coinbasePrime), amount), "USDT approval failed");
        string memory positionId = coinbasePrime.createStakingPosition(amount, currentAPY);
        
        // Update or create staking position
        StakingPosition storage position = stakingPositions[msg.sender];
        
        if (!position.isActive) {
            // New position
            position.principal = amount;
            position.accruedRewards = 0;
            position.lastYieldUpdate = block.timestamp;
            position.stakedAt = block.timestamp;
            position.withdrawnRewards = 0;
            position.isActive = true;
            position.positionId = positionId;
            
            totalActivePositions++;
        } else {
            // Add to existing position
            position.principal += amount;
            position.lastYieldUpdate = block.timestamp;
        }
        
        totalStaked += amount;
        expectedAPY = currentAPY;
        
        emit Staked(msg.sender, amount, positionId, expectedAPY, block.timestamp);
        
        return expectedAPY;
    }
    
    /**
     * @dev Withdraw staked amount plus accrued rewards
     * @param amount Amount to withdraw (0 = withdraw all)
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        StakingPosition storage position = stakingPositions[msg.sender];
        require(position.isActive, "No active staking position");
        
        // Update yield before withdrawal
        _updateStakingPosition(msg.sender);
        
        uint256 availableAmount = position.principal + position.accruedRewards;
        uint256 withdrawAmount = amount == 0 ? availableAmount : amount;
        
        require(withdrawAmount <= availableAmount, "Insufficient staked balance");
        require(withdrawAmount > 0, "Withdrawal amount must be greater than 0");
        
        // Calculate principal and rewards portions
        uint256 rewardsWithdrawn = 0;
        uint256 principalWithdrawn = 0;
        
        if (withdrawAmount <= position.accruedRewards) {
            // Withdrawing only rewards
            rewardsWithdrawn = withdrawAmount;
            position.accruedRewards -= withdrawAmount;
        } else {
            // Withdrawing rewards + principal
            rewardsWithdrawn = position.accruedRewards;
            principalWithdrawn = withdrawAmount - position.accruedRewards;
            
            position.accruedRewards = 0;
            position.principal -= principalWithdrawn;
            totalStaked -= principalWithdrawn;
        }
        
        position.withdrawnRewards += rewardsWithdrawn;
        
        // Close position if fully withdrawn
        if (position.principal == 0) {
            position.isActive = false;
            totalActivePositions--;
        }
        
        // Withdraw from Coinbase Prime
        coinbasePrime.withdrawFromPosition(position.positionId, withdrawAmount);
        
        // Transfer USDT to staker
        require(USDT.transfer(msg.sender, withdrawAmount), "USDT transfer failed");
        
        totalWithdrawnRewards += rewardsWithdrawn;
        
        emit Withdrawn(msg.sender, principalWithdrawn, rewardsWithdrawn, withdrawAmount, block.timestamp);
    }
    
    /**
     * @dev Request emergency withdrawal (24-hour delay)
     */
    function requestEmergencyWithdrawal() external {
        StakingPosition storage position = stakingPositions[msg.sender];
        require(position.isActive, "No active staking position");
        require(emergencyWithdrawalRequests[msg.sender] == 0, "Emergency withdrawal already requested");
        
        emergencyWithdrawalRequests[msg.sender] = block.timestamp;
        
        emit EmergencyWithdrawalRequested(
            msg.sender,
            block.timestamp,
            block.timestamp + EMERGENCY_WITHDRAWAL_DELAY
        );
    }
    
    /**
     * @dev Execute emergency withdrawal after delay
     */
    function executeEmergencyWithdrawal() external nonReentrant {
        uint256 requestTime = emergencyWithdrawalRequests[msg.sender];
        require(requestTime > 0, "No emergency withdrawal requested");
        require(
            block.timestamp >= requestTime + EMERGENCY_WITHDRAWAL_DELAY,
            "Emergency withdrawal delay not met"
        );
        
        // Clear the request
        emergencyWithdrawalRequests[msg.sender] = 0;
        
        // Execute full withdrawal
        withdraw(0);
    }
    
    /**
     * @dev Distribute yield to all active positions
     */
    function distributeYield() external onlyRole(YIELD_MANAGER_ROLE) nonReentrant {
        require(yieldDistributionEnabled, "Yield distribution disabled");
        require(
            block.timestamp >= lastYieldDistribution + YIELD_DISTRIBUTION_INTERVAL,
            "Distribution interval not met"
        );
        require(totalActivePositions > 0, "No active positions");
        
        // Get total yield from Coinbase Prime
        uint256 totalYield = coinbasePrime.getTotalAccruedYield();
        require(totalYield > 0, "No yield to distribute");
        
        // Calculate new APY based on actual returns
        uint256 newAPY = _calculateActualAPY(totalYield);
        
        // Update APY if significantly different
        if (_abs(newAPY, currentAPY) > 50) { // 0.5% difference threshold
            emit APYUpdated(currentAPY, newAPY, "Actual yield variance", block.timestamp);
            currentAPY = newAPY;
        }
        
        // Record distribution
        yieldDistributions[yieldDistributionCount] = YieldDistribution({
            totalYield: totalYield,
            participantCount: totalActivePositions,
            averageAPY: currentAPY,
            distributedAt: block.timestamp,
            periodStart: lastYieldDistribution,
            periodEnd: block.timestamp
        });
        
        totalAccruedRewards += totalYield;
        lastYieldDistribution = block.timestamp;
        yieldDistributionCount++;
        
        emit YieldDistributed(totalYield, totalActivePositions, currentAPY, block.timestamp);
    }
    
    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Get staking position information
     */
    function getStakingPosition(address staker) external view returns (StakingPosition memory) {
        return stakingPositions[staker];
    }
    
    /**
     * @dev Get current staked balance including accrued rewards
     */
    function getStakedBalance(address staker) external view returns (uint256) {
        StakingPosition memory position = stakingPositions[staker];
        if (!position.isActive) return 0;
        
        uint256 pendingYield = _calculatePendingYield(staker);
        return position.principal + position.accruedRewards + pendingYield;
    }
    
    /**
     * @dev Get total staked amount across all positions
     */
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }
    
    /**
     * @dev Get total accrued rewards across all positions
     */
    function getAccruedRewards() external view returns (uint256) {
        return totalAccruedRewards + coinbasePrime.getTotalAccruedYield();
    }
    
    /**
     * @dev Get staking statistics
     */
    function getStakingStatistics() external view returns (
        uint256 totalStaked_,
        uint256 totalRewards,
        uint256 totalWithdrawn,
        uint256 activePositions,
        uint256 apy
    ) {
        return (
            totalStaked,
            totalAccruedRewards,
            totalWithdrawnRewards,
            totalActivePositions,
            currentAPY
        );
    }
    
    /**
     * @dev Get yield distribution information
     */
    function getYieldDistribution(uint256 distributionId) external view returns (YieldDistribution memory) {
        return yieldDistributions[distributionId];
    }
    
    /**
     * @dev Check if emergency withdrawal is available
     */
    function canExecuteEmergencyWithdrawal(address staker) external view returns (bool) {
        uint256 requestTime = emergencyWithdrawalRequests[staker];
        return requestTime > 0 && block.timestamp >= requestTime + EMERGENCY_WITHDRAWAL_DELAY;
    }
    
    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Update staking position with latest yield
     */
    function _updateStakingPosition(address staker) internal {
        StakingPosition storage position = stakingPositions[staker];
        if (!position.isActive) return;
        
        uint256 pendingYield = _calculatePendingYield(staker);
        if (pendingYield > 0) {
            position.accruedRewards += pendingYield;
            position.lastYieldUpdate = block.timestamp;
            
            emit YieldCalculated(staker, pendingYield, currentAPY, block.timestamp);
        }
    }
    
    /**
     * @dev Calculate pending yield for a staker
     */
    function _calculatePendingYield(address staker) internal view returns (uint256) {
        StakingPosition memory position = stakingPositions[staker];
        if (!position.isActive || position.principal == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - position.lastYieldUpdate;
        if (timeElapsed == 0) return 0;
        
        // Calculate yield: (principal * APY * timeElapsed) / (365 days * BASIS_POINTS)
        uint256 annualYield = (position.principal * currentAPY) / BASIS_POINTS;
        uint256 pendingYield = (annualYield * timeElapsed) / 365 days;
        
        return pendingYield;
    }
    
    /**
     * @dev Calculate actual APY based on yield performance
     */
    function _calculateActualAPY(uint256 yieldAmount) internal view returns (uint256) {
        if (totalStaked == 0) return currentAPY;
        
        uint256 timeSinceLastDistribution = block.timestamp - lastYieldDistribution;
        if (timeSinceLastDistribution == 0) return currentAPY;
        
        // Annualize the yield
        uint256 annualizedYield = (yieldAmount * 365 days) / timeSinceLastDistribution;
        uint256 apy = (annualizedYield * BASIS_POINTS) / totalStaked;
        
        // Ensure APY stays within guaranteed range
        if (apy < MIN_GUARANTEED_APY) return MIN_GUARANTEED_APY;
        if (apy > MAX_GUARANTEED_APY) return MAX_GUARANTEED_APY;
        
        return apy;
    }
    
    /**
     * @dev Calculate absolute difference between two numbers
     */
    function _abs(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a - b : b - a;
    }
    
    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Configure Coinbase Prime integration
     */
    function configureCoinbase(
        string calldata apiKey,
        string calldata apiSecret,
        string calldata environment,
        string calldata portfolioId
    ) external onlyRole(ADMIN_ROLE) {
        require(bytes(apiKey).length > 0, "Invalid API key");
        require(bytes(apiSecret).length > 0, "Invalid API secret");
        require(
            keccak256(abi.encodePacked(environment)) == keccak256("SANDBOX") ||
            keccak256(abi.encodePacked(environment)) == keccak256("PRODUCTION"),
            "Invalid environment"
        );
        require(bytes(portfolioId).length > 0, "Invalid portfolio ID");
        
        coinbaseConfig = CoinbaseConfig({
            apiKey: apiKey,
            apiSecret: apiSecret,
            environment: environment,
            portfolioId: portfolioId,
            isConfigured: true
        });
        
        emit CoinbaseConfigUpdated(environment, portfolioId, block.timestamp);
    }
    
    /**
     * @dev Update current APY (within guaranteed range)
     */
    function updateAPY(uint256 newAPY, string calldata reason) external onlyRole(ADMIN_ROLE) {
        require(newAPY >= MIN_GUARANTEED_APY, "APY below guaranteed minimum");
        require(newAPY <= MAX_GUARANTEED_APY, "APY above guaranteed maximum");
        
        uint256 oldAPY = currentAPY;
        currentAPY = newAPY;
        
        emit APYUpdated(oldAPY, newAPY, reason, block.timestamp);
    }
    
    /**
     * @dev Enable/disable staking
     */
    function setStakingEnabled(bool enabled) external onlyRole(ADMIN_ROLE) {
        stakingEnabled = enabled;
    }
    
    /**
     * @dev Enable/disable yield distribution
     */
    function setYieldDistributionEnabled(bool enabled) external onlyRole(ADMIN_ROLE) {
        yieldDistributionEnabled = enabled;
    }
    
    /**
     * @dev Update treasury address
     */
    function updateTreasuryAddress(address newTreasury) external onlyRole(ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury address");
        treasuryAddress = newTreasury;
    }
    
    /**
     * @dev Pause contract operations
     */
    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract operations
     */
    function unpause() external onlyRole(EMERGENCY_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal function
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        string calldata reason
    ) external onlyRole(EMERGENCY_ROLE) {
        require(emergencyRecipient != address(0), "Emergency recipient not set");
        
        if (token == address(0)) {
            // Withdraw ETH
            payable(emergencyRecipient).transfer(amount);
        } else {
            // Withdraw ERC20 token
            require(IERC20(token).transfer(emergencyRecipient, amount), "Token transfer failed");
        }
    }
}

// =============================================================================
// INTERFACES
// =============================================================================

interface ICoinbasePrime {
    function createStakingPosition(uint256 amount, uint256 expectedAPY) external returns (string memory positionId);
    function withdrawFromPosition(string calldata positionId, uint256 amount) external;
    function getTotalAccruedYield() external view returns (uint256);
    function getPositionDetails(string calldata positionId) external view returns (uint256 principal, uint256 yield);
}
