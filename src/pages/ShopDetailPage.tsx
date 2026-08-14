import { useEffect, useState } from 'react';
import { ArrowLeft, Ban, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { adminApi } from '../services/api';
import { ShopDetail, ShopStatus } from '../types/shop';
import { navigate } from '../utils/routing';
import { StatusMessage } from '../components/StatusMessage';

interface ShopDetailPageProps {
  tenantId: string;
}

const STATUS_STYLES: Record<ShopStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  SUSPENDED: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
};

export function ShopDetailPage({ tenantId }: ShopDetailPageProps) {
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    adminApi
      .getShop(tenantId)
      .then(setShop)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load shop'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  async function updateStatus(status: ShopStatus) {
    setUpdating(true);
    setError('');
    try {
      const updated = await adminApi.updateShopStatus(tenantId, status);
      setShop(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 sm:px-7">
      <button
        type="button"
        onClick={() => navigate('/shops')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shops
      </button>

      {error && (
        <div className="mb-4">
          <StatusMessage type="error" message={error} />
        </div>
      )}

      {!shop ? null : (
        <div className="max-w-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{shop.shopName}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{shop.tenantCode}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[shop.status]}`}>
              {shop.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
            <Field label="Owner name" value={shop.ownerName} />
            <Field label="Owner email" value={shop.ownerEmail} />
            <Field label="Phone" value={shop.phone} />
            <Field label="Contact email" value={shop.contactEmail || '—'} />
            <Field label="Address" value={shop.address || '—'} />
            <Field label="City / District" value={[shop.city, shop.district].filter(Boolean).join(', ') || '—'} />
            <Field label="Owner account" value={shop.ownerActive ? 'Active' : 'Disabled'} />
            <Field label="Owner verified" value={shop.ownerVerified ? 'Yes' : 'No'} />
            <Field
              label="Last login"
              value={shop.lastLoginAt ? new Date(shop.lastLoginAt).toLocaleString() : 'Never'}
            />
            <Field label="Created" value={new Date(shop.createdAt).toLocaleString()} />
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {shop.status !== 'ACTIVE' && (
              <button
                type="button"
                disabled={updating}
                onClick={() => updateStatus('ACTIVE')}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
            )}
            {shop.status !== 'SUSPENDED' && (
              <button
                type="button"
                disabled={updating}
                onClick={() => updateStatus('SUSPENDED')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
              >
                <Ban className="h-4 w-4" />
                Suspend
              </button>
            )}
            {shop.status !== 'PENDING' && (
              <button
                type="button"
                disabled={updating}
                onClick={() => updateStatus('PENDING')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
