// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SHELTR Treasury
 * @dev Manages all treasury allocations and sub-accounts
 * 
 * Tokenomics Breakdown:
 * - 50% Public Sale (50M) - Managed by TokenSale contract
 * - 5% Reserve Fund (5M) - Emergency reserves
 * - 15% Team & Advisors (15M) - 3-year vesting
 * - 15% Strategic Partnerships (15M) - Partnership incentives
 * - 15% Platform Development (15M) - Development and operations
 * 
 * Sub-Accounts:
 * - Onboarding Rewards (from Platform Development)
 * - Community Rewards (from Platform Development)
 * - Emergency Fund (from Reserve Fund)
 * - Partnership Rewards (from Strategic Partnerships)
 */
contract SHELTRTreasury is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Token contract
    IERC20 public immutable sheltrToken;
    
    // Treasury allocations (in tokens)
    uint256 public constant RESERVE_FUND = 5_000_000 * 10**18; // 5M (5%)
    uint256 public constant STRATEGIC_PARTNERSHIPS = 15_000_000 * 10**18; // 15M (15%)
    uint256 public constant PLATFORM_DEVELOPMENT = 15_000_000 * 10**18; // 15M (15%)
    
    // Sub-account allocations (from Platform Development)
    uint256 public constant ONBOARDING_REWARDS = 5_000_000 * 10**18; // 5M (5% of total, 33.3% of Platform Development)
    uint256 public constant COMMUNITY_REWARDS = 5_000_000 * 10**18; // 5M (5% of total, 33.3% of Platform Development)
    uint256 public constant DEVELOPMENT_OPERATIONS = 5_000_000 * 10**18; // 5M (5% of total, 33.3% of Platform Development)
    
    // Sub-account allocations (from Reserve Fund)
    uint256 public constant EMERGENCY_FUND = 3_000_000 * 10**18; // 3M (3% of total, 60% of Reserve Fund)
    uint256 public constant LIQUIDITY_RESERVE = 2_000_000 * 10**18; // 2M (2% of total, 40% of Reserve Fund)
    
    // Sub-account allocations (from Strategic Partnerships)
    uint256 public constant PARTNERSHIP_REWARDS = 10_000_000 * 10**18; // 10M (10% of total, 66.7% of Strategic Partnerships)
    uint256 public constant PARTNERSHIP_DEVELOPMENT = 5_000_000 * 10**18; // 5M (5% of total, 33.3% of Strategic Partnerships)
    
    // Treasury addresses
    address public reserveFundWallet;
    address public strategicPartnershipsWallet;
    address public platformDevelopmentWallet;
    
    // Sub-account addresses
    address public onboardingRewardsWallet;
    address public communityRewardsWallet;
    address public developmentOperationsWallet;
    address public emergencyFundWallet;
    address public liquidityReserveWallet;
    address public partnershipRewardsWallet;
    address public partnershipDevelopmentWallet;
    
    // Access control
    mapping(address => bool) public authorizedManagers;
    
    // Events
    event TreasuryInitialized();
    event WalletUpdated(string walletType, address indexed oldWallet, address indexed newWallet);
    event TokensAllocated(string allocation, uint256 amount);
    event TokensDistributed(string wallet, address indexed recipient, uint256 amount);
    event ManagerAuthorized(address indexed manager);
    event ManagerRevoked(address indexed manager);
    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);
    
    constructor(
        address _sheltrToken,
        address _reserveFundWallet,
        address _strategicPartnershipsWallet,
        address _platformDevelopmentWallet,
        address _onboardingRewardsWallet,
        address _communityRewardsWallet,
        address _developmentOperationsWallet,
        address _emergencyFundWallet,
        address _liquidityReserveWallet,
        address _partnershipRewardsWallet,
        address _partnershipDevelopmentWallet
    ) Ownable(msg.sender) {
        require(_sheltrToken != address(0), "Invalid SHELTR token address");
        require(_reserveFundWallet != address(0), "Invalid reserve fund wallet");
        require(_strategicPartnershipsWallet != address(0), "Invalid strategic partnerships wallet");
        require(_platformDevelopmentWallet != address(0), "Invalid platform development wallet");
        require(_onboardingRewardsWallet != address(0), "Invalid onboarding rewards wallet");
        require(_communityRewardsWallet != address(0), "Invalid community rewards wallet");
        require(_developmentOperationsWallet != address(0), "Invalid development operations wallet");
        require(_emergencyFundWallet != address(0), "Invalid emergency fund wallet");
        require(_liquidityReserveWallet != address(0), "Invalid liquidity reserve wallet");
        require(_partnershipRewardsWallet != address(0), "Invalid partnership rewards wallet");
        require(_partnershipDevelopmentWallet != address(0), "Invalid partnership development wallet");
        
        sheltrToken = IERC20(_sheltrToken);
        
        // Set treasury wallets
        reserveFundWallet = _reserveFundWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
        platformDevelopmentWallet = _platformDevelopmentWallet;
        
        // Set sub-account wallets
        onboardingRewardsWallet = _onboardingRewardsWallet;
        communityRewardsWallet = _communityRewardsWallet;
        developmentOperationsWallet = _developmentOperationsWallet;
        emergencyFundWallet = _emergencyFundWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        partnershipRewardsWallet = _partnershipRewardsWallet;
        partnershipDevelopmentWallet = _partnershipDevelopmentWallet;
        
        emit TreasuryInitialized();
    }
    
    /**
     * @dev Initialize treasury with token allocations
     * @param totalAmount Total amount of tokens to allocate
     */
    function initializeTreasury(uint256 totalAmount) external onlyOwner {
        require(totalAmount == RESERVE_FUND + STRATEGIC_PARTNERSHIPS + PLATFORM_DEVELOPMENT, "Invalid total amount");
        require(sheltrToken.balanceOf(address(this)) >= totalAmount, "Insufficient tokens");
        
        // Allocate to main treasury wallets
        sheltrToken.safeTransfer(reserveFundWallet, RESERVE_FUND);
        sheltrToken.safeTransfer(strategicPartnershipsWallet, STRATEGIC_PARTNERSHIPS);
        sheltrToken.safeTransfer(platformDevelopmentWallet, PLATFORM_DEVELOPMENT);
        
        emit TokensAllocated("Reserve Fund", RESERVE_FUND);
        emit TokensAllocated("Strategic Partnerships", STRATEGIC_PARTNERSHIPS);
        emit TokensAllocated("Platform Development", PLATFORM_DEVELOPMENT);
    }
    
    /**
     * @dev Distribute onboarding rewards
     * @param recipient Address to receive rewards
     * @param amount Amount of tokens
     */
    function distributeOnboardingRewards(address recipient, uint256 amount) external {
        require(authorizedManagers[msg.sender] || msg.sender == owner(), "Not authorized");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer from onboarding rewards wallet
        require(sheltrToken.balanceOf(onboardingRewardsWallet) >= amount, "Insufficient onboarding rewards");
        sheltrToken.safeTransferFrom(onboardingRewardsWallet, recipient, amount);
        
        emit TokensDistributed("Onboarding Rewards", recipient, amount);
    }
    
    /**
     * @dev Distribute community rewards
     * @param recipient Address to receive rewards
     * @param amount Amount of tokens
     */
    function distributeCommunityRewards(address recipient, uint256 amount) external {
        require(authorizedManagers[msg.sender] || msg.sender == owner(), "Not authorized");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer from community rewards wallet
        require(sheltrToken.balanceOf(communityRewardsWallet) >= amount, "Insufficient community rewards");
        sheltrToken.safeTransferFrom(communityRewardsWallet, recipient, amount);
        
        emit TokensDistributed("Community Rewards", recipient, amount);
    }
    
    /**
     * @dev Distribute partnership rewards
     * @param recipient Address to receive rewards
     * @param amount Amount of tokens
     */
    function distributePartnershipRewards(address recipient, uint256 amount) external {
        require(authorizedManagers[msg.sender] || msg.sender == owner(), "Not authorized");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer from partnership rewards wallet
        require(sheltrToken.balanceOf(partnershipRewardsWallet) >= amount, "Insufficient partnership rewards");
        sheltrToken.safeTransferFrom(partnershipRewardsWallet, recipient, amount);
        
        emit TokensDistributed("Partnership Rewards", recipient, amount);
    }
    
    /**
     * @dev Use emergency fund
     * @param recipient Address to receive emergency funds
     * @param amount Amount of tokens
     */
    function useEmergencyFund(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer from emergency fund wallet
        require(sheltrToken.balanceOf(emergencyFundWallet) >= amount, "Insufficient emergency funds");
        sheltrToken.safeTransferFrom(emergencyFundWallet, recipient, amount);
        
        emit TokensDistributed("Emergency Fund", recipient, amount);
    }
    
    /**
     * @dev Authorize a manager
     * @param manager Address to authorize
     */
    function authorizeManager(address manager) external onlyOwner {
        require(manager != address(0), "Invalid manager address");
        require(!authorizedManagers[manager], "Already authorized");
        
        authorizedManagers[manager] = true;
        emit ManagerAuthorized(manager);
    }
    
    /**
     * @dev Revoke manager authorization
     * @param manager Address to revoke
     */
    function revokeManager(address manager) external onlyOwner {
        require(authorizedManagers[manager], "Not authorized");
        
        authorizedManagers[manager] = false;
        emit ManagerRevoked(manager);
    }
    
    /**
     * @dev Update wallet addresses
     */
    function updateReserveFundWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = reserveFundWallet;
        reserveFundWallet = newWallet;
        emit WalletUpdated("Reserve Fund", oldWallet, newWallet);
    }
    
    function updateStrategicPartnershipsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = strategicPartnershipsWallet;
        strategicPartnershipsWallet = newWallet;
        emit WalletUpdated("Strategic Partnerships", oldWallet, newWallet);
    }
    
    function updatePlatformDevelopmentWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = platformDevelopmentWallet;
        platformDevelopmentWallet = newWallet;
        emit WalletUpdated("Platform Development", oldWallet, newWallet);
    }
    
    function updateOnboardingRewardsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = onboardingRewardsWallet;
        onboardingRewardsWallet = newWallet;
        emit WalletUpdated("Onboarding Rewards", oldWallet, newWallet);
    }
    
    function updateCommunityRewardsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = communityRewardsWallet;
        communityRewardsWallet = newWallet;
        emit WalletUpdated("Community Rewards", oldWallet, newWallet);
    }
    
    function updateDevelopmentOperationsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = developmentOperationsWallet;
        developmentOperationsWallet = newWallet;
        emit WalletUpdated("Development Operations", oldWallet, newWallet);
    }
    
    function updateEmergencyFundWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = emergencyFundWallet;
        emergencyFundWallet = newWallet;
        emit WalletUpdated("Emergency Fund", oldWallet, newWallet);
    }
    
    function updateLiquidityReserveWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = liquidityReserveWallet;
        liquidityReserveWallet = newWallet;
        emit WalletUpdated("Liquidity Reserve", oldWallet, newWallet);
    }
    
    function updatePartnershipRewardsWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = partnershipRewardsWallet;
        partnershipRewardsWallet = newWallet;
        emit WalletUpdated("Partnership Rewards", oldWallet, newWallet);
    }
    
    function updatePartnershipDevelopmentWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        address oldWallet = partnershipDevelopmentWallet;
        partnershipDevelopmentWallet = newWallet;
        emit WalletUpdated("Partnership Development", oldWallet, newWallet);
    }
    
    /**
     * @dev Get treasury balances
     */
    function getTreasuryBalances() external view returns (
        uint256 reserveFundBalance,
        uint256 strategicPartnershipsBalance,
        uint256 platformDevelopmentBalance,
        uint256 onboardingRewardsBalance,
        uint256 communityRewardsBalance,
        uint256 developmentOperationsBalance,
        uint256 emergencyFundBalance,
        uint256 liquidityReserveBalance,
        uint256 partnershipRewardsBalance,
        uint256 partnershipDevelopmentBalance
    ) {
        return (
            sheltrToken.balanceOf(reserveFundWallet),
            sheltrToken.balanceOf(strategicPartnershipsWallet),
            sheltrToken.balanceOf(platformDevelopmentWallet),
            sheltrToken.balanceOf(onboardingRewardsWallet),
            sheltrToken.balanceOf(communityRewardsWallet),
            sheltrToken.balanceOf(developmentOperationsWallet),
            sheltrToken.balanceOf(emergencyFundWallet),
            sheltrToken.balanceOf(liquidityReserveWallet),
            sheltrToken.balanceOf(partnershipRewardsWallet),
            sheltrToken.balanceOf(partnershipDevelopmentWallet)
        );
    }
    
    /**
     * @dev Pause treasury (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause treasury
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal of tokens
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
        emit EmergencyWithdraw(token, to, amount);
    }
}
