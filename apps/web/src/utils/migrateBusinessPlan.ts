import { SecureDocumentService } from '@/services/secureDocumentService';
import fs from 'fs';
import path from 'path';

/**
 * Migration script to move the business plan from public files to secure Firestore
 * This should be run once to migrate existing sensitive documents
 */
export async function migrateBusinessPlanToFirestore(userId: string): Promise<string> {
  try {
    // Read the business plan markdown file
    const businessPlanPath = path.join(process.cwd(), 'apps/web/public/docs/founders/sheltr-business-plan.md');
    const businessPlanContent = fs.readFileSync(businessPlanPath, 'utf-8');

    // Create the secure document in Firestore
    const documentId = await SecureDocumentService.createFounderDocument({
      title: 'SHELTR Business Plan',
      content: businessPlanContent,
      type: 'markdown',
      category: 'business-plan',
      tags: ['business-plan', 'vc-ready', 'confidential', 'founders-only'],
      metadata: {
        description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
        author: 'SHELTR Founding Team',
        confidentialityLevel: 'founder',
        version: '1.0',
        originalFile: 'sheltr-business-plan.md',
        migrationDate: new Date().toISOString()
      }
    }, userId);

    console.log('✅ Business plan migrated to Firestore with ID:', documentId);
    return documentId;
  } catch (error) {
    console.error('❌ Error migrating business plan:', error);
    throw error;
  }
}

/**
 * Client-side version for browser execution
 */
export async function migrateBusinessPlanClient(userId: string): Promise<string> {
  try {
    // Fetch the business plan content from the public URL
    const response = await fetch('/docs/founders/sheltr-business-plan.md');
    if (!response.ok) {
      throw new Error('Failed to fetch business plan content');
    }
    
    const businessPlanContent = await response.text();

    // Create the secure document in Firestore
    const documentId = await SecureDocumentService.createFounderDocument({
      title: 'SHELTR Business Plan',
      content: businessPlanContent,
      type: 'markdown',
      category: 'business-plan',
      tags: ['business-plan', 'vc-ready', 'confidential', 'founders-only'],
      metadata: {
        description: 'Professional VC-worthy business plan with market analysis, financial projections, and exit strategy',
        author: 'SHELTR Founding Team',
        confidentialityLevel: 'founder',
        version: '1.0',
        originalFile: 'sheltr-business-plan.md',
        migrationDate: new Date().toISOString()
      }
    }, userId);

    console.log('✅ Business plan migrated to Firestore with ID:', documentId);
    return documentId;
  } catch (error) {
    console.error('❌ Error migrating business plan:', error);
    throw error;
  }
}
