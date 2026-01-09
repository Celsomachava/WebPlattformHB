import React, { Suspense, memo } from 'react';

// Lazy load form sections
const KundendatenSection = React.lazy(() => import('./KundendatenSection'));
const AnlagendatenSection = React.lazy(() => import('./AnlagendatenSection'));
const ServiceangabenSection = React.lazy(() => import('./ServiceangabenSection'));
const ZusatzinformationenSection = React.lazy(() => import('./ZusatzinformationenSection'));
const RechtlichesSection = React.lazy(() => import('./RechtlichesSection'));

// Loading component
const SectionLoader = memo(() => (
  <div style={{
    padding: '20px',
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '14px'
  }}>
    ⏳ Lädt Sektion...
  </div>
));

// Memoized section wrapper
const LazySection = memo(({ children, fallback = <SectionLoader /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
));

export {
  KundendatenSection,
  AnlagendatenSection,
  ServiceangabenSection,
  ZusatzinformationenSection,
  RechtlichesSection,
  LazySection
};