import React from 'react';

import MainHeader from '../../../components/pageComponents/headers/MainHeader.jsx'
import MainFooter from '../../../components/pageComponents/footers/MainFooter.jsx';
import InputComponent from '../../../components/customInput/InputComponent.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import TimePicker from '../../../components/dateTime/TimePicker.jsx';
import { DateTime } from 'luxon';

import Back from '../../../components/buttons/Back.jsx';
import useCreateSubscription from '../../../hooks/supabaseAPI/useCreateSubscription.js';
export default function SubscriptionPage() {

    const {errors, showCalendar, setShowCalendar, handleInputChange, handleDateChange, handleSubmit, globalError, subscription, formData, subId, setFormData} = useCreateSubscription();

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
                                        value={formData.date ? DateTime.fromISO(formData.date, { zone: 'Europe/Riga' }).toJSDate() : null}
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
                            subscriptonId={subId}
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