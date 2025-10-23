import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

export default function MSBRegistrationPage() {
  return (
    <SecureDocumentViewer
      documentSlug="msb-registration-canada"
      category="Legal & Compliance"
      backLink="/portal/founders-only"
    />
  );
}

