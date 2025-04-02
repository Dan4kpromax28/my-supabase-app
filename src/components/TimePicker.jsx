import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { DateTime } from "luxon";

export default function TimePicker({ date, onStartTime, onEndTime, start,end}) {
    const [times, setTimes] = useState([]);

    useEffect(() => {
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

        fetchTimes();
    }, [date]);

    useEffect(() => {
        console.log('Jaunie dati:', times);
    }, [times]);

    function listWithTimesFrom08To20(){
        let times = [];
        for (let i = 8; i < 21; i++) {
            if(i < 10){
                times.push(`0${i}:00:00`);
                continue;
            }
            times.push(`${i}:00:00`);
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
    const allTimes = listWithTimesFrom08To20();
    const availableStartTimes = newFiltredArray(times, allTimes);
    const availableEndTimes = newSecondFiltredArray(times, allTimes,start );

    return (
        <>
          <label className="block text-gray-700 mb-1">Izvēlieties sākuma laiku:</label>
          <select
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            onChange={(e) => onStartTime(e.target.value)}
          >
            <option value="">Izvēlieties sākuma laiku</option>
            {availableStartTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
          
          <label className="block text-gray-700 mb-1">Izvēlieties beigu laiku:</label>
          <select
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            onChange={(e) => onEndTime(e.target.value)}
          >
            <option value="">Izvēlieties beigu laiku</option>
            {availableEndTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </>
      );
}