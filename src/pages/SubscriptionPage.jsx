import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter';
import InputComponent from '../components/InputComponent';

export default function SubscriptionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const subId = state?.id;
    const [subscription, setSubscription] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (!subId) {
            navigate('/');
            return;
        }

        const fetchSubscription = async () => {
            try {
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('id', subId)
                    .single(); 
        
                if (error) {
                    console.error('Notika kluda:', error);
                    navigate('/');
                } else {
                    setSubscription(data);
                }
            } catch (err) {
                console.error('Kluda:', err);
                navigate('/');
            }
        };
  
        fetchSubscription(); 
    }, [subId, navigate]);

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
            //TODO: Supabase logika 
            navigate('/');
        } catch (error) {
            console.error('Notika kluda:', error);
        }
    };

    if (!subscription) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100">
                <p className="text-gray-600">Notiek ielade...</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-stone-100'>
            <MainHeader />
            <div className='max-w-2xl mx-auto p-4'>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <h1 className='font-extrabold text-2xl text-center mb-6'>
                        {subscription.name}
                    </h1>
                    <hr className="mb-4"/>
                    <h2 className='m-4 text-m text-justify'>
                        {subscription.description}
                    </h2>
                    
                    <InputComponent 
                        label="Vards"
                        id="name"
                        placeholder="Ievadiet vardu"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="Uzvards"
                        id="surname"
                        placeholder="Ievadiet uzvardu"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="E-pasts"
                        type="email"
                        id="email"
                        placeholder="email@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    
                    <InputComponent 
                        label="Telefona numurs"
                        type="tel"
                        id="phone"
                        placeholder="+371 xxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <div>
                        <label htmlFor="additionalInfo" className="block text-gray-700 mb-2">Papildu informacija:</label>
                        <textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                            placeholder="Ievadiet papildu informaciju"
                        />
                    </div>

                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            Pieteikties
                        </button>
                    </div>
                </form>
            </div>
            <MainFooter />
        </div>
    );
}