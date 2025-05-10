import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import AdminHeader from "../../components/AdminHeader";
import Back from "../../components/Back";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
    const [profiles, setProfiles] = useState([]); 
    
    const [error, setError] = useState(null); 
    const [user, setUser] = useState(null); 


    const navigate = useNavigate();


    const fetchData = async () => {

        const { data, error } = await supabase.from("profiles").select("*");
        console.log(data, 'no data');
        if (error) {
            console.log(error);
        }
        setProfiles(data); 
        
    };

    useEffect(() => {
        fetchData();
    }, []); 

    const handleDeleteProfile = async (id, name) => {
        const confirm = window.confirm('Vai velies nodzes ierastu '+name);

        if (!confirm) return;

    
        const {error} = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Notika kluda');
        }
        alert('Veiksmigi nodzests');
        fetchData(); 
    
    };

    const handleUpdateProfile = () => {
        navigate();
    }

    return (
    <>
    <AdminHeader />
        <div className="max-w-3xl mx-auto p-4">
            <Back />
            <ul className="list-none p-4">
                {profiles.map((profile) => (
                <li
                    key={profile.id}
                    className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50"
                >
                    <span>{profile.email}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleClick(profile.id)}
                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                            Atjaunot 
                        </button>
                        <button
                            onClick={() => handleDelete(profile.id, profile.email)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
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