import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

export const metricsProviders = [
  makeCounterProvider({
    name: 'news_requests_total',
    help: 'Total number of news requests made',
  }),
  makeHistogramProvider({
    name: 'news_request_duration_seconds',
    help: 'News request duration in seconds',
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  makeCounterProvider({
    name: 'sports_requests_total',
    help: 'Total number of news requests made',
  }),
  makeHistogramProvider({
    name: 'sports_request_duration_seconds',
    help: 'News request duration in seconds',
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
];
