import Users from "../../../components/specialPages/Users";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/helpers/supabase/supabase";
import useClient from "../../../hooks/supabaseAPI/useClient";

export default function EditClient(){
    const {client} = useClient();
    

    

    return (

            <Users 
                name={client?.name}
                surname={client?.surname}
                email={client?.email}
                phone={client?.phone_number}
                tips="update"
            />
    );
}