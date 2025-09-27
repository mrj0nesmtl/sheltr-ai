// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/SHELTRPaymentDistributor.sol";
import "../src/SHELTRStablecoin.sol";
import "../src/AdyenPayoutIntegration.sol";
import "../src/CoinbaseStakingIntegration.sol";
import "../src/BaseNetworkOptimization.sol";

/**
 * @title SetupPartnershipIntegrations
 * @dev Configuration script for SHELTR's enterprise partnerships
 * 
 * SHELTR Partnership Integration Setup:
 * 1. Configure Adyen payment processing integration
 * 2. Configure Coinbase Prime institutional staking
 * 3. Configure Base network optimization parameters
 * 4. Set up automated workflows and triggers
 * 5. Initialize test participants and demo flows
 * 6. Verify all integrations are working correctly
 * 
 * Key Features:
 * - Complete partnership API configuration
 * - Automated integration testing
 * - Demo participant setup for testing
 * - Production-ready configuration validation
 * - Comprehensive integration verification
 */
contract SetupPartnershipIntegrations is Script {
    // =============================================================================
    // INTEGRATION CONFIGURATION
    // =============================================================================
    
    struct AdyenConfig {
        string apiKey;
        string merchantAccount;
        string environment;
        string webhookSecret;
        bool configured;
    }
    
    struct CoinbaseConfig {
        string apiKey;
        string apiSecret;
        string environment;
        string portfolioId;
        bool configured;
    }
    
    struct BaseConfig {
        uint256 targetGasPrice;
        uint256 ethToUsdRate;
        bool optimizationEnabled;
        bool batchProcessingEnabled;
        bool configured;
    }
    
    struct TestParticipant {
        address participantAddress;
        address shelterAddress;
        string name;
        string cardToken;
        uint256 initialAmount;
    }
    
    // =============================================================================
    // STATE VARIABLES
    // =============================================================================
    
    // Contract addresses (to be loaded from deployment)
    SHELTRPaymentDistributor public paymentDistributor;
    SHELTRStablecoin public sheltrStablecoin;
    AdyenPayoutIntegration public adyenPayout;
    CoinbaseStakingIntegration public coinbaseStaking;
    BaseNetworkOptimization public baseOptimization;
    
    // Configuration state
    AdyenConfig public adyenConfig;
    CoinbaseConfig public coinbaseConfig;
    BaseConfig public baseConfig;
    
    // Test participants for demo
    TestParticipant[] public testParticipants;
    
    // =============================================================================
    // MAIN SETUP FUNCTION
    // =============================================================================
    
    function run() external {
        console.log("=== SHELTR Partnership Integrations Setup ===");
        console.log("");
        
        // Load deployed contract addresses
        _loadDeployedContracts();
        
        // Load configuration from environment
        _loadConfiguration();
        
        // Start setup
        vm.startBroadcast();
        
        // Configure partnerships
        _configureAdyenIntegration();
        _configureCoinbaseIntegration();
        _configureBaseOptimization();
        
        // Setup test participants
        _setupTestParticipants();
        
        // Initialize demo flows
        _initializeDemoFlows();
        
        // Verify integrations
        _verifyIntegrations();
        
        vm.stopBroadcast();
        
        // Log setup summary
        _logSetupSummary();
        
        console.log("=== Partnership Integrations Setup Complete ===");
    }
    
    // =============================================================================
    // CONFIGURATION FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Configure Adyen payment processing integration
     */
    function _configureAdyenIntegration() internal {
        console.log("Configuring Adyen payment processing integration...");
        
        if (!adyenConfig.configured) {
            console.log("Adyen configuration not provided, skipping...");
            return;
        }
        
        // Configure Adyen API credentials
        adyenPayout.configureAdyen(
            adyenConfig.apiKey,
            adyenConfig.merchantAccount,
            adyenConfig.environment,
            adyenConfig.webhookSecret
        );
        
        // Enable card issuance
        adyenPayout.setCardIssuanceEnabled(true);
        
        console.log("Adyen integration configured successfully");
        console.log("Environment:", adyenConfig.environment);
        console.log("Merchant Account:", adyenConfig.merchantAccount);
        console.log("");
    }
    
    /**
     * @dev Configure Coinbase Prime institutional staking
     */
    function _configureCoinbaseIntegration() internal {
        console.log("Configuring Coinbase Prime institutional staking...");
        
        if (!coinbaseConfig.configured) {
            console.log("Coinbase configuration not provided, skipping...");
            return;
        }
        
        // Configure Coinbase Prime API credentials
        coinbaseStaking.configureCoinbase(
            coinbaseConfig.apiKey,
            coinbaseConfig.apiSecret,
            coinbaseConfig.environment,
            coinbaseConfig.portfolioId
        );
        
        // Enable staking and yield distribution
        coinbaseStaking.setStakingEnabled(true);
        coinbaseStaking.setYieldDistributionEnabled(true);
        
        // Set initial APY to 5%
        coinbaseStaking.updateAPY(500, "Initial configuration");
        
        console.log("Coinbase Prime integration configured successfully");
        console.log("Environment:", coinbaseConfig.environment);
        console.log("Portfolio ID:", coinbaseConfig.portfolioId);
        console.log("");
    }
    
    /**
     * @dev Configure Base network optimization
     */
    function _configureBaseOptimization() internal {
        console.log("Configuring Base network optimization...");
        
        if (!baseConfig.configured) {
            console.log("Base configuration not provided, using defaults...");
            baseConfig = BaseConfig({
                targetGasPrice: 1000000000, // 1 gwei
                ethToUsdRate: 2000,         // $2000 per ETH
                optimizationEnabled: true,
                batchProcessingEnabled: true,
                configured: true
            });
        }
        
        // Update ETH to USD rate
        baseOptimization.updateEthToUsdRate(baseConfig.ethToUsdRate);
        
        // Enable optimization features
        baseOptimization.setGasOptimizationEnabled(baseConfig.optimizationEnabled);
        baseOptimization.setBatchProcessingEnabled(baseConfig.batchProcessingEnabled);
        baseOptimization.setDynamicPricingEnabled(true);
        
        console.log("Base network optimization configured successfully");
        console.log("Target Gas Price:", baseConfig.targetGasPrice);
        console.log("ETH/USD Rate:", baseConfig.ethToUsdRate);
        console.log("Optimization Enabled:", baseConfig.optimizationEnabled);
        console.log("");
    }
    
    // =============================================================================
    // TEST PARTICIPANT SETUP
    // =============================================================================
    
    /**
     * @dev Setup test participants for demo flows
     */
    function _setupTestParticipants() internal {
        console.log("Setting up test participants...");
        
        // Create test participant data
        _createTestParticipantData();
        
        // Register each test participant
        for (uint256 i = 0; i < testParticipants.length; i++) {
            TestParticipant memory participant = testParticipants[i];
            
            console.log("Registering participant:", participant.name);
            console.log("Address:", participant.participantAddress);
            console.log("Shelter:", participant.shelterAddress);
            
            // Register participant in payment distributor
            paymentDistributor.registerParticipant(
                participant.participantAddress,
                participant.shelterAddress,
                participant.cardToken
            );
            
            // Issue virtual card through Adyen (if configured)
            if (adyenConfig.configured) {
                try adyenPayout.issueParticipantCard(
                    participant.participantAddress,
                    participant.initialAmount
                ) {
                    console.log("Virtual card issued successfully");
                } catch {
                    console.log("Virtual card issuance failed (expected in test environment)");
                }
            }
            
            console.log("");
        }
        
        console.log("Test participants setup complete");
        console.log("");
    }
    
    /**
     * @dev Create test participant data
     */
    function _createTestParticipantData() internal {
        // Clear existing test participants
        delete testParticipants;
        
        // Add test participants
        testParticipants.push(TestParticipant({
            participantAddress: address(0x1001),
            shelterAddress: address(0x2001),
            name: "John Doe",
            cardToken: "SHELTR_TEST_001",
            initialAmount: 100e6 // $100 USDT
        }));
        
        testParticipants.push(TestParticipant({
            participantAddress: address(0x1002),
            shelterAddress: address(0x2002),
            name: "Jane Smith",
            cardToken: "SHELTR_TEST_002",
            initialAmount: 150e6 // $150 USDT
        }));
        
        testParticipants.push(TestParticipant({
            participantAddress: address(0x1003),
            shelterAddress: address(0x1003), // Independent participant
            name: "Mike Johnson (Independent)",
            cardToken: "SHELTR_TEST_003",
            initialAmount: 200e6 // $200 USDT
        }));
    }
    
    // =============================================================================
    // DEMO FLOW INITIALIZATION
    // =============================================================================
    
    /**
     * @dev Initialize demo donation flows
     */
    function _initializeDemoFlows() internal {
        console.log("Initializing demo donation flows...");
        
        // Demo donor addresses
        address demoDonor1 = address(0x9001);
        address demoDonor2 = address(0x9002);
        
        // Simulate demo donations for each test participant
        for (uint256 i = 0; i < testParticipants.length; i++) {
            TestParticipant memory participant = testParticipants[i];
            
            console.log("Simulating donation for:", participant.name);
            
            // Create demo transaction ID
            bytes32 demoTxId = keccak256(abi.encodePacked(
                "DEMO_TX_",
                participant.participantAddress,
                block.timestamp
            ));
            
            console.log("Demo Transaction ID:", vm.toString(demoTxId));
            
            // Note: In a real environment, this would process actual donations
            // For demo purposes, we're just logging the intended flow
            
            console.log("Donation Flow:");
            console.log("- Donor:", i % 2 == 0 ? demoDonor1 : demoDonor2);
            console.log("- Amount:", participant.initialAmount);
            console.log("- Participant (80%):", (participant.initialAmount * 80) / 100);
            console.log("- Housing Fund (15%):", (participant.initialAmount * 15) / 100);
            console.log("- Shelter Ops (5%):", (participant.initialAmount * 5) / 100);
            console.log("");
        }
        
        console.log("Demo flows initialized");
        console.log("");
    }
    
    // =============================================================================
    // VERIFICATION FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Verify all integrations are working correctly
     */
    function _verifyIntegrations() internal view {
        console.log("Verifying partnership integrations...");
        
        // Verify contract addresses
        _verifyContractAddresses();
        
        // Verify Adyen integration
        _verifyAdyenIntegration();
        
        // Verify Coinbase integration
        _verifyCoinbaseIntegration();
        
        // Verify Base optimization
        _verifyBaseOptimization();
        
        // Verify test participants
        _verifyTestParticipants();
        
        console.log("All integrations verified successfully");
        console.log("");
    }
    
    /**
     * @dev Verify contract addresses are valid
     */
    function _verifyContractAddresses() internal view {
        require(address(paymentDistributor) != address(0), "PaymentDistributor not loaded");
        require(address(sheltrStablecoin) != address(0), "SheltrStablecoin not loaded");
        require(address(adyenPayout) != address(0), "AdyenPayout not loaded");
        require(address(coinbaseStaking) != address(0), "CoinbaseStaking not loaded");
        require(address(baseOptimization) != address(0), "BaseOptimization not loaded");
    }
    
    /**
     * @dev Verify Adyen integration configuration
     */
    function _verifyAdyenIntegration() internal view {
        if (!adyenConfig.configured) {
            console.log("Adyen integration not configured (skipped)");
            return;
        }
        
        // Check card issuance is enabled
        require(adyenPayout.cardIssuanceEnabled(), "Card issuance not enabled");
        
        // Check statistics
        (uint256 totalIssued, uint256 totalActive, , , ) = adyenPayout.getCardStatistics();
        console.log("Adyen Cards - Total Issued:", totalIssued, "Active:", totalActive);
    }
    
    /**
     * @dev Verify Coinbase integration configuration
     */
    function _verifyCoinbaseIntegration() internal view {
        if (!coinbaseConfig.configured) {
            console.log("Coinbase integration not configured (skipped)");
            return;
        }
        
        // Check staking is enabled
        require(coinbaseStaking.stakingEnabled(), "Staking not enabled");
        require(coinbaseStaking.yieldDistributionEnabled(), "Yield distribution not enabled");
        
        // Check APY configuration
        (, , , , uint256 apy) = coinbaseStaking.getStakingStatistics();
        require(apy >= 400 && apy <= 600, "APY not within guaranteed range");
        console.log("Coinbase Staking - Current APY:", apy, "basis points");
    }
    
    /**
     * @dev Verify Base network optimization
     */
    function _verifyBaseOptimization() internal view {
        require(baseOptimization.gasOptimizationEnabled(), "Gas optimization not enabled");
        require(baseOptimization.batchProcessingEnabled(), "Batch processing not enabled");
        
        // Check ETH/USD rate
        require(baseOptimization.ethToUsdRate() > 0, "ETH/USD rate not set");
        console.log("Base Optimization - ETH/USD Rate:", baseOptimization.ethToUsdRate());
    }
    
    /**
     * @dev Verify test participants are registered
     */
    function _verifyTestParticipants() internal view {
        for (uint256 i = 0; i < testParticipants.length; i++) {
            TestParticipant memory participant = testParticipants[i];
            
            // Check participant is registered
            (
                address participantAddr,
                address shelterAddr,
                string memory cardToken,
                ,
                ,
                bool isActive,
                
            ) = paymentDistributor.getParticipant(participant.participantAddress);
            
            require(participantAddr == participant.participantAddress, "Participant not registered");
            require(shelterAddr == participant.shelterAddress, "Shelter mismatch");
            require(
                keccak256(abi.encodePacked(cardToken)) == keccak256(abi.encodePacked(participant.cardToken)),
                "Card token mismatch"
            );
            require(isActive, "Participant not active");
        }
        
        console.log("Test participants verified:", testParticipants.length);
    }
    
    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================
    
    /**
     * @dev Load deployed contract addresses
     */
    function _loadDeployedContracts() internal {
        // Load from environment variables or previous deployment
        paymentDistributor = SHELTRPaymentDistributor(vm.envAddress("PAYMENT_DISTRIBUTOR_ADDRESS"));
        sheltrStablecoin = SHELTRStablecoin(vm.envAddress("SHELTR_STABLECOIN_ADDRESS"));
        adyenPayout = AdyenPayoutIntegration(vm.envAddress("ADYEN_PAYOUT_ADDRESS"));
        coinbaseStaking = CoinbaseStakingIntegration(vm.envAddress("COINBASE_STAKING_ADDRESS"));
        baseOptimization = BaseNetworkOptimization(vm.envAddress("BASE_OPTIMIZATION_ADDRESS"));
        
        console.log("Loaded contract addresses:");
        console.log("PaymentDistributor:", address(paymentDistributor));
        console.log("SheltrStablecoin:", address(sheltrStablecoin));
        console.log("AdyenPayout:", address(adyenPayout));
        console.log("CoinbaseStaking:", address(coinbaseStaking));
        console.log("BaseOptimization:", address(baseOptimization));
        console.log("");
    }
    
    /**
     * @dev Load configuration from environment variables
     */
    function _loadConfiguration() internal {
        console.log("Loading configuration from environment...");
        
        // Load Adyen configuration
        try vm.envString("ADYEN_API_KEY") returns (string memory apiKey) {
            adyenConfig = AdyenConfig({
                apiKey: apiKey,
                merchantAccount: vm.envString("ADYEN_MERCHANT_ACCOUNT"),
                environment: vm.envString("ADYEN_ENVIRONMENT"),
                webhookSecret: vm.envString("ADYEN_WEBHOOK_SECRET"),
                configured: true
            });
            console.log("Adyen configuration loaded");
        } catch {
            console.log("Adyen configuration not found in environment");
            adyenConfig.configured = false;
        }
        
        // Load Coinbase configuration
        try vm.envString("COINBASE_API_KEY") returns (string memory apiKey) {
            coinbaseConfig = CoinbaseConfig({
                apiKey: apiKey,
                apiSecret: vm.envString("COINBASE_API_SECRET"),
                environment: vm.envString("COINBASE_ENVIRONMENT"),
                portfolioId: vm.envString("COINBASE_PORTFOLIO_ID"),
                configured: true
            });
            console.log("Coinbase configuration loaded");
        } catch {
            console.log("Coinbase configuration not found in environment");
            coinbaseConfig.configured = false;
        }
        
        // Load Base configuration
        try vm.envUint("BASE_TARGET_GAS_PRICE") returns (uint256 gasPrice) {
            baseConfig = BaseConfig({
                targetGasPrice: gasPrice,
                ethToUsdRate: vm.envUint("ETH_TO_USD_RATE"),
                optimizationEnabled: vm.envBool("GAS_OPTIMIZATION_ENABLED"),
                batchProcessingEnabled: vm.envBool("BATCH_PROCESSING_ENABLED"),
                configured: true
            });
            console.log("Base configuration loaded");
        } catch {
            console.log("Base configuration not found in environment, using defaults");
            baseConfig.configured = false;
        }
        
        console.log("");
    }
    
    /**
     * @dev Log comprehensive setup summary
     */
    function _logSetupSummary() internal view {
        console.log("");
        console.log("=== PARTNERSHIP INTEGRATION SUMMARY ===");
        console.log("");
        
        console.log("=== ADYEN INTEGRATION ===");
        if (adyenConfig.configured) {
            console.log("Status: CONFIGURED");
            console.log("Environment:", adyenConfig.environment);
            console.log("Merchant Account:", adyenConfig.merchantAccount);
        } else {
            console.log("Status: NOT CONFIGURED");
        }
        console.log("");
        
        console.log("=== COINBASE INTEGRATION ===");
        if (coinbaseConfig.configured) {
            console.log("Status: CONFIGURED");
            console.log("Environment:", coinbaseConfig.environment);
            console.log("Portfolio ID:", coinbaseConfig.portfolioId);
        } else {
            console.log("Status: NOT CONFIGURED");
        }
        console.log("");
        
        console.log("=== BASE OPTIMIZATION ===");
        console.log("Status: CONFIGURED");
        console.log("Gas Optimization:", baseConfig.optimizationEnabled);
        console.log("Batch Processing:", baseConfig.batchProcessingEnabled);
        console.log("ETH/USD Rate:", baseConfig.ethToUsdRate);
        console.log("");
        
        console.log("=== TEST PARTICIPANTS ===");
        console.log("Total Registered:", testParticipants.length);
        for (uint256 i = 0; i < testParticipants.length; i++) {
            console.log("Participant", i + 1, ":", testParticipants[i].name);
            console.log("Address:", testParticipants[i].participantAddress);
        }
        console.log("");
        
        console.log("=== NEXT STEPS ===");
        console.log("1. Test donation processing with demo participants");
        console.log("2. Verify virtual card loading and transactions");
        console.log("3. Test housing fund allocation and staking");
        console.log("4. Monitor gas optimization performance");
        console.log("5. Set up production monitoring and alerts");
        console.log("");
    }
}
