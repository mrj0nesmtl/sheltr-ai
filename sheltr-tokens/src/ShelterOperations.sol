// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Shelter Operations
 * @dev Manages 5% platform fees distribution to shelters or platform
 * 
 * Logic:
 * - If participant is affiliated with a shelter → 5% goes to that shelter
 * - If participant is solo → 5% goes to platform operations
 * 
 * Use Cases:
 * - Onboarding Program
 * - Financial audits
 * - Tech support
 * - Support materials
 * 
 * Distribution: SHELTR for Shelters
 */
contract ShelterOperations is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Token contracts
    IERC20 public immutable usdcToken;
    IERC20 public immutable sheltrToken;
    
    // Addresses
    address public platformOperations;
    address public smartFundDistributor;
    
    // Shelter data
    struct Shelter {
        bool isRegistered;
        address wallet;
        string name;
        uint256 totalReceived;
        uint256 lastDistribution;
        uint256 participantCount;
    }
    
    // Participant data
    struct Participant {
        bool isAffiliated;
        address shelterAddress;
        uint256 totalContributed;
    }
    
    mapping(address => Shelter) public shelters;
    mapping(address => Participant) public participants;
    address[] public registeredShelters;
    
    // Platform operations tracking
    uint256 public platformTotalReceived;
    uint256 public platformLastDistribution;
    
    // Events
    event ShelterRegistered(address indexed shelter, string name, address wallet);
    event ParticipantAffiliated(address indexed participant, address indexed shelter);
    event ParticipantSolo(address indexed participant);
    event ShelterFeeDistributed(address indexed shelter, uint256 amount);
    event PlatformFeeDistributed(uint256 amount);
    event PlatformOperationsUpdated(address indexed newOperations);
    event SmartFundDistributorUpdated(address indexed newDistributor);
    
    constructor(
        address _usdcToken,
        address _sheltrToken,
        address _platformOperations
    ) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_sheltrToken != address(0), "Invalid SHELTR address");
        require(_platformOperations != address(0), "Invalid platform operations address");
        
        usdcToken = IERC20(_usdcToken);
        sheltrToken = IERC20(_sheltrToken);
        platformOperations = _platformOperations;
    }
    
    /**
     * @dev Register a shelter
     * @param shelter Address of the shelter
     * @param name Name of the shelter
     * @param wallet Shelter's wallet address
     */
    function registerShelter(address shelter, string memory name, address wallet) external onlyOwner {
        require(shelter != address(0), "Invalid shelter address");
        require(wallet != address(0), "Invalid wallet address");
        require(bytes(name).length > 0, "Invalid shelter name");
        require(!shelters[shelter].isRegistered, "Shelter already registered");
        
        shelters[shelter] = Shelter({
            isRegistered: true,
            wallet: wallet,
            name: name,
            totalReceived: 0,
            lastDistribution: 0,
            participantCount: 0
        });
        
        registeredShelters.push(shelter);
        
        emit ShelterRegistered(shelter, name, wallet);
    }
    
    /**
     * @dev Affiliate a participant with a shelter
     * @param participant Address of the participant
     * @param shelter Address of the shelter
     */
    function affiliateParticipant(address participant, address shelter) external onlyOwner {
        require(participant != address(0), "Invalid participant address");
        require(shelters[shelter].isRegistered, "Shelter not registered");
        require(!participants[participant].isAffiliated, "Participant already affiliated");
        
        participants[participant] = Participant({
            isAffiliated: true,
            shelterAddress: shelter,
            totalContributed: 0
        });
        
        shelters[shelter].participantCount++;
        
        emit ParticipantAffiliated(participant, shelter);
    }
    
    /**
     * @dev Mark participant as solo (not affiliated with any shelter)
     * @param participant Address of the participant
     */
    function markParticipantSolo(address participant) external onlyOwner {
        require(participant != address(0), "Invalid participant address");
        require(!participants[participant].isAffiliated, "Participant is already affiliated");
        
        participants[participant] = Participant({
            isAffiliated: false,
            shelterAddress: address(0),
            totalContributed: 0
        });
        
        emit ParticipantSolo(participant);
    }
    
    /**
     * @dev Distribute 5% platform fee (called by SmartFundDistributor)
     * @param participant Address of the participant
     * @param amount Amount of USDC (5% of donation)
     */
    function distributePlatformFee(address participant, uint256 amount) external {
        require(msg.sender == smartFundDistributor, "Only SmartFundDistributor can call");
        require(participant != address(0), "Invalid participant address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from SmartFundDistributor to this contract
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update participant tracking
        participants[participant].totalContributed += amount;
        
        // Check if participant is affiliated with a shelter
        if (participants[participant].isAffiliated) {
            // Distribute to shelter
            address shelterAddress = participants[participant].shelterAddress;
            Shelter storage shelter = shelters[shelterAddress];
            
            shelter.totalReceived += amount;
            shelter.lastDistribution = block.timestamp;
            
            // Transfer to shelter wallet
            usdcToken.safeTransfer(shelter.wallet, amount);
            
            emit ShelterFeeDistributed(shelterAddress, amount);
        } else {
            // Distribute to platform operations
            platformTotalReceived += amount;
            platformLastDistribution = block.timestamp;
            
            // Transfer to platform operations wallet
            usdcToken.safeTransfer(platformOperations, amount);
            
            emit PlatformFeeDistributed(amount);
        }
    }
    
    /**
     * @dev Get shelter information
     * @param shelter Address of the shelter
     * @return shelterInfo Shelter details
     */
    function getShelter(address shelter) external view returns (Shelter memory) {
        return shelters[shelter];
    }
    
    /**
     * @dev Get participant information
     * @param participant Address of the participant
     * @return participantInfo Participant details
     */
    function getParticipant(address participant) external view returns (Participant memory) {
        return participants[participant];
    }
    
    /**
     * @dev Get all registered shelters
     * @return Array of registered shelter addresses
     */
    function getRegisteredShelters() external view returns (address[] memory) {
        return registeredShelters;
    }
    
    /**
     * @dev Update platform operations address
     * @param newOperations New platform operations address
     */
    function updatePlatformOperations(address newOperations) external onlyOwner {
        require(newOperations != address(0), "Invalid address");
        platformOperations = newOperations;
        emit PlatformOperationsUpdated(newOperations);
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
     * @dev Update shelter wallet address
     * @param shelter Address of the shelter
     * @param newWallet New wallet address
     */
    function updateShelterWallet(address shelter, address newWallet) external onlyOwner {
        require(shelters[shelter].isRegistered, "Shelter not registered");
        require(newWallet != address(0), "Invalid wallet address");
        
        shelters[shelter].wallet = newWallet;
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
    
    /**
     * @dev Get platform statistics
     * @return stats Platform statistics
     */
    function getPlatformStatistics() external view returns (
        uint256 _platformTotalReceived,
        uint256 _platformLastDistribution,
        uint256 _totalShelters
    ) {
        return (platformTotalReceived, platformLastDistribution, registeredShelters.length);
    }
}
