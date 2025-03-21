import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import SubscriptionPage from './pages/SubscriptionPage';
import './App.css'
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Wrapper from './wrappers/Wrapper';
import LoginWrapper from './wrappers/LoginWrapper';
import AdminProfile from './pages/admin/AdminProfile'
import CreateClient from './pages/admin/CreateClient';
import Subscription from './pages/admin/Subscription';
import AllSub from './components/SubComp';
import AllSubscriptions from './pages/admin/AllSubscriptions';
import EditClient from './pages/admin/EditClient';
import SubscriptionTypes from './pages/admin/SubscriptionsTypes';
import CreateSubscriptionType from './pages/admin/CreateSubscriptionType';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
        <Route path="/admin/login" element={<LoginWrapper><AdminLogin /></LoginWrapper>} />
        <Route path="/admin/dashboard" element={<Wrapper><Dashboard /></Wrapper>}/>
        <Route path="/admin/profils" element={<Wrapper><AdminProfile /></Wrapper>} />
        <Route path="/admin/clients/createClient" element={<Wrapper><CreateClient /></Wrapper>} />
        <Route path="/admin/clients/subscriptions/:id" element={<Wrapper><Subscription /></Wrapper>} />
        <Route path="/admin/all_subscriptions" element={<Wrapper><AllSubscriptions /></Wrapper>} />
        <Route path="/admin/clients/edit/:id" element={<Wrapper><EditClient /></Wrapper>} />
        <Route path="/admin/subscriptions" element={<Wrapper><SubscriptionTypes /></Wrapper>} />
        <Route path="/admin/subscriptions/:id" element={<Wrapper><CreateSubscriptionType /></Wrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

