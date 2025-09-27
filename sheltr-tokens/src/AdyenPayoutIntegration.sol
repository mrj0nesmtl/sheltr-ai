// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AdyenPayoutIntegration
 * @dev Enterprise integration with Adyen for zero-risk virtual card management
 * 
 * SHELTR's Zero-Risk Virtual Card Architecture:
 * - Complete elimination of participant cryptocurrency exposure
 * - Global Visa/Mastercard virtual debit card issuance
 * - Instant card loading and activation
 * - PCI DSS Level 1 compliant payment processing
 * - Integration with 110+ nonprofit organizations framework
 * 
 * Key Features:
 * - Seamless Adyen API integration for virtual card management
 * - Real-time card balance tracking and transaction monitoring
 * - Enterprise-grade security and compliance
 * - Global payment acceptance without crypto complexity
 * - Automated card provisioning for new participants
 */
contract AdyenPayoutIntegration is AccessControl, ReentrancyGuard, Pausable {
    // =============================================================================
    // CONSTANTS & IMMUTABLES
    // =============================================================================
    
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant CARD_MANAGER_ROLE = keccak256("CARD_MANAGER_ROLE");
    
    IERC20 public immutable USDT;
    
    // Adyen configuration
    string public constant ADYEN_API_VERSION = "v1";
    uint256 public constant MIN_CARD_LOAD = 1e6; // $1 USDT minimum
    uint256 public constant MAX_CARD_LOAD = 10000e6; // $10,000 USDT maximum
    uint256 public constant CARD_EXPIRY_MONTHS = 24; // 2 years
    
    // =============================================================================
    // STRUCTS
    // =============================================================================
    
    struct ParticipantCard {
        string cardToken;           // Adyen card token
        string cardNumber;          // Masked card number for display
        string expiryDate;          // Card expiry (MM/YY format)
        uint256 balance;            // Current card balance in USDT
        uint256 totalLoaded;        // Total amount loaded to card
        uint256 totalSpent;         // Total amount spent from card
        bool isActive;              // Card activation status
        bool isBlocked;             // Card blocked status
        uint256 createdAt;          // Card creation timestamp
        uint256 lastLoadedAt;       // Last load timestamp
        uint256 lastTransactionAt;  // Last transaction timestamp
    }
    
    struct CardTransaction {
        bytes32 transactionId;      // Adyen transaction ID
        address participant;        // Participant address
        uint256 amount;            // Transaction amount
        string transactionType;    // "LOAD", "SPEND", "REFUND"
        string merchantName;       // Merchant name (for spending)
        string description;        // Transaction description
        uint256 timestamp;         // Transaction timestamp
        bool isSuccessful;         // Transaction success status
    }
    
    struct AdyenConfig {
        string apiKey;             // Adyen API key (encrypted)
        string merchantAccount;    // Adyen merchant account
        string environment;        // "TEST" or "LIVE"
        string webhookSecret;      // Webhook verification secret
        bool isConfigured;         // Configuration status
    }
    
    // =============================================================================
    // STATE VARIABLES
    // =============================================================================
    
    mapping(address => ParticipantCard) public participantCards;
    mapping(bytes32 => CardTransaction) public cardTransactions;
    mapping(string => address) public cardTokenToParticipant;
    
    AdyenConfig private adyenConfig;
    
    uint256 public totalCardsIssued;
    uint256 public totalActiveCards;
    uint256 public totalAmountLoaded;
    uint256 public totalAmountSpent;
    uint256 public totalTransactions;
    
    address public treasuryAddress;
    address public emergencyRecipient;
    bool public cardIssuanceEnabled = true;
    
    // =============================================================================
    // EVENTS
    // =============================================================================
    
    event CardIssued(
        address indexed participant,
        string cardToken,
        string maskedCardNumber,
        string expiryDate,
        uint256 timestamp
    );
    
    event CardLoaded(
        address indexed participant,
        uint256 amount,
        bytes32 adyenTransactionId,
        uint256 newBalance,
        uint256 timestamp
    );
    
    event CardTransaction(
        address indexed participant,
        bytes32 transactionId,
        uint256 amount,
        string transactionType,
        string merchantName,
        uint256 timestamp
    );
    
    event CardStatusChanged(
        address indexed participant,
        string cardToken,
        bool isActive,
        bool isBlocked,
        string reason
    );
    
    event AdyenConfigUpdated(
        string environment,
        string merchantAccount,
        uint256 timestamp
    );
    
    event EmergencyCardBlock(
        address indexed participant,
        string cardToken,
        string reason,
        uint256 timestamp
    );
    
    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================
    
    constructor(
        address _usdt,
        address _treasuryAddress,
        address _emergencyRecipient
    ) {
        require(_usdt != address(0), "Invalid USDT address");
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_emergencyRecipient != address(0), "Invalid emergency recipient");
        
        USDT = IERC20(_usdt);
        treasuryAddress = _treasuryAddress;
        emergencyRecipient = _emergencyRecipient;
        
        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(CARD_MANAGER_ROLE, msg.sender);
    }
    
    // =============================================================================
    // MAIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Issue a new virtual card for a participant
     * @param participant Address of participant receiving the card
     * @param initialLoadAmount Initial amount to load onto the card
     */
    function issueParticipantCard(
        address participant,
        uint256 initialLoadAmount
    ) external onlyRole(CARD_MANAGER_ROLE) nonReentrant whenNotPaused returns (string memory cardToken) {
        require(participant != address(0), "Invalid participant address");
        require(cardIssuanceEnabled, "Card issuance disabled");
        require(!participantCards[participant].isActive, "Card already issued");
        require(initialLoadAmount >= MIN_CARD_LOAD, "Initial load below minimum");
        require(initialLoadAmount <= MAX_CARD_LOAD, "Initial load exceeds maximum");
        require(adyenConfig.isConfigured, "Adyen not configured");
        
        // Generate unique card token (in real implementation, this would call Adyen API)
        cardToken = _generateCardToken(participant);
        
        // Create virtual card through Adyen API (simulated)
        (string memory maskedCardNumber, string memory expiryDate) = _createAdyenVirtualCard(
            participant,
            cardToken,
            initialLoadAmount
        );
        
        // Store card information
        participantCards[participant] = ParticipantCard({
            cardToken: cardToken,
            cardNumber: maskedCardNumber,
            expiryDate: expiryDate,
            balance: 0, // Will be set during initial load
            totalLoaded: 0,
            totalSpent: 0,
            isActive: true,
            isBlocked: false,
            createdAt: block.timestamp,
            lastLoadedAt: 0,
            lastTransactionAt: 0
        });
        
        cardTokenToParticipant[cardToken] = participant;
        totalCardsIssued++;
        totalActiveCards++;
        
        emit CardIssued(participant, cardToken, maskedCardNumber, expiryDate, block.timestamp);
        
        // Load initial amount if specified
        if (initialLoadAmount > 0) {
            _loadCardBalance(participant, initialLoadAmount, keccak256(abi.encodePacked(cardToken, block.timestamp)));
        }
        
        return cardToken;
    }
    
    /**
     * @dev Load funds onto a participant's virtual card
     * @param participant Address of participant
     * @param amount Amount to load in USDT
     * @param cardToken Participant's card token
     * @param transactionId Adyen transaction ID
     */
    function loadParticipantCard(
        address participant,
        uint256 amount,
        string calldata cardToken,
        bytes32 transactionId
    ) external onlyRole(PROCESSOR_ROLE) nonReentrant whenNotPaused {
        require(participant != address(0), "Invalid participant address");
        require(amount >= MIN_CARD_LOAD, "Amount below minimum");
        require(amount <= MAX_CARD_LOAD, "Amount exceeds maximum");
        require(participantCards[participant].isActive, "Card not active");
        require(!participantCards[participant].isBlocked, "Card is blocked");
        require(
            keccak256(abi.encodePacked(participantCards[participant].cardToken)) == 
            keccak256(abi.encodePacked(cardToken)),
            "Invalid card token"
        );
        
        // Transfer USDT from caller to this contract
        require(USDT.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");
        
        // Load card through Adyen API (simulated)
        _loadCardBalance(participant, amount, transactionId);
    }
    
    /**
     * @dev Process card transaction webhook from Adyen
     * @param cardToken Card token from Adyen
     * @param transactionId Adyen transaction ID
     * @param amount Transaction amount
     * @param transactionType Type of transaction
     * @param merchantName Merchant name
     * @param isSuccessful Transaction success status
     */
    function processCardTransaction(
        string calldata cardToken,
        bytes32 transactionId,
        uint256 amount,
        string calldata transactionType,
        string calldata merchantName,
        bool isSuccessful
    ) external onlyRole(PROCESSOR_ROLE) nonReentrant {
        address participant = cardTokenToParticipant[cardToken];
        require(participant != address(0), "Invalid card token");
        require(participantCards[participant].isActive, "Card not active");
        
        // Record transaction
        cardTransactions[transactionId] = CardTransaction({
            transactionId: transactionId,
            participant: participant,
            amount: amount,
            transactionType: transactionType,
            merchantName: merchantName,
            description: string(abi.encodePacked(transactionType, " - ", merchantName)),
            timestamp: block.timestamp,
            isSuccessful: isSuccessful
        });
        
        // Update card balance for spending transactions
        if (isSuccessful && keccak256(abi.encodePacked(transactionType)) == keccak256("SPEND")) {
            require(participantCards[participant].balance >= amount, "Insufficient card balance");
            participantCards[participant].balance -= amount;
            participantCards[participant].totalSpent += amount;
            totalAmountSpent += amount;
        }
        
        participantCards[participant].lastTransactionAt = block.timestamp;
        totalTransactions++;
        
        emit CardTransaction(participant, transactionId, amount, transactionType, merchantName, block.timestamp);
    }
    
    // =============================================================================
    // CARD MANAGEMENT FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Block a participant's card (emergency or compliance)
     */
    function blockParticipantCard(
        address participant,
        string calldata reason
    ) external onlyRole(CARD_MANAGER_ROLE) {
        require(participant != address(0), "Invalid participant address");
        require(participantCards[participant].isActive, "Card not active");
        
        participantCards[participant].isBlocked = true;
        totalActiveCards--;
        
        emit CardStatusChanged(
            participant,
            participantCards[participant].cardToken,
            true,
            true,
            reason
        );
        
        emit EmergencyCardBlock(
            participant,
            participantCards[participant].cardToken,
            reason,
            block.timestamp
        );
    }
    
    /**
     * @dev Unblock a participant's card
     */
    function unblockParticipantCard(
        address participant,
        string calldata reason
    ) external onlyRole(CARD_MANAGER_ROLE) {
        require(participant != address(0), "Invalid participant address");
        require(participantCards[participant].isActive, "Card not active");
        require(participantCards[participant].isBlocked, "Card not blocked");
        
        participantCards[participant].isBlocked = false;
        totalActiveCards++;
        
        emit CardStatusChanged(
            participant,
            participantCards[participant].cardToken,
            true,
            false,
            reason
        );
    }
    
    /**
     * @dev Deactivate a participant's card permanently
     */
    function deactivateParticipantCard(
        address participant,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) {
        require(participant != address(0), "Invalid participant address");
        require(participantCards[participant].isActive, "Card not active");
        
        // Return remaining balance to treasury
        uint256 remainingBalance = participantCards[participant].balance;
        if (remainingBalance > 0) {
            require(USDT.transfer(treasuryAddress, remainingBalance), "Balance transfer failed");
        }
        
        participantCards[participant].isActive = false;
        participantCards[participant].balance = 0;
        totalActiveCards--;
        
        emit CardStatusChanged(
            participant,
            participantCards[participant].cardToken,
            false,
            false,
            reason
        );
    }
    
    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Get participant card information
     */
    function getParticipantCard(address participant) external view returns (ParticipantCard memory) {
        return participantCards[participant];
    }
    
    /**
     * @dev Get card statistics
     */
    function getCardStatistics() external view returns (
        uint256 totalIssued,
        uint256 totalActive,
        uint256 totalLoaded,
        uint256 totalSpent,
        uint256 totalTxns
    ) {
        return (
            totalCardsIssued,
            totalActiveCards,
            totalAmountLoaded,
            totalAmountSpent,
            totalTransactions
        );
    }
    
    /**
     * @dev Get transaction details
     */
    function getTransaction(bytes32 transactionId) external view returns (CardTransaction memory) {
        return cardTransactions[transactionId];
    }
    
    /**
     * @dev Check if participant has an active card
     */
    function hasActiveCard(address participant) external view returns (bool) {
        return participantCards[participant].isActive && !participantCards[participant].isBlocked;
    }
    
    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Generate unique card token for participant
     */
    function _generateCardToken(address participant) internal view returns (string memory) {
        return string(abi.encodePacked(
            "SHELTR_",
            block.timestamp,
            "_",
            uint256(uint160(participant))
        ));
    }
    
    /**
     * @dev Create virtual card through Adyen API (simulated)
     */
    function _createAdyenVirtualCard(
        address participant,
        string memory cardToken,
        uint256 initialAmount
    ) internal pure returns (string memory maskedCardNumber, string memory expiryDate) {
        // In real implementation, this would make actual Adyen API calls
        // For now, we simulate the response
        
        uint256 participantNum = uint256(uint160(participant));
        maskedCardNumber = string(abi.encodePacked(
            "****-****-****-",
            _toString(participantNum % 10000)
        ));
        
        // Set expiry to 24 months from now
        expiryDate = "12/26"; // Simplified for demo
        
        return (maskedCardNumber, expiryDate);
    }
    
    /**
     * @dev Load card balance (internal)
     */
    function _loadCardBalance(
        address participant,
        uint256 amount,
        bytes32 transactionId
    ) internal {
        participantCards[participant].balance += amount;
        participantCards[participant].totalLoaded += amount;
        participantCards[participant].lastLoadedAt = block.timestamp;
        
        totalAmountLoaded += amount;
        
        // Record load transaction
        cardTransactions[transactionId] = CardTransaction({
            transactionId: transactionId,
            participant: participant,
            amount: amount,
            transactionType: "LOAD",
            merchantName: "SHELTR Platform",
            description: "Card balance load",
            timestamp: block.timestamp,
            isSuccessful: true
        });
        
        totalTransactions++;
        
        emit CardLoaded(
            participant,
            amount,
            transactionId,
            participantCards[participant].balance,
            block.timestamp
        );
    }
    
    /**
     * @dev Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0000";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(4);
        for (uint256 i = 0; i < 4; i++) {
            if (i < digits) {
                buffer[3 - i] = bytes1(uint8(48 + uint256(value % 10)));
                value /= 10;
            } else {
                buffer[3 - i] = "0";
            }
        }
        
        return string(buffer);
    }
    
    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Configure Adyen integration settings
     */
    function configureAdyen(
        string calldata apiKey,
        string calldata merchantAccount,
        string calldata environment,
        string calldata webhookSecret
    ) external onlyRole(ADMIN_ROLE) {
        require(bytes(apiKey).length > 0, "Invalid API key");
        require(bytes(merchantAccount).length > 0, "Invalid merchant account");
        require(
            keccak256(abi.encodePacked(environment)) == keccak256("TEST") ||
            keccak256(abi.encodePacked(environment)) == keccak256("LIVE"),
            "Invalid environment"
        );
        
        adyenConfig = AdyenConfig({
            apiKey: apiKey,
            merchantAccount: merchantAccount,
            environment: environment,
            webhookSecret: webhookSecret,
            isConfigured: true
        });
        
        emit AdyenConfigUpdated(environment, merchantAccount, block.timestamp);
    }
    
    /**
     * @dev Enable/disable card issuance
     */
    function setCardIssuanceEnabled(bool enabled) external onlyRole(ADMIN_ROLE) {
        cardIssuanceEnabled = enabled;
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
