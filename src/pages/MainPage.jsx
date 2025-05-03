
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';


import Card from '../components/Card';
import CustomSlider from '../components/CustomSlider';
import MainHeader from '../components/MainHeader'
import MainFooter from '../components/MainFooter';
import useAllSubscription from '../hooks/supabaseAPI/useAllSubscription';


export default function MainPage() {
    
    const {subscriptions} = useAllSubscription();
  
  
    return (
        <div className="min-h-screen flex flex-col bg-stone-100 text-white">
            <MainHeader />
            <main className="flex-grow py-8">
                <h2 className="text-gray-950 text-2xl text-center mb-4">Izvele</h2>
                { subscriptions.length === 0 ? (
                    <p className="text-center">Notiek ielade</p>
                ) : (
                <CustomSlider subscriptions={subscriptions} />
                )}
            </main>
        
            <MainFooter />
        </div>
    );
  }
  