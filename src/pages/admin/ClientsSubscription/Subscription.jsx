import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/helpers/supabase/supabase.js";
import AdminHeader from "../../../components/pageComponents/headers/AdminHeader.jsx";
import Back from "../../../components/buttons/Back.jsx";
import InputComponent from "../../../components/customInput/InputComponent.jsx";
import { formatDate } from "../../../utils/helpers/date/helpers.js";
import validation from "../../../utils/helpers/validation/handleInput.js";

export default function Subscription() {

    const [invoice, setInvoice] = useState();
    const [chooseOption, setChooseOption] = useState();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        invoice_number: "",
        price: "",
        additionalInfo: "",
        myStatus: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (invoice) {
            setFormData({
                invoice_number: invoice.number_id || "",
                price: invoice.full_price || "",
                additionalInfo: invoice.user_subscription?.information || "",
                myStatus: chooseOption
            });
        }
    }, [invoice]);

    

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        
        const errorMessage = await validation.InputFieldValidationInvoice(name, value, invoice?.number_id);
        setErrors(prev => ({
        ...prev,
        [name]: errorMessage
        }));
        
        setMessage('');
      };

    const status = [
        'new',
        'valid',
        'rejected',
        'accepted',
        'invalid'
    ];


    const handleUpdate = async () => {
        if (!invoice) return;
        const newErrors = {};
        let isValid = true;
        Object.keys(formData).forEach(field => {
            const error =  validation.InputFieldValidation(field, formData[field], invoice.number_id);
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
        }
        );
        setErrors(newErrors);
        if (!isValid) {
            setMessage('Lūdzu aizpildiet visus laukus pareizi');
            return;
        }
    
        
            
            const { error: invoiceError } = await supabase
                .from("invoice")
                .update({
                    status: formData.myStatus,
                    full_price: formData.price,
                    number_id: formData.invoice_number
                })
                .eq("id", invoice.id);
    
            if (invoiceError) {
                setMessage("Kļuda atjauninot rēķinu!");
                return;
            }
    
            
            if (invoice.user_subscription?.id) {
                const { error: subscriptionError } = await supabase
                    .from("user_subscription")
                    .update({
                        information: formData.additionalInfo
                    })
                    .eq("id", invoice.user_subscription.id);
    
                if (subscriptionError) {
                    setMessage("Kļuda atjauninot abonementa informāciju!");
                    return;
                }
            }
    
            setMessage("Ieraksts veiksmīgi atjaunināts!");
        
    };


    

    const navigate = useNavigate();
    const { id: inId } = useParams();

    useEffect(() => {
        
        const fetchInvoice = async () => {
        
            const { data, error } = await supabase
                .from('invoice')
                .select(`
                    *,
                    user_subscription:user_subscription_id (
                        *,
                        subscriptions:subscription_id (
                            id,
                            name,
                            price,
                            is_time,
                            is_date
                        ),
                        client:client_id(*)
                    )
                `)
                .eq('id', inId)
                .single();

            if (error) {
                console.error('Notika kluda:', error);
            } else {
                setInvoice(data);
                setChooseOption(data.status);
            }
        
        };


        fetchInvoice(); 
    }, [inId, navigate]);

 





  

  return (
    <>
        <AdminHeader />
        <div className="max-w-3xl mx-auto p-4">
            <Back />
            <ul className="list-none p-4">
                
                <li key={invoice?.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div>
                        <h1 className="font-bold text-6xl">{invoice?.user_subscription?.subscriptions?.name}</h1>
                        <h2 className="font-bold text-3xl">{invoice?.user_subscription?.client?.name} {invoice?.user_subscription?.client?.surname}</h2>
                        <h2 className="font-bold text-3xl">Izveidots: {formatDate(invoice?.user_subscription?.created_at)}</h2>
                        <h2 className="font-semibold text-2xl">
                            {invoice?.user_subscription?.start_date && invoice?.user_subscription?.end_date && (
                                <>
                                Datums: {invoice.user_subscription.start_date} - {invoice.user_subscription.end_date}
                                </>
                            )}
                        </h2>
                        
                        <h2 className="font-semibold text-2xl">
                            {invoice?.user_subscription?.start_date && (
                                <>
                                Datums: {invoice?.user_subscription?.start_date}
                                </>
                            )}
                        </h2>
                        <h2 className="font-semibold text-2xl">
                            {invoice?.user_subscription?.start_time && invoice?.user_subscription?.end_time &&  (
                                <>
                                    Laiks: {invoice?.user_subscription?.start_time} - {invoice?.user_subscription?.end_time}
                                </>
                            )}
                        </h2>
                        {invoice?.user_subscription?.information && <div>
                            <label htmlFor="additionalInfo" className="block text-gray-700 mb-2">Papildu informacija:</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                                placeholder="Ievadiet papildu informaciju"
                            />
                        </div>}
                        {invoice?.number_id && 
                        <InputComponent
                            label="Ivoice number"
                            id="invoice_number"
                            placeholder="Invoice number"
                            value={formData.invoice_number}
                            onChange={handleInputChange}
                        />}
                        {formData.invoice_number && errors.invoice_number
                        ? <div className='text-red-500 text-sm text-center '>{errors.invoice_number}</div>
                        : null}
                        {invoice?.full_price &&
                        <InputComponent
                            label="Cena"
                            id="price"
                            placeholder="Ievadiet cenu"
                            value={formData.price}
                            onChange={handleInputChange}
                        />}
                        {formData.price && errors.price
                        ? <div className='text-red-500 text-sm text-center '>{errors.price}</div>
                        : null}
                        {invoice?.status && 
                        <><h3>Status:</h3>
                            <select 
                                name="myStatus" 
                                id="myStatus" 
                                value={formData.myStatus} 
                                onChange={(e) => setFormData(prev => ({ ...prev, myStatus: e.target.value }))}
                            >
                                {status.map((st) => 
                                    <option key={st} value={st}>
                                        {st}
                                    </option>
                                )}
                            </select> 
                        </>
                        }
                        
                    </div>
                    {message && (<h2 className="text-center">{message}</h2>)}
                    {}
                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6' onClick={() => handleUpdate()}>
                            Atjaunot
                        </button>
                    </div>
                </li>
                
               
            </ul>
        </div>
        </>
    );
}