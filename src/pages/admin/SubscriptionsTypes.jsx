import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import Back from "../../components/Back";




export default function SubscriptionTypes(){


    const [subscriptions, setSubscriptions] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {
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
  
        fetchSubscriptions(); 
    }, []);


    const handleCreateSubscription = () => {
        navigate('/admin/subscription/create');

    };

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
        setSubscriptions(prev => prev.filter(sub => sub.id !== id)); // lai atjaunot
       
    };


    const handleClick = (id) => {
        navigate(`/admin/subscriptions/${id}`);
    };

    



    return(
        <>
         <AdminHeader />
         <div className="max-w-3xl mx-auto p-4">
         <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100'>
                <div className='cursor-pointer' onClick={() => handleCreateSubscription()}>
                    <h2 className='font-bold text-center'>Izveidot jaunu piedavajumu</h2>
                </div>
            </div>
         <ul>
         {subscriptions.map((sub) => (
                <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50" >
                    <div>
                        <h3 className="font-bold text-lg">{sub.name} </h3>
                    </div>
                     
                     <div className="flex gap-2">
                        <button
                            onClick={() => handleClick(sub.id)}
                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                            Atjaunot 
                        </button>
                        <button
                            onClick={() => handleDelete(sub.id, sub.name)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                            Dzest
                        </button>
                     </div>
                </li>
                
            ))}
         </ul>
         </div>
        </>
       
        

    );

}