import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/helpers/supabase/supabase.js";
import { formatDate } from "../../utils/helpers/date/helpers.js";
import validation from "../../utils/helpers/validation/handleInput.js";

export function useSubscriptionData() {
    //const navigate = useNavigate();
    const { id: inId } = useParams();

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

    const handleUpdate = async () => {
        const newErrors = {};
        let isValid = true;
        for (const field of Object.keys(formData)) {
            const error = validation.InputFieldValidation(field, formData[field], invoice?.number_id);
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
        }

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
            .eq("id", invoice?.id);

        setMessage(invoiceError ? "Notika kļūda" : "Ieraksts veiksmīgi atjaunināts!");
    };

    const handleNewCode = async (datas, email) => {
        const { error } = await supabase.functions.invoke('sendMail', {
            body: { subId: String(datas), email: String(email) },
        });
        if (error) console.error(error);
    };

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
            console.error('Notika kļūda:', error);
        } else {
            setInvoice(data);
            setChooseOption(data.status);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [inId]);

    return {
        invoice,
        formData,
        errors,
        chooseOption,
        setFormData,
        setChooseOption,
        message,
        handleInputChange,
        handleUpdate,
        handleNewCode,
        formatDate
    };
}