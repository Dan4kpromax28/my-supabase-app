import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import SubscriptionPage from './pages/SubscriptionPage';
import './App.css'
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Wrapper from './wrappers/Wrapper';
import LoginWrapper from './wrappers/LoginWrapper';
import AdminProfile from './pages/admin/AdminProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
        <Route path="/admin/login" element={<LoginWrapper><AdminLogin /></LoginWrapper>} />
        <Route path="/admin/dashboard" element={<Wrapper><Dashboard /></Wrapper>}/>
        <Route path="/admin/profils" element={<Wrapper><AdminProfile /></Wrapper>} />

      </Routes>
    </BrowserRouter>
  );
}

