// Generate static params for all investor data room documents
export function generateStaticParams() {
  return [
    { slug: 'investor-relations' },
    { slug: 'shelter-research' },
    { slug: 'development-roadmap' },
    { slug: 'business-plan' },
    { slug: 'leadership-team' },
    { slug: 'system-design' },
    { slug: 'blockchain-architecture' },
    { slug: 'technical-whitepaper' },
    { slug: 'adyen-integration' },
    { slug: 'covenant-house-outreach' },
    { slug: 'msb-registration' },
    { slug: 'proposed-payment-rails' },
    { slug: 'platform-admin-guide' },
    { slug: 'github-repository' },
  ];
}

export default function InvestorDocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

