
import AdminHeader from "../../../components/pageComponents/headers/AdminHeader.jsx";
import Back from "../../../components/buttons/Back.jsx";
import InputComponent from "../../../components/customInput/InputComponent.jsx";

import { useSubscriptionData } from "../../../hooks/supabaseAPI/useSubscriptionData";


export default function Subscription() {

    const {
        invoice,
        formData,
        errors,
        setFormData,
        message,
        handleInputChange,
        handleUpdate,
        handleNewCode,
        formatDate
    } = useSubscriptionData();

    const status = [
        'new',
        'valid',
        'rejected',
        'accepted',
        'invalid'
    ];

   
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
                                
                                defaultValue={formData.additionalInfo}
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
                        {invoice?.status === 'valid' && (
                            <button
                                onClick={() => handleNewCode(invoice?.user_subscription?.id, invoice?.user_subscription?.client?.email)}
                                className=" ml-13 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6"
                            >
                                Nosutit kvadratkodu atkartoti
                                
                            </button>
                            )
                        }
                    </div>
                </li>
                
               
            </ul>
        </div>
        </>
    );
}

