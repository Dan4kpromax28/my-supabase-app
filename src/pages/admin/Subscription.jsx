import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminHeader from "../../components/AdminHeader";

export default function Subscription() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [clientInfo, setClientInfo] = useState(null);

    const navigate = useNavigate();
    const { id: clientId } = useParams();

    useEffect(() => {
        if (!clientId) {
        navigate('/admin/dashboard');
        return;
        }
        const fetchSubscriptions = async () => {
        try {
            const { data, error } = await supabase
            .from('user_subscription')
            .select(`
                *,
                subscription:subscription_id (
                    id,
                    name,
                    description
                )
            `)
            .eq('client_id', clientId);

            if (error) {
            console.error('Notika kluda:', error);
            } else {
            setSubscriptions(data);
            }
        } catch (err) {
            console.error('Kluda:', err);
        }
        };


        fetchSubscriptions(); 
    }, [clientId, navigate]);

    const handleBack = () => {
        navigate("/admin/dashboard");
  };

  

  return (
    <>
        <AdminHeader />
        <div className="max-w-3xl mx-auto p-4">
        <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100'>
            <div className='cursor-pointer' onClick={() => handleBack()}>
                <h2 className='font-bold text-center'>Atpakaļ</h2>
            </div>
        </div>
        <ul className="list-none p-4">
            {subscriptions.map((sub) => (
            <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                <h3 className="font-bold text-lg">{sub.id}</h3>
                <p className="text-sm text-gray-600">{sub.subscription?.name}</p>
                <p className="text-sm text-gray-600">{sub.time}</p>
                </div>
            </li>
            ))}
        </ul>
        </div>
        </>
    );
}