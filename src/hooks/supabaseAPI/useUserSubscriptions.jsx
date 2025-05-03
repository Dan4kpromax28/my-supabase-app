
import { useEffect, useState } from "react";
import { supabase } from '../../utils/supabase';



export default function useUserSubscriptions(userId){

    const [subscriptions, setSubscriptions] = useState([]);

    
        const fetchUserSubscriptions = async () => {
            
            const { data, error } = await supabase
                .from('user_subscription')
                .select(`
                    *,
                    subscriptions:subscription_id(*),
                    client:client_id(*),
                    invoice(*)
                `)
                .eq('client_id', userId);
            
            if(error){
                console.log('Notikak kluda');
                return;
            }
            
            const invoices = [];
            data.forEach(subscription => {
                if (subscription.invoice && subscription.invoice.length > 0) {
                    subscription.invoice.forEach(inv => {
                        invoices.push({
                            ...inv,
                            user_subscription: subscription
                        });
                    });
                }
            });
            
            setSubscriptions(invoices);
            
        };
    useEffect(() => {  
        if (userId) {
            fetchUserSubscriptions();
        }
    }, [userId]);


    const handleDelete = async (id) => {
        const confirm = window.confirm('Vai velaties nodzest ierastu?');
        if (!confirm) return;
        const {error} = await supabase
            .from('user_subscription')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Notika kluda');
            return;
        }

        fetchUserSubscriptions(); 
    }



    return {subscriptions, handleDelete};
}