import PropTypes from 'prop-types';

export default function Pagination({ objects, page, setPage, itemsInPage }) {
    const allPages = Math.ceil(objects.length / itemsInPage);

    const setFirstPage = () => {
        setPage(1);
    }

    const setLastPage = () => {
        setPage(allPages);
    }

    const setNextPage = () => {
        if (page < allPages) {
            setPage(page + 1);
        }
    }

    const setPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={setFirstPage} disabled={page === 1} className={`px-3 py-1 rounded-md ${
                        page === 1 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Pirmā lapa {1}
                </button>
                <button
                    onClick={setPreviousPage} disabled={page === 1} className={`px-3 py-1 rounded-md ${
                        page === 1 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {'<'}
                </button>
                <div className='px-3 py-1 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed'>
                    {page}

                </div>
                
                

                <button
                    onClick={setNextPage} disabled={page === allPages} className={`px-3 py-1 rounded-md ${
                        page === allPages 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {'>'}
                </button>
                <button
                    onClick={setLastPage} disabled={page === allPages} className={`px-3 py-1 rounded-md ${
                        page === allPages 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Pēdējā lapa  {allPages === 0 ?  1 : allPages}
                </button>
            </div>
            
        </div>
    );
}

Pagination.propTypes = {
    objects: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    itemsInPage: PropTypes.number.isRequired
};