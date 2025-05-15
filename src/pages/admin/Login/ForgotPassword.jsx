import { useState} from "react";


import { supabase } from "../../../utils/helpers/supabase/supabase";
import InputComponent from "../../../components/InputComponent";
import MainHeader from "../../../components/pageComponents/headers/MainHeader";
import MainFooter from "../../../components/pageComponents/footers/MainFooter";
import Back from "../../../components/buttons/Back";

export default function ForgotPassword(){
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);


    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: "http://localhost:5173/admin/profils",} );
        if (error) {
            setError("Notika kluda");
            console.log(error);
        }
        console.log(data);
    };

 



    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
        <MainHeader />
        
        <div className="flex-grow flex items-center justify-center">
        
            <div className="max-w-2xl w-full p-4">
            <Back />
                
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">

                    <InputComponent 
                        label="E-pasts"
                        id="email"
                        placeholder="admin@admin.com"
                        value={email}
                        onChange={handleInputChange}
                    />
                    {error && (<p>{error}</p>)}
                    

                    <div className="flex justify-center items-center">
                        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-1'>
                            Iesniegt pieprasijumu
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <MainFooter />
    </div>
    );
}