import { ReactNode } from 'react';
import { LogOut, ShieldCheck, Store, Truck } from 'lucide-react';
import { AuthUser } from '../types/auth';
import { Route } from '../utils/routing';
import { ThemeToggle } from './ThemeToggle';

interface DashboardLayoutProps {
  user: AuthUser;
  route: Route;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (route: Route) => void;
  children: ReactNode;
}

const navItems = [
  { label: 'Shops', route: '/shops' as const, icon: Store, disabled: false },
  // Supplier moderation isn't implemented yet — ready to wire up once
  // supplier admin endpoints exist.
  { label: 'Suppliers', route: '/suppliers' as const, icon: Truck, disabled: true },
];

export function DashboardLayout({
  user,
  route,
  theme,
  onToggleTheme,
  onLogout,
  onNavigate,
  children,
}: DashboardLayoutProps) {
  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 dark:hidden"
      />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white/80 px-5 py-6 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Qal Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Platform console</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.route === route;

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => !item.disabled && onNavigate(item.route)}
                  title={item.disabled ? 'Coming soon' : undefined}
                  className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors duration-150 ${
                    item.disabled
                      ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
                      : active
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {item.disabled && (
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-none sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
                <h1 className="truncate text-xl font-semibold">{user.fullName}</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.route === route;

                return (
                  <button
                    key={item.label}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => !item.disabled && onNavigate(item.route)}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium ${
                      item.disabled
                        ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600'
                        : active
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
