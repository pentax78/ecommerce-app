import ReactGA from 'react-ga4';

export const initGA = (measurementId: string) => {
  if (process.env.NODE_ENV === 'production' && measurementId) {
    ReactGA.initialize(measurementId);
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};
