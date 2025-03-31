

const filterAllSubscriptions =
{
    "Aktīvie abonimenti" : (subscriptions) => subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) > new Date()),
    "Beigušies abonimenti" : (subscriptions) => subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) <= new Date()),
    "Ar informāciju" : (subscriptions) => subscriptions.filter(sub => sub.user_subscription?.information && sub.user_subscription.information.trim() !== ""),
    "Bez informācijas" : (subscriptions) => subscriptions.filter(sub => !sub.user_subscription?.information || sub.user_subscription.information.trim() === ""),
    "Jaunie" : (subscriptions) => subscriptions.filter(sub => sub.status === "new"),
    "Rejected" : (subscriptions) => subscriptions.filter(sub => sub.status === "rejected"),
    "Accepted" : (subscriptions) => subscriptions.filter(sub => sub.status === "accepted"),
    "Invalid" : (subscriptions) => subscriptions.filter(sub => sub.status === "invalid"),
    "Visi abonimenti" : (subscriptions) => subscriptions
};

export default filterAllSubscriptions;
