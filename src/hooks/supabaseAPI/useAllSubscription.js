
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/helpers/supabase/supabase';




export default function useAllSubscription(){

    const [subscriptions, setSubscriptions] = useState([]);
    
    const fetchSubscriptions = async () => {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*'); 

        if (error) {
            console.error('Notika kļūda');
        } else {
            setSubscriptions(data);
        }
        
    };
    useEffect(() => {
        fetchSubscriptions(); 
    }, []);


    const handleDelete = async (id, name) => {
        const confirm = window.confirm('Vai vēlies nodzēst ierakstu '+name + '?');

        if (!confirm) return;

       
        const {error} = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Notika kļūda ar dzēšanu!');
            return;
        }
        alert('Veiksmīgi nodzēsts!');
        fetchSubscriptions(); 
       
    };

    return {subscriptions, handleDelete};
}