import AdminHeader from '../../components/AdminHeader';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Back from '../../components/Back';
import { Bar } from 'react-chartjs-2';
import Pagination from '../../components/Pagination';
import Select from 'react-select'


import { 
    Chart, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import useClient from '../../hooks/supabaseAPI/useClients';

Chart.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend
);




const checkDayDifference = (startDate, endDate) => {
    const start = startDate.split('T')[0];
    const end = endDate.split('T')[0];
    
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);
    
    const timeDifference = endDateObj.getTime() - startDateObj.getTime();
    
    const dayDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));
    
    return dayDifference;
};

const makeDataForChart = (stamps, startDate, endDate) => {
    const dayDifference = checkDayDifference(startDate, endDate);

    let labels = [];
    let data = [];
    let title = '';

    if (dayDifference === 0) {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i + ':00');
        }
        const dataWithHourlyUpdate = new Array(24).fill(0);
        stamps.forEach(stamp => {
            const hour = new Date(stamp.created_at).getUTCHours();
            dataWithHourlyUpdate[hour]++;
        });
        labels = hours;
        data = dataWithHourlyUpdate;
        title = "Apmeklējumi viena dienā";
    }
    else if (dayDifference < 31) {
        const dayData = {};
        const start = new Date(startDate);
        for (let i = 0; i <= dayDifference; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            labels.push(date.toDateString());
        }
        data = new Array(labels.length).fill(0);
        stamps.forEach(stamp => {
            const stampDate = new Date(stamp.created_at).toDateString();
            const index = labels.indexOf(stampDate);
            if (index !== -1) {
                data[index]++;
            }
        });
        title = "Apmēklējumi pa dienam";
    }
    else if (dayDifference < 361) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let current = new Date(start.getFullYear(), start.getMonth(), 1);

        const allMonth = ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs',
            'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'];
        while (current <= end) {
          const monthName = allMonth[current.getMonth()];
          labels.push(monthName);
          current.setMonth(current.getMonth() + 1);
        }
        data = new Array(labels.length).fill(0);
    
        stamps.forEach(stamp => {
          const date = new Date(stamp.created_at);
          const monthName = allMonth[date.getMonth()];
          const i = labels.indexOf(monthName);
          if (i !== -1){
            data[i]++;
          }
        });
    
        title = 'Apmeklējumi pa mēnešiem';
      }

      else {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let current = new Date(start.getFullYear(), 0, 1);

        while (current <= end) {
            const year = current.getFullYear();
            labels.push(year);
            current.setFullYear(current.getFullYear() + 1);
        } 
        data = new Array(labels.length).fill(0);

        stamps.forEach(stamp => {
            const stampYear = new Date(stamp.created_at).getFullYear();
            const i = labels.indexOf(stampYear);
            if (i !== -1){
                data[i]++;
            }
        });
        
        title = 'Apmeklējumi pa gadiem';
      }

    const result = {
        labels,
        datasets: [{
            label: 'Apmeklējumu skaits',
            data: data,
            tension: 0.1,
            fill: false
        }],
        title
    };
    
    return result;
};

export default function AdminStatistic() {
    const todayInLatvia = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'Europe/Riga'
    });

    const [page, setPage] = useState(1);
    const itemsInPage = 10;

    const [informationOnPage, setInformationOnPage] = useState([]);
    
    //const dispayItems = informationOnPage();

    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);


    

    const [stamps, setStamps] = useState([]);
    const [filteredStamps, setFilteredStamps] = useState([]);

    const [date, setDate] = useState({
        startDate: todayInLatvia,
        endDate: todayInLatvia
    });
    const [dateError, setDateError] = useState('');
    const [uniqueVisitors, setUniqueVisitors] = useState(0);
    const [chartData, setShartData] = useState(null);

    const [howMuchVisits, setHowMuchVisits] = useState({});
    const [howMuchUniqueVisits, setHowMuchUniqueVisits] = useState({});

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const newDate = {
            ...date,
            [name]: value
        };

        if (new Date(value) > new Date()) {
            setDateError('Nevar izvēlēties nākotnes datumu');
            return;
        }

        if (name === 'startDate' && new Date(value) > new Date(newDate.endDate)) {
            setDateError('Sākuma datums nevar būt vēlāks par beigu datumu');
            return;
        }
        if (name === 'endDate' && new Date(value) < new Date(newDate.startDate)) {
            setDateError('Beigu datums nevar būt agrāks par sākuma datumu');
            return;
        }

        setDateError('');
        setDate(newDate);
    };

    const uniquePersonsThatEnters = (data) => {
        const uniqueClients = new Set();
        data.forEach(stamp => {
            const clientId = stamp.ticket?.user_subscription?.client?.id;
            if (clientId) {
                uniqueClients.add(clientId);
            }
        });
        return uniqueClients.size;
    };

    const fetchClients = async () => {
        const {data, error} = await supabase
            .from('client')
            .select('id, name, surname')
            .order('name', {ascending: false});

        if (error) {
            console.log('Notika kluda');
        }
        else {
            const clientsForSelector = data.map(client => (
                {
                    value: client.id,
                    label: `${client.name} ${client.surname}`
                }
            ));
            setClients(clientsForSelector);
        }

    } 
    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const fetchClinetStatistic = async () => {
            if (dateError) return;

            const { data, error } = await supabase
                .from('time_stamps')
                .select(`
                    *,
                    ticket:ticket_id(*, user_subscription:user_subscription_id(*, subscriptions:subscription_id(*), client:client_id(*)))
                `)
                .gte('created_at', `${date.startDate}T00:00:00.000Z`)
                .lte('created_at', `${date.endDate}T23:59:59.999Z`)
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Notika kluda:', error);
            } else {
                setPage(1);
                if (data.length === 0) {
                    setStamps([]);
                    setFilteredStamps([]);
                    setUniqueVisitors(0);
                    setInformationOnPage([]);
                    setShartData(null);
                } else {
                    setStamps(data);
                    setFilteredStamps(data);
                    setUniqueVisitors(uniquePersonsThatEnters(data));
                    setInformationOnPage(data.slice(0, itemsInPage));
                }
            }
        };
        fetchClinetStatistic();
    }, [date, dateError]);

    useEffect(() => {
        if (stamps.length > 0) {
            setPage(1);
            const selectedIds = selectedClients.map(client => client.value);
            const filtered = selectedClients.length > 0
                ? stamps.filter(stamp =>
                    selectedIds.includes(stamp.ticket?.user_subscription?.client?.id)
                )
                : stamps;

            const chart = makeDataForChart(filtered, date.startDate, date.endDate);
            setShartData(chart);
            setFilteredStamps(filtered);
            setUniqueVisitors(uniquePersonsThatEnters(filtered));
            setInformationOnPage(filtered.slice(0, itemsInPage));
        } else {
            setShartData(null);
            setInformationOnPage([]);
            setUniqueVisitors(0);
            setFilteredStamps([]);
        }
    }, [stamps, date.startDate, date.endDate, selectedClients]);

    useEffect(() => {
        if (filteredStamps.length > 0) {
            setInformationOnPage(filteredStamps.slice((page - 1) * itemsInPage, page * itemsInPage));
        }
    }, [page, filteredStamps]);

    const handleClient = (selectedOptions) => {
        setPage(1);
        setSelectedClients(selectedOptions);
    }

    console.log(chartData);


    return (
        <>
            <div className="min-h-screen bg-stone-100 flex flex-col">
                <AdminHeader />
                <div className="flex-grow flex justify-center">
                    <div className="max-w-4xl w-full p-4">
                        <Back />
                        <div>
                            <h2 className="text-xl font-bold mb-4">Statistika</h2>
                            <Select 
                                options={clients}
                                value={selectedClients}
                                onChange={handleClient}
                                isMulti={true}
                                noOptionsMessage={() => 'Nav neviena klienta'}
                                
                            />
                            
                            <div className="mb-4 flex gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-800">Sākuma datums</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={date.startDate}
                                        onChange={handleDateChange}
                                        max={todayInLatvia}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800">Beigu datums</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={date.endDate}
                                        onChange={handleDateChange}
                                        max={todayInLatvia}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            {dateError && (
                                <div className="text-red-500 mb-4">
                                    {dateError}
                                </div>
                            )}
                            <div className="bg-white p-2 rounded-lg mb-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Kopējais apmeklējumu skaits:</p>
                                        <p className="text-2xl font-bold">{filteredStamps.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Unikālo apmeklētāju skaits:</p>
                                        <p className="text-2xl font-bold">{uniqueVisitors}</p>
                                    </div>
                                </div>
                            </div>
                            {chartData && (
                                <div className="bg-white p-4 rounded-lg shadow mb-5">
                                    <h3 className="text-lg font-semibold mb-4">{chartData.title}</h3>
                                    <Bar
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        stepSize: 1
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            <ul>
                                {informationOnPage.map((stamps, index) => (
                                    <li key={index} className="bg-white p-2 my-2 rounded shadow">
                                        <div className='flex justify-between'>
                                            <div>
                                                {stamps.ticket?.user_subscription?.client?.name + " " + stamps.ticket?.user_subscription?.client?.surname || 'Nav vārda'}
                                            </div>
                                            <div>
                                                {stamps.ticket?.user_subscription?.subscriptions?.name || 'Nezinams'} aboniments
                                            </div>
                                            <div>
                                                {new Date(stamps.created_at).toISOString().split('T')[0] + " " + new Date(stamps.created_at).toISOString().split('T')[1].split('.')[0]}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Pagination 
                                objects={filteredStamps}
                                page={page}
                                setPage={setPage}
                                itemsInPage={itemsInPage} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}