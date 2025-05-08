


export default function AllSub({sub}){

    return (
        <li key={sub.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50">
            <div>
                <h3 className="font-bold text-lg">{sub.id}</h3>
                <p className="text-sm text-gray-600">{sub.subscription?.name}</p>
                <p className="text-sm text-gray-600">{sub.time}</p>
            </div>
        </li>
    );

}