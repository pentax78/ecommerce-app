import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initGA, trackPageView } from '../lib/analytics';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Init GA4
    initGA(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!);
    
    // Processing 
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default MyApp;
