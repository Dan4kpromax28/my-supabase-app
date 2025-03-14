
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom'



export default function Dashboard(){

    const navigate = useNavigate();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.log("Notika kluda");
        navigate("/admin/login");

    };

    return (
        <button
        onClick={signOut}>
            Sign out
        </button>
    );
}