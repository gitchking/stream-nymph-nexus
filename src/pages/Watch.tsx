
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share, Heart, Download, Flag, Tag, Eye, Clock } from 'lucide-react';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState({
    id: '1',
    title: 'Beautiful Animation Collection Vol.1', 
    description: 'A stunning collection of high-quality animations featuring premium content with exceptional detail and artistic excellence.',
    telegramUrl: 'https://t.me/example',
    tags: ['animation', 'collection', 'hd', 'premium', 'artistic'],
    uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    views: 15420,
    duration: '12:34',
    likes: 1247
  });

  const [relatedVideos] = useState([
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
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-punch">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm opacity-80">Video Player</p>
                  <p className="text-xs opacity-60 mt-1">Telegram integration will be implemented</p>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {video.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{video.likes.toLocaleString()} likes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2 text-red-600">
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?tag=${tag}`}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div key={relatedVideo.id} className="transform scale-95">
                  <VideoCard {...relatedVideo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
