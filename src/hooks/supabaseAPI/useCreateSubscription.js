import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/helpers/supabase/supabase.js';

import 'react-calendar/dist/Calendar.css';
import validation from '../../utils/helpers/validation/handleInput.js';

import { DateTime } from 'luxon';
import useOneSubscription from '../../hooks/supabaseAPI/useOneSubscription';





export default function useCreateSubscription(){
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
        const isoDate = DateTime.fromJSDate(date, { zone: 'Europe/Riga' }).toISODate();
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
            alert(error);
            return;
        }
        alert('Pieteikums veiksmīgi nosūtīts!');
        navigate('/');
    };

    return {errors, showCalendar, setShowCalendar, handleInputChange, handleDateChange, handleSubmit, globalError, subscription, formData, subId, setFormData}
}