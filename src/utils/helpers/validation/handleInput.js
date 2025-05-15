import { supabase } from "../supabase/supabase";

function InputFieldValidation(name, value) {
    let message = '';
    switch(name){
        case 'name':{
            const nameRegex = /^[A-ZĒŪĪĻĶĢŠĀČŅ][a-zēūīļķģšāžčņ]+$/;
            if(!value || value.length< 2 || value.length > 30 || !nameRegex.test(value)){
                message = 'Nekorekta vārda ievade';
            }
        }
            break;
        case 'surname': {
            const surnameRegex = /^[A-ZĒŪĪĻĶĢŠĀČŅ][a-zēūīļķģšāžčņ]+$/;
            if(!value || value.length< 2 || value.length > 30 || !surnameRegex.test(value)){
                message = 'Nekorekta uzvārda ievade';
            }
        }
            break;
        case 'email':{
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if(!value || !emailRegex.test(value)){
                message = 'Nekorekta e-pasta ievade';
            }
        }
            break;
        case 'phone':{
            const phoneRegex = /^\+?\d{8,15}$/;
            if (!value || !phoneRegex.test(value)) {
                message = 'Nekorekta telefona numura ievade';
            }
        }
            break;
        default:
            break;
    }
    return message;
}

const InputFieldValidationInvoice = async (name, value, acctual_number) =>{
    let message = '';
    switch(name){
        case 'invoice_number':{
            const invoiceNumberRegex = /^MOM\d{1,100}$/;
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
        }
            break;
        case 'price':{
            const num = parseFloat(value);
            if(isNaN(num) || num <= 0 || num > 10000) {
                message = 'Nekorekta cenas ievade';
            }
        }
            break;

        case 'additionalInfo':
            if(value.length > 10000) {
                message = 'Ievades garuma parkapums';
            }
        
            break;
        default:
            break;
    }
    return message;
}

const InputFieldValidationType = (name, value) => {
    let message = '';
    switch(name){
        case 'name': 
            if(!value || value.length < 2 || value.length > 30){
                message = 'Nekorekta nosaukuma ievade';
            }
        
            break;
        case 'description':
            if (value.length > 200){
                message = 'Zinojums nevar but lielaks par 200 simboliem';
            }
        
            break;
        case 'price':
        case 'additionalHourPrice':
            if (isNaN(value) || value < 0){
                message = 'Cena nevar but negativa';
            }
        
            break;
        case 'durationValue':{
            if (isNaN(value) || value <= 0){
                message = 'Ilgums nevar but negativs vai nulle';
            }
            break;
        }
        case 'durationType':
            if (!value || !['dienas', 'stundas', 'reizes'].includes(value)){
                message = 'Nekorekts ilguma tips';
            }
        
            break;
        case 'restrictionStart':
        case 'restrictionEnd':{
            const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/;
            if (!timeRegex.test(value)){
                message = 'Nekorekta laika ievade';
            }
        }
            break;
        case 'isTime':
        case 'isDate':
            if (typeof value !== 'boolean'){
                message = 'Nekorekta vertiba';
            }
        
            break;
        default:
            break;
    }
    return message;
};

export default {InputFieldValidation, InputFieldValidationInvoice, InputFieldValidationType};


