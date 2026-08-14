import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AuthShell({ children, title, subtitle, theme, onToggleTheme }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_1.05fr]">
        <section className="hidden bg-indigo-700 px-10 py-12 text-white lg:flex lg:flex-col dark:bg-indigo-950">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Qal Admin</p>
              <p className="text-sm text-indigo-50/80">
                Platform control center for the Qal market chain.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.p
              className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Admin Console
            </motion.p>

            <motion.p
              className="max-w-xl text-lg leading-8 text-indigo-50/85"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Review and approve new shop accounts before they go live on the POS platform.
            </motion.p>
          </div>
        </section>

        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="font-semibold">Qal Admin</p>
            </div>
            <div className="ml-auto">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <motion.div
              className="w-full max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="mb-7">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {subtitle}
                </p>
              </div>
              {children}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
