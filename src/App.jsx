import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import SubscriptionPage from './pages/SubscriptionPage';
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/pakalpojums/:id" element={<SubscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

