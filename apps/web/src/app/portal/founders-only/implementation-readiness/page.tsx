import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

export default function ImplementationReadinessPage() {
  return (
    <SecureDocumentViewer
      documentSlug="implementation-readiness-summary"
      category="Payment Rails"
      backLink="/portal/founders-only"
    />
  );
}

