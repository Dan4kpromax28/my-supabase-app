import { useEffect, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { supabase } from "../../utils/supabase";



export default function AllSubscriptions(){

    const [subscriptions, setSubscriptions] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        
        const fetchSubscriptions = async () => {
        try {
            const { data, error } = await supabase
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
            `);

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
    }, [ navigate]);

    const handleBack = () => {
        navigate(-1);
    }
    const handleSubscriptions = (subId) => {
        navigate(`/admin/clients/subscriptions/${subId}`);
    };

    return (
        <>
        <AdminHeader />
        <div className="max-w-3xl mx-auto p-4">
        <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100' onClick={() => handleBack()}>
            
            <h2 className='font-bold text-center'>Atpakaļ</h2>
            
        </div>
        <ul className="list-none p-4">
            {subscriptions.map((sub) => (
            <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50"onClick={() => handleSubscriptions(sub.id)}>
                <div className="">
                <h3 className="font-bold text-lg">{sub.user_subscription?.subscriptions?.name} </h3>
                <p className="text-sm text-gray-600">{sub.user_subscription?.client?.name+" "+sub.user_subscription?.client?.surname}</p>
                <p className="text-sm text-gray-600">{sub.full_price} eiro</p>
                <p className="text-sm text-gray-600">{sub.time}</p>
               
                <p className="text-sm text-gray-600">{sub.user_subscription?.start_date} - {sub.user_subscription?.end_date}</p>
                {!(sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "") && (
                
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
               
                )}
                {sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "" && (
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                )}
                </div>
            </li>
            ))}
        </ul>
        </div>
        </>

    );
}