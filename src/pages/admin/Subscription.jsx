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
        <button
            onClick={handleBack}
            className="mb-6 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center">
            ← Atgriezties
        </button>
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
        </>
    );
}