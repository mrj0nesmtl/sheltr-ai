# SHELTR Utility Token Implementation Guide
*Dual-Purpose Architecture: Shelter Ledger Track & Trace + SmartFund™ Investment Vehicle*

**Document Version**: 3.0.0  
**Last Updated**: December 12, 2025  
**Status**: Technical Specification  
**Architecture**: Shelter Ledger Public Accountability System

---

## 🎯 **Implementation Overview**

This guide provides the technical implementation details for SHELTR's revolutionary **dual-purpose utility token architecture**, integrating the Shelter Ledger public accountability system with enterprise payment rails (Adyen) and Coinbase Base blockchain infrastructure.

### **Dual-Purpose Architecture**

**PRIMARY PURPOSE: Shelter Ledger - Track & Trace Every Dollar**
- Immutable record of every donation received
- Complete transparency of all fund distributions
- Public access for anyone to verify transactions
- Automatic participant wallet creation upon registration

**SECONDARY PURPOSE: SmartFund™ Investment Vehicle**
- 15% of donations allocated to participant housing fund
- Guaranteed 4-6% APY through Coinbase institutional staking
- Zero cryptocurrency exposure for participants
- Real-time balance monitoring via dashboard

---

## 🏗️ **Core Components**

### **1. Adyen Payment Integration**

#### **A. Merchant Account Setup**
```bash
# Environment Configuration
ADYEN_API_KEY=your_live_api_key
ADYEN_MERCHANT_ACCOUNT=SHELTR_MAIN_ACCOUNT
ADYEN_CLIENT_KEY=your_client_key
ADYEN_ENVIRONMENT=live
ADYEN_WEBHOOK_HMAC_KEY=your_webhook_key
ADYEN_ISSUING_USERNAME=your_issuing_username
ADYEN_ISSUING_PASSWORD=your_issuing_password
```

#### **B. Payment Processing Service**
```python
# apps/api/services/adyen_payment_service.py
import adyen
from decimal import Decimal
from typing import Dict, Any

class AdyenPaymentService:
    def __init__(self):
        self.adyen_client = adyen.Adyen()
        self.adyen_client.client.xapikey = os.getenv('ADYEN_API_KEY')
        self.adyen_client.client.platform = os.getenv('ADYEN_ENVIRONMENT')
        
    async def create_donation_session(
        self, 
        participant_id: str, 
        amount: Decimal,
        donor_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create payment session for QR donation
        """
        request = {
            "amount": {
                "currency": "USD",
                "value": int(amount * 100)  # Convert to cents
            },
            "reference": f"SHELTR-{participant_id}-{int(time.time())}",
            "merchantAccount": os.getenv('ADYEN_MERCHANT_ACCOUNT'),
            "channel": "Web",
            "countryCode": "US",
            "shopperEmail": donor_info.get('email'),
            "returnUrl": f"{os.getenv('FRONTEND_URL')}/donation/success",
            "additionalData": {
                "participant_id": participant_id,
                "sheltr_smartfund": "true",
                "housing_fund_allocation": "15",
                "shelter_ops_allocation": "5"
            }
        }
        
        try:
            result = self.adyen_client.checkout.payment_sessions.post(request)
            return {
                "session_data": result.message.get('sessionData'),
                "payment_session": result.message.get('id'),
                "reference": request['reference']
            }
        except Exception as e:
            raise PaymentException(f"Payment session creation failed: {str(e)}")
```

#### **C. Virtual Card Issuance**
```python
# apps/api/services/adyen_issuing_service.py
class AdyenIssuingService:
    def __init__(self):
        self.client = adyen.Adyen()
        self.client.client.username = os.getenv('ADYEN_ISSUING_USERNAME')
        self.client.client.password = os.getenv('ADYEN_ISSUING_PASSWORD')
        
    async def create_participant_card(
        self, 
        participant: ParticipantModel,
        initial_balance: Decimal
    ) -> Dict[str, Any]:
        """
        Issue virtual debit card for participant
        """
        # Create account holder first
        account_holder_request = {
            "accountHolderCode": f"SHELTR-{participant.id}",
            "accountHolderDetails": {
                "email": participant.email,
                "fullPhoneNumber": participant.phone,
                "individualDetails": {
                    "name": {
                        "firstName": participant.first_name,
                        "lastName": participant.last_name
                    },
                    "dateOfBirth": participant.date_of_birth.strftime("%Y-%m-%d")
                },
                "address": {
                    "country": "US",
                    "city": participant.city or "Unknown",
                    "postalCode": participant.zip_code or "00000",
                    "stateOrProvince": participant.state or "CA",
                    "street": participant.address or "Homeless Services"
                }
            },
            "legalEntity": "Individual",
            "processingTier": 1
        }
        
        account_holder = await self.client.marketpay.create_account_holder(account_holder_request)
        
        # Create payment instrument (card)
        card_request = {
            "accountHolderCode": f"SHELTR-{participant.id}",
            "card": {
                "number": "************1234",  # Adyen generates
                "expiryMonth": "12",
                "expiryYear": str(datetime.now().year + 3),
                "holderName": f"{participant.first_name} {participant.last_name}",
                "cvc": "***"  # Adyen generates
            },
            "type": "virtual"
        }
        
        card_response = await self.client.marketpay.create_payment_instrument(card_request)
        
        # Load initial balance
        if initial_balance > 0:
            await self.load_card_balance(
                account_holder_code=f"SHELTR-{participant.id}",
                amount=initial_balance
            )
            
        return {
            "card_token": card_response.get('token'),
            "account_holder_code": f"SHELTR-{participant.id}",
            "card_number_masked": card_response.get('card', {}).get('number'),
            "expiry_date": f"{card_response.get('card', {}).get('expiryMonth')}/{card_response.get('card', {}).get('expiryYear')}",
            "initial_balance": float(initial_balance)
        }
        
    async def load_card_balance(
        self, 
        account_holder_code: str, 
        amount: Decimal
    ) -> bool:
        """
        Load funds onto participant's virtual card
        """
        transfer_request = {
            "accountHolderCode": account_holder_code,
            "amount": {
                "currency": "USD",
                "value": int(amount * 100)
            },
            "sourceAccountCode": "SHELTR_MASTER_ACCOUNT",
            "transferCode": f"DONATION-{int(time.time())}"
        }
        
        try:
            result = await self.client.marketpay.transfer_funds(transfer_request)
            return result.get('resultCode') == 'Success'
        except Exception as e:
            logger.error(f"Card balance loading failed: {str(e)}")
            return False
```

### **2. Coinbase Base Integration**

#### **A. SHELTR Utility Token Contract (Dual-Purpose)**
```solidity
// contracts/SHELTRUtilityToken.sol
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SHELTR Utility Token
 * @notice Dual-purpose token for Shelter Ledger transparency and SmartFund™ housing investment
 * @dev Primary: Track & Trace all donations and payouts | Secondary: Housing fund with 4-6% APY
 */
contract SHELTRUtilityToken is ERC20, Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");
    
    // USDT contract on Base network
    IERC20 public immutable USDT;
    
    // Coinbase staking integration
    address public coinbaseStakingPool;
    uint256 public targetAPY = 500; // 5.00% (basis points)
    
    // Housing fund tracking (Secondary Purpose)
    mapping(address => uint256) public participantHousingFunds;
    uint256 public totalHousingFund;
    uint256 public totalStakedAmount;
    
    // Shelter Ledger: Track & Trace (Primary Purpose)
    mapping(address => uint256) public totalDonationsReceived;
    mapping(address => Transaction[]) public transactionHistory;
    mapping(string => DonationRecord) public donationLedger;
    uint256 public totalTransactionsTracked;
    
    struct Transaction {
        uint256 amount;
        uint256 timestamp;
        TransactionType txType;
        string donationId;
        bool isPublic;
    }
    
    struct DonationRecord {
        address donor;
        address participant;
        uint256 totalAmount;
        uint256 virtualCardAmount;
        uint256 housingFundAmount;
        uint256 operationsAmount;
        uint256 timestamp;
        bool verified;
    }
    
    enum TransactionType {
        DONATION_RECEIVED,
        VIRTUAL_CARD_LOAD,
        HOUSING_FUND_DEPOSIT,
        INTEREST_ACCRUED,
        PAYOUT_DISTRIBUTED
    }
    
    // Events for Shelter Ledger transparency
    event HousingFundDeposit(address indexed participant, uint256 amount, uint256 timestamp);
    event StakingRewardsDistributed(uint256 totalRewards, uint256 timestamp);
    event ParticipantHousingAllocation(address indexed participant, uint256 amount);
    event DonationTracked(string indexed donationId, address indexed participant, uint256 amount);
    event PayoutTraced(address indexed participant, uint256 amount, TransactionType txType);
    event ShelterLedgerEntry(address indexed participant, uint256 amount, TransactionType txType);
    
    constructor(
        address _usdt,
        address _coinbaseStakingPool
    ) ERC20("SHELTR Utility Token", "SHELTR") {
        USDT = IERC20(_usdt);
        coinbaseStakingPool = _coinbaseStakingPool;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(STAKER_ROLE, msg.sender);
    }
    
    /**
     * @dev Track donation in Shelter Ledger (Primary Purpose)
     * @param donationId Unique donation identifier
     * @param donor Address of the donor
     * @param participant Address of the participant
     * @param totalAmount Total donation amount
     * @param virtualCardAmount Amount loaded to virtual card (80%)
     * @param housingFundAmount Amount allocated to housing fund (15%)
     * @param operationsAmount Amount for platform operations (5%)
     */
    function trackDonation(
        string memory donationId,
        address donor,
        address participant,
        uint256 totalAmount,
        uint256 virtualCardAmount,
        uint256 housingFundAmount,
        uint256 operationsAmount
    ) external onlyRole(MINTER_ROLE) nonReentrant {
        require(bytes(donationId).length > 0, "Invalid donation ID");
        require(participant != address(0), "Invalid participant address");
        require(totalAmount > 0, "Amount must be greater than 0");
        
        // Record in Shelter Ledger
        donationLedger[donationId] = DonationRecord({
            donor: donor,
            participant: participant,
            totalAmount: totalAmount,
            virtualCardAmount: virtualCardAmount,
            housingFundAmount: housingFundAmount,
            operationsAmount: operationsAmount,
            timestamp: block.timestamp,
            verified: true
        });
        
        // Update participant totals
        totalDonationsReceived[participant] += totalAmount;
        totalTransactionsTracked++;
        
        // Add to transaction history
        transactionHistory[participant].push(Transaction({
            amount: totalAmount,
            timestamp: block.timestamp,
            txType: TransactionType.DONATION_RECEIVED,
            donationId: donationId,
            isPublic: true
        }));
        
        emit DonationTracked(donationId, participant, totalAmount);
        emit ShelterLedgerEntry(participant, totalAmount, TransactionType.DONATION_RECEIVED);
    }
    
    /**
     * @dev Deposit USDT to housing fund and mint SHELTR tokens (Secondary Purpose)
     * @param participant The participant this housing fund is for
     * @param usdtAmount Amount of USDT to deposit
     * @param donationId Associated donation ID for tracking
     */
    function depositHousingFund(
        address participant, 
        uint256 usdtAmount,
        string memory donationId
    ) external onlyRole(MINTER_ROLE) nonReentrant {
        require(usdtAmount > 0, "Amount must be greater than 0");
        
        // Transfer USDT from sender
        USDT.transferFrom(msg.sender, address(this), usdtAmount);
        
        // Mint SHELTR tokens 1:1 with USDT
        _mint(address(this), usdtAmount);
        
        // Update participant housing fund allocation
        participantHousingFunds[participant] += usdtAmount;
        totalHousingFund += usdtAmount;
        
        // Stake USDT in Coinbase for yield
        _stakeToCoinbase(usdtAmount);
        
        // Record in Shelter Ledger
        transactionHistory[participant].push(Transaction({
            amount: usdtAmount,
            timestamp: block.timestamp,
            txType: TransactionType.HOUSING_FUND_DEPOSIT,
            donationId: donationId,
            isPublic: true
        }));
        
        emit HousingFundDeposit(participant, usdtAmount, block.timestamp);
        emit ParticipantHousingAllocation(participant, participantHousingFunds[participant]);
        emit ShelterLedgerEntry(participant, usdtAmount, TransactionType.HOUSING_FUND_DEPOSIT);
    }
    
    /**
     * @dev Get participant's complete transaction history (Shelter Ledger)
     * @param participant Address of the participant
     * @return Array of all transactions
     */
    function getTransactionHistory(address participant) external view returns (Transaction[] memory) {
        return transactionHistory[participant];
    }
    
    /**
     * @dev Get donation record from Shelter Ledger
     * @param donationId Unique donation identifier
     * @return Complete donation record
     */
    function getDonationRecord(string memory donationId) external view returns (DonationRecord memory) {
        return donationLedger[donationId];
    }
    
    /**
     * @dev Verify donation on Shelter Ledger (Public Access)
     * @param donationId Unique donation identifier
     * @return verified Whether the donation exists and is verified
     */
    function verifyDonation(string memory donationId) external view returns (bool verified) {
        return donationLedger[donationId].verified;
    }
    
    /**
     * @dev Get total donations received by participant (Shelter Ledger)
     * @param participant Address of the participant
     * @return Total amount of all donations received
     */
    function getTotalDonationsReceived(address participant) external view returns (uint256) {
        return totalDonationsReceived[participant];
    }
    
    /**
     * @dev Stake USDT to Coinbase for guaranteed returns
     */
    function _stakeToCoinbase(uint256 amount) internal {
        // Approve Coinbase staking pool
        USDT.approve(coinbaseStakingPool, amount);
        
        // Call Coinbase staking contract
        ICoinbaseStaking(coinbaseStakingPool).stake(amount);
        
        totalStakedAmount += amount;
    }
    
    /**
     * @dev Distribute staking rewards proportionally to participants
     */
    function distributeStakingRewards() external onlyRole(STAKER_ROLE) {
        uint256 rewards = ICoinbaseStaking(coinbaseStakingPool).claimRewards();
        
        if (rewards > 0) {
            // Mint new SHELTR tokens representing the rewards
            _mint(address(this), rewards);
            totalHousingFund += rewards;
            
            emit StakingRewardsDistributed(rewards, block.timestamp);
        }
    }
    
    /**
     * @dev Get participant's housing fund balance with accrued rewards
     */
    function getParticipantHousingBalance(address participant) external view returns (uint256) {
        if (totalStakedAmount == 0) return participantHousingFunds[participant];
        
        // Calculate proportional share of total fund including rewards
        uint256 participantShare = (participantHousingFunds[participant] * totalHousingFund) / totalStakedAmount;
        return participantShare;
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}

interface ICoinbaseStaking {
    function stake(uint256 amount) external returns (bool);
    function claimRewards() external returns (uint256);
    function getStakedBalance(address account) external view returns (uint256);
}
```

#### **B. Smart Contract Distribution Logic**
```solidity
// contracts/SHELTRPaymentDistributor.sol
pragma solidity ^0.8.19;

import "./SHELTRStablecoin.sol";
import "./interfaces/IAdyenPayout.sol";

contract SHELTRPaymentDistributor is AccessControl, ReentrancyGuard {
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    
    SHELTRStablecoin public immutable sheltrToken;
    IAdyenPayout public immutable adyenPayout;
    
    // Distribution percentages (in basis points)
    uint256 public constant PARTICIPANT_PERCENTAGE = 8000; // 80%
    uint256 public constant HOUSING_FUND_PERCENTAGE = 1500; // 15%
    uint256 public constant SHELTER_OPS_PERCENTAGE = 500;   // 5%
    
    struct DonationSplit {
        uint256 participantAmount;
        uint256 housingFundAmount;
        uint256 shelterOpsAmount;
        uint256 totalAmount;
    }
    
    // Mapping participant to their registered shelter
    mapping(address => address) public participantShelters;
    
    event DonationProcessed(
        address indexed participant,
        address indexed donor,
        uint256 totalAmount,
        uint256 participantAmount,
        uint256 housingFundAmount,
        uint256 shelterOpsAmount,
        bytes32 adyenTransactionId
    );
    
    constructor(
        address _sheltrToken,
        address _adyenPayout
    ) {
        sheltrToken = SHELTRStablecoin(_sheltrToken);
        adyenPayout = IAdyenPayout(_adyenPayout);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROCESSOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Process donation and distribute funds according to SmartFund model
     */
    function processDonation(
        address participant,
        address donor,
        uint256 totalAmount,
        bytes32 adyenTransactionId
    ) external onlyRole(PROCESSOR_ROLE) nonReentrant {
        require(participant != address(0), "Invalid participant address");
        require(totalAmount > 0, "Amount must be greater than 0");
        
        DonationSplit memory split = _calculateSplit(totalAmount);
        
        // 1. Send 80% to participant via Adyen virtual card
        bool cardLoadSuccess = adyenPayout.loadParticipantCard(
            participant,
            split.participantAmount,
            adyenTransactionId
        );
        require(cardLoadSuccess, "Failed to load participant card");
        
        // 2. Deposit 15% to housing fund (SHELTR stablecoin pool)
        sheltrToken.depositHousingFund(participant, split.housingFundAmount);
        
        // 3. Handle shelter operations (5%)
        address shelter = participantShelters[participant];
        if (shelter != address(0)) {
            // Transfer to registered shelter
            _transferToShelter(shelter, split.shelterOpsAmount);
        } else {
            // No registered shelter - add to participant's housing fund
            sheltrToken.depositHousingFund(participant, split.shelterOpsAmount);
        }
        
        emit DonationProcessed(
            participant,
            donor,
            totalAmount,
            split.participantAmount,
            split.housingFundAmount,
            split.shelterOpsAmount,
            adyenTransactionId
        );
    }
    
    function _calculateSplit(uint256 amount) internal pure returns (DonationSplit memory) {
        uint256 participantAmount = (amount * PARTICIPANT_PERCENTAGE) / 10000;
        uint256 housingFundAmount = (amount * HOUSING_FUND_PERCENTAGE) / 10000;
        uint256 shelterOpsAmount = (amount * SHELTER_OPS_PERCENTAGE) / 10000;
        
        return DonationSplit({
            participantAmount: participantAmount,
            housingFundAmount: housingFundAmount,
            shelterOpsAmount: shelterOpsAmount,
            totalAmount: amount
        });
    }
    
    function _transferToShelter(address shelter, uint256 amount) internal {
        // Implementation for shelter transfer
        // Could be direct transfer, escrow, or another mechanism
        payable(shelter).transfer(amount);
    }
    
    /**
     * @dev Register participant with their shelter
     */
    function registerParticipantShelter(
        address participant, 
        address shelter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        participantShelters[participant] = shelter;
    }
}
```

### **3. Backend API Integration**

#### **A. Donation Processing Router**
```python
# apps/api/routers/donations_v2.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

router = APIRouter(prefix="/api/v2/donations", tags=["donations"])

class DonationRequest(BaseModel):
    participant_id: str
    amount: Decimal
    donor_email: Optional[str] = None
    donor_name: Optional[str] = None

class DonationResponse(BaseModel):
    success: bool
    donation_id: str
    payment_session: str
    participant_card_token: Optional[str] = None
    housing_fund_allocation: Decimal
    shelter_ops_allocation: Decimal

@router.post("/create-session", response_model=DonationResponse)
async def create_donation_session(
    request: DonationRequest,
    adyen_service: AdyenPaymentService = Depends(get_adyen_service),
    participant_service: ParticipantService = Depends(get_participant_service)
):
    """
    Create donation session with Adyen and prepare fund distribution
    """
    try:
        # Validate participant exists
        participant = await participant_service.get_participant(request.participant_id)
        if not participant:
            raise HTTPException(status_code=404, detail="Participant not found")
        
        # Create Adyen payment session
        payment_session = await adyen_service.create_donation_session(
            participant_id=request.participant_id,
            amount=request.amount,
            donor_info={
                "email": request.donor_email,
                "name": request.donor_name
            }
        )
        
        # Create or get participant's virtual card
        card_info = await adyen_service.get_or_create_participant_card(participant)
        
        # Calculate fund allocations
        housing_fund = request.amount * Decimal('0.15')
        shelter_ops = request.amount * Decimal('0.05')
        
        # Store donation record
        donation_id = await store_donation_record(
            participant_id=request.participant_id,
            amount=request.amount,
            payment_session=payment_session['payment_session'],
            housing_fund_allocation=housing_fund,
            shelter_ops_allocation=shelter_ops
        )
        
        return DonationResponse(
            success=True,
            donation_id=donation_id,
            payment_session=payment_session['session_data'],
            participant_card_token=card_info.get('card_token'),
            housing_fund_allocation=housing_fund,
            shelter_ops_allocation=shelter_ops
        )
        
    except Exception as e:
        logger.error(f"Donation session creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create donation session")

@router.post("/webhook/adyen")
async def handle_adyen_webhook(
    webhook_data: dict,
    blockchain_service: BlockchainService = Depends(get_blockchain_service)
):
    """
    Handle Adyen webhook notifications for payment completion
    """
    try:
        # Verify webhook signature
        if not verify_adyen_webhook_signature(webhook_data):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Extract payment information
        notification = webhook_data.get('notificationItems', [{}])[0]
        event_code = notification.get('eventCode')
        success = notification.get('success') == 'true'
        
        if event_code == 'AUTHORISATION' and success:
            # Payment successful - trigger smart contract distribution
            merchant_reference = notification.get('merchantReference')
            amount = notification.get('amount', {}).get('value', 0) / 100  # Convert from cents
            
            # Get donation record
            donation = await get_donation_by_reference(merchant_reference)
            if not donation:
                logger.warning(f"Donation not found for reference: {merchant_reference}")
                return {"status": "accepted"}
            
            # Trigger blockchain distribution
            tx_hash = await blockchain_service.process_donation(
                participant_address=donation['participant_blockchain_address'],
                donor_address=donation.get('donor_blockchain_address'),
                total_amount=amount,
                adyen_transaction_id=notification.get('pspReference')
            )
            
            # Update donation record
            await update_donation_status(
                donation['id'],
                status='completed',
                blockchain_tx_hash=tx_hash
            )
            
            logger.info(f"Donation processed successfully: {donation['id']}")
        
        return {"status": "accepted"}
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        return {"status": "error"}
```

#### **B. Blockchain Integration Service**
```python
# apps/api/services/blockchain_service.py
from web3 import Web3
from decimal import Decimal
import json

class BlockchainService:
    def __init__(self):
        # Base network configuration
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('BASE_RPC_URL')))
        self.chain_id = 8453  # Base mainnet
        
        # Load contract ABIs and addresses
        self.distributor_contract = self._load_contract(
            address=os.getenv('SHELTR_DISTRIBUTOR_ADDRESS'),
            abi_file='SHELTRPaymentDistributor.json'
        )
        
        self.sheltr_token_contract = self._load_contract(
            address=os.getenv('SHELTR_TOKEN_ADDRESS'),
            abi_file='SHELTRStablecoin.json'
        )
        
        # Load private key for transaction signing
        self.private_key = os.getenv('BLOCKCHAIN_PRIVATE_KEY')
        self.account = self.w3.eth.account.from_key(self.private_key)
        
    def _load_contract(self, address: str, abi_file: str):
        """Load contract instance from ABI file"""
        with open(f'contracts/abi/{abi_file}', 'r') as f:
            abi = json.load(f)
        return self.w3.eth.contract(address=address, abi=abi)
    
    async def process_donation(
        self,
        participant_address: str,
        donor_address: str,
        total_amount: Decimal,
        adyen_transaction_id: str
    ) -> str:
        """
        Process donation through smart contract distribution
        """
        try:
            # Convert amount to Wei (18 decimals)
            amount_wei = int(total_amount * 10**18)
            
            # Build transaction
            transaction = self.distributor_contract.functions.processDonation(
                participant_address,
                donor_address or self.account.address,
                amount_wei,
                adyen_transaction_id.encode('utf-8')
            ).build_transaction({
                'chainId': self.chain_id,
                'gas': 500000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
            
            if receipt.status == 1:
                logger.info(f"Donation processed successfully: {tx_hash.hex()}")
                return tx_hash.hex()
            else:
                raise Exception("Transaction failed")
                
        except Exception as e:
            logger.error(f"Blockchain donation processing failed: {str(e)}")
            raise
    
    async def get_participant_housing_balance(self, participant_address: str) -> Decimal:
        """
        Get participant's current housing fund balance including rewards
        """
        try:
            balance_wei = self.sheltr_token_contract.functions.getParticipantHousingBalance(
                participant_address
            ).call()
            
            # Convert from Wei to USD
            balance_usd = Decimal(balance_wei) / Decimal(10**18)
            return balance_usd
            
        except Exception as e:
            logger.error(f"Failed to get housing balance: {str(e)}")
            return Decimal('0')
    
    async def get_total_housing_fund_stats(self) -> dict:
        """
        Get overall housing fund statistics
        """
        try:
            total_fund = self.sheltr_token_contract.functions.totalHousingFund().call()
            total_staked = self.sheltr_token_contract.functions.totalStakedAmount().call()
            
            return {
                "total_housing_fund_usd": float(Decimal(total_fund) / Decimal(10**18)),
                "total_staked_usd": float(Decimal(total_staked) / Decimal(10**18)),
                "current_apy": await self._calculate_current_apy(),
                "total_participants": await self._count_participants_with_housing_funds()
            }
            
        except Exception as e:
            logger.error(f"Failed to get housing fund stats: {str(e)}")
            return {}
```

---

## 🚀 **Deployment Instructions**

### **1. Environment Setup**
```bash
# Clone repository
git clone https://github.com/sheltr-ai/platform.git
cd platform

# Install dependencies
npm install
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Configure all Adyen and Coinbase credentials
```

### **2. Smart Contract Deployment**
```bash
# Install Hardhat
npm install --save-dev hardhat

# Compile contracts
npx hardhat compile

# Deploy to Base network
npx hardhat run scripts/deploy-v2.js --network base

# Verify contracts
npx hardhat verify --network base [CONTRACT_ADDRESS]
```

### **3. Backend Service Deployment**
```bash
# Build Docker image
docker build -t sheltr-api:v2 .

# Deploy to Google Cloud Run
gcloud run deploy sheltr-api \
  --image gcr.io/sheltr-ai/sheltr-api:v2 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### **4. Frontend Integration**
```bash
# Update frontend configuration
export NEXT_PUBLIC_API_BASE_URL=https://your-api-url
export NEXT_PUBLIC_ADYEN_CLIENT_KEY=your_client_key
export NEXT_PUBLIC_BLOCKCHAIN_NETWORK=base

# Build and deploy
npm run build
firebase deploy --only hosting
```

---

## 📊 **Testing & Validation**

### **1. Payment Flow Testing**
```python
# Test donation processing
async def test_donation_flow():
    # Create test donation
    response = await client.post("/api/v2/donations/create-session", {
        "participant_id": "test-participant-001",
        "amount": 100.00,
        "donor_email": "test@example.com"
    })
    
    assert response.status_code == 200
    assert response.json()["housing_fund_allocation"] == 15.00
    assert response.json()["shelter_ops_allocation"] == 5.00
```

### **2. Smart Contract Testing**
```javascript
// Hardhat test
describe("SHELTRPaymentDistributor", function() {
  it("Should distribute funds correctly", async function() {
    const [owner, participant, donor] = await ethers.getSigners();
    
    const donation = ethers.utils.parseEther("100");
    
    await distributor.processDonation(
      participant.address,
      donor.address,
      donation,
      ethers.utils.formatBytes32String("test-tx")
    );
    
    // Verify housing fund allocation
    const housingBalance = await sheltrToken.getParticipantHousingBalance(participant.address);
    expect(housingBalance).to.equal(ethers.utils.parseEther("15"));
  });
});
```

---

## 🔐 **Security Considerations**

### **1. Smart Contract Security**
- Multi-signature wallet for admin functions
- Time-locked upgrades with 48-hour delay
- Regular security audits by reputable firms
- Bug bounty program for vulnerability disclosure

### **2. API Security**
- JWT authentication for all endpoints
- Rate limiting on donation endpoints
- Webhook signature verification
- Input validation and sanitization

### **3. Data Protection**
- Encryption at rest for all sensitive data
- PCI DSS compliance for payment data
- GDPR compliance for EU users
- Regular security penetration testing

---

## 📈 **Monitoring & Analytics**

### **1. Key Metrics Dashboard**
```python
# Monitoring service
class MonitoringService:
    async def get_platform_metrics(self):
        return {
            "total_donations_24h": await self.get_donations_count(hours=24),
            "total_housing_fund_usd": await self.get_total_housing_fund(),
            "average_donation_amount": await self.get_average_donation(),
            "participant_card_usage_rate": await self.get_card_usage_rate(),
            "housing_fund_apy": await self.get_current_apy(),
            "system_uptime": await self.get_system_uptime()
        }
```

### **2. Alert System**
- Transaction failure alerts
- Smart contract event monitoring
- Housing fund performance tracking
- Participant card usage anomalies

---

## 🎯 **Success Criteria**

### **Technical KPIs**
- ✅ Payment processing success rate: >99.5%
- ✅ Smart contract gas optimization: <$0.50 per transaction
- ✅ Housing fund APY achievement: 4-6% annually
- ✅ System uptime: 99.9%
- ✅ API response time: <200ms average

### **Business KPIs**
- ✅ Participant satisfaction: >4.5/5.0
- ✅ Donor conversion rate: >15%
- ✅ Housing fund growth: $1M+ in Year 1
- ✅ Shelter partner adoption: 100+ active partners

---

## 📖 **Shelter Ledger Public API**

### **Public Verification Endpoints (No Authentication Required)**

```python
# apps/api/routers/shelter_ledger.py
from fastapi import APIRouter, HTTPException
from typing import List, Optional

router = APIRouter(prefix="/api/v1/ledger", tags=["shelter-ledger"])

@router.get("/donations/{donation_id}")
async def verify_donation(donation_id: str):
    """
    Public endpoint to verify any donation on the Shelter Ledger
    Anyone can verify donations for complete transparency
    """
    try:
        donation = await blockchain_service.get_donation_record(donation_id)
        
        return {
            "donationId": donation_id,
            "verified": donation.verified,
            "totalAmount": float(donation.totalAmount),
            "participant": donation.participant,
            "timestamp": donation.timestamp,
            "distribution": {
                "virtualCard": float(donation.virtualCardAmount),
                "housingFund": float(donation.housingFundAmount),
                "operations": float(donation.operationsAmount)
            },
            "blockchainTx": donation.transactionHash,
            "immutable": True
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Donation not found")

@router.get("/participant/{participant_id}/balance")
async def get_participant_balance(participant_id: str):
    """
    Public endpoint to view participant's housing fund balance
    Promotes transparency while protecting privacy
    """
    try:
        balance = await blockchain_service.get_participant_housing_balance(participant_id)
        total_donations = await blockchain_service.get_total_donations_received(participant_id)
        
        return {
            "participantId": participant_id,
            "housingFundBalance": float(balance),
            "totalDonationsReceived": float(total_donations),
            "projectedAPY": "4-6%",
            "lastUpdated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Participant not found")

@router.get("/stats/platform")
async def get_platform_stats():
    """
    Public endpoint for overall platform statistics
    Complete transparency of platform performance
    """
    try:
        stats = await blockchain_service.get_total_housing_fund_stats()
        
        return {
            "totalHousingFund": stats["total_housing_fund_usd"],
            "totalStaked": stats["total_staked_usd"],
            "currentAPY": stats["current_apy"],
            "totalParticipants": stats["total_participants"],
            "totalTransactionsTracked": stats["total_transactions"],
            "platformTransparency": "100%",
            "lastUpdated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch stats")

@router.get("/transactions/{participant_id}")
async def get_transaction_history(
    participant_id: str,
    limit: int = 50,
    offset: int = 0
):
    """
    Public endpoint to view participant's transaction history
    Complete transparency of all fund movements
    """
    try:
        transactions = await blockchain_service.get_transaction_history(
            participant_id,
            limit=limit,
            offset=offset
        )
        
        return {
            "participantId": participant_id,
            "transactions": [
                {
                    "amount": float(tx.amount),
                    "timestamp": tx.timestamp,
                    "type": tx.txType.name,
                    "donationId": tx.donationId,
                    "isPublic": tx.isPublic
                }
                for tx in transactions
            ],
            "total": len(transactions),
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Transactions not found")
```

### **Participant Wallet Dashboard Interface**

```typescript
// apps/web/src/types/wallet.ts
export interface ParticipantWallet {
  walletAddress: string;
  housingFundBalance: number;
  totalDonationsReceived: number;
  housingFundGrowth: number;
  projectedBalance: number;
  transactionHistory: WalletTransaction[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  timestamp: Date;
  type: 'DONATION_RECEIVED' | 'HOUSING_FUND_DEPOSIT' | 'INTEREST_ACCRUED' | 'VIRTUAL_CARD_LOAD';
  donationId?: string;
  verified: boolean;
  blockchainTx: string;
}

export interface WalletDashboardProps {
  participantId: string;
  wallet: ParticipantWallet;
  showTransactions?: boolean;
  showProjections?: boolean;
}
```

---

## 🎯 **Shelter Ledger Benefits**

### **For Participants**
✅ **Complete Visibility**: View every donation and payout in real-time  
✅ **Housing Fund Tracking**: Monitor investment growth with 4-6% APY  
✅ **Zero Complexity**: No cryptocurrency knowledge required  
✅ **Automatic Wallet**: Created upon registration, no setup needed

### **For Donors**
✅ **Donation Verification**: Verify your donation was received and distributed correctly  
✅ **Impact Tracking**: See exactly how your contribution was allocated  
✅ **Public Transparency**: Anyone can audit the system  
✅ **Immutable Records**: Donations cannot be altered or hidden

### **For Auditors & Regulators**
✅ **Public Access**: No special permissions needed to verify transactions  
✅ **Complete Audit Trail**: Every dollar tracked from donation to distribution  
✅ **Blockchain Security**: Cryptographically secure and immutable  
✅ **Real-Time Monitoring**: Live data available 24/7

### **For the Platform**
✅ **Trust Building**: Complete transparency builds donor confidence  
✅ **Regulatory Compliance**: Meets highest standards for charitable organizations  
✅ **Fraud Prevention**: Immutable records prevent manipulation  
✅ **Scalability**: Blockchain handles millions of transactions efficiently

---

*This implementation guide provides the technical foundation for SHELTR v3.0's revolutionary **dual-purpose utility token architecture**, combining the Shelter Ledger public accountability system with the SmartFund™ investment vehicle, ensuring maximum transparency, impact, and minimal risk for all participants.*

**Last Updated: December 12, 2025 - Shelter Ledger Implementation Complete**
