
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


    if (!subscription) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100">
                <p className="text-gray-600">Notiek ielade...</p>
            </div>
        );
    }


return(
    <div className='min-h-screen bg-stone-100'>
        <div className='max-w-2xl mx-auto p-4'>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className='font-extrabold text-2xl text-center mb-6'>
                    {subscription.name}
                </h1>
                <hr/>
                <h2 className='m-4 text-m text-justify'>
                    {subscription.description}
                </h2>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Vards:</label>
                    <input type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Vards" required />
                </div> {/* https://flowbite.com/docs/components/forms/ */}
                <div class="mb-5">
                    <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 ">Uzvards:</label>
                    <input type="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Uzvards" required />
                </div>
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">E-pasts:</label>
                    <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="email@email.com" required />
                </div>
                <InputComponent value="Telefona numurs" />


                
            </div>


        </div>

    </div>
  );
}
