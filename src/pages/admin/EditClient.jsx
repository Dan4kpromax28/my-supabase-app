import Users from "../../components/Users";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminHeader from "../../components/AdminHeader";

export default function EditClient(){
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id: clientId } = useParams();

    useEffect(() => {
        if (!clientId) {
            navigate('/admin/dashboard');
            return;
        }

        const fetchClient = async () => {
            try {
                setLoading(true);
                
                const { data, error } = await supabase
                    .from('client')
                    .select('*')
                    .eq('id', clientId)
                    .single();
        
                if (error) {
                    throw error;
                }

                if (!data) {
                    setError('Klients nav atrasts');
                    return;
                }

                setClient(data);
            } catch (err) {
                console.error('Kļūda:', err);
            } finally {
                setLoading(false);
            }
        };
  
        fetchClient();
    }, [clientId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-xl animate-bounce"></div>
            </div>
        );
    }

    

    return (

            <Users 
                name={client.name}
                surname={client.surname}
                email={client.email}
                phone={client.phone_number}
                tips="update"
            />
    );
}