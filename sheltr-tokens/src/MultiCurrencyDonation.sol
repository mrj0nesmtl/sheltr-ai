// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Multi-Currency Donation Handler
 * @dev Handles donations in CAD, USD, EUR with automatic conversion to USDC
 * 
 * Supported Currencies:
 * - CAD (Canadian Dollar)
 * - USD (US Dollar) 
 * - EUR (Euro)
 * - USDC (Direct)
 */
contract MultiCurrencyDonation is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Supported stablecoins
    IERC20 public immutable usdcToken;  // USDC (USD)
    IERC20 public immutable usdtToken;  // USDT (USD)
    IERC20 public immutable cadcToken;  // CADC (Canadian Dollar)
    IERC20 public immutable eursToken;  // EURS (Euro)
    
    // Exchange rates (basis points: 10000 = 100%)
    uint256 public cadToUsdRate = 7500;  // 1 CAD = 0.75 USD (example)
    uint256 public eurToUsdRate = 11000; // 1 EUR = 1.10 USD (example)
    
    // Fee for currency conversion (0.5%)
    uint256 public constant CONVERSION_FEE = 50; // 0.5%
    
    // Events
    event DonationReceived(
        address indexed donor,
        address indexed participant,
        address token,
        uint256 amount,
        uint256 usdcEquivalent,
        string currency
    );
    event ExchangeRateUpdated(string currency, uint256 newRate);
    event ConversionFeeCollected(uint256 amount);
    
    constructor(
        address _usdcToken,
        address _usdtToken,
        address _cadcToken,
        address _eursToken
    ) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_usdtToken != address(0), "Invalid USDT address");
        require(_cadcToken != address(0), "Invalid CADC address");
        require(_eursToken != address(0), "Invalid EURS address");
        
        usdcToken = IERC20(_usdcToken);
        usdtToken = IERC20(_usdtToken);
        cadcToken = IERC20(_cadcToken);
        eursToken = IERC20(_eursToken);
    }
    
    /**
     * @dev Donate in CAD (Canadian Dollar)
     * @param participant Address of the participant
     * @param amount Amount in CAD
     */
    function donateCAD(address participant, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(cadcToken.balanceOf(msg.sender) >= amount, "Insufficient CADC balance");
        require(cadcToken.allowance(msg.sender, address(this)) >= amount, "Insufficient CADC allowance");
        
        // Transfer CADC from donor
        cadcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Convert CAD to USD equivalent
        uint256 usdcEquivalent = convertCADToUSD(amount);
        
        emit DonationReceived(msg.sender, participant, address(cadcToken), amount, usdcEquivalent, "CAD");
        
        // Forward to SmartFund distributor
        forwardToSmartFund(participant, usdcEquivalent);
    }
    
    /**
     * @dev Donate in EUR (Euro)
     * @param participant Address of the participant
     * @param amount Amount in EUR
     */
    function donateEUR(address participant, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(eursToken.balanceOf(msg.sender) >= amount, "Insufficient EURS balance");
        require(eursToken.allowance(msg.sender, address(this)) >= amount, "Insufficient EURS allowance");
        
        // Transfer EURS from donor
        eursToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Convert EUR to USD equivalent
        uint256 usdcEquivalent = convertEURToUSD(amount);
        
        emit DonationReceived(msg.sender, participant, address(eursToken), amount, usdcEquivalent, "EUR");
        
        // Forward to SmartFund distributor
        forwardToSmartFund(participant, usdcEquivalent);
    }
    
    /**
     * @dev Donate in USD (US Dollar) via USDT
     * @param participant Address of the participant
     * @param amount Amount in USD
     */
    function donateUSD(address participant, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.balanceOf(msg.sender) >= amount, "Insufficient USDT balance");
        require(usdtToken.allowance(msg.sender, address(this)) >= amount, "Insufficient USDT allowance");
        
        // Transfer USDT from donor
        usdtToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Convert USDT to USDC (1:1 for USD stablecoins)
        uint256 usdcEquivalent = amount;
        
        emit DonationReceived(msg.sender, participant, address(usdtToken), amount, usdcEquivalent, "USD");
        
        // Forward to SmartFund distributor
        forwardToSmartFund(participant, usdcEquivalent);
    }
    
    /**
     * @dev Donate directly in USDC
     * @param participant Address of the participant
     * @param amount Amount in USDC
     */
    function donateUSDC(address participant, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(msg.sender) >= amount, "Insufficient USDC balance");
        require(usdcToken.allowance(msg.sender, address(this)) >= amount, "Insufficient USDC allowance");
        
        // Transfer USDC from donor
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit DonationReceived(msg.sender, participant, address(usdcToken), amount, amount, "USDC");
        
        // Forward to SmartFund distributor
        forwardToSmartFund(participant, amount);
    }
    
    /**
     * @dev Convert CAD to USD equivalent
     * @param cadAmount Amount in CAD
     * @return USD equivalent amount
     */
    function convertCADToUSD(uint256 cadAmount) public view returns (uint256) {
        return (cadAmount * cadToUsdRate) / 10000;
    }
    
    /**
     * @dev Convert EUR to USD equivalent
     * @param eurAmount Amount in EUR
     * @return USD equivalent amount
     */
    function convertEURToUSD(uint256 eurAmount) public view returns (uint256) {
        return (eurAmount * eurToUsdRate) / 10000;
    }
    
    /**
     * @dev Update exchange rates
     * @param _cadToUsdRate New CAD to USD rate
     * @param _eurToUsdRate New EUR to USD rate
     */
    function updateExchangeRates(uint256 _cadToUsdRate, uint256 _eurToUsdRate) external onlyOwner {
        require(_cadToUsdRate > 0, "Invalid CAD rate");
        require(_eurToUsdRate > 0, "Invalid EUR rate");
        
        cadToUsdRate = _cadToUsdRate;
        eurToUsdRate = _eurToUsdRate;
        
        emit ExchangeRateUpdated("CAD", _cadToUsdRate);
        emit ExchangeRateUpdated("EUR", _eurToUsdRate);
    }
    
    /**
     * @dev Forward converted donation to SmartFund distributor
     * @param participant Address of the participant
     * @param usdcAmount Amount in USDC
     */
    function forwardToSmartFund(address participant, uint256 usdcAmount) internal {
        // This will be called by the SmartFund distributor
        // For now, we'll emit an event and the SmartFund distributor can listen
        // In a full implementation, this would call the SmartFund distributor directly
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
