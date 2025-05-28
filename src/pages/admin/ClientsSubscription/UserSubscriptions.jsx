import { useParams } from "react-router-dom";
import Subscriptions from "../../../components/specialPages/Subscriptions";



export default function UserSubscriptions(){

    
    const { id: userId} = useParams();

    return(
        <Subscriptions userId={userId}/>
    );
}
   