import { IRoute } from '../interfaces';

export function LogRoutes(routes: IRoute[]): void {
  console.log(routes.map(route => route.pathMatcher.path));
}
