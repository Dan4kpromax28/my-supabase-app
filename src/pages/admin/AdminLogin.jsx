import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import MainFooter from '../../components/MainFooter';
import MainHeader from '../../components/MainHeader';
import InputComponent from '../../components/InputComponent';
export default function AdminLogin(){

    

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [session, setSession] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password,
        });
        if (error) {
            setError("Nepareizais logins vai parole");
        } else {    
            navigate('/admin/dashboard');
        }
    };
    const handleReset = () => {
        navigate("/admin/forgotpassword");
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <MainHeader />
 
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-2xl w-full p-4">
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">

                        <InputComponent 
                            label="E-pasts"
                            id="email"
                            placeholder="admin@admin.com"
                            value={loginData.email}
                            onChange={handleInputChange}
                        />

                        <InputComponent 
                            label="Parole"
                            type="password"
                            id="password"
                            placeholder="Ievadiet paroli"
                            value={loginData.password}
                            onChange={handleInputChange}
                        />
                        {error && (<p>{error}</p>)}
                    
                        <div className="flex flex-col justify-center items-center">
                            
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-1'>
                                Pieteikties
                            </button>
                             <button className='underline text-blue-400' onClick={handleReset}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
            <MainFooter />
        </div>
    );

}