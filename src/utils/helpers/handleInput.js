import { supabase } from "../supabase";

export function InputFieldValidation(name, value) {
    var message = '';
    switch(name){
        case 'name':
            const nameRegex = /^[A-ZĒŪĪĻĶĢŠĀČŅ]{1}[a-zēūīļķģšāžčņ]+$/;
            if(!value || value.length< 2 || value.length > 30 || !nameRegex.test(value)){
                message = 'Nekorekta vārda ievade';
            }
            break;
        case 'surname':
            const surnameRegex = /^[A-ZĒŪĪĻĶĢŠĀČŅ]{1}[a-zēūīļķģšāžčņ]+$/;
            if(!value || value.length< 2 || value.length > 30 || !surnameRegex.test(value)){
                message = 'Nekorekta uzvārda ievade';
            }
            break;
        case 'email':
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if(!value || !emailRegex.test(value)){
                message = 'Nekorekta e-pasta ievade';
            }
            break;
        case 'phone':
            const phoneRegex = /^\+?[0-9]{8,15}$/;
            if (!value || !phoneRegex.test(value)) {
                message = 'Nekorekta telefona numura ievade';
            }
            break;
        default:
            break;
    }
    return message;
}

const InputFieldValidationInvoice = async (name, value, acctual_number) =>{
    var message = '';
    switch(name){
        case 'invoice_number':
            const invoiceNumberRegex = /^MOM[0-9]{1,100}$/;
            if(!value || !invoiceNumberRegex.test(value)){
                message = 'Nekorekta rēķina numura ievade';
            }
            const {data, error} = await supabase
                .from('invoice')
                .select('number_id')
                .eq('number_id', value)
                .maybeSingle();
            if (error) {
                console.error('Notika kluda');
            }
            else if (data && data.number_id != acctual_number && data.number_id === value){
                message = 'Rēķina numurs jau eksistē';
            }
            
            

            break;
        case 'price':
            if(!value || value <= 0 || value > 10000) {
                message = 'Nekorekta cenas ievade';
            }
            break;
        /*case 'additionalInfo':
            if(value.length > 10000) {
                message = 'Ievades garuma parkapums';
            }
            break;
            */
        default:
            break;
    }
    return message;
}

export default {InputFieldValidation, InputFieldValidationInvoice};


