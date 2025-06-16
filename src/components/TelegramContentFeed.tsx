
import { useState, useEffect } from 'react';
import { Play, Calendar, Eye, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useTelegramAPI } from '../hooks/useTelegramAPI';

interface TelegramContentFeedProps {
  channelId: string;
}

interface TelegramPost {
  message_id: number;
  date: number;
  text?: string;
  caption?: string;
  video?: {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    duration: number;
    file_size?: number;
    mime_type?: string;
    thumbnail?: {
      file_id: string;
      width: number;
      height: number;
      file_size?: number;
    };
  };
  photo?: Array<{
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
  }>;
  document?: {
    file_id: string;
    file_unique_id: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
    thumbnail?: {
      file_id: string;
      width: number;
      height: number;
      file_size?: number;
    };
  };
}

const TelegramContentFeed = ({ channelId }: TelegramContentFeedProps) => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { callTelegramAPI } = useTelegramAPI();

  const fetchChannelPosts = async () => {
    if (!channelId) {
      setError('Channel ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get recent updates
      const result = await callTelegramAPI({
        method: 'getChatHistory',
        channelId: channelId
      });

      if (result.ok && result.result) {
        // Filter for channel posts
        const channelPosts = result.result
          .filter((update: any) => update.channel_post)
          .map((update: any) => update.channel_post)
          .sort((a: any, b: any) => b.date - a.date);

        setPosts(channelPosts);
        
        if (channelPosts.length === 0) {
          setError('No recent posts found. Try uploading some content to your channel!');
        }
      } else {
        setError(result.description || 'Failed to fetch channel posts');
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelPosts();
  }, [channelId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTelegramFileUrl = (fileId: string) => {
    // Note: This would need the bot token, which should be handled server-side
    return `https://api.telegram.org/file/bot<BOT_TOKEN>/${fileId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading channel content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border/50">
        <div className="flex items-center space-x-3 text-red-500 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-medium">Unable to load content</h3>
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Make sure your bot token is configured in Supabase secrets</p>
          <p>• Verify your channel ID is correct (should start with -100)</p>
          <p>• Ensure the bot is added as an admin to your channel</p>
          <p>• Try uploading some content to your Telegram channel first</p>
        </div>
        <button 
          onClick={fetchChannelPosts}
          className="btn-primary mt-4 flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center border border-border/50">
        <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Content Yet</h3>
        <p className="text-muted-foreground mb-4">Upload some content to your Telegram channel to see it here!</p>
        <button 
          onClick={fetchChannelPosts}
          className="btn-secondary flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Channel Content</h2>
          <p className="text-muted-foreground">{posts.length} posts loaded from your Telegram channel</p>
        </div>
        <button 
          onClick={fetchChannelPosts}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.message_id} className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Media Preview */}
            {post.video && (
              <div className="aspect-video bg-muted/50 flex items-center justify-center relative">
                <Play className="w-12 h-12 text-white/80" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(post.video.duration / 60)}:{String(post.video.duration % 60).padStart(2, '0')}
                </div>
              </div>
            )}
            
            {post.photo && post.photo.length > 0 && (
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                <Eye className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            {!post.video && !post.photo && (
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {/* Caption/Text */}
              {(post.caption || post.text) && (
                <p className="text-foreground mb-3 line-clamp-3">
                  {post.caption || post.text}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.date)}</span>
                </span>
                
                <a
                  href={`https://t.me/c/${channelId.replace('-100', '')}/${post.message_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View</span>
                </a>
              </div>

              {/* File info */}
              {post.video && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Video • {post.video.width}x{post.video.height}
                  {post.video.file_size && ` • ${(post.video.file_size / (1024 * 1024)).toFixed(1)} MB`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramContentFeed;
