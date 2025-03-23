import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { DateTime } from "luxon";

export default function TimePicker({ date }) {
    const [times, setTimes] = useState([]);

    useEffect(() => {
        const fetchTimes = async () => {
            
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

        fetchTimes();
    }, [date]);

    useEffect(() => {
        console.log('Jaunie dati:', times);
    }, [times]);

    function listWithTimesFrom08To20(){
        let times = [];
        for (let i = 8; i < 21; i++) {
            if(i < 10){
                times.push(`0${i}:00:00+02`);
                continue;
            }
            times.push(`${i}:00:00+02`);
        }
        return times;
    } 


    console.log(listWithTimesFrom08To20());

    function newFiltredArray(databaseTimes, allTimes){
        let times = [];
        for(let i =0; i < allTimes.length; i++){
            let isExist = false;
            for(let j = 0; j < databaseTimes.length; j++){
                if(allTimes[i] >= databaseTimes[j].start_time && allTimes[i] < databaseTimes[j].end_time){
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
                times.push(allTimes[i]);
            }
        }
        return times;
    }

    function newSecondFiltredArray(databaseTimes, allTimes, selectedTime) {
        let times = [];
        for (let i = 0; i < allTimes.length; i++) {
            let isExist = false;
            
            if (allTimes[i] <= selectedTime) {
                isExist = true;
            } else {
                
                for (let j = 0; j < databaseTimes.length; j++) {
                    if (
                        allTimes[i] > databaseTimes[j].start_time && 
                        selectedTime < databaseTimes[j].end_time && 
                        allTimes[i] <= databaseTimes[j].end_time
                    ) {
                        isExist = true;
                        break;
                    }
                    
                    if (databaseTimes[j].start_time > selectedTime && allTimes[i] > databaseTimes[j].start_time) {
                        isExist = true;
                        break;
                    }
                }
            }
            if (!isExist) {
                times.push(allTimes[i]);
            }
        }
        return times;
    }
    console.log('Filtred data:', newFiltredArray(times, listWithTimesFrom08To20()));
    console.log('Second Filtred data:', newSecondFiltredArray(times, listWithTimesFrom08To20(), '08:00:00+02'));

    return (
        <>
        <select>
            {newFiltredArray(times, listWithTimesFrom08To20()).map((time, index) => (
                <option key={index} value={time}>{time}</option>
            ))}
        </select>
        <select>
            {newSecondFiltredArray(times, listWithTimesFrom08To20(), '14:00:00+02').map((time, index) => (
                <option key={index} value={time}>{time}</option>
            ))}
        </select>
        </>
    );
}