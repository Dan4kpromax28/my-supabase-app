import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import InputComponent from "../../components/InputComponent";
import Back from "../../components/Back";

export default function CreateSubscriptionType() {
const navigate = useNavigate();
const { id: typeId } = useParams();

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
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select()
                .eq('id', typeId)
                .single();

            if (error) {
                console.log('Notika kluda');
                navigate(-1);
                return;
            }

            UpdateForm(data);
        } catch (err) {
            console.error('Notika kluda');
            navigate(-1);
        }
    };

        
    fetchSubType();
    
}, [typeId, navigate]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
    }));
};

const handleSubmit = () => {

}

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
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] "
                        placeholder="Ievadiet papildu informaciju"
                    />
                </div>
                <InputComponent
                    label="Cena"
                    id="cena"
                    name="cena"
                    placeholder="Cena"
                    value={formData.price}
                    onChange={handleInputChange}
                />
                {formData.additionalHourPrice && (<InputComponent
                    label="additional hour price"
                    id="addPrice"
                    name="addPrice"
                    placeholder="Cena par nakamo stundu"
                    value={formData.price}
                    onChange={handleInputChange}
                />)}

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
                    label="restStart"
                    id="restStart"
                    name="reststart"
                    placeholder="Kad beidzas laika ierobezojums"
                    value={formData.restrictionStart}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="restEnd"
                    id="restEnd"
                    name="restEnd"
                    placeholder="Kad sakas laika ierobezojums"
                    value={formData.restrictionEnd}
                    onChange={handleInputChange}
                />
                <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            Atjaunot
                        </button>
                    </div>
            </form>

        </div>
    </>
);
}