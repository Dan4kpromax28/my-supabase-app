

const filterAllSubscriptions =
{
    "Aktīvie abonimenti" : (subscriptions) => subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) > new Date()),
    "Beigušies abonimenti" : (subscriptions) => subscriptions.filter(sub => new Date(sub.user_subscription?.end_date) <= new Date()),
    "Ar informāciju" : (subscriptions) => subscriptions.filter(sub => sub.user_subscription?.information && sub.user_subscription.information.trim() !== ""),
    "Bez informācijas" : (subscriptions) => subscriptions.filter(sub => !sub.user_subscription?.information || sub.user_subscription.information.trim() === ""),
    "Jaunie" : (subscriptions) => subscriptions.filter(sub => sub.status === "new"),
    "Noraidīts" : (subscriptions) => subscriptions.filter(sub => sub.status === "rejected"),
    "Pieņemts" : (subscriptions) => subscriptions.filter(sub => sub.status === "accepted"),
    "Derīgs" : (subscriptions) => subscriptions.filter(sub => sub.status === "valid"),
    "Invalid" : (subscriptions) => subscriptions.filter(sub => sub.status === "invalid"),
    "Nederīgs" : (subscriptions) => subscriptions
};

export default filterAllSubscriptions;
