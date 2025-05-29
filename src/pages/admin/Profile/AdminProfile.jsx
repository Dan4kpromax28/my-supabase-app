
import { useState } from "react"
import AdminHeader from '../../../components/pageComponents/headers/AdminHeader'
import InputComponent from "../../../components/customInput/InputComponent";
import { supabase } from '../../../utils/helpers/supabase/supabase';
import validation from "../../../utils/helpers/validation/handleInput.js";
import useAdminProfile from "../../../hooks/supabaseAPI/useAdminProfile.js";





export default function AdminPanel(){
    const {error, handleInputChange, handleSubmit, message} = useAdminProfil();

    return(
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <AdminHeader />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-2xl w-full p-4">
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        {error && (<p className="text-red-500 text-center">{error.password}</p>)}
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