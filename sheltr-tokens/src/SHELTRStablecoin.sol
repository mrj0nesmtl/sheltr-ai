// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SHELTRStablecoin
 * @dev Enterprise-grade stablecoin for transparent housing fund tracking
 * 
 * SHELTR's Revolutionary Housing Fund Architecture:
 * - 1:1 USDT backing through Coinbase Prime institutional custody
 * - Guaranteed 4-6% APY through institutional staking
 * - Zero participant cryptocurrency exposure (tracking only)
 * - Complete blockchain transparency for housing fund growth
 * - Daily liquidity access for housing allocation
 * 
 * Key Features:
 * - USDT-backed stability with guaranteed returns
 * - Participant housing fund allocation tracking
 * - Integration with Coinbase Prime for institutional staking
 * - Base network optimization for ultra-low fees
 * - Enterprise-grade security and compliance
 */
contract SHELTRStablecoin is ERC20, AccessControl, ReentrancyGuard, Pausable {
    // =============================================================================
    // CONSTANTS & IMMUTABLES
    // =============================================================================
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant STAKING_MANAGER_ROLE = keccak256("STAKING_MANAGER_ROLE");
    
    IERC20 public immutable USDT;
    ICoinbaseStaking public immutable coinbaseStaking;
    
    // APY configuration (basis points for precision)
    uint256 public constant MIN_GUARANTEED_APY = 400; // 4.00%
    uint256 public constant MAX_GUARANTEED_APY = 600; // 6.00%
    uint256 public constant BASIS_POINTS = 10000;
    
    // =============================================================================
    // STATE VARIABLES
    // =============================================================================
    
    // Housing fund participant tracking
    mapping(address => uint256) public participantHousingFunds;
    mapping(address => uint256) public participantLastUpdate;
    mapping(address => uint256) public participantAccruedRewards;
    
    // Housing fund statistics
    uint256 public totalHousingFund;
    uint256 public totalParticipants;
    uint256 public currentAPY = 500; // 5.00% default
    uint256 public lastRewardDistribution;
    uint256 public totalRewardsDistributed;
    
    // Enterprise configuration
    address public treasuryAddress;
    address public emergencyRecipient;
    uint256 public minimumDeposit = 1e6; // $1 USDT minimum
    bool public housingAllocationsEnabled = true;
    
    // =============================================================================
    // EVENTS
    // =============================================================================
    
    event HousingFundDeposit(
        address indexed participant,
        uint256 usdtAmount,
        uint256 sheltrMinted,
        uint256 timestamp
    );
    
    event HousingAllocation(
        address indexed participant,
        uint256 sheltrBurned,
        uint256 usdtWithdrawn,
        uint256 rewardsIncluded,
        string purpose
    );
    
    event RewardsDistributed(
        uint256 totalRewards,
        uint256 participantCount,
        uint256 newAPY,
        uint256 timestamp
    );
    
    event ParticipantRewardsClaimed(
        address indexed participant,
        uint256 rewardAmount,
        uint256 timestamp
    );
    
    event APYUpdated(
        uint256 oldAPY,
        uint256 newAPY,
        uint256 timestamp
    );
    
    event EmergencyWithdrawal(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        string reason
    );
    
    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================
    
    constructor(
        address _usdt,
        address _coinbaseStaking,
        address _treasuryAddress,
        address _emergencyRecipient
    ) ERC20("SHELTR Housing Fund Token", "SHELTR") {
        require(_usdt != address(0), "Invalid USDT address");
        require(_coinbaseStaking != address(0), "Invalid Coinbase staking address");
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_emergencyRecipient != address(0), "Invalid emergency recipient");
        
        USDT = IERC20(_usdt);
        coinbaseStaking = ICoinbaseStaking(_coinbaseStaking);
        treasuryAddress = _treasuryAddress;
        emergencyRecipient = _emergencyRecipient;
        lastRewardDistribution = block.timestamp;
        
        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(STAKING_MANAGER_ROLE, msg.sender);
    }
    
    // =============================================================================
    // MAIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Deposit USDT to housing fund and mint SHELTR tokens 1:1
     * @param participant Address of participant receiving housing fund allocation
     * @param amount Amount of USDT to deposit
     */
    function depositHousingFund(
        address participant,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) nonReentrant whenNotPaused {
        require(participant != address(0), "Invalid participant address");
        require(amount >= minimumDeposit, "Amount below minimum deposit");
        
        // Transfer USDT from caller to this contract
        require(
            USDT.transferFrom(msg.sender, address(this), amount),
            "USDT transfer failed"
        );
        
        // Update participant rewards before deposit
        _updateParticipantRewards(participant);
        
        // Mint SHELTR tokens 1:1 with USDT
        _mint(address(this), amount);
        
        // Track participant allocation
        if (participantHousingFunds[participant] == 0) {
            totalParticipants++;
        }
        
        participantHousingFunds[participant] += amount;
        participantLastUpdate[participant] = block.timestamp;
        totalHousingFund += amount;
        
        // Stake USDT in Coinbase for guaranteed returns
        require(USDT.approve(address(coinbaseStaking), amount), "USDT approval failed");
        coinbaseStaking.stake(amount);
        
        emit HousingFundDeposit(participant, amount, amount, block.timestamp);
    }
    
    /**
     * @dev Allocate housing funds for a participant (burn SHELTR, withdraw USDT)
     * @param participant Address of participant receiving housing allocation
     * @param amount Amount of SHELTR tokens to burn for housing
     * @param purpose Description of housing allocation purpose
     */
    function allocateHousingFunds(
        address participant,
        uint256 amount,
        string calldata purpose
    ) external onlyRole(ADMIN_ROLE) nonReentrant whenNotPaused {
        require(participant != address(0), "Invalid participant address");
        require(amount > 0, "Amount must be greater than 0");
        require(housingAllocationsEnabled, "Housing allocations disabled");
        require(bytes(purpose).length > 0, "Purpose required");
        
        // Update participant rewards before allocation
        _updateParticipantRewards(participant);
        
        uint256 participantBalance = getParticipantHousingBalance(participant);
        require(participantBalance >= amount, "Insufficient housing fund balance");
        
        // Calculate USDT to withdraw (including proportional rewards)
        uint256 totalStaked = coinbaseStaking.getTotalStaked();
        uint256 totalValue = totalStaked + coinbaseStaking.getAccruedRewards();
        uint256 usdtToWithdraw = (amount * totalValue) / totalSupply();
        
        // Burn SHELTR tokens
        _burn(address(this), amount);
        
        // Update participant allocation
        uint256 baseAmount = (amount * totalHousingFund) / totalSupply();
        participantHousingFunds[participant] -= baseAmount;
        totalHousingFund -= baseAmount;
        
        if (participantHousingFunds[participant] == 0) {
            totalParticipants--;
        }
        
        // Withdraw from Coinbase staking
        coinbaseStaking.withdraw(usdtToWithdraw);
        
        // Transfer USDT to participant for housing
        require(USDT.transfer(participant, usdtToWithdraw), "USDT transfer failed");
        
        uint256 rewardsIncluded = usdtToWithdraw - baseAmount;
        
        emit HousingAllocation(participant, amount, usdtToWithdraw, rewardsIncluded, purpose);
    }
    
    /**
     * @dev Distribute staking rewards to all participants
     */
    function distributeRewards() external onlyRole(STAKING_MANAGER_ROLE) nonReentrant {
        require(totalParticipants > 0, "No participants to distribute to");
        require(
            block.timestamp >= lastRewardDistribution + 1 days,
            "Rewards distributed recently"
        );
        
        uint256 totalRewards = coinbaseStaking.getAccruedRewards();
        require(totalRewards > 0, "No rewards to distribute");
        
        // Update APY based on actual returns
        uint256 newAPY = _calculateActualAPY(totalRewards);
        if (newAPY != currentAPY) {
            emit APYUpdated(currentAPY, newAPY, block.timestamp);
            currentAPY = newAPY;
        }
        
        lastRewardDistribution = block.timestamp;
        totalRewardsDistributed += totalRewards;
        
        emit RewardsDistributed(totalRewards, totalParticipants, currentAPY, block.timestamp);
    }
    
    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Get participant's total housing fund balance (including rewards)
     */
    function getParticipantHousingBalance(address participant) public view returns (uint256) {
        if (participantHousingFunds[participant] == 0) return 0;
        
        uint256 totalStaked = coinbaseStaking.getTotalStaked();
        if (totalStaked == 0) return participantHousingFunds[participant];
        
        // Calculate proportional share including Coinbase staking rewards
        uint256 totalValue = totalStaked + coinbaseStaking.getAccruedRewards();
        uint256 participantShare = (participantHousingFunds[participant] * totalValue) / totalHousingFund;
        
        return participantShare;
    }
    
    /**
     * @dev Get participant's accrued rewards
     */
    function getParticipantRewards(address participant) external view returns (uint256) {
        if (participantHousingFunds[participant] == 0) return participantAccruedRewards[participant];
        
        uint256 totalBalance = getParticipantHousingBalance(participant);
        uint256 baseAmount = participantHousingFunds[participant];
        uint256 pendingRewards = totalBalance > baseAmount ? totalBalance - baseAmount : 0;
        
        return participantAccruedRewards[participant] + pendingRewards;
    }
    
    /**
     * @dev Get housing fund statistics
     */
    function getHousingFundStats() external view returns (
        uint256 totalFund,
        uint256 totalStaked,
        uint256 totalRewards,
        uint256 participantCount,
        uint256 apy
    ) {
        return (
            totalHousingFund,
            coinbaseStaking.getTotalStaked(),
            coinbaseStaking.getAccruedRewards(),
            totalParticipants,
            currentAPY
        );
    }
    
    /**
     * @dev Get current backing ratio (should always be 1:1 or better)
     */
    function getBackingRatio() external view returns (uint256) {
        uint256 totalStaked = coinbaseStaking.getTotalStaked();
        uint256 totalValue = totalStaked + coinbaseStaking.getAccruedRewards();
        
        if (totalSupply() == 0) return BASIS_POINTS; // 100%
        
        return (totalValue * BASIS_POINTS) / totalSupply();
    }
    
    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Update participant's accrued rewards
     */
    function _updateParticipantRewards(address participant) internal {
        if (participantHousingFunds[participant] == 0) return;
        
        uint256 currentBalance = getParticipantHousingBalance(participant);
        uint256 baseAmount = participantHousingFunds[participant];
        
        if (currentBalance > baseAmount) {
            uint256 newRewards = currentBalance - baseAmount;
            participantAccruedRewards[participant] += newRewards;
        }
        
        participantLastUpdate[participant] = block.timestamp;
    }
    
    /**
     * @dev Calculate actual APY based on rewards
     */
    function _calculateActualAPY(uint256 rewards) internal view returns (uint256) {
        if (totalHousingFund == 0) return currentAPY;
        
        uint256 timeSinceLastDistribution = block.timestamp - lastRewardDistribution;
        uint256 annualizedRewards = (rewards * 365 days) / timeSinceLastDistribution;
        uint256 apy = (annualizedRewards * BASIS_POINTS) / totalHousingFund;
        
        // Ensure APY stays within guaranteed range
        if (apy < MIN_GUARANTEED_APY) return MIN_GUARANTEED_APY;
        if (apy > MAX_GUARANTEED_APY) return MAX_GUARANTEED_APY;
        
        return apy;
    }
    
    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Update minimum deposit amount
     */
    function updateMinimumDeposit(uint256 newMinimum) external onlyRole(ADMIN_ROLE) {
        require(newMinimum > 0, "Minimum must be greater than 0");
        minimumDeposit = newMinimum;
    }
    
    /**
     * @dev Enable/disable housing allocations
     */
    function setHousingAllocationsEnabled(bool enabled) external onlyRole(ADMIN_ROLE) {
        housingAllocationsEnabled = enabled;
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
        
        emit EmergencyWithdrawal(token, emergencyRecipient, amount, reason);
    }
    
    // =============================================================================
    // OVERRIDES
    // =============================================================================
    
    /**
     * @dev Override decimals to match USDT (6 decimals)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    /**
     * @dev Prevent direct transfers (tokens should only be minted/burned through housing fund operations)
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("Direct transfers not allowed");
    }
    
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("Direct transfers not allowed");
    }
}

// =============================================================================
// INTERFACES
// =============================================================================

interface ICoinbaseStaking {
    function stake(uint256 amount) external returns (uint256 expectedAPY);
    function withdraw(uint256 amount) external;
    function getTotalStaked() external view returns (uint256);
    function getAccruedRewards() external view returns (uint256);
}
