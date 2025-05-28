export const checkDayDifference = (startDate, endDate) => {
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

export const makeDataForChart = (stamps, startDate, endDate) => {
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
        const start = new Date(startDate);
        for (let i = 0; i <= dayDifference; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            labels.push(date.toISOString().split('T')[0]);
        }
        data = new Array(labels.length).fill(0);
        stamps.forEach(stamp => {
            const stampDate = new Date(stamp.created_at).toISOString().split('T')[0];
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

    return {
        labels,
        datasets: [{
            label: 'Apmeklējumu skaits',
            data: data,
            tension: 0.1,
            fill: false
        }],
        title
    };
};

export const uniquePersonsThatEnters = (data) => {
    const uniqueClients = new Set();
    data.forEach(stamp => {
        const clientId = stamp.ticket?.user_subscription?.client?.id;
        if (clientId) {
            uniqueClients.add(clientId);
        }
    });
    return uniqueClients.size;
}; 