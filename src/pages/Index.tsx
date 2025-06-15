
import { useState, useEffect } from 'react';
import { Flame, TrendingUp, Clock, Star } from 'lucide-react';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [videos, setVideos] = useState([
    {
      id: '1',
      title: 'Beautiful Animation Collection Vol.1',
      thumbnail: '/placeholder.svg',
      duration: '12:34',
      tags: ['animation', 'collection', 'hd'],
      uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      views: 15420
    },
    {
      id: '2',
      title: 'Premium Series Episode 5',
      thumbnail: '/placeholder.svg', 
      duration: '8:45',
      tags: ['series', 'premium', 'episode'],
      uploadDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      views: 8932
    },
    {
      id: '3',
      title: 'Artistic Masterpiece Collection',
      thumbnail: '/placeholder.svg',
      duration: '15:22',
      tags: ['artistic', 'masterpiece', 'collection'],
      uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      views: 23187
    },
    {
      id: '4',
      title: 'Studio Exclusive Release',
      thumbnail: '/placeholder.svg',
      duration: '20:15',
      tags: ['exclusive', 'studio', 'new'],
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 5643
    },
    {
      id: '5',
      title: 'Classic Collection Remastered',
      thumbnail: '/placeholder.svg',
      duration: '18:30',
      tags: ['classic', 'remastered', 'collection'],
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 12087
    },
    {
      id: '6',
      title: 'Latest Release - High Quality',
      thumbnail: '/placeholder.svg',
      duration: '14:12',
      tags: ['latest', 'hq', 'new'],
      uploadDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      views: 3245
    }
  ]);

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'featured', label: 'Featured', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            HentaiStream.AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium adult content streaming platform with seamless experience and high-quality videos
          </p>
        </div>

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

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <VideoCard {...video} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-primary">
            Load More Videos
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-gradient">HentaiStream.AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Premium adult content streaming platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
