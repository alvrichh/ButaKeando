import { EmptyState } from '../../../components/ui/EmptyState';
import { usePageTitle } from '../../../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Página no encontrada');

  return (
    <EmptyState
      action={{ to: '/', label: 'Volver al inicio' }}
      body="La página que buscas no existe o ha cambiado de dirección."
      title="Página no encontrada"
    />
  );
}
