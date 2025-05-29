
import { useState, useEffect } from "react";

import PropTypes from 'prop-types';

import { supabase } from '../../utils/helpers/supabase/supabase';

export default function useTimes(date, subscriptionId) {

    const [times, setTimes] = useState([]);

    const fetchTimes = async () => {
        
        const { data, error } = await supabase
            .from('user_subscription')
            .select('start_time, end_time')
            .eq('start_date', date)
            .eq('subscription_id', subscriptionId)
            .not('start_time', 'is', null);

        if (error) {
            console.error('Notika klūda!');
            setTimes([]);
            return;
        }

        setTimes(data);
        
    };

    useEffect(() => {
        fetchTimes();
    }, [date]);

    return times;
}

useTimes.propTypes = {
    date: PropTypes.string,
    subscriptionId: PropTypes.number
};
