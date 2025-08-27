// Real Wallet Service - Connects to actual donation data
// This service reads real donation data from Firestore and converts it to wallet format

import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface RealWalletData {
  address: string;
  displayKey: string;
  tokens: {
    sheltrS: number;    // Real donation amount converted to SHELTR-S
    sheltr: number;     // Utility token balance (0 for now)
  };
  qrCode: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface RealTransaction {
  id: string;
  hash: string;
  type: 'earned' | 'spent' | 'received' | 'transferred';
  amount: number;
  tokenType: 'sheltrS' | 'sheltr';
  description: string;
  timestamp: Date;
  from?: string;
  to?: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
}

export interface RealTokenRewards {
  welcome: number;           // SHELTR-S on registration
  dailyCheckIn: number;      // Daily shelter check-in
  serviceCompletion: number; // Service completion
  goalAchievement: number;   // Milestone achievement
  peerSupport: number;       // Helping other participants
  emergencyAllowance: number; // Emergency distribution
  donationReward: number;    // Donor rewards
}

// Real token reward structure (1 SHELTR-S = $1 USD)
export const REAL_TOKEN_REWARDS: RealTokenRewards = {
  welcome: 0, // No welcome bonus for real users
  dailyCheckIn: 5,
  serviceCompletion: 25,
  goalAchievement: 100,
  peerSupport: 10,
  emergencyAllowance: 500,
  donationReward: 1 // 1 SHELTR-S per $1 donated
};

class RealWalletService {
  private realWallets: Map<string, RealWalletData> = new Map();

  // Generate a realistic-looking wallet address
  private generateWalletAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  // Generate a realistic-looking transaction hash
  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  // Get real donation data for a user
  private async getRealDonationData(userId: string): Promise<{ total_received: number; donation_count: number }> {
    try {
      let total_received = 0;
      let donation_count = 0;
      
      // Query demo_donations collection for this user
      const donationsQuery = query(
        collection(db, 'demo_donations'),
        where('participant_id', '==', userId),
        where('status', '==', 'completed')
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      
      donationsSnapshot.docs.forEach(doc => {
        const donationData = doc.data();
        const amount = donationData.amount || {};
        
        // Handle different amount formats
        let donationValue = 0;
        if (typeof amount === 'object') {
          donationValue = amount.total || amount.amount || 0;
        } else {
          donationValue = amount || 0;
        }
        
        if (donationValue > 0) {
          total_received += donationValue;
          donation_count++;
        }
      });
      
      console.log(`💰 Real donation data for ${userId}: $${total_received} from ${donation_count} donations`);
      return { total_received, donation_count };
      
    } catch (error) {
      console.error(`❌ Error fetching real donation data for ${userId}:`, error);
      return { total_received: 0, donation_count: 0 };
    }
  }

  // Create or get real wallet data for a user
  async getRealWallet(userId: string): Promise<RealWalletData | null> {
    try {
      // Check if we already have this wallet in memory
      if (this.realWallets.has(userId)) {
        return this.realWallets.get(userId)!;
      }

      // Get real donation data
      const donationData = await this.getRealDonationData(userId);
      
      // Convert USD donations to SHELTR-S (1:1 ratio for now)
      const sheltrSBalance = donationData.total_received;
      
      // Create wallet data
      const wallet: RealWalletData = {
        address: this.generateWalletAddress(),
        displayKey: `SHELTR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        tokens: {
          sheltrS: sheltrSBalance,
          sheltr: 0 // No utility tokens yet
        },
        qrCode: '',
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true
      };

      // Store in memory
      this.realWallets.set(userId, wallet);
      
      console.log(`✅ Real wallet created for ${userId}: ${sheltrSBalance} SHELTR-S`);
      return wallet;
      
    } catch (error) {
      console.error(`❌ Error creating real wallet for ${userId}:`, error);
      return null;
    }
  }

  // Get real transaction history from donations
  async getRealTransactionHistory(userId: string, limitCount: number = 50): Promise<RealTransaction[]> {
    try {
      const transactions: RealTransaction[] = [];
      
      // Query demo_donations collection
      const donationsQuery = query(
        collection(db, 'demo_donations'),
        where('participant_id', '==', userId),
        where('status', '==', 'completed'),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      
      donationsSnapshot.docs.forEach((doc, index) => {
        const donationData = doc.data();
        const amount = donationData.amount || {};
        
        // Handle different amount formats
        let donationValue = 0;
        if (typeof amount === 'object') {
          donationValue = amount.total || amount.amount || 0;
        } else {
          donationValue = amount || 0;
        }
        
        if (donationValue > 0) {
          const transaction: RealTransaction = {
            id: doc.id,
            hash: this.generateTransactionHash(),
            type: 'received',
            amount: donationValue,
            tokenType: 'sheltrS',
            description: `Donation received - ${donationData.donor_info?.name || 'Anonymous donor'}`,
            timestamp: donationData.created_at?.toDate() || new Date(),
            from: donationData.donor_info?.email || 'Anonymous',
            to: userId,
            status: 'confirmed',
            blockNumber: Math.floor(Math.random() * 1000000) + 500000,
            gasUsed: Math.floor(Math.random() * 50000) + 21000
          };
          
          transactions.push(transaction);
        }
      });
      
      console.log(`📊 Real transaction history for ${userId}: ${transactions.length} transactions`);
      return transactions;
      
    } catch (error) {
      console.error(`❌ Error fetching real transaction history for ${userId}:`, error);
      return [];
    }
  }

  // Refresh real wallet data
  async refreshRealWallet(userId: string): Promise<RealWalletData | null> {
    // Remove from cache to force refresh
    this.realWallets.delete(userId);
    
    // Get fresh data
    return this.getRealWallet(userId);
  }

  // Get real token balance
  async getRealBalance(userId: string): Promise<{ sheltrS: number; sheltr: number } | null> {
    const wallet = await this.getRealWallet(userId);
    return wallet ? wallet.tokens : null;
  }
}

// Export singleton instance
const realWalletService = new RealWalletService();
export default realWalletService;
