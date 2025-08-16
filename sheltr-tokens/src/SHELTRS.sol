// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SHELTR-S Stablecoin
 * @dev USD-pegged stablecoin backed by USDC reserves
 * 
 * Features:
 * - Always $1.00 USD value
 * - Backed 1:1 by USDC reserves
 * - Unlimited supply (demand-driven)
 * - Zero volatility risk for participants
 * - 100 token welcome bonus for new participants
 * - No transaction fees for participants
 */
contract SHELTRS is ERC20, ERC20Permit, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // USDC backing
    IERC20 public immutable usdcToken;
    
    // Welcome bonus for new participants
    uint256 public constant WELCOME_BONUS = 100 * 10**18; // 100 SHELTR-S
    
    // Participant tracking
    mapping(address => bool) public hasReceivedBonus;
    mapping(address => bool) public isParticipant;
    
    // Reserve tracking
    uint256 public totalUSDCReserves;
    
    // Events
    event ParticipantRegistered(address indexed participant);
    event WelcomeBonusClaimed(address indexed participant, uint256 amount);
    event USDCReservesUpdated(uint256 newReserves);
    event SHELTRSMinted(address indexed to, uint256 amount, uint256 usdcBacking);
    event SHELTRSBurned(address indexed from, uint256 amount, uint256 usdcReturned);
    
    constructor(address _usdcToken) ERC20("SHELTR-S", "SHELTR-S") ERC20Permit("SHELTR-S") Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Register a participant and give welcome bonus
     * @param participant Address of the participant
     */
    function registerParticipant(address participant) external onlyOwner {
        require(participant != address(0), "Invalid participant address");
        require(!isParticipant[participant], "Already registered");
        
        isParticipant[participant] = true;
        
        // Mint welcome bonus
        if (!hasReceivedBonus[participant]) {
            _mint(participant, WELCOME_BONUS);
            hasReceivedBonus[participant] = true;
            emit WelcomeBonusClaimed(participant, WELCOME_BONUS);
        }
        
        emit ParticipantRegistered(participant);
    }
    
    /**
     * @dev Mint SHELTR-S by depositing USDC (1:1 ratio)
     * @param usdcAmount Amount of USDC to deposit
     */
    function mintWithUSDC(uint256 usdcAmount) external nonReentrant whenNotPaused {
        require(usdcAmount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(msg.sender) >= usdcAmount, "Insufficient USDC balance");
        require(usdcToken.allowance(msg.sender, address(this)) >= usdcAmount, "Insufficient USDC allowance");
        
        // Transfer USDC to reserves
        usdcToken.safeTransferFrom(msg.sender, address(this), usdcAmount);
        totalUSDCReserves += usdcAmount;
        
        // Mint SHELTR-S (1:1 ratio)
        _mint(msg.sender, usdcAmount);
        
        emit SHELTRSMinted(msg.sender, usdcAmount, usdcAmount);
        emit USDCReservesUpdated(totalUSDCReserves);
    }
    
    /**
     * @dev Burn SHELTR-S to receive USDC (1:1 ratio)
     * @param sheltrsAmount Amount of SHELTR-S to burn
     */
    function burnForUSDC(uint256 sheltrsAmount) external nonReentrant whenNotPaused {
        require(sheltrsAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= sheltrsAmount, "Insufficient SHELTR-S balance");
        require(totalUSDCReserves >= sheltrsAmount, "Insufficient USDC reserves");
        
        // Burn SHELTR-S
        _burn(msg.sender, sheltrsAmount);
        
        // Transfer USDC from reserves
        totalUSDCReserves -= sheltrsAmount;
        usdcToken.safeTransfer(msg.sender, sheltrsAmount);
        
        emit SHELTRSBurned(msg.sender, sheltrsAmount, sheltrsAmount);
        emit USDCReservesUpdated(totalUSDCReserves);
    }
    
    /**
     * @dev Get current backing ratio
     * @return backingRatio Current USDC backing ratio (basis points)
     */
    function getBackingRatio() external view returns (uint256) {
        if (totalSupply() == 0) return 10000; // 100% if no supply
        return (totalUSDCReserves * 10000) / totalSupply();
    }
    
    /**
     * @dev Check if participant can claim welcome bonus
     * @param participant Address of the participant
     * @return canClaim Whether participant can claim bonus
     */
    function canClaimWelcomeBonus(address participant) external view returns (bool) {
        return isParticipant[participant] && !hasReceivedBonus[participant];
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
     * @dev Emergency withdrawal of USDC reserves (owner only)
     * @param amount Amount of USDC to withdraw
     */
    function emergencyWithdrawUSDC(uint256 amount) external onlyOwner {
        require(amount <= totalUSDCReserves, "Amount exceeds reserves");
        totalUSDCReserves -= amount;
        usdcToken.safeTransfer(msg.sender, amount);
        emit USDCReservesUpdated(totalUSDCReserves);
    }
    
    /**
     * @dev Override transfer to respect pause
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        require(!paused(), "Token transfers paused");
        super._update(from, to, value);
    }
}
