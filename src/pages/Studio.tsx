
import { useState } from 'react';
import { Upload, Calendar, MessageSquare, Video, Image, FileText, Bot, Send, Clock, Plus, Save, Eye, Settings } from 'lucide-react';
import Header from '../components/Header';

const Studio = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoTags, setVideoTags] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChannelId, setTelegramChannelId] = useState('');

  const handleVideoUpload = async (file: File) => {
    // Mock upload functionality
    console.log('Uploading video:', file.name);
    alert(`Video "${file.name}" uploaded successfully!`);
  };

  const handleTelegramUpload = async (file: File) => {
    if (!telegramBotToken || !telegramChannelId) {
      alert('Please configure Telegram bot token and channel ID first');
      return;
    }

    const formData = new FormData();
    formData.append('chat_id', telegramChannelId);
    formData.append('document', file);
    formData.append('caption', `Uploaded from ProxyHub Studio: ${file.name}`);

    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendDocument`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('File uploaded to Telegram successfully!');
      } else {
        alert('Failed to upload to Telegram');
      }
    } catch (error) {
      console.error('Telegram upload error:', error);
      alert('Error uploading to Telegram');
    }
  };

  const autoGenerateTags = async (title: string, description: string) => {
    // Mock AI tagging - in real implementation, use HuggingFace API
    const text = `${title} ${description}`;
    const mockTags = ['video', 'content', 'premium'];
    
    if (text.toLowerCase().includes('animation')) mockTags.push('animation');
    if (text.toLowerCase().includes('tutorial')) mockTags.push('tutorial');
    if (text.toLowerCase().includes('game')) mockTags.push('gaming');
    if (text.toLowerCase().includes('art')) mockTags.push('art');
    
    setVideoTags(mockTags.slice(0, 5).join(', '));
  };

  const handleSaveVideo = () => {
    const videoData = {
      title: videoTitle,
      description: videoDescription,
      tags: videoTags.split(',').map(tag => tag.trim()),
      scheduledDate: isScheduled ? scheduledDate : null,
      status: isScheduled && new Date(scheduledDate) > new Date() ? 'scheduled' : 'active'
    };

    console.log('Saving video:', videoData);
    alert('Video saved successfully!');
  };

  const tabs = [
    { id: 'upload', label: 'Upload Video', icon: Upload },
    { id: 'telegram', label: 'Telegram Storage', icon: MessageSquare },
    { id: 'schedule', label: 'Scheduled Content', icon: Calendar },
    { id: 'settings', label: 'Studio Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient">Content Studio</h1>
          <p className="text-muted-foreground">Upload and manage your video content</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slide-up overflow-x-auto">
          <div className="glass-effect rounded-lg p-1 inline-flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Video Upload */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-6">Upload New Video</h2>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors mb-6">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Video File</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop your video file or click to browse</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleVideoUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="btn-primary cursor-pointer inline-flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Choose Video File</span>
                  </label>
                </div>

                {/* Video Details Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Video Title</label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Enter video title..."
                        className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                      <textarea
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Enter video description..."
                        rows={4}
                        className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={videoTags}
                          onChange={(e) => setVideoTags(e.target.value)}
                          placeholder="Enter tags separated by commas..."
                          className="flex-1 px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                          onClick={() => autoGenerateTags(videoTitle, videoDescription)}
                          className="btn-secondary"
                        >
                          Auto-Tag
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Thumbnail</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                        <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload custom thumbnail</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="btn-secondary cursor-pointer inline-flex items-center space-x-2 text-sm">
                          <Image className="w-3 h-3" />
                          <span>Choose Image</span>
                        </label>
                      </div>
                    </div>

                    {/* Schedule Options */}
                    <div>
                      <label className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={isScheduled}
                          onChange={(e) => setIsScheduled(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-foreground">Schedule for later</span>
                      </label>
                      {isScheduled && (
                        <input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSaveVideo}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Video</span>
                      </button>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telegram' && (
            <div className="space-y-6">
              {/* Telegram Configuration */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <div className="flex items-center space-x-2 mb-4">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold text-foreground">Telegram Storage Setup</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bot Token</label>
                    <input
                      type="password"
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      placeholder="Enter your Telegram bot token..."
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Channel ID</label>
                    <input
                      type="text"
                      value={telegramChannelId}
                      onChange={(e) => setTelegramChannelId(e.target.value)}
                      placeholder="Enter your channel ID..."
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <button className="btn-primary mt-4 flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Test Connection</span>
                </button>
              </div>

              {/* Telegram Upload */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upload to Telegram</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">Upload Files to Telegram</h4>
                  <p className="text-sm text-muted-foreground mb-4">Files will be stored in your Telegram channel for CDN use</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(handleTelegramUpload);
                      }
                    }}
                    className="hidden"
                    id="telegram-studio-upload"
                  />
                  <label htmlFor="telegram-studio-upload" className="btn-primary cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Files</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Scheduled Content</h2>
              
              {/* Scheduled Videos List */}
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Premium Animation Series Ep. 10</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for: January 20, 2024 at 3:00 PM</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-500">Pending</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="btn-secondary text-sm">Edit</button>
                    <button className="btn-primary text-sm">Publish Now</button>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Tutorial: Advanced Techniques</h3>
                    <p className="text-sm text-muted-foreground">Scheduled for: January 22, 2024 at 12:00 PM</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-500">Pending</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="btn-secondary text-sm">Edit</button>
                    <button className="btn-primary text-sm">Publish Now</button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Schedule New Content</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Studio Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Video Quality</label>
                  <select className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option>1080p (Recommended)</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Auto-publish scheduled content</label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-muted-foreground">Automatically publish content when scheduled time arrives</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content Backup</label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-muted-foreground">Automatically backup uploads to Telegram storage</span>
                  </label>
                </div>

                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Studio;
