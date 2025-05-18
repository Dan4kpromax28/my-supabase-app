import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/public/MainPage/MainPage';
import SubscriptionPage from './pages/public/CreateSubscription/SubscriptionPage';
import './App.css';
import AdminLogin from './pages/admin/Login/AdminLogin';
import Dashboard from './pages/admin/MainPage/Dashboard';
import Wrapper from './wrappers/Wrapper';
import LoginWrapper from './wrappers/LoginWrapper';
import AdminProfile from './pages/admin/Profile/AdminProfile';
import CreateClient from './pages/admin/Client/CreateClient';
import Subscription from './pages/admin/ClientsSubscription/Subscription';
import AllSubscriptions from './pages/admin/ClientsSubscription/AllSubscriptions';
import EditClient from './pages/admin/Client/EditClient';
import SubscriptionTypes from './pages/admin/SubscriptionTypes/SubscriptionsTypes';
import ForgotPassword from './pages/admin/Login/ForgotPassword';
import CreateType from './pages/admin/SubscriptionTypes/CreateType';
import UpdateSubscriptionType from './pages/admin/SubscriptionTypes/UpdateSubscriptionType';
import UserSubscriptions from './pages/admin/ClientsSubscription/UserSubscriptions';
import AdminStatistic from './pages/admin/Statistic/AdminStatistic';
import NotFound from './pages/notFound/NotFound';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
        
        <Route path="/admin/forgotpassword" element={<LoginWrapper><ForgotPassword /></LoginWrapper>} />
        <Route path="/admin/login" element={<LoginWrapper><AdminLogin /></LoginWrapper>} />
        <Route path="/admin/dashboard" element={<Wrapper><Dashboard /></Wrapper>}/>
        <Route path="/admin/profils" element={<Wrapper><AdminProfile /></Wrapper>} />
        <Route path="/admin/clients/createClient" element={<Wrapper><CreateClient /></Wrapper>} />
        <Route path="/admin/clients/subscriptions/:id" element={<Wrapper><Subscription /></Wrapper>} />
        <Route path="/admin/all_subscriptions" element={<Wrapper><AllSubscriptions /></Wrapper>} />
        <Route path="/admin/clients/edit/:id" element={<Wrapper><EditClient /></Wrapper>} />
        <Route path="/admin/subscriptions" element={<Wrapper><SubscriptionTypes /></Wrapper>} />
        <Route path="/admin/subscriptions/:id" element={<Wrapper><UpdateSubscriptionType /></Wrapper>} />
        <Route path='/admin/subscription/create' element={<Wrapper><CreateType /></Wrapper>} />
        <Route path='/admin/clients/userSubscriptions/:id' element={<Wrapper><UserSubscriptions /></Wrapper>} />
        <Route path='/admin/statistic' element={<Wrapper><AdminStatistic/></Wrapper>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

