import React from 'react';

import MainFooter from '../../../components/pageComponents/footers/MainFooter';
import MainHeader from '../../../components/pageComponents/headers/MainHeader';
import InputComponent from '../../../components/customInput/InputComponent';
import useLogin from '../../../hooks/supabaseAPI/useLogin';
export default function AdminLogin(){

    

    
    const {error, loginData, handleInputChange, handleReset, handleSubmitLogin} = useLogin();
    

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <MainHeader />
 
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-2xl w-full p-4">
                    
                    <form onSubmit={handleSubmitLogin} className="bg-white rounded-lg shadow-md p-6">

                        <InputComponent 
                            label="E-pasts"
                            id="email"
                            placeholder="admin@admin.com"
                            value={loginData.email}
                            onChange={handleInputChange}
                        />

                        <InputComponent 
                            label="Parole"
                            type="password"
                            id="password"
                            placeholder="Ievadiet paroli"
                            value={loginData.password}
                            onChange={handleInputChange}
                        />
                        {error && (<p className='text-red-800 text-center'>{error}</p>)}
                    
                        <div className="flex flex-col justify-center items-center">
                            
                            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-1'>
                                Pieteikties
                            </button>
                             <button className='underline text-blue-400' onClick={handleReset}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
            <MainFooter />
        </div>
    );

}