import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Routine from './pages/Routine';
import Products from './pages/Products';
import Specialists from './pages/Specialists';
import SpecialistProfile from './pages/SpecialistProfile';
import Booking from './pages/Booking';
import Progress from './pages/Progress';
import SignIn from './pages/SignIn';
import AuthCallback from './pages/AuthCallback';
import PaymentSuccess from './pages/PaymentSuccess';

export default function App() {
  return (
    <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/products" element={<Products />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/specialists/:city/:index" element={<SpecialistProfile />} />
          <Route path="/booking/:city/:index" element={<Booking />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
    </ThemeProvider>
  );
}
