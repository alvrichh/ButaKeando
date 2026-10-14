import { Button } from '../common/Button';
import { PageContainer } from '../layout/PageContainer';
import { SectionContainer } from '../layout/SectionContainer';
import { Card } from './Card';

export function EmptyState({ title, body, action }) {
  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer>
          <Card className="shop-empty">
            <h1>{title}</h1>
            <p>{body}</p>
            {action ? <Button to={action.to}>{action.label}</Button> : null}
          </Card>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
