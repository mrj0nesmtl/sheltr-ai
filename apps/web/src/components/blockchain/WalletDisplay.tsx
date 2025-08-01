"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Copy, 
  Refresh,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useMockWallet } from './MockWalletProvider';

interface WalletDisplayProps {
  variant?: 'default' | 'compact' | 'detailed';
  showAddress?: boolean;
  showActions?: boolean;
  className?: string;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({
  variant = 'default',
  showAddress = true,
  showActions = true,
  className = ''
}) => {
  const { 
    wallet, 
    balance, 
    loading, 
    error, 
    networkStatus,
    refreshWallet,
    formatTokenAmount,
    formatAddress,
    clearError
  } = useMockWallet();

  const [showFullAddress, setShowFullAddress] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      try {
        await navigator.clipboard.writeText(wallet.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleRefresh = () => {
    refreshWallet();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Wallet className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading wallet...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600 mb-3">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Wallet Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={clearError}>
            Dismiss
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!wallet || !balance) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Wallet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-muted-foreground">No wallet found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Wallet</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">
                {formatTokenAmount(balance.sheltrS)} SHELTR-S
              </div>
              <div className="text-xs text-blue-600">
                {formatTokenAmount(balance.sheltr)} SHELTR
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant with full information
  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Digital Wallet</span>
              {networkStatus?.connected && (
                <Badge variant="outline" className="ml-2">
                  <Shield className="h-3 w-3 mr-1" />
                  {networkStatus.networkName}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Your SHELTR blockchain wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Token Balances */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatTokenAmount(balance.sheltrS)}
                  </div>
                  <div className="text-xs text-muted-foreground">SHELTR-S (Stable)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatTokenAmount(balance.sheltr)}
                  </div>
                  <div className="text-xs text-muted-foreground">SHELTR (Utility)</div>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            {showAddress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Wallet Address:</span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1"
                      onClick={() => setShowFullAddress(!showFullAddress)}
                    >
                      {showFullAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1"
                      onClick={handleCopyAddress}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                  {showFullAddress ? wallet.address : formatAddress(wallet.address)}
                </div>
                {copied && (
                  <div className="text-xs text-green-600">Address copied to clipboard!</div>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={handleRefresh}>
                  <Refresh className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  History
                </Button>
              </div>
            )}

            {/* Network Status */}
            {networkStatus && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Network: {networkStatus.networkName}</span>
                  <span>Block: {networkStatus.blockHeight.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5" />
          <span>Digital Wallet</span>
        </CardTitle>
        <CardDescription>Your SHELTR token balances</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Balances */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">SHELTR-S</span>
            <span className="text-lg font-bold text-green-600">
              {formatTokenAmount(balance.sheltrS)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SHELTR</span>
            <span className="text-lg font-bold text-blue-600">
              {formatTokenAmount(balance.sheltr)}
            </span>
          </div>
        </div>

        {/* Wallet Address */}
        {showAddress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Address:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1"
                onClick={handleCopyAddress}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
              {formatAddress(wallet.address)}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleRefresh}>
              <Refresh className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletDisplay; 