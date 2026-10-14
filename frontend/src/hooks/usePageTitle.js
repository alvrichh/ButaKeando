import { useEffect } from 'react';
import { appConfig } from '../lib/config';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${appConfig.appName} | ${title}` : appConfig.appName;
  }, [title]);
}
