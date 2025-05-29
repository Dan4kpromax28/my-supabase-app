import  { useState, useEffect} from 'react';
import { supabase } from '../../utils/helpers/supabase/supabase.js';

import validation from '../../utils/helpers/validation/handleInput.js';

import PropTypes from 'prop-types';




export default function useUser({name ='', surname = '', email = '', phone = '', tips=''}){
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
        name: name,
        surname: surname,
        email: email,
        phone: phone,
    });

    useEffect(() => {
        setFormData({
            name,
            surname,
            email,
            phone
        });
    }, [name, surname, email, phone]);


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
   
        if (tips === 'update'){
            const { error } = await supabase
                .from('client')
                .update({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone_number: formData.phone
                }, { onConflict: 'email' })
                .eq('email', email);

            if (error) {
                setMessage('Notika kļuda');
                return;
            }

            setMessage("Klinets ir veiksmigi izveidots");
        }
        else {
            const { error } = await supabase
                .from('client')
                .insert({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    phone_number: formData.phone
                }, { onConflict: 'email' })
                .single();

            if (error) {
                setMessage('Notika kļuda');
                return;
            }

            setMessage("Klinets ir veiksmigi izveidots");
        }
    };
    return {message, errors, handleInputChange, handleSubmit, formData}

}
useUser.propTypes = {
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    tips: PropTypes.string.isRequired
};