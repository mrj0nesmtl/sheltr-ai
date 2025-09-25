import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token and check if user is super admin
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is super admin (either from custom claims or Firestore)
    const isSuperAdmin = decodedToken.role === 'super_admin' || 
      (await adminDb.collection('users').doc(decodedToken.uid).get()).data()?.role === 'super_admin';

    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Super Admin role required.' },
        { status: 403 }
      );
    }

    console.log('🔧 Starting Platform Admin custom claims fix...');

    // Get all users with role 'platform_admin' from Firestore
    const platformAdminQuery = adminDb.collection('users').where('role', '==', 'platform_admin');
    const platformAdminSnapshot = await platformAdminQuery.get();

    const fixedUsers = [];
    const errors = [];

    for (const doc of platformAdminSnapshot.docs) {
      try {
        const userData = doc.data();
        const userId = doc.id;
        const email = userData.email || 'unknown';

        console.log(`🔧 Processing Platform Admin: ${email} (${userId})`);

        // Define standard Platform Admin custom claims
        const customClaims = {
          role: 'platform_admin',
          tenant_id: 'platform',
          permissions: [
            'platform:read',
            'users:manage',
            'shelters:manage',
            'donations:view',
            'analytics:view',
            'participants:manage'
          ],
          shelter_id: null
        };

        // Set the claims using Firebase Admin SDK
        await adminAuth.setCustomUserClaims(userId, customClaims);
        console.log(`✅ Custom claims set for Platform Admin: ${email}`);

        fixedUsers.push({
          email,
          uid: userId,
          claims_set: true
        });

      } catch (userError) {
        const errorMsg = `Failed to set claims for ${userData.email || 'unknown'}: ${userError.message}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    const response = {
      success: true,
      message: `Platform Admin custom claims fix completed. Fixed ${fixedUsers.length} users.`,
      data: {
        fixed_users: fixedUsers,
        errors,
        total_fixed: fixedUsers.length,
        total_errors: errors.length
      }
    };

    console.log('✅ Bulk fix completed:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Platform Admin claims fix failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fix Platform Admin claims: ${error.message}`,
        error: error.message
      },
      { status: 500 }
    );
  }
}
