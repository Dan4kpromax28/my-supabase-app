import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function LoginWrapper({ children }) {
    //const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authentication, setAuthentication] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session},
            } = await supabase.auth.getSession();

            setAuthentication(!!session);
            setLoading(false);
        }
        getSession();
    },[]);

    if (loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100">
                <div className="text-gray-600">Notiek ielade...</div>
            </div>
        );

    } else {
        if (authentication){
            return <Navigate to="/admin/dashboard" />;
        }
        return children;
    }

        

};