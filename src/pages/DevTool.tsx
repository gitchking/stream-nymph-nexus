import { useState, useEffect } from 'react';
import { Lock, Shield, Database, Users, BarChart3, Download, Edit, Trash2, Eye, Upload, Settings, MessageSquare, Cloud, Plus, FileText, Image, Video, Send, Bot, Check, X, Play } from 'lucide-react';
import Header from '../components/Header';
import TelegramContentFeed from '../components/TelegramContentFeed';
import VideoUploadModal from '../components/VideoUploadModal';

const DevTool = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('library');
  const [error, setError] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('7704391228:AAGvi1-1Mg4AttZfzvmmdFwFHefMZaT0zNM');
  const [telegramChannelId, setTelegramChannelId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [telegramConnectionStatus, setTelegramConnectionStatus] = useState('');
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);

  const correctPassword = 'Daman@2005';

  // Load saved Telegram credentials from localStorage and set the provided token
  useEffect(() => {
    const savedChannelId = localStorage.getItem('telegram_channel_id');
    if (savedChannelId) setTelegramChannelId(savedChannelId);
    
    // Auto-save the provided token
    localStorage.setItem('telegram_bot_token', telegramBotToken);
    setTelegramConnectionStatus('✅ Bot token has been set! Please add your channel ID and test the connection.');
    setTimeout(() => setTelegramConnectionStatus(''), 5000);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const saveTelegramCredentials = () => {
    localStorage.setItem('telegram_bot_token', telegramBotToken);
    localStorage.setItem('telegram_channel_id', telegramChannelId);
    setTelegramConnectionStatus('✅ Credentials saved successfully!');
    setTimeout(() => setTelegramConnectionStatus(''), 3000);
  };

  const testTelegramConnection = async () => {
    if (!telegramBotToken) {
      setTelegramConnectionStatus('❌ Please enter bot token first');
      return;
    }

    try {
      setTelegramConnectionStatus('🔄 Testing connection...');
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setTelegramConnectionStatus(`✅ Connected to bot: ${data.result.first_name} (@${data.result.username})`);
        
        // If channel ID is provided, test sending a message
        if (telegramChannelId) {
          setTimeout(async () => {
            try {
              const testResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: telegramChannelId,
                  text: '🔧 DevTool connection test successful!'
                })
              });
              
              const testData = await testResponse.json();
              if (testData.ok) {
                setTelegramConnectionStatus(`✅ Bot and channel verified! Ready to upload content.`);
              } else {
                setTelegramConnectionStatus(`⚠️ Bot connected but channel access failed: ${testData.description}`);
              }
            } catch (error) {
              setTelegramConnectionStatus('⚠️ Bot connected but channel test failed');
            }
          }, 1000);
        }
      } else {
        setTelegramConnectionStatus(`❌ Invalid bot token: ${data.description}`);
      }
    } catch (error) {
      setTelegramConnectionStatus('❌ Connection failed - Check your internet connection');
    }
    
    setTimeout(() => setTelegramConnectionStatus(''), 8000);
  };

  const handleTelegramUpload = async (file: File) => {
    if (!telegramBotToken || !telegramChannelId) {
      alert('❌ Please configure and save both Telegram bot token and channel ID first');
      return;
    }

    // Validate file size (50MB Telegram limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`❌ ${file.name} is too large. Telegram limit is 50MB per file`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('chat_id', telegramChannelId);
    formData.append('document', file);
    formData.append('caption', `📎 ${file.name}\n📱 Uploaded from ProxyHub DevTool\n📅 ${new Date().toLocaleString()}\n💾 Size: ${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendDocument`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Upload successful:', result);
        
        // Update mock files list
        const newFile = {
          id: Date.now().toString(),
          fileName: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          type: file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'document',
          telegramUrl: result.result.document ? 
            `https://t.me/c/${telegramChannelId.replace('-100', '')}/${result.result.message_id}` : 
            '#',
          fileId: result.result.document?.file_id || 'N/A'
        };
        
        mockTelegramFiles.unshift(newFile);
        
        alert(`✅ File uploaded successfully!\n📎 File: ${file.name}\n🆔 File ID: ${newFile.fileId}\n🔗 Message ID: ${result.result.message_id}`);
      } else {
        const errorData = await response.json();
        console.error('❌ Upload failed:', errorData);
        alert(`❌ Upload failed: ${errorData.description || 'Unknown error'}\n\nTip: Make sure the bot is added to your channel as an admin.`);
      }
    } catch (error) {
      console.error('❌ Telegram upload error:', error);
      alert('❌ Error uploading to Telegram. Please check:\n• Your internet connection\n• Bot token is correct\n• Channel ID is correct\n• Bot is admin in the channel');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (files: FileList | null, type?: 'video' | 'image') => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      // Validate file type if specified
      if (type === 'video' && !file.type.startsWith('video/')) {
        alert(`❌ ${file.name} is not a video file`);
        continue;
      }
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert(`❌ ${file.name} is not an image file`);
        continue;
      }

      await handleTelegramUpload(file);
      
      // Add small delay between uploads to prevent rate limiting
      if (files.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const exportData = (type: string) => {
    let data: any;
    let filename: string;
    let mimeType = 'application/json';

    switch (type) {
      case 'videos':
        data = mockVideos;
        filename = 'videos_export.json';
        break;
      case 'users':
        // Convert to CSV format
        const headers = 'ID,Email,Role,Join Date,Status\n';
        const csvData = mockUsers.map(user => 
          `${user.id},${user.email},${user.role},${user.joinDate},${user.status}`
        ).join('\n');
        data = headers + csvData;
        filename = 'users_export.csv';
        mimeType = 'text/csv';
        break;
      case 'telegram':
        data = mockTelegramFiles;
        filename = 'telegram_files_export.json';
        break;
      case 'database':
        data = { 
          videos: mockVideos, 
          users: mockUsers, 
          telegramFiles: mockTelegramFiles,
          exportDate: new Date().toISOString()
        };
        filename = 'full_database_export.json';
        break;
      default:
        return;
    }

    const content = mimeType === 'application/json' ? JSON.stringify(data, null, 2) : data;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Exported ${type} data to ${filename}`);
  };

  // Mock data with enhanced structure
  const mockVideos = [
    { id: '1', title: 'Beautiful Animation Collection Vol.1', views: 15420, uploadDate: '2024-01-15', status: 'active', size: '245 MB' },
    { id: '2', title: 'Premium Series Episode 5', views: 8932, uploadDate: '2024-01-14', status: 'active', size: '380 MB' },
    { id: '3', title: 'Artistic Masterpiece Collection', views: 23187, uploadDate: '2024-01-13', status: 'pending', size: '512 MB' },
    { id: '4', title: 'Studio Exclusive Release', views: 5643, uploadDate: '2024-01-12', status: 'active', size: '298 MB' },
  ];

  const mockUsers = [
    { id: '1', email: 'user1@example.com', joinDate: '2024-01-10', status: 'active', role: 'user' },
    { id: '2', email: 'user2@example.com', joinDate: '2024-01-08', status: 'active', role: 'premium' },
    { id: '3', email: 'user3@example.com', joinDate: '2024-01-05', status: 'inactive', role: 'user' },
    { id: '4', email: 'admin@example.com', joinDate: '2024-01-01', status: 'active', role: 'admin' },
  ];

  const mockTelegramFiles = [
    { id: '1', fileName: 'sample_video.mp4', size: '245 MB', uploadDate: '2024-01-15', type: 'video', telegramUrl: 'https://t.me/c/123456/1', fileId: 'BAADBAADqwADBREAAYag2DP7l26UWBYECgQ' },
    { id: '2', fileName: 'thumbnail_001.jpg', size: '2.1 MB', uploadDate: '2024-01-15', type: 'image', telegramUrl: 'https://t.me/c/123456/2', fileId: 'BAADBAADrAADBREAAYag2DP7l26UWBYECgQ' },
    { id: '3', fileName: 'documentation.pdf', size: '5.3 MB', uploadDate: '2024-01-14', type: 'document', telegramUrl: 'https://t.me/c/123456/3', fileId: 'BAADBAADsAADBREAAYag2DP7l26UWBYECgQ' },
  ];

  const stats = {
    totalVideos: mockVideos.length,
    totalViews: mockVideos.reduce((sum, video) => sum + video.views, 0),
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(user => user.status === 'active').length,
    telegramFiles: mockTelegramFiles.length,
    storageUsed: '2.1 GB'
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background bg-grid-pattern">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-punch border border-border/50 animate-fade-in">
              {/* Lock Icon */}
              <div className="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                Control Panel Access
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                This area is restricted. Please enter the password to continue.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter control panel password..."
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Access Control Panel</span>
                </button>
              </form>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 This page is password protected for security purposes
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Control Panel</h1>
            <p className="text-muted-foreground">Manage all website content and users</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 animate-slide-up">
          <div className="bg-card rounded-lg p-4 shadow-punch border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.totalVideos}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-punch border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-punch border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-punch border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow-punch border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.storageUsed}</p>
                <p className="text-xs text-muted-foreground">Storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slide-up overflow-x-auto">
          <div className="glass-effect rounded-lg p-1 inline-flex min-w-max">
            {[
              { id: 'library', label: 'Library', icon: Play },
              { id: 'videos', label: 'Videos', icon: Database },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'telegram', label: 'Telegram Config', icon: MessageSquare },
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
          {activeTab === 'library' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Content Library</h2>
                  <p className="text-muted-foreground">Live content from your Telegram channel</p>
                </div>
                <button 
                  onClick={() => setIsVideoUploadModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </button>
              </div>

              {/* Telegram Content Feed */}
              <TelegramContentFeed 
                botToken={telegramBotToken}
                channelId={telegramChannelId}
              />
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Video Management</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Title</th>
                      <th className="text-left p-4 font-medium text-foreground">Views</th>
                      <th className="text-left p-4 font-medium text-foreground">Upload Date</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockVideos.map((video) => (
                      <tr key={video.id} className="border-t border-border hover:bg-muted/20">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{video.title}</p>
                          <p className="text-sm text-muted-foreground">ID: {video.id}</p>
                        </td>
                        <td className="p-4 text-muted-foreground">{video.views.toLocaleString()}</td>
                        <td className="p-4 text-muted-foreground">{video.uploadDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            video.status === 'active' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {video.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-foreground">Role</th>
                      <th className="text-left p-4 font-medium text-foreground">Join Date</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-t border-border hover:bg-muted/20">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'premium' 
                              ? 'bg-purple-500/10 text-purple-500' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'telegram' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-foreground">Telegram Bot Configuration</h2>
              </div>
              
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  🤖 <strong>Bot Token:</strong> Already configured and saved!<br/>
                  📋 <strong>Next step:</strong> Add your channel ID below and test the connection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bot Token</label>
                  <input
                    type="password"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="Enter your Telegram bot token..."
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Token from @BotFather</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Channel ID</label>
                  <input
                    type="text"
                    value={telegramChannelId}
                    onChange={(e) => setTelegramChannelId(e.target.value)}
                    placeholder="-1001234567890"
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Your private channel ID (must start with -100)</p>
                </div>
              </div>
              
              {telegramConnectionStatus && (
                <div className={`p-3 rounded-lg mb-4 border ${
                  telegramConnectionStatus.includes('✅') ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                  telegramConnectionStatus.includes('❌') || telegramConnectionStatus.includes('⚠️') ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                  'bg-blue-500/10 text-blue-600 border-blue-500/20'
                }`}>
                  {telegramConnectionStatus}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={saveTelegramCredentials}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Credentials</span>
                </button>
                <button 
                  onClick={testTelegramConnection}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Upload Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setIsVideoUploadModalOpen(true)}
                >
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Videos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload videos directly to your Telegram channel</p>
                  <div className="btn-primary inline-flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Choose Videos</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Images</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload thumbnails and images</p>
                  <div className="btn-primary inline-flex items-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span>Choose Images</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Website Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Site Title</label>
                    <input
                      type="text"
                      defaultValue="ProxyHub"
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Max Upload Size (MB)</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Admin Password</label>
                  <input
                    type="password"
                    placeholder="Change admin password..."
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button className="btn-primary">Save Settings</button>
                  <button className="btn-secondary">Reset to Default</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Video Upload Modal */}
      <VideoUploadModal 
        isOpen={isVideoUploadModalOpen}
        onClose={() => setIsVideoUploadModalOpen(false)}
        botToken={telegramBotToken}
        channelId={telegramChannelId}
        onUploadSuccess={() => {
          // Refresh the content feed after successful upload
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DevTool;
