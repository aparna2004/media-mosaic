export interface HealthCheckResponse {
  service: string;
  status: 'ok' | 'error';
  timestamp: string;
  version?: string;
  uptime?: number;
}
