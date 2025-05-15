import AdminHeader from '../../components/AdminHeader';
import Back from '../../components/Back';
import { Bar } from 'react-chartjs-2';
import Pagination from '../../components/Pagination';
import Select from 'react-select';
import useStatistic from '../../hooks/supabaseAPI/useStatistic';

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

export default function AdminStatistic() {
    const {
        page,
        setPage,
        itemsInPage,
        informationOnPage,
        clients,
        selectedClients,
        date,
        dateError,
        uniqueVisitors,
        chartData,
        handleDateChange,
        handleClient,
        filteredStamps
    } = useStatistic();

    const todayInLatvia = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'Europe/Riga'
    });

    return (
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
                                    <label className="block text-sm font-medium text-gray-800" htmlFor='startDate'>Sākuma datums</label>
                                    <input
                                        id='startDate'
                                        type="date"
                                        name="startDate"
                                        value={date.startDate}
                                        onChange={handleDateChange}
                                        max={todayInLatvia}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800" htmlFor='endDate'>Beigu datums</label>
                                    <input
                                        id='endDate'
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
                                                    display: true
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
                                {informationOnPage.map((stamps) => (
                                    <li key={stamps.id} className="bg-white p-2 my-2 rounded shadow">
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
    );
}