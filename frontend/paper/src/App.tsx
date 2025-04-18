import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import TopNews from './pages/TopNews';
import Sports from './pages/Sports';
import Finance from './pages/Finance';
import Entertainment from './pages/Entertainment';
import Technology from './pages/Technology';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Preferences from "@/pages/Preferences";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<TopNews />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/entertainment" element={<Entertainment />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/preferences" element={<Preferences />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
