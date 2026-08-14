import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ShopsPage } from './pages/ShopsPage';
import { ShopDetailPage } from './pages/ShopDetailPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { DashboardLayout } from './components/DashboardLayout';
import { clearStoredAuth, getStoredAuth } from './services/api';
import { LoginData } from './types/auth';
import { getShopDetailId, navigate, readRoute, Route } from './utils/routing';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState<Route>(readRoute);
  const [auth, setAuth] = useState<LoginData | null>(getStoredAuth);

  useEffect(() => {
    function handleRouteChange() {
      setRoute(readRoute());
    }

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    function onUnauthorized() {
      clearStoredAuth();
      setAuth(null);
      navigate('/login');
    }
    window.addEventListener('qaladmin:unauthorized', onUnauthorized);
    return () => window.removeEventListener('qaladmin:unauthorized', onUnauthorized);
  }, []);

  useEffect(() => {
    if (!auth && route !== '/login') {
      navigate('/login');
    }

    if (auth && route === '/login') {
      navigate('/shops');
    }
  }, [auth, route]);

  if (auth && route !== '/login') {
    return (
      <DashboardLayout
        user={auth.user}
        route={route}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onLogout={() => {
          clearStoredAuth();
          setAuth(null);
          navigate('/login');
        }}
      >
        {renderProtectedPage(route)}
      </DashboardLayout>
    );
  }

  return <LoginPage theme={theme} onToggleTheme={toggleTheme} onLogin={setAuth} />;
}

function renderProtectedPage(route: Route) {
  switch (route) {
    case '/shops/detail': {
      const tenantId = getShopDetailId();
      return tenantId ? <ShopDetailPage tenantId={tenantId} /> : <ShopsPage />;
    }
    case '/suppliers':
      return <SuppliersPage />;
    case '/shops':
    default:
      return <ShopsPage />;
  }
}

export default App;
