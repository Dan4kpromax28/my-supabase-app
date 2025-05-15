import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/helpers/supabase/supabase.js';
import MainHeader from '../../../components/pageComponents/headers/MainHeader.jsx'
import MainFooter from '../../../components/pageComponents/footers/MainFooter.jsx';
import InputComponent from '../../../components/InputComponent.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import validation from '../../../utils/helpers/validation/handleInput.js';
import TimePicker from '../../../components/dateTime/TimePicker.jsx';
import { DateTime } from 'luxon';
import useOneSubscription from '../../../hooks/supabaseAPI/useOneSubscription.jsx';
import Back from '../../../components/buttons/Back.jsx';
export default function SubscriptionPage() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const subId = state?.id;
    const subscription = useOneSubscription(subId);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

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
    const handleDateChange = (date) => {
        const isoDate = DateTime.fromJSDate(date, { zone: 'local' }).toISODate();
        setFormData(prev => ({ ...prev, date: isoDate }));
       
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
   
        if (subscription?.isDate){
            if (!formData.date) {
                setGlobalError('Lūdzu izvēlieties datumu');
                return;
            }
        }

        if (subscription?.isTime) {
            if (!formData.startTime || !formData.endTime) {
                setGlobalError('Lūdzu izvēlieties laiku');
                return;
            }
        }
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
            globalError('Lūdzu aizpildiet visus laukus pareizi');
        return;
        }

        
    
        const { error } = await supabase.rpc('create_user_subscription', {
            cl_name: formData.name,
            cl_surname: formData.surname,
            cl_email: formData.email,
            cl_phone: formData.phone,
            cl_subscription: subId,
            cl_information: formData.additionalInfo,
            cl_start_date: formData.date ? formData.date : null,
            cl_start_time: formData.startTime ? `${formData.startTime}` : null,
            cl_end_time: formData.endTime ? `${formData.endTime}` : null,
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
                <Back />
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
                        {formData.name && errors.name 
                        ? <div className='text-red-500 text-sm text-center '>{errors.name}</div>
                        : null}
                        
                        <InputComponent 
                            label="Uzvards"
                            id="surname"
                            placeholder="Ievadiet uzvardu"
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                        {formData.surname && errors.surname 
                        ? <div className='text-red-500 text-sm text-center'>{errors.surname}</div>
                        : null}
                        
                        <InputComponent 
                            label="E-pasts"
                            type="email"
                            id="email"
                            placeholder="email@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {formData.email && errors.email
                        ? <div className='text-red-500 text-sm text-center'>{errors.email}</div>
                        : null}
                        
                        <InputComponent 
                            label="Telefona numurs"
                            type="phone"
                            id="phone"
                            placeholder="+371 xxxxxxxx"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        {formData.phone && errors.phone
                        ? <div className='text-red-500 text-sm text-center'>{errors.phone}</div>
                        : null}
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

                        {!(!subscription.is_date) && (
                            <div className="mt-4">
                                <button type="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 "
                                    onClick={() => setShowCalendar(prev => !prev)}>
                                    {formData.date ? `Datums: ` : "Izvēlieties datumu"}
                                </button>

                                {showCalendar && (
                                    
                                    <Calendar
                                        className="mt-2"
                                        value={formData.date ? DateTime.fromISO(formData.date, { zone: 'local' }).toJSDate() : null}
                                        onChange={handleDateChange}
                                        minDate={DateTime.now().plus({ days: 1 }).toJSDate()}
                                    />
                                    

                                )}
                            </div>
                        ) }

                        {(subscription.is_time) && (
                            <TimePicker 
                            date={formData.date ? new Date(formData.date).toISOString().split('T')[0] : null}
                            onStartTime={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                            onEndTime={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                            start={formData.startTime}
                            end={formData.endTime}
                          />
                        )}
                        {globalError && (<div>{globalError}</div>)}


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