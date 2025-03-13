
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function SubscriptionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const subId = state?.id;
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if (!subId) {
            navigate('/');
            return;
        }

        const fetchSubscription = async () => {
            try {
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('id', subId)
                    .single(); 
        
                if (error) {
                    console.error('Notika kluda:', error);
                } else {
                    setSubscription(data);
                }
            } catch (err) {
                console.error('Kluda:', err);
            }
        };
  
        fetchSubscription(); 
    }, [subId]);


return(
    <></>
  );
}
