import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminHeader from "../../components/AdminHeader";
import Back from "../../components/Back";






export default function UserSubscriptions(){

    const navigate = useNavigate();
    const { id: userId} = useParams();

    const [subscriptions, setSubscriptions] = useState([]);
    
    

    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            try{
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
                
                console.log("Notika kluda");
                
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
            } catch(err){
                console.error('Notika kluda');
            }
        };
        
        if (userId) {
            fetchUserSubscriptions();
        }
    }, [userId, navigate]);


    const handleSubscriptions = (subId) => {
        navigate(`/admin/clients/subscriptions/${subId}`);
    }

    return (<>
            <AdminHeader />
            
            <div className="max-w-3xl mx-auto p-4">
            
                <Back />
           
            
            <ul className="list-none p-4">
                {subscriptions.map((sub) => (
                <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50" >
                    <div className="" onClick={() => handleSubscriptions(sub.id)}>
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
                    <div className="flex gap-2">
                        {sub.status === 'new' && (
                        <>
                            <button
                                onClick={() => handleReject(sub.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Atteikt
                            </button>
                        </>
                        )}
                         {sub.status === 'accepted' && (
                        <>
                            <button
                                onClick={() => handleInvoice(sub.user_subscription?.client?.email, sub.user_subscription?.client?.email)}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                                Apmaksa atnaca
                            </button>
                        </>
    
                        )}
                         {sub.status === 'accepted' && (
                        <>
                            <button
                                onClick={() => handleInvoice(sub.user_subscription?.client?.email, sub.user_subscription?.client?.email)}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                                Apmaksa atnaca
                            </button>
                        </>
    
                        )}
                        
                    </div>
                </li>
                ))}
            </ul>
            </div>
            </>
    
        );


}