import { useEffect, useState } from 'react';
import { Loader2, Store } from 'lucide-react';
import { adminApi } from '../services/api';
import { ShopStatus, ShopSummary } from '../types/shop';
import { navigateToShop } from '../utils/routing';
import { StatusMessage } from '../components/StatusMessage';

const FILTERS: { label: string; value: ShopStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

const STATUS_STYLES: Record<ShopStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  SUSPENDED: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
};

export function ShopsPage() {
  const [filter, setFilter] = useState<ShopStatus | undefined>(undefined);
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    adminApi
      .listShops(filter)
      .then((data) => {
        if (!cancelled) setShops(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load shops');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shop accounts</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review new shop signups and manage existing accounts.
          </p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 shadow-sm hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <StatusMessage type="error" message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 dark:border-slate-800">
          <Store className="h-8 w-8" />
          <p className="text-sm">No shops found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Shop</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last login</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr
                  key={shop.tenantId}
                  onClick={() => navigateToShop(shop.tenantId)}
                  className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 font-medium">{shop.shopName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <div>{shop.ownerName}</div>
                    <div className="text-xs text-slate-400">{shop.ownerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {[shop.city, shop.district].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[shop.status]}`}
                    >
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {shop.lastLoginAt ? new Date(shop.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
