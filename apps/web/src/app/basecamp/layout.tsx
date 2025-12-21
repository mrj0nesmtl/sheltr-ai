import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basecamp | SHELTR',
  description: 'Community support hubs providing essential services, technical assistance, and coordination for POD deployment and participant support.',
  keywords: ['basecamp', 'community hub', 'support center', 'volunteer center', 'pod deployment', 'social services', 'technical support'],
  openGraph: {
    title: 'Basecamp - Community Support Hub | SHELTR',
    description: 'Centralized support hubs for POD communities with volunteer coordination, technical assistance, and essential services.',
    type: 'website',
  },
};

export default function BasecampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
