import { supabase } from "../../utils/supabase"
import { useState} from "react";
import AdminHeader from "../../components/AdminHeader";
import InputComponent from "../../components/InputComponent";
import MainFooter from "../../components/MainFooter";


export default function CreateProfile(){

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'super_admin'
    })

    
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {data, error} = await supabase.auth.SignUp({
            email: formData.email,
            password: formData.password,
            user_metadata: {name: formData.name}
        });
        if (error){
            console.log(error);
        }
        await supabase
            .from('user_roles')
            .insert({
                user_id:data.user_id,
                role: formData.role
            });
    }

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
    };


    return(
    <div >
            <AdminHeader />
            <div className='max-w-2xl mx-auto p-4'>
                <div className='bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex items-center hover:bg-sky-100 cursor-pointer' onClick={() => handleBack()}>
                    <h2 className='font-bold text-center'>Atpakaļ</h2>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    
                    <InputComponent 
                        label="Email"
                        id="email"
                        placeholder="Ievadiet email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    
                    
                    <InputComponent 
                        label="Klienta vards"
                        id="name"
                        placeholder="Ievadiet vardu"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    
                    
                    <InputComponent 
                        label="Ievadi paroli"
                        type="password"
                        id="password"
                        placeholder="Ievadi paroli"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                   

                    
                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6'>
                            {'Izveidot'}
                        </button>
                    </div>
                </form>
            </div>
            <MainFooter />
        </div>
    );
}