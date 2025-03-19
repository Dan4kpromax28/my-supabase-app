import { useEffect, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { supabase } from "../../utils/supabase";
import Dropdown from "../../components/Dropdown";
import Back from "../../components/Back";


export default function AllSubscriptions(){

    const [subscriptions, setSubscriptions] = useState([]);
    const [filtSubscriptions, setFiltSubscriptions] = useState([]);
    const [filter, setFilter] = useState("Visi abonimenti");
    const [search, setSearch] = useState('');

    const navigate = useNavigate();


    const filterOptions = [
        "Visi abonimenti",
        "Aktīvie abonimenti",
        "Beigušies abonimenti",
        "Ar informāciju",
        "Bez informācijas",
        "Jaunie",
        "Rejected"
    ]

    const handleFilter = (filterOption) => {
        setFilter(filterOption);
        let filtered = [...subscriptions];

        switch (filterOption) {
            case "Aktīvie abonimenti":
                filtered = subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) > new Date());
                break;  
            case "Beigušies abonimenti":
                filtered = subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) <= new Date());
                break;  
            case "Ar informāciju":
                filtered = subscriptions.filter(sub => sub.user_subscription?.information && sub.user_subscription.information.trim() !== "");
                break;  
            case "Bez informācijas":
                filtered = subscriptions.filter(sub => !sub.user_subscription?.information || sub.user_subscription.information.trim() === "");
                break;  
            case "Jaunie":
                filtered = subscriptions.filter(sub => sub.status === "new");
                break;
            case "Rejected":
                filtered = subscriptions.filter(sub => sub.status === "rejected");
                break;    
            default:
                filtered = subscriptions;
        }
        setFiltSubscriptions(filtered);
    }

    useEffect(() => {
        let filtered = subscriptions.filter(sub => 
            sub.number_id.toLowerCase().includes(search.toLowerCase())
        );
        setFiltSubscriptions(filtered);
    }, [search, subscriptions]);


    useEffect(() => {
        
        const fetchSubscriptions = async (find) => {

        try {

            let query = supabase
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
            `);

            if (find){
                query = query.or(
                    `number_id.ilike.%${find}%`
                );
            }
            const { data, error } = await query;

            if (error) {
            console.error('Notika kluda:', error);
            } else {
                
            setSubscriptions(data);
            setFiltSubscriptions(data);
            }
        } catch (err) {
            console.error('Kluda:', err);
        }
        };


        fetchSubscriptions(); 
    }, [ navigate]);

    const handleBack = () => {
        navigate(-1);
    }
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
            {filtSubscriptions.map((sub) => (
            <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50"onClick={() => handleSubscriptions(sub.id)}>
                <div className="">
                    <h3 className="font-bold text-lg">{sub.user_subscription?.subscriptions?.name} </h3>
                    <p className="text-sm text-gray-600">{sub.user_subscription?.client?.name+" "+sub.user_subscription?.client?.surname}</p>
                    <p className="text-sm text-gray-600">{sub.full_price} eiro</p>
                    <p className="text-sm text-gray-600">{sub.time}</p>
                
                    <p className="text-sm text-gray-600">{sub.user_subscription?.start_date} - {sub.user_subscription?.end_date}</p>
                    {!(sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "") && (
                    
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                
                    )}
                    {sub.user_subscription?.information && sub.user_subscription?.information.trim() !== "" && (
                        <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(client.id)}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                        Rediģēt
                    </button>
                    <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                        Dzēst
                    </button>
                </div>
            </li>
            ))}
        </ul>
        </div>
        </>

    );
}