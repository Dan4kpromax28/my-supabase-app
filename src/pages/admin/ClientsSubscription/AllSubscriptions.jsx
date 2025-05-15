import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/pageComponents/headers/AdminHeader.jsx";
import Dropdown from "../../../components/Dropdown.jsx";
import Back from "../../../components/buttons/Back.jsx";
import filterAllSubscriptions from "../../../utils/helpers/filters/SubscriptionsFilters.js";
import { filterOptions } from "../../../utils/helpers/filters/filterOptions.js";
import useInvoice from "../../../hooks/supabaseAPI/useInvoice.jsx";


export default function AllSubscriptions(){

    const {subscriptions, handleInvoice, handleReject, handleDelete,handleInvalid,handleAccept} = useInvoice();
    const [filter, setFilter] = useState("Visi abonimenti");
    const [search, setSearch] = useState('');

    const navigate = useNavigate();




    const handleFilter = (filterOption) => {
        setFilter(filterOption);
    }

    const filteredSubscriptions = subscriptions
        .filter(sub => 
            sub.number_id.toLowerCase().includes(search.toLowerCase())
        )
        .filter(sub => filter === "Visi abonimenti" ? true : filterAllSubscriptions[filter]([sub]).length > 0);


    
    const handleSubscriptions = (subId) => {
        navigate(`/admin/clients/subscriptions/${subId}`);
    };


    
    return (
        <>
        <AdminHeader />
        
        <div className="max-w-3xl mx-auto p-4">
        <input 
                type='text' placeholder='Meklēt pec maksajuma numura' value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded-md mb-4">

            </input>
            <Back />
        <div className="mb-6">
            <Dropdown options={filterOptions} onSelect={handleFilter} selected={filter}/>
        </div>
        
        <ul className="list-none p-4">
            {filteredSubscriptions.map((sub) => (
            <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50" >
                <div className="" >
                    <button className="w-full " onClick={() => handleSubscriptions(sub.id)}>
                        <div className="text-left">
                            <h3 className="font-bold text-lg ">{sub.user_subscription?.subscriptions?.name} </h3>
                            <div className="text-sm text-gray-600">
                                <p>{sub.user_subscription?.client?.name+" "+sub.user_subscription?.client?.surname}</p>
                                <p>{sub.full_price} eiro</p>
                                <p>{sub.time}</p>
                                <p >{sub.user_subscription?.start_date} - {sub.user_subscription?.end_date}</p>
                            </div>
                        
                            {!(sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "") && (
                            
                                <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                        
                            )}
                            {sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "" && (
                                <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                            )}
                        </div>
                    </button>
                </div>
                <div className="flex gap-2">
                    {sub.status === 'new' && (
                    <>
                        <button
                            onClick={() => handleReject(sub.id, sub.user_subscription?.client?.email)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                            Atteikt
                        </button>
                        <button
                            onClick={() => handleAccept(sub.id, sub.user_subscription?.client?.email)}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                            Apstiprinat
                        </button>
                    </>
                    

                    )}
                     {sub.status === 'accepted' && (
                 
                        <button
                            onClick={() => handleInvoice(sub.user_subscription?.id, sub.user_subscription?.client?.email, sub.id)}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                            Apmaksa atnaca
                        </button>
                   

                    )}
                     {sub.status === 'valid' && (
                   
                        <button
                            onClick={() => handleInvalid(sub.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                            Ban
                        </button>
                    

                    )}
                    <button
                        onClick={() => handleDelete(sub.user_subscription?.id)}
                        className="bg-red-800 text-white py-1 px-3 rounded hover:bg-red-900">
                        Dzest
                    </button>

                    
                </div>
            </li>
            ))}
        </ul>
        </div>
        </>

    );
}