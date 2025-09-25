/**
 * One-time profile synchronization API endpoint
 * This endpoint will sync Joel's Super Admin profile to the Platform Admin structure
 * so his data appears on the Team page
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProfileSyncService } from '@/services/profileSyncService';

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    let result = false;
    
    switch (action) {
      case 'sync-super-to-platform':
        console.log('🔄 Syncing Super Admin to Platform Admin...');
        result = await ProfileSyncService.syncSuperAdminToPlatformAdmin(userId);
        break;
        
      case 'sync-platform-to-super':
        console.log('🔄 Syncing Platform Admin to Super Admin...');
        result = await ProfileSyncService.syncPlatformAdminToSuperAdmin(userId);
        break;
        
      case 'initialize':
        console.log('🚀 Initializing profile sync...');
        result = await ProfileSyncService.initializeProfileSync(userId);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: sync-super-to-platform, sync-platform-to-super, or initialize' },
          { status: 400 }
        );
    }
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: `Profile sync completed successfully for action: ${action}`,
        userId
      });
    } else {
      return NextResponse.json(
        { error: 'Profile sync failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Profile sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Profile Sync API',
    endpoints: {
      'POST /api/sync-profile': 'Sync profile data between collections',
      actions: [
        'sync-super-to-platform - Sync Super Admin profile to Platform Admin structure',
        'sync-platform-to-super - Sync Platform Admin profile to Super Admin structure', 
        'initialize - Auto-detect and initialize sync'
      ],
      example: {
        userId: 'user-id-here',
        action: 'initialize'
      }
    }
  });
}
