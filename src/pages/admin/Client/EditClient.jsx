import Users from "../../../components/specialPages/Users";

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