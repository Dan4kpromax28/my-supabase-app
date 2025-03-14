import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import SubscriptionPage from './pages/SubscriptionPage';
import './App.css'
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Wrapper from './wrappers/Wrapper';
import LoginWrapper from './wrappers/LoginWrapper';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
        <Route path="/admin/login" element={<LoginWrapper><AdminLogin /></LoginWrapper>} />
        <Route path="/admin/dashboard" element={<Wrapper><Dashboard /></Wrapper>}/>

      </Routes>
    </BrowserRouter>
  );
}

