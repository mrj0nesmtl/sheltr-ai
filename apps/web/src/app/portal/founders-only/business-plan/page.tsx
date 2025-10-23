import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

export default function BusinessPlanPage() {
  return (
    <SecureDocumentViewer
      documentSlug="sheltr-business-plan"
      category="Business Plan"
      backLink="/portal/founders-only"
    />
  );
}

