
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import useSession from '../hooks/supabaseAPI/useSession';


export default function Wrapper({ children }) {

    const {authentication, loading} = useSession();

    if (loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-100">
                <div className="text-gray-600">Notiek ielade...</div>
            </div>
        );

    } else {
        if (authentication){
            return children;
        }
        return <Navigate to="/admin/login" />
    }

        

};

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
};