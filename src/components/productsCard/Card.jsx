import React from 'react';
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';

export default function Card({ id, name, description, price, additional_price}) {

    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/pakalpojums/${id}`, {
            state: { id }
          });
    };

  return (
    <li key={id} className="card-item h-95 w-full">
    <div className="flex flex-col h-full">
        <div className="bg-white border border-gray-100 rounded-t-lg shadow-t-lg p-4 flex-grow">
        {name && (
            <h3 className="mb-2 text-2xl font-bold text-gray-900 text-center">
                {name}
            </h3>
        )}
        {description && (
            <p className="mb-3 font-normal text-gray-700">
                {description}
            </p>
        )}
        </div>
        <div className="bg-gray-200 rounded-b-lg p-4">
            {price && (
                <p className="pt-3 pb-3 font-normal text-gray-700 text-center">
                    Cena: {price}
                </p>
            )}
            {additional_price && (
                <p className="pb-3 font-normal text-gray-700 text-center">
                    Par katru nākamo stundu: {additional_price} eiro.
                </p>
            )}
            <div className="flex justify-center items-center">
                <button
                    onClick={handleClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 mb-6">
                        Izvēlēties
                </button>
            </div>
        </div>
    </div>
    </li>
    );
}

Card.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    additional_price: PropTypes.number.isRequired
};
