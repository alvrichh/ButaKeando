import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'ButaKeando | Page not found';
  }, []);

  return (
    <SectionContainer>
      <PageContainer>
        <Card className="empty-state">
          <h1>Page not found</h1>
          <p>Route does not exist in current storefront scaffold.</p>
          <Button to="/">Return home</Button>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
