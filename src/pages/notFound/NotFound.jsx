import AdminHeader from "../../components/pageComponents/headers/AdminHeader";
import MainHeader from "../../components/pageComponents/headers/MainHeader";
import useSession from "../../hooks/supabaseAPI/useSession";


export default function NotFound(){



    const {authentication, loading} = useSession();


    if (authentication) {
        return(
            <>
                <AdminHeader />
                <div className="flex items-center justify-center h-screen">
                    <div className="w-6/12">
                        <img src="../../../public/images/Not_found.png" className="w-full"/>
                    </div>
                </div>

            </>
        );
    }

    else{
        return(
            <>
                <MainHeader />
                <div className="flex items-center justify-center h-screen">
                    <div className="w-6/12">
                        <img src="../../../public/images/Not_found.png" className="w-full"/>
                    </div>
    
                </div>
            </>
        );

    }



    
}