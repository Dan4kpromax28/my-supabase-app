import React from 'react';
import PropTypes from 'prop-types';


export default function InputComponent({ 
    label, 
    type = "text", 
    id, 
    placeholder, 
    required = true,
    value,
    onChange
}) {
    return (
        <div className="mb-5">
            <label 
                htmlFor={id} 
                className="block mb-1 text-sm font-medium text-gray-900"
            >
                {label}:
            </label>
            <input 
                type={type}
                id={id}
                name={id}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required={required}
                value={value || ""}
                onChange={onChange}
            />
        </div>
    );
}

InputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    placeholder: PropTypes.string.isRequired,
    required: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
};