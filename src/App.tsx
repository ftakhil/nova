import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AIConversation from './components/AIConversation';
import Translation from './components/Translation';
import ImageIdentification from './components/ImageIdentification';
import UserConnect from './components/UserConnect';
import Playground from './components/Playground';
import VisualLearning from './components/VisualLearning';

export type CurrentPage =
  | 'landing'
  | 'dashboard'
  | 'ai-conversation'
  | 'translation'
  | 'image-identification'
  | 'user-connect'
  | 'playground'
  | 'dictionary'
  | 'visual-learning';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('landing');
  const [previousPage, setPreviousPage] = useState<CurrentPage | null>(null);

  const navigateTo = (page: CurrentPage) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'ai-conversation':
        return <AIConversation onNavigate={navigateTo} />;
      case 'translation':
        return <Translation onNavigate={navigateTo} />;
      case 'image-identification':
        return <ImageIdentification onNavigate={navigateTo} />;
      case 'user-connect':
        return <UserConnect onNavigate={navigateTo} />;
      case 'playground':
        return <Playground onQuit={() => previousPage && setCurrentPage(previousPage)} />;
      case 'dictionary':
        return <Translation onNavigate={navigateTo} />;
      case 'visual-learning':
        return <VisualLearning />;
      default:
        return <LandingPage onEnter={() => navigateTo('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;