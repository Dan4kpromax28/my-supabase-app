import { useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/helpers/supabase/supabase.js";

import validation from '../../utils/helpers/validation/handleInput.js';


import PropTypes from 'prop-types';







export default function useSubscriptionType({id}){
    const navigate = useNavigate({id});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        additionalHourPrice: null,
        durationValue: '',
        durationType: '',
        restrictionStart: '',
        restrictionEnd: '',
        isTime: false,
        isDate: false,
    });
    const [errors, setErrors] = useState({});

    const UpdateForm = (data) => {
        setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            additionalHourPrice: data.additional_hour_price,
            durationValue: data.duration_value,
            durationType: data.duration_type,
            restrictionStart: data.restriction_start,
            restrictionEnd: data.restriction_end,
            isTime: data.is_time,
            isDate: data.is_date,
        });
    };

    useEffect(() => {
        const fetchSubType = async () => {
            if(id){
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.log('Notika kluda');
                    navigate(-1);
                    return;
                }

                UpdateForm(data);
            }
        };
            
        fetchSubType();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        const errorMessage = validation.InputFieldValidationType(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
   
        if (!formData.name || !formData.description || !formData.price || !formData.durationValue) {
            alert('Lūdzu aizpildiet visus obligātos laukus');
            return;
        }

        const { data: existing, error: existingError } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('name', formData.name)
            .single();

        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                id: id || undefined,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                additional_hour_price: formData.additionalHourPrice,
                duration_value: formData.durationValue,
                duration_type: formData.durationType,
                restriction_start: formData.restrictionStart,
                restriction_end: formData.restrictionEnd,
                is_time: formData.isTime,
                is_date: formData.isDate,
            }, { onConflict: 'name' })
            .select()
            .single();
        
        if (existingError) {
            alert("Notika klūda!")
            navigate('/admin/subscriptions')
            return;
            
        }
        if(existing){
            console.log('Viss ir labi');
        }
        
        if (error) {
            alert("Notika klūda");
            navigate('/admin/subscriptions')
            return;
        }
    
        alert("Viss ir atjaunots");
        navigate('/admin/subscriptions')
    };
 return {navigate, formData, setFormData, errors, UpdateForm, handleInputChange, handleSubmit}
}
useSubscriptionType.propTypes = {
    id:  PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};