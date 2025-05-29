import React from 'react';

import MainHeader from '../pageComponents/headers/MainHeader.jsx'
import MainFooter from '../pageComponents/footers/MainFooter.jsx';
import InputComponent from '../customInput/InputComponent.jsx';


import PropTypes from 'prop-types';
import Back from '../buttons/Back.jsx';
import useUser from '../../hooks/supabaseAPI/useUser.js';


export default function Users({name ='', surname = '', email = '', phone = '', tips=''}){
    const {message, errors, handleSubmit, handleInputChange, formData} = useUser({name, surname, email, phone, tips})


    return (
        <div className=''>
            <MainHeader />
            <div className='max-w-2xl mx-auto p-4 h-screen'>
                <Back />
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


Users.propTypes = {
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    tips: PropTypes.string.isRequired
};