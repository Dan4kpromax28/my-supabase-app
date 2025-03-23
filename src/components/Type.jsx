
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import InputComponent from "../components/InputComponent";
import Back from "../components/Back";


export default function Tips({id}){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        additionalHourPrice: '',
        durationValue: '',
        durationType: '',
        restrictionStart: '',
        restrictionEnd: ''
    });

    const UpdateForm = (data) => {
        setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        additionalHourPrice: data.additional_hour_price,
        durationValue: data.duration_value,
        durationType: data.duration_type,
        restrictionStart: data.restriction_start,
        restrictionEnd: data.restriction_end
        });
    };

    useEffect(() => {
        const fetchSubType = async () => {
            if(id){
               
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select()
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

        const { data, error } = await supabase
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
                restriction_end: formData.restrictionEnd
            }, { onConflict: 'name' })
            .select()
            .single();
        
        if (existingError) {
            //setMessage('Notika problemas ar nomainisanu');
            return;
        }
        if(existing){
            //setMessage('Tika nomainits');
            alert("Viss ir ok");
            return;
        }
        
    
        if (error) {
            //setMessage('Notika kļuda');
            return;
        }
    
        alert("Viss ir atjaunots");
        //setMessage("Pakalpojums ir veiksmigi izveidots");
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
                    <InputComponent
                        label="Cena"
                        id="price"
                        name="price"
                        placeholder="Cena"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label="additional hour price"
                        id="additionalHourPrice"
                        name="additionalHourPrice"
                        placeholder="Cena par nakamo stundu"
                        value={formData.additionalHourPrice}
                        onChange={handleInputChange}
                    />

                    <InputComponent
                        label="durationValue"
                        id="durationValue"
                        name="durationValue"
                        placeholder="Cik ilgst"
                        value={formData.durationValue}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label="durationType"
                        id="durationType"
                        name="durationType"
                        placeholder="Tips "
                        value={formData.durationType}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        //type="time"
                        label="restStart"
                        id="restrictionStart"
                        name="restrictionStart"
                        placeholder="restrictionStart"
                        value={formData.restrictionStart}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        //type="time"
                        label="restEnd"
                        id="restrictionEnd"
                        name="restrictionEnd"
                        placeholder="Kad sakas laika ierobezojums"
                        value={formData.restrictionEnd}
                        onChange={handleInputChange}
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