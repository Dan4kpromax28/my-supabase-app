
import PropTypes from 'prop-types';


export default function SimpleTimePicker({ startTime, endTime, onStartTime, onEndTime }) {
    function listWithTimesFrom0To24() {  
        let times = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0'); 
            times.push(`${hour}:00:00`);
        }
        return times;
    }

    function filteredList(times, chosen) {
        times.push('23:59:59');
        return times.filter(time => time > chosen);
    }

    const allTimes = listWithTimesFrom0To24();
    const availableEndTimes = startTime ? filteredList(allTimes, startTime) : allTimes;

    return (
        <>
          <label className="block text-gray-700 mb-1" htmlFor="startTime">Izvēlieties sākuma laiku:</label>
          <select
            id="startTime"
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            value={startTime}
            onChange={(e) => onStartTime(e.target.value)}
          >
            <option value="">Izvēlieties sākuma laiku</option>
            {allTimes.map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
          
          <label className="block text-gray-700 mb-1" htmlFor="endTime">Izvēlieties beigu laiku:</label>
          <select
            id="endTime"
            className="cursor-pointer mr-2 mb-2 border-2 border-blue-300 rounded-md p-2"
            value={endTime}
            onChange={(e) => onEndTime(e.target.value)}
          >
            <option value="">Izvēlieties beigu laiku</option>
            {availableEndTimes.map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </>
    );
}

SimpleTimePicker.propTypes = {
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  onStartTime: PropTypes.func,
  onEndTime: PropTypes.func,
};