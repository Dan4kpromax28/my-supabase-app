
import { useState, useEffect } from "react";


import { supabase } from '../../utils/supabase';

export default function useTimes(date){

    const [times, setTimes] = useState([]);

    const fetchTimes = async () => {
        if (date === null || date === undefined) return;
        
        const { data, error } = await supabase
            .from('user_subscription')
            .select('start_time, end_time')
            .eq('start_date', date)
            .not('start_time', 'is', null);

        if (error) {
            console.error('Notika kluda:', error.message);
            return;
        }

        setTimes(data);
        
    };

    useEffect(() => {
        fetchTimes();
    }, [date]);

    return times;
}