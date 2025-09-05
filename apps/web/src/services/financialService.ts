import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  totalDonations: number;
  platformFees: number;
  processingFees: number;
  transactionCount: number;
  avgDonation: number;
  fraudRate: number;
}

export interface Transaction {
  id: string;
  type: 'donation' | 'payout' | 'fee';
  amount: number;
  participant: string;
  donor: string;
  shelter: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  fees: number;
  platformFee: number;
  netAmount: number;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * Calculate SmartFund distribution from donation amount
 * 80% to participant, 15% to housing fund, 5% to platform
 */
export const calculateSmartFundDistribution = (amount: number) => {
  const participantAmount = amount * 0.80;
  const housingFundAmount = amount * 0.15;
  const platformFeeAmount = amount * 0.05;
  
  return {
    participantAmount,
    housingFundAmount,
    platformFeeAmount,
    total: amount
  };
};

/**
 * Get comprehensive financial metrics from real donation data
 */
export const getFinancialMetrics = async (): Promise<FinancialMetrics> => {
  try {
    console.log('💰 [FINANCIAL] Fetching real financial metrics from multi-tenant database...');
    
    // Get all donations from demo_donations collection
    const donationsSnapshot = await getDocs(collection(db, 'demo_donations'));
    console.log(`💰 Found ${donationsSnapshot.size} total donations for financial analysis`);
    
    let totalDonations = 0;
    let totalPlatformFees = 0;
    let totalProcessingFees = 0;
    let transactionCount = 0;
    let completedTransactions = 0;
    
    // Process each donation
    donationsSnapshot.docs.forEach(doc => {
      const donationData = doc.data();
      const amount = donationData.amount?.total || donationData.amount || 0;
      const status = donationData.status || 'completed';
      
      console.log(`💰 Processing donation: amount=${amount}, status=${status}`);
      
      if (amount > 0) {
        // Count all donations regardless of status for total amount
        totalDonations += amount;
        transactionCount++;
        
        if (status === 'completed') {
          completedTransactions++;
        }
        
        // Calculate SmartFund distribution
        const smartFund = calculateSmartFundDistribution(amount);
        totalPlatformFees += smartFund.platformFeeAmount;
        
        // Estimate processing fees (typically 2.9% + $0.30 for card processing)
        const processingFee = Math.max(amount * 0.029 + 0.30, 0.30);
        totalProcessingFees += processingFee;
      }
    });
    
    // Calculate metrics
    const avgDonation = transactionCount > 0 ? totalDonations / transactionCount : 0;
    const fraudRate = transactionCount > 0 ? ((transactionCount - completedTransactions) / transactionCount) * 100 : 0;
    const totalRevenue = totalPlatformFees; // Platform revenue = 5% fees
    
    // Mock monthly growth for now (in production, compare with last month's data)
    const monthlyGrowth = 18.2;
    
    const metrics: FinancialMetrics = {
      totalRevenue,
      monthlyGrowth,
      totalDonations,
      platformFees: totalPlatformFees,
      processingFees: totalProcessingFees,
      transactionCount,
      avgDonation,
      fraudRate
    };
    
    console.log('💰 [FINANCIAL] Calculated financial metrics:', metrics);
    return metrics;
    
  } catch (error) {
    console.error('❌ Error fetching financial metrics:', error);
    
    // Return default metrics on error
    return {
      totalRevenue: 0,
      monthlyGrowth: 0,
      totalDonations: 0,
      platformFees: 0,
      processingFees: 0,
      transactionCount: 0,
      avgDonation: 0,
      fraudRate: 0
    };
  }
};

/**
 * Get recent transactions from real donation data
 */
export const getRecentTransactions = async (limitCount: number = 10): Promise<Transaction[]> => {
  try {
    console.log('💰 [FINANCIAL] Fetching recent transactions from real donation data...');
    
    // Get recent donations ordered by timestamp
    const donationsSnapshot = await getDocs(collection(db, 'demo_donations'));
    console.log(`💰 Found ${donationsSnapshot.size} donations for transaction history`);
    
    const transactions: Transaction[] = [];
    
    // Process each donation into transaction format
    donationsSnapshot.docs.forEach(doc => {
      const donationData = doc.data();
      const amount = donationData.amount?.total || donationData.amount || 0;
      
      if (amount > 0) {
        const smartFund = calculateSmartFundDistribution(amount);
        const processingFee = Math.max(amount * 0.029 + 0.30, 0.30);
        
        // Format timestamp
        const timestamp = donationData.created_at 
          ? new Date(donationData.created_at.seconds * 1000).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          : 'Unknown';
        
        transactions.push({
          id: doc.id,
          type: 'donation',
          amount: amount,
          participant: donationData.participant_id === 'michael-rodriguez' ? 'Michael R.' : 
                       donationData.participant_id === 'demo-participant-001' ? 'Demo User' : 
                       'Anonymous',
          donor: donationData.donor_info?.name || 'Anonymous',
          shelter: donationData.shelter_id === 'YDJCJnuLGMC9mWOWDSOa' ? 'Old Brewery Mission' :
                   donationData.shelter_id === 'old-brewery-mission' ? 'Old Brewery Mission' :
                   donationData.shelter_id || 'Unknown Shelter',
          timestamp,
          status: donationData.status === 'completed' ? 'completed' : 
                  donationData.status === 'pending' ? 'pending' : 'completed',
          fees: processingFee,
          platformFee: smartFund.platformFeeAmount,
          netAmount: smartFund.participantAmount
        });
      }
    });
    
    // Sort by timestamp (newest first) and limit
    const sortedTransactions = transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limitCount);
    
    console.log(`💰 [FINANCIAL] Returning ${sortedTransactions.length} recent transactions`);
    return sortedTransactions;
    
  } catch (error) {
    console.error('❌ Error fetching recent transactions:', error);
    return [];
  }
};

/**
 * Get revenue breakdown by category
 */
export const getRevenueBreakdown = async (): Promise<RevenueBreakdown[]> => {
  try {
    const metrics = await getFinancialMetrics();
    const totalRevenue = metrics.platformFees + metrics.processingFees;
    
    if (totalRevenue === 0) {
      return [];
    }
    
    return [
      {
        category: 'Platform Fees (5%)',
        amount: metrics.platformFees,
        percentage: (metrics.platformFees / totalRevenue) * 100
      },
      {
        category: 'Processing Fees',
        amount: metrics.processingFees,
        percentage: (metrics.processingFees / totalRevenue) * 100
      }
    ];
    
  } catch (error) {
    console.error('❌ Error calculating revenue breakdown:', error);
    return [];
  }
};
