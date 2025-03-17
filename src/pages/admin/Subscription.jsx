import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabase";


export default function Subscribtion(){
    const [message, setMessage] = useState();

    const [subscriptions, setSubscriptions] = useState([]);

    const navigate = useNavigate();

    const { state } = useLocation();

    const subId = state.id;

    const handleBack = () => {
        navigate(`/admin/dashboard`);
    }

    useEffect(() => {
        if (!subId) {
            navigate('/');
            return;
        }
        const fetchData = async (subId) => {
            
            const { data: user_subscription, error } = await supabase
                .from('user_subscription')
                .select('*')
                .eq('client_id', subId)
            if (error) {
                console.error('Notika kluda:', error);
                navigate('/admin/dashboard');
            } else {
                setSubscriptions(data);
            }
            

        } 
    })
}