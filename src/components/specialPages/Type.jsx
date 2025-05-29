
import AdminHeader from "../pageComponents/headers/AdminHeader.jsx";

import InputComponent from "../customInput/InputComponent.jsx";
import Back from "../buttons/Back.jsx";

import SimpleTimePicker from "../dateTime/SimpleTimePicker.jsx";

import PropTypes from 'prop-types';
import useSubscriptionType from "../../hooks/supabaseAPI/useSubscriptionType.js";

export default function Tips({id}){
    const {handleInputChange, handleSubmit, errors, formData, setFormData} = useSubscriptionType({id});
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
                    {errors.additionalHourPrice
                    ? <div className='text-red-500 text-sm text-center '>{errors.additionalHourPrice}</div>
                    : null}
                    <SimpleTimePicker
                        startTime={formData.restrictionStart}
                        endTime={formData.restrictionEnd}
                        onStartTime={(time) => setFormData(prev => ({
                            ...prev,
                            restrictionStart: time
                        }))}
                        onEndTime={(time) => setFormData(prev => ({
                            ...prev,
                            restrictionEnd: time
                        }))}
                    />
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