import { useNavigate} from "react-router-dom";
import AdminHeader from "../../components/pageComponents/headers/AdminHeader.jsx";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/helpers/supabase/supabase.js";
import InputComponent from "../InputComponent.jsx";
import Back from "../buttons/Back.jsx";
import validation from '../../utils/helpers/validation/handleInput.js';

import PropTypes from 'prop-types';


export default function Tips({id}){
    const navigate = useNavigate();

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
               
           
            }else return;
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
   
        if (!formData.name || !formData.description || !formData.price || !formData.durationValue || !formData.durationType) {
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
            alert("Notika kluda");
            
        }
        if(existing){
         
            alert("Viss ir ok");
            return;
        }
        
    
        if (error) {
           
            return;
        }
    
        alert("Viss ir atjaunots");
       
    };

    return (
        <>
        <AdminHeader />
            <div className='max-w-2xl mx-auto p-4'>
                <Back />

                
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <InputComponent
                        label="Nosaukums"
                        id="name"
                        name="name"
                        placeholder="Nosaukums"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name 
                    ? <div className='text-red-500 text-sm text-center '>{errors.name}</div>
                    : null}
                    <div>
                        <label htmlFor="additionalInfo" className="block text-gray-700 mb-2">Informacija par ko :</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] "
                            placeholder="Ievadiet papildu informaciju"
                        />
                    </div>
                    {errors.description
                    ? <div className='text-red-500 text-sm text-center '>{errors.description}</div>
                    : null}
                    <InputComponent
                        label="Cena"
                        id="price"
                        name="price"
                        placeholder="Cena"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                    {errors.price 
                    ? <div className='text-red-500 text-sm text-center '>{errors.price}</div>
                    : null}
                    <InputComponent
                        label="durationValue"
                        id="durationValue"
                        name="durationValue"
                        placeholder="Cik ilgst"
                        value={formData.durationValue}
                        onChange={handleInputChange}
                    />
                    {errors.durationValue 
                    ? <div className='text-red-500 text-sm text-center '>{errors.durationValue}</div>
                    : null}
                    <InputComponent
                        label="durationType"
                        id="durationType"
                        name="durationType"
                        placeholder="Tips "
                        value={formData.durationType}
                        onChange={handleInputChange}
                    />
                    {errors.durationType 
                    ? <div className='text-red-500 text-sm text-center '>{errors.durationType}</div>
                    : null}
                    {formData.isTime && (
                        <InputComponent
                        label="additional hour price"
                        id="additionalHourPrice"
                        name="additionalHourPrice"
                        placeholder="Cena par nakamo stundu"
                        value={formData.additionalHourPrice}
                        onChange={handleInputChange}
                    />
                    
                    )}
                    {formData.additionalHourPrice && errors.additionalHourPrice
                    ? <div className='text-red-500 text-sm text-center '>{errors.additionalHourPrice}</div>
                    : null}
                    <InputComponent
                    
                        //type="time"
                        label="restStart"
                        id="restrictionStart"
                        name="restrictionStart"
                        placeholder="restrictionStart"
                        value={formData.restrictionStart}
                        onChange={handleInputChange}
                    />
                    {errors.restrictionStart
                    ? <div className='text-red-500 text-sm text-center '>{errors.restrictionStart}</div>
                    : null}
                    <InputComponent
                        //type="time"
                        label="restEnd"
                        id="restrictionEnd"
                        name="restrictionEnd"
                        placeholder="Kad sakas laika ierobezojums"
                        value={formData.restrictionEnd}
                        onChange={handleInputChange}
                    />
                    {errors.restrictionEnd
                    ? <div className='text-red-500 text-sm text-center '>{errors.restrictionEnd}</div>
                    : null}
                    <p>isTime</p>
                    <input
                        type="checkbox"
                        id="isTime"
                        name="isTime"
                        checked={formData.isTime}
                        onChange={(e) => setFormData({ ...formData, isTime: e.target.checked })}
                    />
                    <br/>
                    <p>isDate</p>
                     <input
                        type="checkbox"
                        id="isDate"
                        name="isDate"
                        checked={formData.isDate}
                        onChange={(e) => setFormData({ ...formData, isDate: e.target.checked })}
                    />

                    
                    
                    
                    <div className="flex justify-center items-center">
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                                {!id ? 'Izveidot' : 'Atjaunot' }
                            </button>
                        </div>
                </form>

            </div>
        </>
    );
}

Tips.propTypes = {
    id:  PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};