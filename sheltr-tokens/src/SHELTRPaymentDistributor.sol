// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SHELTRPaymentDistributor
 * @dev Enterprise-grade payment distribution system for SHELTR's revolutionary 80/15/5 model
 * 
 * SHELTR's Zero-Risk Enterprise Architecture:
 * - 80% → Virtual Debit Cards (Zero crypto exposure for participants)
 * - 15% → Housing Fund with guaranteed 4-6% APY (Coinbase institutional staking)
 * - 5% → Shelter Operations (Community support)
 * 
 * Key Features:
 * - Integration with Adyen for virtual card management
 * - Integration with Coinbase Prime for institutional staking
 * - Base network optimization for sub-cent transaction fees
 * - Enterprise-grade security and compliance
 * - Complete transparency without participant risk
 */
contract SHELTRPaymentDistributor is AccessControl, ReentrancyGuard, Pausable {
    // =============================================================================
    // CONSTANTS & IMMUTABLES
    // =============================================================================
    
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // Enterprise distribution percentages (basis points for precision)
    uint256 public constant PARTICIPANT_PERCENTAGE = 8000; // 80.00%
    uint256 public constant HOUSING_FUND_PERCENTAGE = 1500; // 15.00%
    uint256 public constant SHELTER_OPS_PERCENTAGE = 500;   // 5.00%
    uint256 public constant TOTAL_PERCENTAGE = 10000; // 100.00%
    
    // Integration contracts
    ISHELTRStablecoin public immutable sheltrToken;
    IAdyenPayout public immutable adyenPayout;
    ICoinbaseStaking public immutable coinbaseStaking;
    IERC20 public immutable USDT;
    
    // =============================================================================
    // STRUCTS
    // =============================================================================
    
    struct DonationSplit {
        uint256 participantAmount;
        uint256 housingFundAmount;
        uint256 shelterOpsAmount;
        uint256 totalAmount;
    }
    
    struct ParticipantInfo {
        address participantAddress;
        address shelterAddress;
        string adyenCardToken;
        uint256 totalReceived;
        uint256 housingFundAllocation;
        bool isActive;
        uint256 registeredAt;
    }
    
    // =============================================================================
    // STATE VARIABLES
    // =============================================================================
    
    mapping(address => ParticipantInfo) public participants;
    mapping(address => uint256) public shelterAllocations;
    
    uint256 public totalDonationsProcessed;
    uint256 public totalParticipantPayouts;
    uint256 public totalHousingFundDeposits;
    uint256 public totalShelterOperationsPayouts;
    
    address public emergencyRecipient;
    
    // =============================================================================
    // EVENTS
    // =============================================================================
    
    event DonationProcessed(
        address indexed donor,
        address indexed participant,
        address indexed shelter,
        uint256 totalAmount,
        uint256 participantAmount,
        uint256 housingFundAmount,
        uint256 shelterOpsAmount,
        bytes32 adyenTransactionId
    );
    
    event ParticipantRegistered(
        address indexed participant,
        address indexed shelter,
        string adyenCardToken,
        uint256 timestamp
    );
    
    event VirtualCardLoaded(
        address indexed participant,
        uint256 amount,
        bytes32 adyenTransactionId
    );
    
    event HousingFundDeposited(
        address indexed participant,
        uint256 amount,
        uint256 expectedAPY
    );
    
    event ShelterOperationsPayout(
        address indexed shelter,
        uint256 amount,
        string purpose
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
        address _sheltrToken,
        address _adyenPayout,
        address _coinbaseStaking,
        address _usdt,
        address _emergencyRecipient
    ) {
        require(_sheltrToken != address(0), "Invalid SHELTR token address");
        require(_adyenPayout != address(0), "Invalid Adyen payout address");
        require(_coinbaseStaking != address(0), "Invalid Coinbase staking address");
        require(_usdt != address(0), "Invalid USDT address");
        require(_emergencyRecipient != address(0), "Invalid emergency recipient");
        
        sheltrToken = ISHELTRStablecoin(_sheltrToken);
        adyenPayout = IAdyenPayout(_adyenPayout);
        coinbaseStaking = ICoinbaseStaking(_coinbaseStaking);
        USDT = IERC20(_usdt);
        emergencyRecipient = _emergencyRecipient;
        
        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
    }
    
    // =============================================================================
    // MAIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Register a new participant with their shelter and Adyen card token
     */
    function registerParticipant(
        address participant,
        address shelter,
        string calldata adyenCardToken
    ) external onlyRole(ADMIN_ROLE) {
        require(participant != address(0), "Invalid participant address");
        require(shelter != address(0), "Invalid shelter address");
        require(bytes(adyenCardToken).length > 0, "Invalid card token");
        require(!participants[participant].isActive, "Participant already registered");
        
        participants[participant] = ParticipantInfo({
            participantAddress: participant,
            shelterAddress: shelter,
            adyenCardToken: adyenCardToken,
            totalReceived: 0,
            housingFundAllocation: 0,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        emit ParticipantRegistered(participant, shelter, adyenCardToken, block.timestamp);
    }
    
    /**
     * @dev Process a donation with enterprise 80/15/5 distribution
     * @param donor Address of the donor
     * @param participant Address of the participant receiving support
     * @param totalAmount Total donation amount in USDT
     * @param adyenTransactionId Adyen transaction ID for virtual card loading
     */
    function processDonation(
        address donor,
        address participant,
        uint256 totalAmount,
        bytes32 adyenTransactionId
    ) external onlyRole(PROCESSOR_ROLE) nonReentrant whenNotPaused {
        require(donor != address(0), "Invalid donor address");
        require(participant != address(0), "Invalid participant address");
        require(totalAmount > 0, "Amount must be greater than 0");
        require(participants[participant].isActive, "Participant not registered");
        
        // Calculate distribution split
        DonationSplit memory split = _calculateSplit(totalAmount);
        
        // Transfer USDT from donor to this contract
        require(
            USDT.transferFrom(donor, address(this), totalAmount),
            "USDT transfer failed"
        );
        
        // 1. Load 80% to participant's virtual card (zero crypto exposure)
        _processParticipantPayout(participant, split.participantAmount, adyenTransactionId);
        
        // 2. Deposit 15% to housing fund with guaranteed returns
        _processHousingFundDeposit(participant, split.housingFundAmount);
        
        // 3. Handle 5% shelter operations
        _processShelterAllocation(
            participants[participant].shelterAddress,
            participant,
            split.shelterOpsAmount
        );
        
        // Update statistics
        totalDonationsProcessed += totalAmount;
        totalParticipantPayouts += split.participantAmount;
        totalHousingFundDeposits += split.housingFundAmount;
        totalShelterOperationsPayouts += split.shelterOpsAmount;
        
        // Update participant info
        participants[participant].totalReceived += split.participantAmount;
        participants[participant].housingFundAllocation += split.housingFundAmount;
        
        emit DonationProcessed(
            donor,
            participant,
            participants[participant].shelterAddress,
            totalAmount,
            split.participantAmount,
            split.housingFundAmount,
            split.shelterOpsAmount,
            adyenTransactionId
        );
    }
    
    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Calculate the 80/15/5 split for a donation
     */
    function _calculateSplit(uint256 totalAmount) internal pure returns (DonationSplit memory) {
        uint256 participantAmount = (totalAmount * PARTICIPANT_PERCENTAGE) / TOTAL_PERCENTAGE;
        uint256 housingFundAmount = (totalAmount * HOUSING_FUND_PERCENTAGE) / TOTAL_PERCENTAGE;
        uint256 shelterOpsAmount = (totalAmount * SHELTER_OPS_PERCENTAGE) / TOTAL_PERCENTAGE;
        
        return DonationSplit({
            participantAmount: participantAmount,
            housingFundAmount: housingFundAmount,
            shelterOpsAmount: shelterOpsAmount,
            totalAmount: totalAmount
        });
    }
    
    /**
     * @dev Process participant payout through Adyen virtual card
     */
    function _processParticipantPayout(
        address participant,
        uint256 amount,
        bytes32 adyenTransactionId
    ) internal {
        // Approve USDT for Adyen payout contract
        require(USDT.approve(address(adyenPayout), amount), "USDT approval failed");
        
        // Load participant's virtual card through Adyen
        adyenPayout.loadParticipantCard(
            participant,
            amount,
            participants[participant].adyenCardToken,
            adyenTransactionId
        );
        
        emit VirtualCardLoaded(participant, amount, adyenTransactionId);
    }
    
    /**
     * @dev Process housing fund deposit with Coinbase staking
     */
    function _processHousingFundDeposit(address participant, uint256 amount) internal {
        // Approve USDT for SHELTR stablecoin contract
        require(USDT.approve(address(sheltrToken), amount), "USDT approval failed");
        
        // Deposit to housing fund and mint SHELTR tokens 1:1
        sheltrToken.depositHousingFund(participant, amount);
        
        // Stake in Coinbase for guaranteed 4-6% APY
        require(USDT.approve(address(coinbaseStaking), amount), "USDT approval failed");
        uint256 expectedAPY = coinbaseStaking.stake(amount);
        
        emit HousingFundDeposited(participant, amount, expectedAPY);
    }
    
    /**
     * @dev Process shelter operations allocation
     */
    function _processShelterAllocation(
        address shelter,
        address participant,
        uint256 amount
    ) internal {
        if (shelter == participant) {
            // Independent participant - redirect to housing fund
            _processHousingFundDeposit(participant, amount);
        } else {
            // Transfer to shelter operations
            require(USDT.transfer(shelter, amount), "Shelter payout failed");
            shelterAllocations[shelter] += amount;
            
            emit ShelterOperationsPayout(shelter, amount, "Operational support");
        }
    }
    
    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Get participant information
     */
    function getParticipant(address participant) external view returns (ParticipantInfo memory) {
        return participants[participant];
    }
    
    /**
     * @dev Get donation statistics
     */
    function getDonationStatistics() external view returns (
        uint256 totalProcessed,
        uint256 totalParticipantPayouts_,
        uint256 totalHousingFundDeposits_,
        uint256 totalShelterOperationsPayouts_
    ) {
        return (
            totalDonationsProcessed,
            totalParticipantPayouts,
            totalHousingFundDeposits,
            totalShelterOperationsPayouts
        );
    }
    
    /**
     * @dev Calculate split preview for a donation amount
     */
    function previewDonationSplit(uint256 totalAmount) external pure returns (DonationSplit memory) {
        return _calculateSplit(totalAmount);
    }
    
    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Update emergency recipient
     */
    function updateEmergencyRecipient(address newRecipient) external onlyRole(ADMIN_ROLE) {
        require(newRecipient != address(0), "Invalid recipient address");
        emergencyRecipient = newRecipient;
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
}

// =============================================================================
// INTERFACES
// =============================================================================

interface ISHELTRStablecoin {
    function depositHousingFund(address participant, uint256 amount) external;
    function getParticipantHousingBalance(address participant) external view returns (uint256);
}

interface IAdyenPayout {
    function loadParticipantCard(
        address participant,
        uint256 amount,
        string calldata cardToken,
        bytes32 transactionId
    ) external;
}

interface ICoinbaseStaking {
    function stake(uint256 amount) external returns (uint256 expectedAPY);
    function getTotalStaked() external view returns (uint256);
    function getAccruedRewards() external view returns (uint256);
}
