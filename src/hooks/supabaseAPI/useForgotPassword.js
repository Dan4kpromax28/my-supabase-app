
import { useState} from "react";


import { supabase } from "../../utils/helpers/supabase/supabase";

export default function useForgotPassword(){
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);


    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: "http://localhost:5173/admin/profils",} );
        if (error) {
            setError("Notika kluda");
            console.log(error);
        }
        console.log(data);
    };

    return {handleInputChange,email, error, handleSubmit };
}