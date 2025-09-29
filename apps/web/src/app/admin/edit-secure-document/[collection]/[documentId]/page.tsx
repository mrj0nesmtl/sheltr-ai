import EditSecureDocumentClient from './EditSecureDocumentClient';

// Static params for build-time generation
export async function generateStaticParams() {
  return [
    { collection: 'founder_documents', documentId: 'placeholder' },
    { collection: 'platform_admin_documents', documentId: 'placeholder' }
  ];
}

export default function EditSecureDocumentPage() {
  return <EditSecureDocumentClient />;
}