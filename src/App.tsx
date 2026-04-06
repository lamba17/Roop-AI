import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import GlamResults from './pages/GlamResults';
import GuideResults from './pages/GuideResults';
import BridalResults from './pages/BridalResults';
import Progress from './pages/Progress';
import SignIn from './pages/SignIn';
import AuthCallback from './pages/AuthCallback';
import PaymentSuccess from './pages/PaymentSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/glam-results" element={<GlamResults />} />
        <Route path="/guide-results" element={<GuideResults />} />
        <Route path="/bridal-results" element={<BridalResults />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
