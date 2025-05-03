
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';




export default function useAllSubscription(){

    const [subscriptions, setSubscriptions] = useState([]);
    
    const fetchSubscriptions = async () => {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*'); 

        if (error) {
            console.error('Notika kluda:', error);
        } else {
            setSubscriptions(data);
        }
        
    };
    useEffect(() => {
        fetchSubscriptions(); 
    }, []);


    const handleDelete = async (id, name) => {
        const confirm = window.confirm('Vai velies nodzes ierastu '+name);

        if (!confirm) return;

       
        const {error} = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Notika kluda');
        }
        alert('Veiksmigi nodzests');
        fetchSubscriptions(); // lai atjaunot
       
    };

    return {subscriptions, handleDelete};
}