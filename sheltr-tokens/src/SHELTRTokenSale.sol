// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SHELTR Token Sale
 * @dev Pre-ICO and public launch token sale contract
 * 
 * Pricing:
 * - Pre-seed: $0.05 (50% discount)
 * - Public launch: $0.10
 * - 3M tokens allocated for pre-seed
 */
contract SHELTRTokenSale is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Token contracts
    IERC20 public immutable sheltrToken;
    IERC20 public immutable usdcToken;
    
    // Sale phases
    enum SalePhase { PENDING, PRE_SEED, PUBLIC, ENDED }
    SalePhase public currentPhase = SalePhase.PENDING;
    
    // Pricing (in USDC cents: 100 = $1.00)
    uint256 public constant PRE_SEED_PRICE = 5;  // $0.05
    uint256 public constant PUBLIC_PRICE = 10;   // $0.10
    
    // Allocation
    uint256 public constant PRE_SEED_ALLOCATION = 3_000_000 * 10**18; // 3M tokens
    uint256 public constant PUBLIC_ALLOCATION = 50_000_000 * 10**18;  // 50M tokens
    
    // Sale tracking
    uint256 public preSeedSold;
    uint256 public publicSold;
    uint256 public totalRaised;
    
    // Investor tracking
    struct Investor {
        uint256 preSeedPurchased;
        uint256 publicPurchased;
        uint256 totalInvested;
        bool isWhitelisted;
    }
    
    mapping(address => Investor) public investors;
    address[] public investorList;
    
    // Vesting for pre-seed investors (12 months only)
    uint256 public constant VESTING_DURATION = 365 days; // 12 months
    uint256 public constant VESTING_CLIFF = 30 days;     // 30 day cliff
    
    // Investment limits
    uint256 public constant MIN_INVESTMENT = 500 * 10**6; // $500 USDC (6 decimals)
    uint256 public constant MAX_INVESTMENT = 50_000 * 10**6; // $50,000 USDC (6 decimals)
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        bool isActive;
    }
    
    mapping(address => VestingSchedule) public vestingSchedules;
    
    // Events
    event SalePhaseUpdated(SalePhase newPhase);
    event TokensPurchased(address indexed investor, uint256 amount, uint256 price, SalePhase phase);
    event InvestorWhitelisted(address indexed investor);
    event VestingScheduleCreated(address indexed investor, uint256 amount, uint256 startTime);
    event TokensReleased(address indexed investor, uint256 amount);
    
    constructor(
        address _sheltrToken,
        address _usdcToken
    ) Ownable(msg.sender) {
        require(_sheltrToken != address(0), "Invalid SHELTR address");
        require(_usdcToken != address(0), "Invalid USDC address");
        
        sheltrToken = IERC20(_sheltrToken);
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Start pre-seed sale
     */
    function startPreSeedSale() external onlyOwner {
        require(currentPhase == SalePhase.PENDING, "Sale already started");
        currentPhase = SalePhase.PRE_SEED;
        emit SalePhaseUpdated(SalePhase.PRE_SEED);
    }
    
    /**
     * @dev Start public sale
     */
    function startPublicSale() external onlyOwner {
        require(currentPhase == SalePhase.PRE_SEED, "Must be in pre-seed phase");
        currentPhase = SalePhase.PUBLIC;
        emit SalePhaseUpdated(SalePhase.PUBLIC);
    }
    
    /**
     * @dev End sale
     */
    function endSale() external onlyOwner {
        require(currentPhase != SalePhase.ENDED, "Sale already ended");
        currentPhase = SalePhase.ENDED;
        emit SalePhaseUpdated(SalePhase.ENDED);
    }
    
    /**
     * @dev Whitelist investor for pre-seed
     * @param investor Address of the investor
     */
    function whitelistInvestor(address investor) external onlyOwner {
        require(investor != address(0), "Invalid investor address");
        require(!investors[investor].isWhitelisted, "Already whitelisted");
        
        investors[investor].isWhitelisted = true;
        investorList.push(investor);
        
        emit InvestorWhitelisted(investor);
    }
    
    /**
     * @dev Purchase tokens
     * @param usdcAmount Amount of USDC to invest
     */
    function purchaseTokens(uint256 usdcAmount) external nonReentrant whenNotPaused {
        require(currentPhase != SalePhase.PENDING && currentPhase != SalePhase.ENDED, "Sale not active");
        require(usdcAmount >= MIN_INVESTMENT, "Amount below minimum investment");
        require(usdcAmount <= MAX_INVESTMENT, "Amount exceeds maximum investment");
        require(usdcToken.balanceOf(msg.sender) >= usdcAmount, "Insufficient USDC balance");
        require(usdcToken.allowance(msg.sender, address(this)) >= usdcAmount, "Insufficient USDC allowance");
        
        // Check total investment limit per investor
        require(investors[msg.sender].totalInvested + usdcAmount <= MAX_INVESTMENT, "Total investment exceeds maximum");
        
        uint256 tokenAmount;
        uint256 price;
        
        if (currentPhase == SalePhase.PRE_SEED) {
            require(investors[msg.sender].isWhitelisted, "Not whitelisted for pre-seed");
            require(preSeedSold + (usdcAmount * 10**18) / (PRE_SEED_PRICE * 10**16) <= PRE_SEED_ALLOCATION, "Pre-seed allocation exceeded");
            
            price = PRE_SEED_PRICE;
            tokenAmount = (usdcAmount * 10**18) / (price * 10**16);
            
            investors[msg.sender].preSeedPurchased += tokenAmount;
            preSeedSold += tokenAmount;
            
            // Create vesting schedule for pre-seed purchases (12 months only)
            if (vestingSchedules[msg.sender].totalAmount == 0) {
                vestingSchedules[msg.sender] = VestingSchedule({
                    totalAmount: tokenAmount,
                    releasedAmount: 0,
                    startTime: block.timestamp + VESTING_CLIFF,
                    isActive: true
                });
                emit VestingScheduleCreated(msg.sender, tokenAmount, block.timestamp + VESTING_CLIFF);
            } else {
                vestingSchedules[msg.sender].totalAmount += tokenAmount;
            }
            
        } else if (currentPhase == SalePhase.PUBLIC) {
            require(publicSold + (usdcAmount * 10**18) / (PUBLIC_PRICE * 10**16) <= PUBLIC_ALLOCATION, "Public allocation exceeded");
            
            price = PUBLIC_PRICE;
            tokenAmount = (usdcAmount * 10**18) / (price * 10**16);
            
            investors[msg.sender].publicPurchased += tokenAmount;
            publicSold += tokenAmount;
            
            // Immediate delivery for public sale (no vesting)
            sheltrToken.safeTransfer(msg.sender, tokenAmount);
        }
        
        investors[msg.sender].totalInvested += usdcAmount;
        totalRaised += usdcAmount;
        
        // Transfer USDC from investor
        usdcToken.safeTransferFrom(msg.sender, address(this), usdcAmount);
        
        emit TokensPurchased(msg.sender, tokenAmount, price, currentPhase);
    }
    
    /**
     * @dev Release vested tokens for pre-seed investors
     */
    function releaseVestedTokens() external nonReentrant {
        require(vestingSchedules[msg.sender].isActive, "No vesting schedule");
        
        uint256 vestedAmount = getVestedAmount(msg.sender);
        uint256 releaseAmount = vestedAmount - vestingSchedules[msg.sender].releasedAmount;
        
        require(releaseAmount > 0, "No tokens to release");
        
        vestingSchedules[msg.sender].releasedAmount = vestedAmount;
        
        sheltrToken.safeTransfer(msg.sender, releaseAmount);
        
        emit TokensReleased(msg.sender, releaseAmount);
    }
    
    /**
     * @dev Calculate vested amount
     * @param investor Address of the investor
     * @return Vested amount
     */
    function getVestedAmount(address investor) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[investor];
        
        if (!schedule.isActive || block.timestamp < schedule.startTime) {
            return 0;
        }
        
        if (block.timestamp >= schedule.startTime + VESTING_DURATION) {
            return schedule.totalAmount;
        }
        
        return (schedule.totalAmount * (block.timestamp - schedule.startTime)) / VESTING_DURATION;
    }
    
    /**
     * @dev Get investor information
     * @param investor Address of the investor
     * @return investorInfo Investor details
     */
    function getInvestor(address investor) external view returns (Investor memory) {
        return investors[investor];
    }
    
    /**
     * @dev Get sale statistics
     * @return stats Sale statistics
     */
    function getSaleStatistics() external view returns (
        uint256 _preSeedSold,
        uint256 _publicSold,
        uint256 _totalRaised,
        SalePhase _currentPhase
    ) {
        return (preSeedSold, publicSold, totalRaised, currentPhase);
    }
    
    /**
     * @dev Get investment limits
     * @return minInvestment Minimum investment amount
     * @return maxInvestment Maximum investment amount
     */
    function getInvestmentLimits() external pure returns (uint256 minInvestment, uint256 maxInvestment) {
        return (MIN_INVESTMENT, MAX_INVESTMENT);
    }
    
    /**
     * @dev Get investor's remaining investment capacity
     * @param investor Address of the investor
     * @return Remaining amount that can be invested
     */
    function getRemainingInvestmentCapacity(address investor) external view returns (uint256) {
        if (investors[investor].totalInvested >= MAX_INVESTMENT) {
            return 0;
        }
        return MAX_INVESTMENT - investors[investor].totalInvested;
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
     * @dev Withdraw raised USDC
     * @param amount Amount to withdraw
     */
    function withdrawRaisedFunds(uint256 amount) external onlyOwner {
        require(amount <= totalRaised, "Amount exceeds raised funds");
        usdcToken.safeTransfer(msg.sender, amount);
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
    }
}
