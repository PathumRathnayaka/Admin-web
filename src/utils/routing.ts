export type Route =
  | '/login'
  | '/shops'
  | '/shops/detail'
  | '/suppliers';

export function navigate(route: Route) {
  window.history.pushState({}, '', route);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function navigateToShop(tenantId: string) {
  window.history.pushState({}, '', `/shops/${tenantId}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getShopDetailId(): string | null {
  const path = window.location.pathname;
  const match = path.match(/^\/shops\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function readRoute(): Route {
  const path = window.location.pathname;

  if (/^\/shops\/[^/]+$/.test(path)) {
    return '/shops/detail';
  }

  if (path === '/shops' || path === '/suppliers') {
    return path as Route;
  }

  return '/login';
}
