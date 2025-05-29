
import { useState } from "react"

import { supabase } from '../../utils/helpers/supabase/supabase';
import validation from "../../utils/helpers/validation/handleInput.js";








export default function useAdminProfile(){
    const [message, setMessage] = useState();
    const [error, setError] = useState();

    const [newPassword, setNewPassword] = useState({
        password: '',
    });


    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPassword(prev => ({
            ...prev,
            [name]: value
        }));
        const errorMessage = validation.PasswordValidation(name, value);
        setError(prev => ({
            ...prev,
            [name]: errorMessage
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const {  error } = await supabase.auth.updateUser(
            { password: newPassword.password }
        )

        if (error) {
            setMessage("Notika kluda");
        } else {    
            setMessage("Parole vieksmigi izmainita")
        }
        setNewPassword({password: ''});
           
    };
    return{handleSubmit, handleInputChange, message, error, newPassword}
}