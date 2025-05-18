import {  useParams } from "react-router-dom";

import Tips from "../../../components/specialPages/Type";

export default function UpdateSubscriptionType() {

    const { id: tyoeId} = useParams();

    return (
        <Tips id={tyoeId}/>
    );

}