
import { useState } from 'react';
import { Upload, Calendar, Clock, MessageSquare, Play, Settings, FileVideo, Image, Plus, Schedule, Bot } from 'lucide-react';
import Header from '../components/Header';

const Studio = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const mockTelegramFiles = [
    { id: '1', name: 'video_001.mp4', size: '125 MB', date: '2024-01-15', type: 'video' },
    { id: '2', name: 'thumbnail_001.jpg', size: '2.3 MB', date: '2024-01-15', type: 'image' },
    { id: '3', name: 'video_002.mp4', size: '89 MB', date: '2024-01-14', type: 'video' },
  ];

  const mockScheduledUploads = [
    { id: '1', title: 'Weekly Series Episode 5', scheduledFor: '2024-01-20 14:00', status: 'pending' },
    { id: '2', title: 'Tutorial Collection Part 2', scheduledFor: '2024-01-22 10:00', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Content Studio</h1>
            <p className="text-muted-foreground">Upload, manage, and schedule your video content</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Studio Settings</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slide-up overflow-x-auto">
          <div className="glass-effect rounded-lg p-1 inline-flex min-w-max">
            {[
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'telegram', label: 'Telegram Storage', icon: MessageSquare },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'library', label: 'Library', icon: Play }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
              {/* Upload Area */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Upload Videos</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Drop your videos here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse files</p>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="btn-primary cursor-pointer inline-block">
                    Choose Files
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-foreground mb-3">Selected Files:</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileVideo className="w-5 h-5 text-primary" />
                            <span className="text-foreground">{file.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary mt-4">
                      Upload {selectedFiles.length} file(s)
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Settings */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upload Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Privacy</label>
                    <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Unlisted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Entertainment</option>
                      <option>Education</option>
                      <option>Technology</option>
                      <option>Gaming</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telegram' && (
            <div className="space-y-6">
              {/* Telegram Bot Connection */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Telegram Storage</h2>
                    <p className="text-muted-foreground">Manage files uploaded via Telegram bot</p>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>Connect Bot</span>
                  </button>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Telegram Bot: @ProxyHubBot</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Send files to this bot to automatically upload them to your storage
                  </p>
                </div>
              </div>

              {/* File List */}
              <div className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Telegram Files</h3>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Import to Library</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-4 font-medium text-foreground">File Name</th>
                        <th className="text-left p-4 font-medium text-foreground">Type</th>
                        <th className="text-left p-4 font-medium text-foreground">Size</th>
                        <th className="text-left p-4 font-medium text-foreground">Date</th>
                        <th className="text-left p-4 font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTelegramFiles.map((file) => (
                        <tr key={file.id} className="border-t border-border hover:bg-muted/20">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {file.type === 'video' ? (
                                <FileVideo className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Image className="w-4 h-4 text-green-500" />
                              )}
                              <span className="font-medium text-foreground">{file.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              file.type === 'video' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                            }`}>
                              {file.type}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{file.size}</td>
                          <td className="p-4 text-muted-foreground">{file.date}</td>
                          <td className="p-4">
                            <button className="btn-secondary text-xs">Import</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Schedule Upload */}
              <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Schedule Upload</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Upload Date</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Upload Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Select Content</label>
                  <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Choose from uploaded files...</option>
                    <option>video_001.mp4</option>
                    <option>video_002.mp4</option>
                  </select>
                </div>
                <button className="btn-primary mt-4 flex items-center space-x-2">
                  <Schedule className="w-4 h-4" />
                  <span>Schedule Upload</span>
                </button>
              </div>

              {/* Scheduled Uploads */}
              <div className="bg-card rounded-lg shadow-punch border border-border/50 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Scheduled Uploads</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-4 font-medium text-foreground">Title</th>
                        <th className="text-left p-4 font-medium text-foreground">Scheduled For</th>
                        <th className="text-left p-4 font-medium text-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockScheduledUploads.map((upload) => (
                        <tr key={upload.id} className="border-t border-border hover:bg-muted/20">
                          <td className="p-4 font-medium text-foreground">{upload.title}</td>
                          <td className="p-4 text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{upload.scheduledFor}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500">
                              {upload.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button className="btn-secondary text-xs">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Video Library</h2>
              <p className="text-muted-foreground text-center py-8">
                Your uploaded videos will appear here once you start uploading content.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Studio;
