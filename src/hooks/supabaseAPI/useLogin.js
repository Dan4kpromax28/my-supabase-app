



import  { useState} from 'react';
import {  useNavigate} from 'react-router-dom';
import { supabase } from '../../utils/helpers/supabase/supabase';

export default function useLogin(){
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password,
        });
        if (error) {
            setError("Nepareizais logins vai parole");
        } else {    
            navigate('/admin/dashboard');
        }
    };const handleReset = () => {
        navigate("/admin/forgotpassword");
    };

    return {error, handleInputChange, handleReset, handleSubmitLogin, loginData};
}