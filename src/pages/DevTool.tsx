
import { useState, useEffect } from 'react';
import { Lock, Shield, Database, Users, BarChart3, Download, Edit, Trash2, Eye, Upload, Settings, MessageSquare, Cloud, Plus, FileText, Image, Video } from 'lucide-react';
import Header from '../components/Header';

const DevTool = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const [error, setError] = useState('');

  const correctPassword = 'Daman@2005';

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

  // Mock data
  const mockVideos = [
    { id: '1', title: 'Beautiful Animation Collection Vol.1', views: 15420, uploadDate: '2024-01-15', status: 'active' },
    { id: '2', title: 'Premium Series Episode 5', views: 8932, uploadDate: '2024-01-14', status: 'active' },
    { id: '3', title: 'Artistic Masterpiece Collection', views: 23187, uploadDate: '2024-01-13', status: 'pending' },
    { id: '4', title: 'Studio Exclusive Release', views: 5643, uploadDate: '2024-01-12', status: 'active' },
  ];

  const mockUsers = [
    { id: '1', email: 'user1@example.com', joinDate: '2024-01-10', status: 'active', role: 'user' },
    { id: '2', email: 'user2@example.com', joinDate: '2024-01-08', status: 'active', role: 'premium' },
    { id: '3', email: 'user3@example.com', joinDate: '2024-01-05', status: 'inactive', role: 'user' },
  ];

  const mockTelegramFiles = [
    { id: '1', fileName: 'video1.mp4', size: '245 MB', uploadDate: '2024-01-15', type: 'video' },
    { id: '2', fileName: 'thumbnail1.jpg', size: '2.1 MB', uploadDate: '2024-01-15', type: 'image' },
    { id: '3', fileName: 'document.pdf', size: '5.3 MB', uploadDate: '2024-01-14', type: 'document' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8 animate-slide-up">
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
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.telegramFiles}</p>
                <p className="text-xs text-muted-foreground">Files</p>
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
              { id: 'videos', label: 'Videos', icon: Database },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'telegram', label: 'Telegram Storage', icon: MessageSquare },
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'export', label: 'Export', icon: Download }
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
            <div className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Telegram Storage</h2>
                  <p className="text-sm text-muted-foreground">Manage files stored via Telegram bot</p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Bot</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">File Name</th>
                      <th className="text-left p-4 font-medium text-foreground">Type</th>
                      <th className="text-left p-4 font-medium text-foreground">Size</th>
                      <th className="text-left p-4 font-medium text-foreground">Upload Date</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTelegramFiles.map((file) => (
                      <tr key={file.id} className="border-t border-border hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {file.type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                            {file.type === 'image' && <Image className="w-4 h-4 text-green-500" />}
                            {file.type === 'document' && <FileText className="w-4 h-4 text-purple-500" />}
                            <span className="font-medium text-foreground">{file.fileName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            file.type === 'video' ? 'bg-blue-500/10 text-blue-500' :
                            file.type === 'image' ? 'bg-green-500/10 text-green-500' :
                            'bg-purple-500/10 text-purple-500'
                          }`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{file.size}</td>
                        <td className="p-4 text-muted-foreground">{file.uploadDate}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                              <Download className="w-4 h-4" />
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

          {activeTab === 'upload' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Upload Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Videos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop video files or click to browse</p>
                  <button className="btn-primary">Choose Files</button>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Thumbnails</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload custom thumbnails for videos</p>
                  <button className="btn-primary">Choose Images</button>
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
                      defaultValue="StreamHub"
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Max Upload Size (MB)</label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telegram Bot Token</label>
                  <input
                    type="password"
                    placeholder="Enter your Telegram bot token..."
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

          {activeTab === 'export' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6">Export Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-secondary flex items-center space-x-2 justify-center">
                  <Download className="w-4 h-4" />
                  <span>Export Videos as JSON</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2 justify-center">
                  <Download className="w-4 h-4" />
                  <span>Export Users as CSV</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2 justify-center">
                  <Download className="w-4 h-4" />
                  <span>Export Telegram Files</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2 justify-center">
                  <Download className="w-4 h-4" />
                  <span>Export Full Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DevTool;
