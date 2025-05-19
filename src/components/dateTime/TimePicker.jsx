import useTimes from "../../hooks/supabaseAPI/useTimes";
import PropTypes from 'prop-types';
import { supabase } from "../../utils/helpers/supabase/supabase";
import { useEffect, useState } from "react";

export default function TimePicker({ date, onStartTime, onEndTime, start, subscriptonId}) {
    const times = useTimes(date, subscriptonId);
    const [timeValues, setTimeValues] = useState({});

    const fetchRestriction = async () => {
      const {data, error } = await supabase
        .from('subscriptions')
        .select('restriction_start, restriction_end')
        .eq('id', subscriptonId)
        .single();
      
      if (error) {
        console.log('Notika kluda');
        return;
      }
      
      console.log('Полученные данные:', data);
      setTimeValues(data);
    }

    useEffect(() => {
      fetchRestriction()
    }, [subscriptonId]);

    function listWithTimesFrom08To20(start, end) {
      
      
      const actualStart = parseInt(start.slice(0, 2)); 
      const actualEnd = parseInt(end.slice(0, 2));     
      let times = [];
  
      for (let i = actualStart; i <= actualEnd; i++) {
          const hour = i.toString().padStart(2, '0'); 
          times.push(`${hour}:00:00`);
      }
  
      return times;
    }

    function newFiltredArray(databaseTimes, allTimes){
        let startTimes = [...allTimes];
        startTimes.pop();
        let times = [];
        for(const time of startTimes){
            let isExist = false;
            for(const databaseTime of databaseTimes){
                if(time >= databaseTime.start_time && time < databaseTime.end_time){
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
                times.push(time); 
            }
        }
        return times;
    }

    function newSecondFiltredArray(databaseTimes, allTimes, selectedTime) {
        let endTimes = [...allTimes];
        endTimes.splice(0,1);
        let times = [];
        for (const time of endTimes) {
            let isExist = false;
            
            if (time <= selectedTime) {
                isExist = true;
            } else {
                
                for (const databaseTime of databaseTimes) {
                    if (checkIfIsTimeConflict(databaseTime, selectedTime,time)){
                        isExist = true;
                        break;
                    }
                }
            }
            if (!isExist) {
                times.push(time);
            }
        }
        return times;
    }

    function checkIfIsTimeConflict(databaseTime, selectedTime, time){
      return (time > databaseTime.start_time && 
        selectedTime < databaseTime.end_time && 
        time <= databaseTime.end_time || databaseTime.start_time > selectedTime && time > databaseTime.start_time)
    }
    const allTimes = listWithTimesFrom08To20(timeValues?.restriction_start, timeValues?.restriction_end);
    const availableStartTimes = newFiltredArray(times, allTimes);
    const availableEndTimes = newSecondFiltredArray(times, allTimes, start);

    return (
        <>
          <label className="block text-gray-700 mb-1" htmlFor="startTime">Izvēlieties sākuma laiku:</label>
          <select
            id="startTime"
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            onChange={(e) => onStartTime(e.target.value)}
          >
            <option value="">Izvēlieties sākuma laiku</option>
            {availableStartTimes?.map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
          
          <label className="block text-gray-700 mb-1" htmlFor="endTime">Izvēlieties beigu laiku:</label>
          <select
            id="endTime"
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            onChange={(e) => onEndTime(e.target.value)}
          >
            <option value="">Izvēlieties beigu laiku</option>
            {availableEndTimes?.map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </>
    );
}

TimePicker.propTypes = {
    date: PropTypes.string.isRequired,
    onStartTime: PropTypes.func.isRequired,
    onEndTime: PropTypes.func.isRequired,
    start: PropTypes.string,
    subscriptonId: PropTypes.number
};