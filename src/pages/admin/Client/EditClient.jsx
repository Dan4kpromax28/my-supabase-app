import Users from "../../../components/specialPages/Users";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/helpers/supabase/supabase";

export default function EditClient(){
    const navigate = useNavigate();
    const [client, setClient] = useState();
    
    const [setError] = useState('');
    const { id: clientId } = useParams();

    useEffect(() => {
        if (!clientId) {
            navigate('/admin/dashboard');
            return;
        }

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
  
        fetchClient();
    }, [clientId, navigate]);

    

    

    return (

            <Users 
                name={client?.name}
                surname={client?.surname}
                email={client?.email}
                phone={client?.phone_number}
                tips="update"
            />
    );
}