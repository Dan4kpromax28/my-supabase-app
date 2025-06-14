import { useNavigate } from "react-router-dom";


export default function Back(){

const navigate = useNavigate();


const handleBack = () => {
    navigate(-1);
}

    return(
        <button className='w-full bg-sky-50 shadow-md rounded-lg p-4 mb-4 flex hover:bg-sky-100' onClick={() => handleBack()}>
            <h2 className='font-bold text-center'>Atpakaļ</h2>
        </button>
    );
}