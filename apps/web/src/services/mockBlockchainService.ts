// Mock Blockchain Service for UI Development
// This service simulates blockchain operations with realistic data
// Ready for easy replacement with real blockchain integration

export interface MockWallet {
  address: string;
  displayKey: string;
  tokens: {
    sheltrS: number;    // Stable token balance
    sheltr: number;     // Utility token balance
  };
  qrCode: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface MockTransaction {
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

export interface MockTokenRewards {
  welcome: number;           // SHELTR-S on registration
  dailyCheckIn: number;      // Daily shelter check-in
  serviceCompletion: number; // Service completion
  goalAchievement: number;   // Milestone achievement
  peerSupport: number;       // Helping other participants
  emergencyAllowance: number; // Emergency distribution
  donationReward: number;    // Donor rewards
}

export interface MockQRCode {
  participantId: string;
  walletAddress: string;
  displayData: {
    personalInfo: string;
    permissions: string[];
    timestamp: number;
    expiresAt?: number;
  };
  features: {
    payments: boolean;
    identification: boolean;
    serviceAccess: boolean;
  };
  qrString: string;
}

// Mock token reward structure
export const MOCK_TOKEN_REWARDS: MockTokenRewards = {
  welcome: 100,
  dailyCheckIn: 5,
  serviceCompletion: 25,
  goalAchievement: 100,
  peerSupport: 10,
  emergencyAllowance: 500,
  donationReward: 1 // 1 SHELTR per $1 donated
};

class MockBlockchainService {
  private mockWallets: Map<string, MockWallet> = new Map();
  private mockTransactions: Map<string, MockTransaction[]> = new Map();
  private mockQRCodes: Map<string, MockQRCode> = new Map();

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

  // Create a new mock wallet
  async createWallet(userId: string): Promise<MockWallet> {
    const wallet: MockWallet = {
      address: this.generateWalletAddress(),
      displayKey: `SHELTR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      tokens: {
        sheltrS: MOCK_TOKEN_REWARDS.welcome,
        sheltr: 0
      },
      qrCode: '',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    this.mockWallets.set(userId, wallet);
    
    // Create welcome transaction
    await this.addTransaction(userId, {
      type: 'earned',
      amount: MOCK_TOKEN_REWARDS.welcome,
      tokenType: 'sheltrS',
      description: 'Welcome bonus - Registration complete',
      to: wallet.address
    });

    return wallet;
  }

  // Get wallet for a user
  async getWallet(userId: string): Promise<MockWallet | null> {
    return this.mockWallets.get(userId) || null;
  }

  // Get token balances
  async getBalance(userId: string): Promise<{ sheltrS: number; sheltr: number } | null> {
    const wallet = this.mockWallets.get(userId);
    return wallet ? wallet.tokens : null;
  }

  // Add a mock transaction
  async addTransaction(userId: string, transactionData: Partial<MockTransaction>): Promise<MockTransaction> {
    const transaction: MockTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      hash: this.generateTransactionHash(),
      type: transactionData.type || 'earned',
      amount: transactionData.amount || 0,
      tokenType: transactionData.tokenType || 'sheltrS',
      description: transactionData.description || 'Transaction',
      timestamp: new Date(),
      from: transactionData.from,
      to: transactionData.to,
      status: 'confirmed',
      blockNumber: Math.floor(Math.random() * 1000000) + 500000,
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      ...transactionData
    };

    // Update wallet balance
    const wallet = this.mockWallets.get(userId);
    if (wallet) {
      if (transaction.type === 'earned' || transaction.type === 'received') {
        wallet.tokens[transaction.tokenType] += transaction.amount;
      } else if (transaction.type === 'spent' || transaction.type === 'transferred') {
        wallet.tokens[transaction.tokenType] = Math.max(0, wallet.tokens[transaction.tokenType] - transaction.amount);
      }
      wallet.lastActivity = new Date();
    }

    // Store transaction
    const userTransactions = this.mockTransactions.get(userId) || [];
    userTransactions.unshift(transaction); // Add to beginning (most recent first)
    this.mockTransactions.set(userId, userTransactions);

    return transaction;
  }

  // Get transaction history
  async getTransactionHistory(userId: string, limit: number = 50): Promise<MockTransaction[]> {
    const transactions = this.mockTransactions.get(userId) || [];
    return transactions.slice(0, limit);
  }

  // Simulate earning tokens for various activities
  async earnTokens(userId: string, activity: keyof MockTokenRewards, description?: string): Promise<MockTransaction> {
    const amount = MOCK_TOKEN_REWARDS[activity];
    const activityDescriptions = {
      welcome: 'Welcome bonus - Registration complete',
      dailyCheckIn: 'Daily shelter check-in reward',
      serviceCompletion: 'Service completion reward',
      goalAchievement: 'Goal achievement bonus',
      peerSupport: 'Peer support contribution',
      emergencyAllowance: 'Emergency assistance allocation',
      donationReward: 'Donation reward'
    };

    return this.addTransaction(userId, {
      type: 'earned',
      amount,
      tokenType: 'sheltrS',
      description: description || activityDescriptions[activity]
    });
  }

  // Generate QR code data
  async generateQRCode(userId: string, participantData: any): Promise<MockQRCode> {
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }

    const qrData: MockQRCode = {
      participantId: participantData.participantId || `PART-${userId}`,
      walletAddress: wallet.address,
      displayData: {
        personalInfo: this.encryptData(participantData.name || 'Anonymous'),
        permissions: ['payments', 'identification', 'services'],
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      },
      features: {
        payments: true,
        identification: true,
        serviceAccess: true
      },
      qrString: this.generateQRString(wallet.address, participantData)
    };

    this.mockQRCodes.set(userId, qrData);
    return qrData;
  }

  // Mock encryption for demo purposes
  private encryptData(data: string): string {
    return btoa(data); // Simple base64 encoding for demo
  }

  // Generate QR string
  private generateQRString(walletAddress: string, participantData: any): string {
    const qrData = {
      type: 'SHELTR_PARTICIPANT',
      wallet: walletAddress,
      id: participantData.participantId,
      timestamp: Date.now(),
      version: '1.0'
    };
    return JSON.stringify(qrData);
  }

  // Get QR code for user
  async getQRCode(userId: string): Promise<MockQRCode | null> {
    return this.mockQRCodes.get(userId) || null;
  }

  // Simulate network status
  async getNetworkStatus(): Promise<{
    connected: boolean;
    blockHeight: number;
    gasPrice: number;
    networkName: string;
  }> {
    return {
      connected: true,
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      gasPrice: Math.floor(Math.random() * 100) + 20, // Gwei
      networkName: 'SHELTR Testnet'
    };
  }

  // Simulate token swap (for future features)
  async simulateTokenSwap(userId: string, fromToken: 'sheltrS' | 'sheltr', toToken: 'sheltrS' | 'sheltr', amount: number): Promise<MockTransaction> {
    const rate = fromToken === 'sheltrS' ? 0.1 : 10; // 1 SHELTR-S = 0.1 SHELTR, 1 SHELTR = 10 SHELTR-S
    const receivedAmount = amount * rate;

    // Deduct from source token
    await this.addTransaction(userId, {
      type: 'spent',
      amount,
      tokenType: fromToken,
      description: `Token swap: ${fromToken.toUpperCase()} to ${toToken.toUpperCase()}`
    });

    // Add to destination token
    return this.addTransaction(userId, {
      type: 'earned',
      amount: receivedAmount,
      tokenType: toToken,
      description: `Token swap received: ${fromToken.toUpperCase()} to ${toToken.toUpperCase()}`
    });
  }

  // Mock donation tracking for donors
  async trackDonationReward(donorUserId: string, donationAmount: number): Promise<MockTransaction> {
    const sheltrReward = donationAmount * MOCK_TOKEN_REWARDS.donationReward;
    
    return this.addTransaction(donorUserId, {
      type: 'earned',
      amount: sheltrReward,
      tokenType: 'sheltr',
      description: `Donation reward for $${donationAmount} contribution`
    });
  }

  // Clear all mock data (for testing/reset)
  async clearAllData(): Promise<void> {
    this.mockWallets.clear();
    this.mockTransactions.clear();
    this.mockQRCodes.clear();
  }

  // Get wallet stats
  async getWalletStats(userId: string): Promise<{
    totalEarned: number;
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
  } | null> {
    const transactions = this.mockTransactions.get(userId) || [];
    
    if (transactions.length === 0) {
      return null;
    }

    const earned = transactions
      .filter(tx => tx.type === 'earned' || tx.type === 'received')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const spent = transactions
      .filter(tx => tx.type === 'spent' || tx.type === 'transferred')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalEarned: earned,
      totalSpent: spent,
      transactionCount: transactions.length,
      averageTransaction: earned / transactions.length
    };
  }
}

// Export singleton instance
export const mockBlockchainService = new MockBlockchainService();

// Export types
export default mockBlockchainService; 