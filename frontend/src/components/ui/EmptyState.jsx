import { Button } from '../common/Button';
import { PageContainer } from '../layout/PageContainer';
import { SectionContainer } from '../layout/SectionContainer';

export function EmptyState({ label, title, body, action }) {
  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer>
          <div className="empty-state">
            {label ? <span className="empty-state__label mono">{label}</span> : null}
            <h1>{title}</h1>
            <p>{body}</p>
            {action ? <Button to={action.to}>{action.label}</Button> : null}
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
