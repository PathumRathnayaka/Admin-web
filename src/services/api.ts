import { ApiResponse, LoginData } from '../types/auth';
import { ShopDetail, ShopFeaturesUpdate, ShopStatus, ShopSummary } from '../types/shop';
import { env } from '../config/env';

const AUTH_STORAGE_KEY = 'qaladmin.auth';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export function getStoredAuth(): LoginData | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LoginData;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function storeAuth(data: LoginData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const auth = getStoredAuth();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false && auth?.accessToken) {
    headers.set('Authorization', `${auth.tokenType || 'Bearer'} ${auth.accessToken}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (response.status === 401) {
    clearStoredAuth();
    window.dispatchEvent(new Event('qaladmin:unauthorized'));
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export const authApi = {
  login(email: string, password: string) {
    return request<ApiResponse<LoginData>>('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    });
  },
};

export const adminApi = {
  listShops: (status?: ShopStatus) =>
    requestList<ShopSummary>(`/api/auth/admin/shops${status ? `?status=${status}` : ''}`),
  getShop: (tenantId: string) =>
    requestOne<ShopDetail>(`/api/auth/admin/shops/${tenantId}`),
  updateShopStatus: (tenantId: string, status: ShopStatus) =>
    requestOne<ShopDetail>(`/api/auth/admin/shops/${tenantId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateShopFeatures: (tenantId: string, features: ShopFeaturesUpdate) =>
    requestOne<ShopDetail>(`/api/auth/admin/shops/${tenantId}/features`, {
      method: 'PATCH',
      body: JSON.stringify(features),
    }),
};

async function requestList<T>(path: string, options: RequestOptions = {}) {
  const response = await request<ApiResponse<T[]> | T[]>(path, options);
  return Array.isArray(response) ? response : response.data || [];
}

async function requestOne<T>(path: string, options: RequestOptions = {}) {
  const response = await request<ApiResponse<T> | T>(path, options);
  return isApiResponse<T>(response) ? response.data : response;
}

function isApiResponse<T>(value: ApiResponse<T> | T): value is ApiResponse<T> {
  return Boolean(value && typeof value === 'object' && 'data' in value);
}
