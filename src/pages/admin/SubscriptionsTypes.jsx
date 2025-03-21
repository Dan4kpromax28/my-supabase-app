import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";




export default function SubscriptionTypes(){


    const [subscriptions, setSubscriptions] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*'); 
        
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
    }, []);




    return(
        <>
         <AdminHeader />
         <ul>
         {subscriptions.map((sub) => (
                <li key={sub.id}>
                    <h1>{sub.name}</h1>
                </li>
            ))}
         </ul>
        </>
       
        

    );

}