import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter';
import InputComponent from '../components/InputComponent';
import validation from '../utils/helpers/handleInput.js';

import PropTypes from 'prop-types';


export default function Users({name ='', surname = '', email = '', phone = '', tips=''}){
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});


    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: name,
        surname: surname,
        email: email,
        phone: phone,
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        const errorMessage = validation.InputFieldValidation(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            const error = validation.InputFieldValidation(field, formData[field]);
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
            });
        setErrors(newErrors);
        if (!isValid) {
            setMessage('Lūdzu aizpildiet visus laukus pareizi');
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
            const {data: clientData,error: clientError} = await supabase
                .from('client')
                .select('id')
                .eq('email', formData.email)
                .single();
            if(clientError){
                console.log('Notika kluda');
                return;
            }

            const {data: subData, error: subError} = await supabase
            .from('user_subscription')
            .update({'client_id': clientData.id})
            .eq('client_id', existing.id)
            setMessage('Tika nomainits');
            
            if(subError){
                console.log('Notika kluda');
                return;
            }
            setMessage('Klients tika veiksmigi atjaunots');
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
        <div >
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
                    {formData.name && errors.name 
                    ? <div className='text-red-500 text-sm text-center '>{errors.name}</div>
                    : null}
                    
                    <InputComponent 
                        label="Klienta uzvards"
                        id="surname"
                        placeholder="Ievadiet klienta uzvardu"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                    {formData.surname && errors.surname
                    ? <div className='text-red-500 text-sm text-center '>{errors.surname}</div>
                    : null}
                    
                    <InputComponent 
                        label="Klienta e-pasts"
                        type="email"
                        id="email"
                        placeholder="email@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {formData.email && errors.email
                    ? <div className='text-red-500 text-sm text-center '>{errors.email}</div>
                    : null}
                    
                    <InputComponent 
                        label="Klienta telefona numurs"
                        type="tel"
                        id="phone"
                        placeholder="+371 xxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    {formData.phone && errors.phone 
                    ? <div className='text-red-500 text-sm text-center '>{errors.phone}</div>
                    : null}
                    {message && (<h3 className='text-center text-sm text-zinc-400'>{message}</h3>)}

                    
                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            {tips === '' ? 'Izveidot' : 'Atjaunot'}
                        </button>
                    </div>
                </form>
            </div>
            <MainFooter />
        </div>
    );

}


Users.PropType = {
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    tips: PropTypes.string.isRequired
};