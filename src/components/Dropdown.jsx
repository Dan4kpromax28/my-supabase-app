import { useState } from "react";

export default function Dropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={() => setOpen(!open)} 
                className="inline-flex items-center bg-sky-700 hover:bg-sky-800 text-white text-sm rounded-lg px-5 py-2.5"
            >
                Menu
            </button>
            {open && (
                <div className="absolute mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Visi
                        </li>
                        <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Citi
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}