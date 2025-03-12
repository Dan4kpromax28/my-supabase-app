
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

import "../styles/MainPage.css";
import Card from './Card';


function MainPage() {
    
    const [subscriptions, setSubscriptions] = useState([]);
  
    
    useEffect(() => {
      const fetchSubscriptions = async () => {
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*'); 
  
          if (error) {
            console.error('Notika kluda:', error);
          } else {
            setSubscriptions(data);
          }
        } catch (err) {
          console.error('Kluda:', err);
        }
      };
  
      fetchSubscriptions(); 
    }, []);
  
    return (
        <div className="min-h-screen flex flex-col bg-stone-100 text-white">

        <header className="py-4 bg-sky-800 text-center">
          <h1 className="text-3xl font-bold">MOOMENTUM</h1>
        </header>
      
        <main className="flex-grow py-8">
          <h2 className="text-gray-950 text-2xl text-center mb-4">Izvele</h2>
          {subscriptions.length === 0 ? (
            <p className="text-center">Notiek ielade</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 justify-items-center">
                {subscriptions.map((sub) => (
                    <Card 
                    key={sub.id}
                    id={sub.id}
                    name={sub.name}
                    description={sub.description}
                    price={sub.price}
                    additional_price={sub.additional_hour_price}
                    />
                ))}
            </ul>
          )}
        </main>
      
        <footer className="py-4 bg-sky-950 text-center">
          <p>© MOOMENTUM</p>
        </footer>
      </div>
    );
  }
  
  export default MainPage;