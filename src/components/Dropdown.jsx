import { useState } from "react";

export default function Dropdown({options, onSelect, selected}) {
    const [open, setOpen] = useState(false);


    const handleSelect = (option) => {
        onSelect?.(option);
        setOpen(false);
    };
    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={() => setOpen(!open)} 
                className="inline-flex items-center bg-sky-700 hover:bg-sky-800 text-white text-sm rounded-lg px-5 py-2.5"
            >
                {selected}
            </button>
            {open && (
                <div className="absolute mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        {options.map((option, index) => (
                            <li key={index} onClick={() => handleSelect(option)} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {option}
                            </li>



                        ))}
                        
                    </ul>
                </div>
            )}
        </div>
    );
}