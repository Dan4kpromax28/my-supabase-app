import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminHeader from "../../components/AdminHeader";
import Back from "../../components/Back";
import InputComponent from "../../components/InputComponent";

export default function Subscription() {

    const [invoice, setInvoice] = useState();

    const formData = {
        invoice_number: invoice?.number_id,
        price: invoice?.full_price
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    

    const navigate = useNavigate();
    const { id: inId } = useParams();

    useEffect(() => {
        
        const fetchSubscriptions = async () => {
        try {
            const { data, error } = await supabase
            .from('invoice')
            .select(`
                *,
                user_subscription:user_subscription_id (
                    *,
                    subscriptions:subscription_id (
                        id,
                        name,
                        price
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
            setFiltSubscriptions(data);
            }
        } catch (err) {
            console.error('Kluda:', err);
        }
        };


        fetchSubscriptions(); 
    }, [inId, navigate]);





  

  return (
    <>
        <AdminHeader />
        <div className="max-w-3xl mx-auto p-4">
            <Back />
            <ul className="list-none p-4">
                
                <li key={invoice?.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div>
                        <h3 className="font-bold text-lg">{invoice?.user_subscription?.subscriptions?.name}</h3>
                        <h2 className="font-bold text-lg">{invoice?.user_subscription?.client?.name} {invoice?.user_subscription?.client?.surname}</h2>
                        <h2 className="font-bold text-sm">Izveidots: {invoice?.user_subscription?.created_at}</h2>
                        {invoice?.user_subscription?.start_date && invoice?.user_subscription?.end_date && <p>Datums: {invoice?.user_subscription?.start_date} - {invoice?.user_subscription?.end_date}</p>}
                        {invoice?.user_subscription?.start_date && <p>Datums: {invoice?.user_subscription?.start_date}</p>}
                        {invoice?.user_subscription?.time && <p>Laiks: {invoice?.user_subscription?.time}</p>}
                        {invoice?.user_subscription?.information && <p>Informācija: {invoice?.user_subscription?.information}</p>}
                        {invoice?.number_id && 
                        <InputComponent
                            label="Ivoice number"
                            id="invoice"
                            placeholder="Invoice number"
                            value={formData.invoice_number}
                            onChange={handleInputChange}
                        />}
                        {invoice?.full_price &&
                        <InputComponent
                            label="Cena"
                            id="price"
                            placeholder="Ievadiet cenu"
                            value={formData.price}
                            onChange={handleInputChange}
                        />}
                        {invoice?.status && <p>Status: {invoice?.status}</p>}
                        
                    </div>
                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            Izveidot
                        </button>
                    </div>
                </li>
                
               
            </ul>
        </div>
        </>
    );
}