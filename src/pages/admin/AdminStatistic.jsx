
import AdminHeader from '../../components/AdminHeader';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Back from '../../components/Back';



export default function AdminStatistic(){

    const todayInLatvia = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'Europe/Riga'
      });
    const [users, setUsers] = useState([]);
    const [date, setDate] = useState({
        startDate: todayInLatvia,
        endDate: todayInLatvia
    });

    const [howMuchVisits, setHowMuchVisits] = useState({});
    const [howMuchUniqueVisits, setHowMuchUniqueVisits] = useState({});
    useEffect(() => {
        const fetchClinetStatistic = async () => {
            const { data, error} = await supabase
                .from('time_stamps')
                .select(`
                    *,
                    client:client_id(*)
                `)
                .gte('created_at', `${date.startDate}T00:00:00.000Z`)
                .lte('created_at', `${date.endDate}T23:59:59.999Z`)
                .order('created_at', { ascending: false });
            if (error) {
                console.log('Notika kluda:', error);
            }
            else {
                setUsers(data);
            }
        }
        fetchClinetStatistic();
    }, [date]);
    

    console.log(date.startDate);
    console.log(date.endDate);


    


    return(
     <>
     <div className="min-h-screen bg-stone-100 flex flex-col">
        <AdminHeader />
        <div className="flex-grow flex justify-center">
            <div className="max-w-2xl w-full p-4">
            <Back />
            <div>
                <h2 className="text-xl font-bold mb-4">Statistika</h2>
                <p>Kopā ir: {users.length}</p>
                <ul>
                    {users.map((user, index) => (
                    <li key={index} className="bg-white p-2 my-2 rounded shadow">
                        {user.client?.name || 'Nav vārda'} – {user?.client.created_at}
                    </li>
                    ))}
                </ul>
            </div>

        </div>
        </div>
    </div>
     </>
        
       
       
        

    );

}