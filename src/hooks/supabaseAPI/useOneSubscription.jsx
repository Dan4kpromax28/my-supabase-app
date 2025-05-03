
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

import { useNavigate } from 'react-router-dom';

export default function useOneSubscription(subId){

    const [subscription, setSubscription] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!subId) {
            navigate('/');
            return;
        }
    
        const fetchSubscription = async () => {
           
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('id', subId)
                .single(); 
    
            if (error) {
                console.error('Notika kluda:', error);
                navigate('/');
            } else {
                setSubscription(data);
            }
            
        };
    
        fetchSubscription(); 
    }, [subId, navigate]);

    return subscription;
}


