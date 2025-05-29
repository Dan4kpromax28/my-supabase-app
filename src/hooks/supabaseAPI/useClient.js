
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/helpers/supabase/supabase";



export default function useClient(){
    const navigate = useNavigate();
    const [client, setClient] = useState();
    
    const [setError] = useState('');
    const { id: clientId } = useParams();

    const fetchClient = async () => {
            
        const { data, error } = await supabase
            .from('client')
            .select('*')
            .eq('id', clientId)
            .single();

        if (error) {
            console.log("Notika kluda");
        }

        if (!data) {
            setError('Klients nav atrasts');
            return;
        }

        setClient(data);
    };

    useEffect(() => {
        if (!clientId) {
            navigate('/admin/dashboard');
            return;
        }

        fetchClient();
    }, [clientId, navigate]);

    return {client}
}