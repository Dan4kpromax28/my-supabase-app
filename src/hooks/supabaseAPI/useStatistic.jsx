import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { makeDataForChart, uniquePersonsThatEnters } from '../../utils/statisticUtils';


export default function useStatistic() {
    const [page, setPage] = useState(1);
    const itemsInPage = 10;
    const [informationOnPage, setInformationOnPage] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [stamps, setStamps] = useState([]);
    const [filteredStamps, setFilteredStamps] = useState([]);
    const [date, setDate] = useState({
        startDate: new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' }),
        endDate: new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Riga' })
    });
    const [dateError, setDateError] = useState('');
    const [uniqueVisitors, setUniqueVisitors] = useState(0);
    const [chartData, setChartData] = useState(null);

    const fetchClients = async () => {
        const {data, error} = await supabase
            .from('client')
            .select('id, name, surname')
            .order('name', {ascending: false});

        if (error) {
            console.log('Notika kluda');
        }
        else {
            const clientsForSelector = data.map(client => ({
                value: client.id,
                label: `${client.name} ${client.surname}`
            }));
            setClients(clientsForSelector);
        }
    };

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

    const handleClient = (selectedOptions) => {
        setPage(1);
        setSelectedClients(selectedOptions);
    };

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
                    setChartData(null);
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
            setChartData(chart);
            setFilteredStamps(filtered);
            setUniqueVisitors(uniquePersonsThatEnters(filtered));
            setInformationOnPage(filtered.slice(0, itemsInPage));
        } else {
            setChartData(null);
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

    return {
        page,
        setPage,
        itemsInPage,
        informationOnPage,
        clients,
        selectedClients,
        stamps,
        filteredStamps,
        date,
        dateError,
        uniqueVisitors,
        chartData,
        handleDateChange,
        handleClient
    };
}