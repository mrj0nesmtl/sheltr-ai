/**
 * Layout for dynamic documentation pages
 * Provides static params for Next.js static export
 */

export function generateStaticParams() {
  return [
    { slug: 'placeholder' }, // Placeholder for static export
  ];
}

export default function DocSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

