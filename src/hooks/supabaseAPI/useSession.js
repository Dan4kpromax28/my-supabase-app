import { useState, useEffect } from 'react';

import { supabase } from '../../utils/helpers/supabase/supabase';




export default function useSession(){
    
    const [loading, setLoading] = useState(true);
    const [authentication, setAuthentication] = useState(false);
    

        const getSession = async () => {
            const {
                data: {session},
            } = await supabase.auth.getSession();

            setAuthentication(!!session);
            setLoading(false);
        }
    useEffect(() => {
        getSession();
    },[]);


    return {authentication ,loading};

}