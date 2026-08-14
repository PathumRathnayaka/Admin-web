import { Truck } from 'lucide-react';

export function SuppliersPage() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center text-slate-400">
      <Truck className="h-10 w-10" />
      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Supplier moderation is coming soon</p>
      <p className="max-w-sm text-sm">
        Supplier accounts aren't part of the admin approval flow yet. This section will let you review and manage
        supplier accounts once that's built.
      </p>
    </div>
  );
}
