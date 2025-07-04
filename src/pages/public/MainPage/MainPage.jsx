

import CustomSlider from '../../../components/productsCard/CustomSlider';
import MainHeader from '../../../components/pageComponents/headers/MainHeader'
import MainFooter from '../../../components/pageComponents/footers/MainFooter';
import useAllSubscription from '../../../hooks/supabaseAPI/useAllSubscription';


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
  