// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SHELTR.sol";
import "../src/SHELTRTreasury.sol";

contract SetupTreasury is Script {
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
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Get deployed contracts (you'll need to update these addresses after deployment)
        SHELTR sheltrToken = SHELTR(0x...); // Update with actual address
        SHELTRTreasury treasury = SHELTRTreasury(0x...); // Update with actual address
        
        console.log("Setting up SHELTR Treasury allocations...");
        console.log("Deployer:", deployer);
        
        // Transfer tokens to treasury contract
        uint256 totalTreasuryAmount = RESERVE_FUND + STRATEGIC_PARTNERSHIPS + PLATFORM_DEVELOPMENT;
        console.log("Total Treasury Allocation:", totalTreasuryAmount / 10**18, "SHELTR");
        
        // Transfer tokens from deployer to treasury
        sheltrToken.transfer(address(treasury), totalTreasuryAmount);
        console.log("Transferred", totalTreasuryAmount / 10**18, "SHELTR to Treasury");
        
        // Initialize treasury allocations
        treasury.initializeTreasury(totalTreasuryAmount);
        console.log("Treasury initialized with allocations");
        
        // Display allocation breakdown
        console.log("");
        console.log("=== TREASURY ALLOCATION BREAKDOWN ===");
        console.log("Reserve Fund: 5,000,000 SHELTR (5%)");
        console.log("  ├── Emergency Fund: 3,000,000 SHELTR (3%)");
        console.log("  └── Liquidity Reserve: 2,000,000 SHELTR (2%)");
        console.log("");
        console.log("Strategic Partnerships: 15,000,000 SHELTR (15%)");
        console.log("  ├── Partnership Rewards: 10,000,000 SHELTR (10%)");
        console.log("  └── Partnership Development: 5,000,000 SHELTR (5%)");
        console.log("");
        console.log("Platform Development: 15,000,000 SHELTR (15%)");
        console.log("  ├── Onboarding Rewards: 5,000,000 SHELTR (5%)");
        console.log("  ├── Community Rewards: 5,000,000 SHELTR (5%)");
        console.log("  └── Development Operations: 5,000,000 SHELTR (5%)");
        console.log("");
        console.log("=== SUB-ACCOUNT WALLETS ===");
        console.log("Reserve Fund Wallet:", treasury.reserveFundWallet());
        console.log("Strategic Partnerships Wallet:", treasury.strategicPartnershipsWallet());
        console.log("Platform Development Wallet:", treasury.platformDevelopmentWallet());
        console.log("Onboarding Rewards Wallet:", treasury.onboardingRewardsWallet());
        console.log("Community Rewards Wallet:", treasury.communityRewardsWallet());
        console.log("Development Operations Wallet:", treasury.developmentOperationsWallet());
        console.log("Emergency Fund Wallet:", treasury.emergencyFundWallet());
        console.log("Liquidity Reserve Wallet:", treasury.liquidityReserveWallet());
        console.log("Partnership Rewards Wallet:", treasury.partnershipRewardsWallet());
        console.log("Partnership Development Wallet:", treasury.partnershipDevelopmentWallet());
        
        vm.stopBroadcast();
        
        console.log("");
        console.log("✅ Treasury setup complete!");
        console.log("Next steps:");
        console.log("1. Update wallet addresses for each sub-account");
        console.log("2. Authorize managers for reward distributions");
        console.log("3. Set up governance for treasury management");
    }
}
