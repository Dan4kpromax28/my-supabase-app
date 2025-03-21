import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom'



export default function AdminHeader(){

    const navigate = useNavigate();

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
                    <nav className="hidden md:flex space-x-4 ml-10">
                        <Link to="/admin/dashboard" className="hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium">
                            Lietotaji
                        </Link>
                        <Link to="/admin/all_subscriptions" className="hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium">
                            Pasutijumi
                        </Link>
                        <Link to="/admin/statistic" className="hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium">
                            Statistika
                        </Link>
                        <Link to="/admin/subscriptions" className="hover:bg-sky-700 px-3 py-2 rounded-md text-sm font-medium">
                            Piedavajums
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center">
                    <Link to='/admin/profils' className='bg-sky-700 hover:bg-sky-900 px-3 py-2 rounded-md text-sm font-medium mr-3'>
                        Profils
                    </Link>

                    
                    <button onClick={signOut} className='bg-sky-950 hover:bg-red-400 px-3 py-2 rounded-md text-sm font-medium'>
                        Iziet
                    </button>
                </div>
        
            </div>

        </div>

    </header>
    );
}