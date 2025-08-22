"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import mockBlockchainService, { MockWallet, MockTransaction, MockQRCode } from '@/services/mockBlockchainService';
import realWalletService, { RealWalletData, RealTransaction } from '@/services/realWalletService';

interface MockWalletContextType {
  // Wallet state
  wallet: MockWallet | null;
  balance: { sheltrS: number; sheltr: number } | null;
  transactions: MockTransaction[];
  qrCode: MockQRCode | null;
  loading: boolean;
  error: string | null;

  // Wallet operations
  createWallet: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  earnTokens: (activity: 'dailyCheckIn' | 'serviceCompletion' | 'goalAchievement' | 'peerSupport', description?: string) => Promise<void>;
  generateQR: () => Promise<void>;
  
  // Transaction operations
  getTransactionHistory: (limit?: number) => Promise<void>;
  
  // Network status
  networkStatus: {
    connected: boolean;
    blockHeight: number;
    gasPrice: number;
    networkName: string;
  } | null;
  
  // Utility functions
  clearError: () => void;
  formatTokenAmount: (amount: number, decimals?: number) => string;
  formatAddress: (address: string) => string;
}

const MockWalletContext = createContext<MockWalletContextType | undefined>(undefined);

interface MockWalletProviderProps {
  children: ReactNode;
}

export const MockWalletProvider: React.FC<MockWalletProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<MockWallet | RealWalletData | null>(null);
  const [balance, setBalance] = useState<{ sheltrS: number; sheltr: number } | null>(null);
  const [transactions, setTransactions] = useState<MockTransaction[] | RealTransaction[]>([]);
  const [qrCode, setQrCode] = useState<MockQRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<{
    connected: boolean;
    blockHeight: number;
    gasPrice: number;
    networkName: string;
  } | null>(null);

  const clearError = () => setError(null);

  // Format token amount with decimals
  const formatTokenAmount = (amount: number, decimals: number = 2): string => {
    return amount.toFixed(decimals);
  };

  // Format wallet address for display
  const formatAddress = (address: string): string => {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Create a new wallet
  const createWallet = async (): Promise<void> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newWallet = await mockBlockchainService.createWallet(user.uid);
      setWallet(newWallet);
      
      // Refresh other data
      await Promise.all([
        refreshBalance(),
        refreshTransactions(),
        refreshNetworkStatus()
      ]);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  // Refresh wallet data
  const refreshWallet = async (): Promise<void> => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      
      const walletData = await mockBlockchainService.getWallet(user.uid);
      setWallet(walletData);
      
      // Refresh all related data
      await Promise.all([
        refreshBalance(),
        refreshTransactions(),
        refreshQRCode(),
        refreshNetworkStatus()
      ]);
      
    } catch (err: any) {
      setError(err.message || 'Failed to refresh wallet');
    } finally {
      setLoading(false);
    }
  };

  // Refresh balance
  const refreshBalance = async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      // Use real wallet service for participants, mock for others
      if (user.role === 'participant') {
        const balanceData = await realWalletService.getRealBalance(user.uid);
        setBalance(balanceData);
      } else {
        const balanceData = await mockBlockchainService.getBalance(user.uid);
        setBalance(balanceData);
      }
    } catch (err: any) {
      console.error('Failed to refresh balance:', err);
    }
  };

  // Refresh transactions
  const refreshTransactions = async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      // Use real wallet service for participants, mock for others
      if (user.role === 'participant') {
        const txHistory = await realWalletService.getRealTransactionHistory(user.uid);
        setTransactions(txHistory);
      } else {
        const txHistory = await mockBlockchainService.getTransactionHistory(user.uid);
        setTransactions(txHistory);
      }
    } catch (err: any) {
      console.error('Failed to refresh transactions:', err);
    }
  };

  // Refresh QR code
  const refreshQRCode = async (): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      const qr = await mockBlockchainService.getQRCode(user.uid);
      setQrCode(qr);
    } catch (err: any) {
      console.error('Failed to refresh QR code:', err);
    }
  };

  // Refresh network status
  const refreshNetworkStatus = async (): Promise<void> => {
    try {
      const status = await mockBlockchainService.getNetworkStatus();
      setNetworkStatus(status);
    } catch (err: any) {
      console.error('Failed to refresh network status:', err);
    }
  };

  // Earn tokens for activities
  const earnTokens = async (activity: 'dailyCheckIn' | 'serviceCompletion' | 'goalAchievement' | 'peerSupport', description?: string): Promise<void> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      
      await mockBlockchainService.earnTokens(user.uid, activity, description);
      
      // Refresh wallet data
      await Promise.all([
        refreshBalance(),
        refreshTransactions()
      ]);
      
    } catch (err: any) {
      setError(err.message || 'Failed to earn tokens');
    }
  };

  // Generate QR code
  const generateQR = async (): Promise<void> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      
      const participantData = {
        participantId: `PART-${user.uid.slice(-6)}`,
        name: user.displayName || user.email || 'Anonymous'
      };
      
      const qr = await mockBlockchainService.generateQRCode(user.uid, participantData);
      setQrCode(qr);
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR code');
    }
  };

  // Get transaction history with limit
  const getTransactionHistory = async (limit?: number): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      const txHistory = await mockBlockchainService.getTransactionHistory(user.uid, limit);
      setTransactions(txHistory);
    } catch (err: any) {
      setError(err.message || 'Failed to get transaction history');
    }
  };

  // Initialize wallet data when user changes
  useEffect(() => {
    const initializeWallet = async () => {
      if (!user?.uid) {
        setWallet(null);
        setBalance(null);
        setTransactions([]);
        setQrCode(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let walletData;
        
        // Use real wallet service for participants, mock for others
        if (user.role === 'participant') {
          walletData = await realWalletService.getRealWallet(user.uid);
        } else {
          // Check if mock wallet exists
          walletData = await mockBlockchainService.getWallet(user.uid);
          
          // Create mock wallet if it doesn't exist for donors
          if (!walletData && user.role === 'donor') {
            walletData = await mockBlockchainService.createWallet(user.uid);
          }
        }
        
        setWallet(walletData);
        
        if (walletData) {
          // Load all wallet data
          await Promise.all([
            refreshBalance(),
            refreshTransactions(),
            refreshQRCode(),
            refreshNetworkStatus()
          ]);
        }
        
      } catch (err: any) {
        console.error('Failed to initialize wallet:', err);
        setError(err.message || 'Failed to initialize wallet');
      } finally {
        setLoading(false);
      }
    };

    initializeWallet();
  }, [user?.uid, user?.role]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!user?.uid || !wallet) return;
    
    const interval = setInterval(() => {
      refreshBalance();
      refreshNetworkStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.uid, wallet]);

  const value: MockWalletContextType = {
    // State
    wallet,
    balance,
    transactions,
    qrCode,
    loading,
    error,
    networkStatus,
    
    // Operations
    createWallet,
    refreshWallet,
    earnTokens,
    generateQR,
    getTransactionHistory,
    
    // Utilities
    clearError,
    formatTokenAmount,
    formatAddress
  };

  return (
    <MockWalletContext.Provider value={value}>
      {children}
    </MockWalletContext.Provider>
  );
};

// Custom hook to use the mock wallet context
export const useMockWallet = (): MockWalletContextType => {
  const context = useContext(MockWalletContext);
  if (context === undefined) {
    throw new Error('useMockWallet must be used within a MockWalletProvider');
  }
  return context;
};

export default MockWalletProvider; 