import React, { useState } from 'react';
import { ScreenName } from './types';
import Onboarding from './screens/Onboarding';
import Closet from './screens/Closet';
import GeneratedOutfits from './screens/GeneratedOutfits';
import Profile from './screens/Profile';
import Generator from './screens/Generator';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('onboarding');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onNavigate={setCurrentScreen} />;
      case 'closet':
        return <Closet />;
      case 'outfits':
        return <GeneratedOutfits />;
      case 'profile':
        return <Profile />;
      case 'generator':
        return <Generator />;
      default:
        return <Onboarding onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-black/5 flex justify-center">
        {/* Container to restrict max width for desktop view primarily, making it look like a mobile app */}
        <div className="w-full max-w-md bg-white dark:bg-[#101622] min-h-screen relative shadow-2xl overflow-hidden">
            {renderScreen()}
            {currentScreen !== 'onboarding' && (
                <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
            )}
        </div>
    </div>
  );
};

export default App;
