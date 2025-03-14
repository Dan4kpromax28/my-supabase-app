import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import SubscriptionPage from './pages/SubscriptionPage';
import './App.css'
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
        <Route path="/admin/admin/123/ad-me" element={<AdminLogin/>} />
      </Routes>
    </BrowserRouter>
  );
}

