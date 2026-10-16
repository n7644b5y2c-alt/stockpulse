import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Stocks } from './pages/Stocks';
import { Portfolio } from './pages/Portfolio';
import { ExpertPicks } from './pages/ExpertPicks';
import { ExpectedProfits } from './pages/ExpectedProfits';
import { Future } from './pages/Future';
import { Appearance } from './pages/Appearance';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { NotFound } from './pages/NotFound';
import { DevData } from './pages/DevData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-fast">
            {/* Connection Status Banner */}
            <OfflineBanner />

            {/* Navigation Shell */}
            <Navbar />

            {/* Routed Page Content */}
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stocks" element={<Stocks />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/expert-picks" element={<ExpertPicks />} />
                <Route path="/expected-profits" element={<ExpectedProfits />} />
                <Route path="/future" element={<Future />} />
                <Route path="/appearance" element={<Appearance />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dev-data" element={<DevData />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
