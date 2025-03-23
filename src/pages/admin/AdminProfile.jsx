import { useNavigate } from "react-router-dom";
import { useState } from "react"
import AdminHeader from '../../components/AdminHeader'
import InputComponent from "../../components/InputComponent";
import { supabase } from '../../utils/supabase';





export default function AdminPanel(){
    const navigate = useNavigate();

    const [message, setMessage] = useState();

    const [newPassword, setNewPassword] = useState({
        password: '',
    });


    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPassword(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { data, error } = await supabase.auth.updateUser(
            { password: newPassword.password }
        )

        if (error) {
            setMessage("Notika kluda");
        } else {    
            setMessage("Parole vieksmigi izmainita")
        }
        setNewPassword({password: ''});
           
    };

    return(
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <AdminHeader />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-2xl w-full p-4">
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">

                        <InputComponent 
                            label="Jauna parole"
                            type="password"
                            id="password"
                            placeholder="Ievadiet jauno paroli"
                            value={newPassword.password}
                            onChange={handleInputChange}
                        />
                        {message && (<p>{message}</p>)}


                        <div className="flex justify-center items-center">
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-1'>
                                Izmainīt
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}