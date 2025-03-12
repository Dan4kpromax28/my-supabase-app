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
            console.error('Ошибка при получении подписок:', error);
          } else {
            setSubscriptions(data);
          }
        } catch (err) {
          console.error('Ошибка:', err);
        }
      };
  
      fetchSubscriptions(); 
    }, []);
  
    return (
    <div className="full">
      <div className="main-page">
        <header className="header">
          <h1>MOOMENTUM</h1>
        </header>
  
        <main className="content">
          <h2>Izvele</h2>
          {subscriptions.length === 0 ? (
            <p>Notiek ielade</p>
          ) : (
            <ul className="subscriptions-list">
              {subscriptions.map((sub) => (
                <Card 
                  key={sub.id}
                  id={sub.id}
                  name={sub.name}
                  description={sub.description}
                  price={sub.price}
                />
              ))}
            </ul>
          )}
        </main>
        <footer className="footer">
          <p>© MOOMENTUM</p>
        </footer>
      </div>
      </div>
    );
  }
  
  export default MainPage;