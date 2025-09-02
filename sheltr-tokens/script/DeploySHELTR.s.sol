// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SHELTR.sol";
import "../src/SmartFundDistributor.sol";
import "../src/HousingFund.sol";
import "../src/ShelterOperations.sol";
import "../src/MultiCurrencyDonation.sol";
import "../src/SHELTRGovernance.sol";
import "../src/SHELTRTreasury.sol";

contract DeploySHELTR is Script {
    // Token addresses on Base
    address constant USDC_BASE_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7c;
    address constant USDT_BASE_MAINNET = 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb;
    address constant USDT_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7c;
    address constant CADC_BASE_MAINNET = 0x0000000000000000000000000000000000000000; // TBD
    address constant CADC_BASE_SEPOLIA = 0x0000000000000000000000000000000000000000; // TBD
    address constant EURS_BASE_MAINNET = 0x0000000000000000000000000000000000000000; // TBD
    address constant EURS_BASE_SEPOLIA = 0x0000000000000000000000000000000000000000; // TBD
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying SHELTR Token (100M Total Supply)...");
        SHELTR sheltrToken = new SHELTR();
        console.log("SHELTR Token deployed at:", address(sheltrToken));
        console.log("Total Supply: 100,000,000 SHELTR");
        console.log("Distribution:");
        console.log("  - Public Sale: 50M (50%)");
        console.log("  - Reserve Fund: 5M (5%)");
        console.log("  - Team & Advisors: 15M (15%)");
        console.log("  - Platform Development: 15M (15%)");
        console.log("  - Community Rewards: 15M (15%)");
        
        // Deploy Housing Fund
        console.log("Deploying Housing Fund...");
        HousingFund housingFund = new HousingFund(
            usdcAddress,           // USDC token
            address(sheltrToken),  // SHELTR token
            deployer               // Fund manager (temporary)
        );
        console.log("Housing Fund deployed at:", address(housingFund));
        
        // Get token addresses based on network
        address usdcAddress;
        address usdtAddress;
        address cadcAddress;
        address eursAddress;
        
        if (block.chainid == 8453) { // Base mainnet
            usdcAddress = USDC_BASE_MAINNET;
            usdtAddress = USDT_BASE_MAINNET;
            cadcAddress = CADC_BASE_MAINNET;
            eursAddress = EURS_BASE_MAINNET;
        } else if (block.chainid == 84532) { // Base Sepolia
            usdcAddress = USDC_BASE_SEPOLIA;
            usdtAddress = USDT_BASE_SEPOLIA;
            cadcAddress = CADC_BASE_SEPOLIA;
            eursAddress = EURS_BASE_SEPOLIA;
        } else {
            revert("Unsupported network");
        }
        
        console.log("Using USDC address:", usdcAddress);
        console.log("Using USDT address:", usdtAddress);
        console.log("Using CADC address:", cadcAddress);
        console.log("Using EURS address:", eursAddress);
        
        // Deploy Shelter Operations
        console.log("Deploying Shelter Operations...");
        ShelterOperations shelterOps = new ShelterOperations(
            usdcAddress,           // USDC token
            address(sheltrToken),  // SHELTR token
            deployer               // Platform operations (temporary)
        );
        console.log("Shelter Operations deployed at:", address(shelterOps));
        
        // Deploy SmartFund Distributor
        console.log("Deploying SmartFund Distributor...");
        SmartFundDistributor distributor = new SmartFundDistributor(
            usdcAddress,           // USDC token
            address(sheltrToken),  // SHELTR token
            address(housingFund),  // Housing fund contract
            address(shelterOps)    // Shelter operations contract
        );
        console.log("SmartFund Distributor deployed at:", address(distributor));
        
        // Deploy Multi-Currency Donation Handler
        console.log("Deploying Multi-Currency Donation Handler...");
        MultiCurrencyDonation donationHandler = new MultiCurrencyDonation(
            usdcAddress,           // USDC token
            usdtAddress,           // USDT token
            cadcAddress,           // CADC token
            eursAddress            // EURS token
        );
        console.log("Multi-Currency Donation Handler deployed at:", address(donationHandler));
        
        // Deploy Governance
        console.log("Deploying SHELTR Governance...");
        SHELTRGovernance governance = new SHELTRGovernance(
            address(sheltrToken),  // SHELTR token
            deployer,              // Founder (JY) - temporary
            deployer               // Founding Member (DK) - temporary
        );
        console.log("SHELTR Governance deployed at:", address(governance));
        
        // Deploy Treasury
        console.log("Deploying SHELTR Treasury...");
        SHELTRTreasury treasury = new SHELTRTreasury(
            address(sheltrToken),  // SHELTR token
            deployer,              // Reserve Fund Wallet (temporary)
            deployer,              // Strategic Partnerships Wallet (temporary)
            deployer,              // Platform Development Wallet (temporary)
            deployer,              // Onboarding Rewards Wallet (temporary)
            deployer,              // Community Rewards Wallet (temporary)
            deployer,              // Development Operations Wallet (temporary)
            deployer,              // Emergency Fund Wallet (temporary)
            deployer,              // Liquidity Reserve Wallet (temporary)
            deployer,              // Partnership Rewards Wallet (temporary)
            deployer               // Partnership Development Wallet (temporary)
        );
        console.log("SHELTR Treasury deployed at:", address(treasury));
        
        // Link contracts together
        console.log("Linking contracts...");
        housingFund.updateSmartFundDistributor(address(distributor));
        shelterOps.updateSmartFundDistributor(address(distributor));
        console.log("Integration complete!");
        
        // Add some initial team members (example)
        console.log("Setting up initial team members...");
        
        // Example: Add JY as team member with vesting
        // sheltrToken.addTeamMember(
        //     0x1234567890123456789012345678901234567890, // JYs address
        //     10_000_000 * 10**18, // 10 million tokens
        //     block.timestamp + 30 days, // Start in 30 days
        //     365 days // Vest over 1 year
        // );
        
        vm.stopBroadcast();
        
        console.log("Deployment completed successfully!");
        console.log("Network ID:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("SHELTR Token:", address(sheltrToken));
        console.log("SmartFund Distributor:", address(distributor));
    }
}
