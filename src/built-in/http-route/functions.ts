import { HTTPMethod } from './types';

export function IsHTTPMethod(value: any): value is HTTPMethod {
  return ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'].includes(value);
}
