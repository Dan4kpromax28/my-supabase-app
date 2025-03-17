import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate} from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import MainHeader from '../../components/MainHeader'
import MainFooter from '../../components/MainFooter';
import InputComponent from '../../components/InputComponent';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export default function CreateUser(){


    const [message, setMessage] = useState('');


    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
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
   
        if (!formData.name || !formData.surname || !formData.email || !formData.phone) {
            alert('Lūdzu aizpildiet visus obligātos laukus');
            return;
        }
    
        const { data: existing, error: existingError } = await supabase
            .from('client')
            .select('id')
            .eq('email', formData.email)
            .single();

        const { data: client, error } = await supabase
            .from('client')
            .upsert({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone_number: formData.phone
            }, { onConflict: 'email' })
            .single();
        
        if (existingError) {
            setMessage('Notika problemas ar nomainisanu');
            return;
        }
        if(existing){
            setMessage('Tika nomainits');
            return;
        }
        
    
        if (error) {
            setMessage('Notika kļuda');
            return;
        }
    
        
        setMessage("Klinets ir veiksmigi izveidots");
    };

    

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <div className='min-h-screen bg-stone-100'>
            <MainHeader />
            <div className='max-w-2xl mx-auto p-4'>
                <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100 cursor-pointer' onClick={() => handleBack()}>
                    <h2 className='font-bold text-center'>Atpakaļ</h2>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    
                    <InputComponent 
                        label="Klienta vards"
                        id="name"
                        placeholder="Ievadiet klienta vardu"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="Klienta uzvards"
                        id="surname"
                        placeholder="Ievadiet klienta uzvardu"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="Klienta e-pasts"
                        type="email"
                        id="email"
                        placeholder="email@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="Klienta telefona numurs"
                        type="tel"
                        id="phone"
                        placeholder="+371 xxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    {message && (<h3 className='text-center text-sm text-zinc-400'>{message}</h3>)}

                    
                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            Izveidot
                        </button>
                    </div>
                </form>
            </div>
            <MainFooter />
        </div>
    );

}