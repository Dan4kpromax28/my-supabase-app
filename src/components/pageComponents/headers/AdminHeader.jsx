import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/helpers/supabase/supabase';
import { useState } from "react";



export default function AdminHeader(){

    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log("Notika kluda");
        navigate("/admin/login");
    };


    
    return (
        <header className='bg-sky-800 text-white'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
                <div className="flex items-center">
                    <Link to="/" className="text-3xl font-bold">
                        MOOMENTUM
                    </Link>
                    <nav className='hidden md:flex space-x-4 ml-10'>
                        <Link to="/admin/dashboard" className='hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium'>
                            Lietotaji
                        </Link>
                        <Link to="/admin/all_subscriptions" className='hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium'>
                            Pasutijumi
                        </Link>
                        <Link to="/admin/statistic" className='hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium'>
                            Statistika
                        </Link>
                        <Link to="/admin/subscriptions" className='hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium'>
                            Piedavajums
                        </Link>
                    </nav>
                </div>
                <div className="hidden md:flex items-center">
                    <Link to='/admin/profils' className='bg-sky-700 hover:bg-sky-900 px-3 py-2 rounded-md text-sm font-medium mr-3'>
                        Profils
                    </Link>
                    
                    <button onClick={signOut} className='bg-sky-950 hover:bg-red-400 px-3 py-2 rounded-md text-sm font-medium'>
                        Iziet
                    </button>
                </div>
                <button onClick={() => setOpenMenu(!openMenu)} className='block md:hidden py-3 px-4 mx-2 bg-gray-100 rounded focus:outline-none hover:bg-gray-200 group'>
                    <div className='w-5 h-1 bg-gray-600 mb-1'></div>
                    <div className='w-5 h-1 bg-gray-600 mb-1'></div>
                    <div className='w-5 h-1 bg-gray-600'></div>

                </button>
                {openMenu && (
                    <div className='absolute top-0 right-0 h-screen w-full bg-white border transition-all duration-300 z-50'>
                        <div className='text-black flex flex-col'>
                        <button onClick={() => setOpenMenu(!openMenu)} className='text-center py-3 w-full bg-sky-700 hover:bg-sky-900 text-white'>Atpakal</button>
                        <Link to="/admin/dashboard" className=' text-center py-3 w-full hover:bg-sky-100' onClick={() => setOpenMenu(!openMenu)}>Lietotaji</Link>
                        <Link to="/admin/all_subscriptions" className='text-center py-3 w-full hover:bg-sky-100' onClick={() => setOpenMenu(!openMenu)}>Pasutijumi</Link>
                        <Link to="/admin/statistic" className='text-center py-3 w-full hover:bg-sky-100' onClick={() => setOpenMenu(!openMenu)}>Statistika</Link>
                        <Link to="/admin/subscriptions" className='text-center py-3 w-full hover:bg-sky-100' onClick={() => setOpenMenu(!openMenu)}>Piedavajums</Link>
                        <Link to="/admin/profils" className='text-center py-3 w-full hover:bg-sky-700 hover:text-white' onClick={() => setOpenMenu(!openMenu)}>Profils</Link>
                        <div className='flex justify-center'>
                            <button onClick={signOut} className='py-3 bg-red-600 hover:bg-red-900 text-white rounded text-center w-full'>
                                Iziet
                            </button>
                        </div>
                        {/* https://www.youtube.com/watch?feature=shared&v=y-TM-gH6I1k — dropdown no sejenes */}

                        

                        </div>
                    </div>
                )}  
                    
                
        
            </div>

        </div>

    </header>
    );
}