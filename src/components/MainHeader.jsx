import { Link } from 'react-router-dom';


export default function MainHeader(){
    return(
        <header className="py-4 bg-sky-800 text-center">
            <Link to="/" className="text-3xl font-bold text-white">MOOMENTUM</Link>
        </header>
    );
}