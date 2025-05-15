



export default function useProfile(){
    const [message, setMessage] = useState();

    const [newPassword, setNewPassword] = useState({
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const {  error } = await supabase.auth.updateUser(
            { password: newPassword.password }
        )

        if (error) {
            setMessage("Notika kluda");
        } else {    
            setMessage("Parole vieksmigi izmainita")
        }
        setNewPassword({password: ''});
           
    };


    return {handleSubmit}
}