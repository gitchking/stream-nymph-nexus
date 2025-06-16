
import { useState } from 'react';
import { Flame, TrendingUp, Clock, Star, Globe } from 'lucide-react';
import Header from '../components/Header';
import TelegramContentFeed from '../components/TelegramContentFeed';

const Index = () => {
  const [activeTab, setActiveTab] = useState('trending');

  // Get Telegram credentials from localStorage
  const telegramBotToken = localStorage.getItem('telegram_bot_token') || '7704391228:AAGvi1-1Mg4AttZfzvmmdFwFHefMZaT0zNM';
  const telegramChannelId = localStorage.getItem('telegram_channel_id') || '';

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'featured', label: 'Featured', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="glass-effect rounded-lg p-1">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-punch'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Telegram Content Feed */}
        {telegramChannelId ? (
          <TelegramContentFeed 
            botToken={telegramBotToken}
            channelId={telegramChannelId}
            className="animate-fade-in"
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Telegram Channel Not Configured</h3>
            <p className="text-muted-foreground mb-4">
              Please configure your Telegram channel in the DevTool to see content here.
            </p>
            <a 
              href="/dev-tool" 
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Configure Telegram</span>
            </a>
          </div>
        )}
      </main>

      {/* Blurred Footer */}
      <footer className="footer-blur py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Globe className="w-6 h-6 text-foreground animate-pulse" />
            <span className="font-semibold text-foreground">ProxyHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium streaming platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
