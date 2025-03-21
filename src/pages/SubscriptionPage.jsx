import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter';
import InputComponent from '../components/InputComponent';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function SubscriptionPage() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const subId = state?.id;
    const [subscription, setSubscription] = useState(null);
    const [availability, setAvailability] = useState({ dates: [], times: [] });

    const [showCalendar, setShowCalendar] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        additionalInfo: '',
        date: '',
        startTime: '',
        endTime: ''
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
    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date }));
        if (subscription.time_restriction) {
            fetchTimeAvailability(date);
        }
    };
    const fetchTimeAvailability = async (date) => {
        const { data } = await supabase.rpc('get_available_times', { selected_date: date });
        setAvailability(prev => ({ ...prev, times: data }));
    };

    const handleBack = () => {
        navigate(-1);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
   
        if (!formData.name || !formData.surname || !formData.email || !formData.phone) {
            alert('Lūdzu aizpildiet visus obligātos laukus');
            return;
        }
    
        const { error } = await supabase.rpc('create_user_subscription', {
            cl_name: formData.name,
            cl_surname: formData.surname,
            cl_email: formData.email,
            cl_phone: formData.phone,
            cl_subscription: subId,
            cl_information: formData.additionalInfo,
            cl_start_date: formData.date ? formData.date.toISOString().split('T')[0] : null,
            cl_start_time: formData.startTime ? `${formData.startTime}:00+02:00` : null,
            cl_end_time: formData.endTime ? `${formData.endTime}:00+02:00` : null,
        });
    
        if (error) {
            alert(error.message);
            return;
        }
    
        alert('Pieteikums veiksmīgi nosūtīts!');
        navigate('/');
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
                <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100' onClick={() => handleBack()}>
                
                    <h2 className='font-bold text-center'>Atpakaļ</h2>
                
                </div>
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

                        {!(subscription.name === '8 Reižu') && (
                            <div className="mt-4">
                                <button type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 "
                                    onClick={() => setShowCalendar(prev => !prev)}>
                                    {formData.date ? `Datums: ${formData.date}` : "Izvēlieties datumu"}
                                </button>

                                {showCalendar && (
                                    
                                    <Calendar
                                        className="mt-2"
                                        value={formData.date ? new Date(formData.date) : null}
                                        onChange={handleDateChange}
                                        minDate={new Date()}
                                        tileDisabled={({ date }) => availability.dates.includes(date.toISOString().slice(0, 10))}
                                    />
                                )}
                            </div>
                        ) }

                        {(subscription.name === 'Konferenču zāle' || subscription.name === 'Atpūtas zona') && (
                            <div className="mt-4">
                                <label className="block mb-2">Izvēlieties laiku:</label>
                                <select
                                    className="border p-2 w-full"
                                    value={formData.time}
                                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                >
                                    <option value="">Izvēlieties pieejamo laiku</option>
                                    {availability.times.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        )}


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