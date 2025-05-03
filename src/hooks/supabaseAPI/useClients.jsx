

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';




export default function useClient(search){


    const [clients, setClients] = useState([]);

    const fetchClients = async (find) => {  
        let query = supabase
            .from("client")
            .select(`
                *,
                user_subscription (
                    *,
                    invoice (*)
                )
            `);
        if (find) {
            query = query.or(
                `name.ilike.%${find}%,surname.ilike.%${find}%,email.ilike.%${find}%,phone_number.ilike.%${find}%`
            );
        }

        const { data, error } = await query;
                    
        if (error) {
            console.error('Kļūda:', error);
            return;
        }

        
        const clientsSubscriptionCount = data.map(client => ({
            ...client,
            subscriptionCount: client.user_subscription ? client.user_subscription.length : 0
        }));

        setClients(clientsSubscriptionCount);
    };

    useEffect(() => {
        fetchClients(search);
    }, [search]);

    const handleDelete = async (clientId) => {
        if (window.confirm('Vai jus gribat nodzest clientu')) {
            const { error } = await supabase.from('client').delete().eq('id', clientId);
            if (error) {
                console.error(error);
                return;
            }
            fetchClients();
        }
    };


    return {clients, handleDelete};
}