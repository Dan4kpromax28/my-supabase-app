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
                    .from('user_subscriptions')
                    .select('*')
                    .eq('client_id',subId); 
        
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
    }, []);

    return (
        <>
        <AdminHeader />
        
        </>
    );




};