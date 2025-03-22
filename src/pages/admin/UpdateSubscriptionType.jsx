import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import InputComponent from "../../components/InputComponent";
import Back from "../../components/Back";
import Tips from "../../components/Type";

export default function CreateSubscriptionType() {

    const { id: tyoeId} = useParams();
    

    return (
        <Tips id={tyoeId}/>
    );

}