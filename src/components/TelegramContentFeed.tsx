
import React, { useState, useEffect } from 'react';
import { Play, Calendar, Tag, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface TelegramPost {
  id: string;
  messageId: number;
  type: 'video' | 'photo' | 'text' | 'document';
  caption?: string;
  date: string;
  fileId?: string;
  fileUrl?: string;
  thumbnail?: string;
  tags: string[];
  telegramUrl: string;
}

interface TelegramContentFeedProps {
  botToken: string;
  channelId: string;
  className?: string;
}

const TelegramContentFeed: React.FC<TelegramContentFeedProps> = ({
  botToken,
  channelId,
  className = ''
}) => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelPosts = async () => {
    if (!botToken || !channelId) {
      setError('Bot token and channel ID are required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get recent messages from the channel
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=50`);
      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Failed to fetch channel posts');
      }

      // Filter messages from our channel
      const channelMessages = data.result.filter((update: any) => 
        update.channel_post && 
        update.channel_post.chat.id.toString() === channelId
      );

      // Process messages into posts
      const processedPosts = await Promise.all(
        channelMessages.map(async (update: any) => {
          const message = update.channel_post;
          const post: TelegramPost = {
            id: `${message.chat.id}_${message.message_id}`,
            messageId: message.message_id,
            type: 'text',
            caption: message.caption || message.text || '',
            date: new Date(message.date * 1000).toISOString(),
            tags: extractTags(message.caption || message.text || ''),
            telegramUrl: `https://t.me/c/${channelId.replace('-100', '')}/${message.message_id}`
          };

          // Handle different message types
          if (message.video) {
            post.type = 'video';
            post.fileId = message.video.file_id;
            if (message.video.thumbnail) {
              post.thumbnail = await getFileUrl(message.video.thumbnail.file_id);
            }
          } else if (message.photo) {
            post.type = 'photo';
            const largestPhoto = message.photo[message.photo.length - 1];
            post.fileId = largestPhoto.file_id;
            post.fileUrl = await getFileUrl(largestPhoto.file_id);
          } else if (message.document) {
            post.type = 'document';
            post.fileId = message.document.file_id;
            if (message.document.thumbnail) {
              post.thumbnail = await getFileUrl(message.document.thumbnail.file_id);
            }
          }

          return post;
        })
      );

      setPosts(processedPosts.reverse()); // Show newest first
    } catch (err) {
      console.error('Error fetching channel posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = async (fileId: string): Promise<string | undefined> => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
      const data = await response.json();
      
      if (data.ok) {
        return `https://api.telegram.org/file/bot${botToken}/${data.result.file_path}`;
      }
    } catch (error) {
      console.error('Error getting file URL:', error);
    }
    return undefined;
  };

  const extractTags = (text: string): string[] => {
    // Extract hashtags and common keywords
    const hashtags = text.match(/#\w+/g) || [];
    const keywords = [];
    
    // Add some basic content detection
    if (text.toLowerCase().includes('anime')) keywords.push('anime');
    if (text.toLowerCase().includes('video')) keywords.push('video');
    if (text.toLowerCase().includes('new')) keywords.push('new');
    if (text.toLowerCase().includes('premium')) keywords.push('premium');
    
    return [...hashtags, ...keywords].slice(0, 5);
  };

  useEffect(() => {
    fetchChannelPosts();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchChannelPosts, 30000);
    return () => clearInterval(interval);
  }, [botToken, channelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading channel content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-2">❌ {error}</div>
        <button 
          onClick={fetchChannelPosts}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Channel Content</h2>
        <button 
          onClick={fetchChannelPosts}
          className="btn-secondary flex items-center space-x-2"
        >
          <Loader2 className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card 
            key={post.id} 
            className="card-hover overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-0">
              {/* Media Preview */}
              {(post.type === 'video' || post.type === 'photo') && (
                <div className="relative h-48 bg-muted overflow-hidden">
                  {post.type === 'video' && post.thumbnail ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={post.thumbnail} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-black ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : post.type === 'photo' && post.fileUrl ? (
                    <img 
                      src={post.fileUrl} 
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Play className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Caption */}
                {post.caption && (
                  <p className="text-foreground mb-3 line-clamp-3">
                    {post.caption}
                  </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <a 
                    href={post.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Content Yet</h3>
          <p className="text-muted-foreground">
            Upload some content to your Telegram channel to see it here!
          </p>
        </div>
      )}
    </div>
  );
};

export default TelegramContentFeed;
