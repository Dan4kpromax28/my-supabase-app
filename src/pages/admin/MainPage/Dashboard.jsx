import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../components/pageComponents/headers/AdminHeader';
import useClient from '../../../hooks/supabaseAPI/useClients';

export default function Dashboard(){
    const [search, setSearch] = useState('');
    const {clients, handleDelete} = useClient(search);
    const navigate = useNavigate();

    const handleEdit = (clientId) => {
        navigate(`/admin/clients/edit/${clientId}`);
    };

    const handleViewSubscriptions = (clientId) => {
        navigate(`/admin/clients/userSubscriptions/${clientId}`);
    };

    const handleCreateClient = () => {
        navigate('/admin/clients/createClient');
    };
    


    return (
        <>
        <AdminHeader /> 
        <div className="max-w-3xl mx-auto p-4 ">
            <input 
                type='text' placeholder='Meklēt pec paramietrem' value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded-md mb-4">

            </input>

            <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100'>
                <button className='cursor-pointer' onClick={() => handleCreateClient()}>
                    <h2 className='font-bold text-center'>Izveidot jaunu klientu</h2>
                </button>
            </div>

            {clients.map(client => (
                <div key={client.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50">
                    <button className="w-full npmcursor-pointer text-left" onClick={() => handleViewSubscriptions(client.id)}>
                        <h3 className="font-bold text-lg" >{client.name} {client.surname}</h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-600">{client.phone_number}</p>
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Abonementi: {client.subscriptionCount}
                        </span>
                    </button>
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
                </div>
            ))}
            
        </div>
        </>
        
        
    );
}
