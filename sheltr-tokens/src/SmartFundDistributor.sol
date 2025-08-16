// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SmartFund Distributor
 * @dev Handles the 80/15/5 distribution model for SHELTR donations
 * 
 * Distribution Model:
 * - 80% → Participant wallet (immediate access)
 * - 15% → Housing fund (staked for yield)
 * - 5% → Shelter operations (platform fees)
 */
contract SmartFundDistributor is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Distribution percentages (basis points: 10000 = 100%)
    uint256 public constant PARTICIPANT_SHARE = 8000; // 80%
    uint256 public constant HOUSING_SHARE = 1500;     // 15%
    uint256 public constant PLATFORM_SHARE = 500;     // 5%
    
    // Token contracts
    IERC20 public immutable usdcToken;
    IERC20 public immutable sheltrToken;
    
    // Addresses
    address public housingFund;
    address public shelterOperations;
    
    // Housing Fund contract interface
    interface IHousingFund {
        function addParticipantContribution(address participant, uint256 amount) external;
    }
    
    // Shelter Operations contract interface
    interface IShelterOperations {
        function distributePlatformFee(address participant, uint256 amount) external;
    }
    
    // SHELTR-S contract interface
    interface ISHELTRS {
        function mintWithUSDC(uint256 usdcAmount) external;
        function transfer(address to, uint256 amount) external returns (bool);
    }
    
    // Participant data
    struct Participant {
        bool isRegistered;
        address wallet;
        uint256 totalReceived;
        uint256 housingFundBalance;
        uint256 lastDistribution;
    }
    
    mapping(address => Participant) public participants;
    mapping(address => bool) public authorizedShelters;
    
    // Events
    event ParticipantRegistered(address indexed participant, address indexed wallet);
    event DonationDistributed(
        address indexed donor,
        address indexed participant,
        uint256 totalAmount,
        uint256 participantAmount,
        uint256 housingAmount,
        uint256 platformAmount
    );
    event HousingFundUpdated(address indexed newFund);
    event ShelterOperationsUpdated(address indexed newOperations);
    event ShelterAuthorized(address indexed shelter);
    event ShelterDeauthorized(address indexed shelter);
    
    constructor(
        address _usdcToken,
        address _sheltrToken,
        address _housingFund,
        address _shelterOperations
    ) Ownable(msg.sender) {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_sheltrToken != address(0), "Invalid SHELTR address");
        require(_housingFund != address(0), "Invalid housing fund address");
        require(_shelterOperations != address(0), "Invalid shelter operations address");
        
        usdcToken = IERC20(_usdcToken);
        sheltrToken = IERC20(_sheltrToken);
        housingFund = _housingFund;
        shelterOperations = _shelterOperations;
    }
    
    /**
     * @dev Register a participant
     * @param participant Address of the participant
     * @param wallet Participant's wallet address
     */
    function registerParticipant(address participant, address wallet) external {
        require(msg.sender == owner() || authorizedShelters[msg.sender], "Not authorized");
        require(participant != address(0), "Invalid participant address");
        require(wallet != address(0), "Invalid wallet address");
        require(!participants[participant].isRegistered, "Already registered");
        
        participants[participant] = Participant({
            isRegistered: true,
            wallet: wallet,
            totalReceived: 0,
            housingFundBalance: 0,
            lastDistribution: 0
        });
        
        emit ParticipantRegistered(participant, wallet);
    }
    
    /**
     * @dev Distribute donation according to 80/15/5 model
     * @param participant Address of the participant
     * @param amount Total donation amount in USDC
     */
    function distributeDonation(address participant, uint256 amount) external nonReentrant whenNotPaused {
        require(participants[participant].isRegistered, "Participant not registered");
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(msg.sender) >= amount, "Insufficient USDC balance");
        require(usdcToken.allowance(msg.sender, address(this)) >= amount, "Insufficient USDC allowance");
        
        // Transfer USDC from donor to this contract
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate distribution amounts
        uint256 participantAmount = (amount * PARTICIPANT_SHARE) / 10000;
        uint256 housingAmount = (amount * HOUSING_SHARE) / 10000;
        uint256 platformAmount = (amount * PLATFORM_SHARE) / 10000;
        
        // Ensure total equals original amount (handle rounding)
        uint256 totalDistributed = participantAmount + housingAmount + platformAmount;
        if (totalDistributed < amount) {
            platformAmount += (amount - totalDistributed);
        }
        
        // Distribute to participant (80%) - Convert to SHELTR-S tokens
        // This will be handled by the frontend to convert USDC to SHELTR-S
        usdcToken.safeTransfer(participants[participant].wallet, participantAmount);
        
        // Add to housing fund (15%) - now integrated with HousingFund contract
        IHousingFund(housingFund).addParticipantContribution(participant, housingAmount);
        participants[participant].housingFundBalance += housingAmount;
        
        // Send to shelter operations (5%) - now integrated with ShelterOperations contract
        IShelterOperations(shelterOperations).distributePlatformFee(participant, platformAmount);
        
        // Update participant stats
        participants[participant].totalReceived += amount;
        participants[participant].lastDistribution = block.timestamp;
        
        emit DonationDistributed(
            msg.sender,
            participant,
            amount,
            participantAmount,
            housingAmount,
            platformAmount
        );
    }
    
    /**
     * @dev Distribute SHELTR tokens to participant (for rewards/staking)
     * @param participant Address of the participant
     * @param amount Amount of SHELTR tokens
     */
    function distributeSHELTRTokens(address participant, uint256 amount) external onlyOwner {
        require(participants[participant].isRegistered, "Participant not registered");
        require(amount > 0, "Amount must be greater than 0");
        require(sheltrToken.balanceOf(msg.sender) >= amount, "Insufficient SHELTR balance");
        require(sheltrToken.allowance(msg.sender, address(this)) >= amount, "Insufficient SHELTR allowance");
        
        sheltrToken.safeTransferFrom(msg.sender, address(this), amount);
        sheltrToken.safeTransfer(participants[participant].wallet, amount);
    }
    
    /**
     * @dev Update housing fund address
     * @param newFund New housing fund address
     */
    function updateHousingFund(address newFund) external onlyOwner {
        require(newFund != address(0), "Invalid address");
        housingFund = newFund;
        emit HousingFundUpdated(newFund);
    }
    
    /**
     * @dev Update shelter operations address
     * @param newOperations New shelter operations address
     */
    function updateShelterOperations(address newOperations) external onlyOwner {
        require(newOperations != address(0), "Invalid address");
        shelterOperations = newOperations;
        emit ShelterOperationsUpdated(newOperations);
    }
    
    /**
     * @dev Authorize a shelter to register participants
     * @param shelter Shelter address
     */
    function authorizeShelter(address shelter) external onlyOwner {
        require(shelter != address(0), "Invalid address");
        authorizedShelters[shelter] = true;
        emit ShelterAuthorized(shelter);
    }
    
    /**
     * @dev Deauthorize a shelter
     * @param shelter Shelter address
     */
    function deauthorizeShelter(address shelter) external onlyOwner {
        authorizedShelters[shelter] = false;
        emit ShelterDeauthorized(shelter);
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
     * @dev Get participant information
     * @param participant Address of the participant
     * @return Participant information
     */
    function getParticipant(address participant) external view returns (Participant memory) {
        return participants[participant];
    }
    
    /**
     * @dev Emergency withdrawal of tokens (owner only)
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
    }
}
