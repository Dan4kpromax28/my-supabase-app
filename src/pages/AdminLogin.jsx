import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import InputComponent from '../components/InputComponent';
export default function AdminLogin(){

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            console.log('Viss ok:', formData);
            
            navigate('/');
        } catch (error) {
            console.error('Kluda:', error);
        }
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
                            id="password"
                            placeholder="Ievadiet paroli"
                            value={loginData.password}
                            onChange={handleInputChange}
                        />

                        <div className="flex justify-center items-center">
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-1'>
                                Pieteikties
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <MainFooter />
        </div>
    );

}