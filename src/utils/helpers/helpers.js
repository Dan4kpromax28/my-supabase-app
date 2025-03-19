


export function formatDate(myDate){
    const date = new Date(myDate);
    return date.toLocaleDateString(navigator.language,  
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );
}