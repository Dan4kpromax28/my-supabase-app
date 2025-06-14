


import { useState, useEffect } from 'react';
import { supabase } from '../../utils/helpers/supabase/supabase';






export default function useInvoice(userId = ''){
    const [subscriptions, setSubscriptions] = useState([]);


    const fetchSubscriptions = async (find) => {
        let query = supabase
            .from('invoice')
            .select(`
                *,
                user_subscription:user_subscription_id (
                    *,
                    subscriptions:subscription_id (
                        id,
                        name,
                        price
                    ),
                    client:client_id(*)
                )
            `)
            .order('created_at', { ascending: false });

        if (find) {
            query = query.or(`number_id.ilike.%${find}%`);
        }

        const { data, error } = await query;
        
        if (error) {
            console.error('Notika klūda!');
            setSubscriptions([]);
            return;
        }

        if (userId) {
            let newData = data.filter(invoice => Number(invoice.user_subscription?.client_id) === Number(userId));
            setSubscriptions(newData);
            return;
        }

        setSubscriptions(data);
    };

    useEffect(() => {
        fetchSubscriptions(); 
    }, []);
    const handleInvoice = async (datas, email, id ) => {
        const d = String(datas);
        const e = String(email);
        console.log(d,e)
        const { error } = await supabase.functions.invoke('sendMail', {
            body: { 'subId': d, 'email': e},
        });
    
        if (error) console.error(error);
        else {
            const {error: second} = await supabase
                .from('invoice')
                .update({
                    status: 'valid'
                })
                .eq('id', id);
            if (second){
                console.log('Notika kļūda ar statusa izmaiņu!');
            }
        }
        await fetchSubscriptions(); 

    };

    const handleReject = async (id, email) => {
        const d = String(id);
        const e = String(email);
        console.log(d,e)
        const { error: rejectEr } = await supabase.functions.invoke('sendMailWithCredentials', {
            body: { 'id': d, 'email': e},
        });
        if (rejectEr) console.error(rejectEr);
        const {error} = await supabase
            .from('invoice')
            .update({
                status: 'rejected'
            })
            .eq('id', id);
        
        if (error){
            alert('Notika kluda!');
        }
        
      await fetchSubscriptions(); 
    }

    const handleDelete = async (id) => {
        const confirm = window.confirm('Vai velies nodzes ierastu?');
        if (!confirm) return;
        const {error} = await supabase
            .from('user_subscription')
            .delete()
            .eq('id', id);
        if (error){
            alert('Notika kļūda!');
            return;
        }
        console.log('Veiksmigi nodzests' + id);
        await fetchSubscriptions();
    }

    const handleInvalid = async (id) => {
        const {error} = await supabase
            .from('invoice')
            .update({ status: 'invalid'})
            .eq('id', id);
        if (error){
            console.log('Notika kluda ar statusa izmaiņu!');
            return;
        }
        await fetchSubscriptions(); 
    }

    const handleAccept = async (id, email) => {
        const {error} = await supabase
            .from('invoice')
            .update({ status: 'accepted'})
            .eq('id', id);
        if (error){
            console.log('Notika kluda ar statusa izmaiņu!');
            return;
        }
        const {  error: accept } = await supabase.functions.invoke('sendMailWithCredentials', {
            body: { 'id': id, 'email': email},
        });
        if (accept) {
            alert('Notika kluda!');
            return;
        }
        
        await fetchSubscriptions(); 
    }


    return {subscriptions, handleInvoice, handleReject, handleDelete,handleInvalid,handleAccept};
}