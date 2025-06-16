import React, { useState } from 'react';
import { X, Upload, Video, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTelegramAPI } from '../hooks/useTelegramAPI';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onUploadSuccess: () => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  channelId,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const { callTelegramAPI } = useTelegramAPI();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      
      // Validate file size (50MB limit for Telegram)
      const maxSize = 50 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert('File too large. Maximum size is 50MB for videos.');
        return;
      }
      
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !channelId) {
      alert('Please select a file and ensure Telegram is configured');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload...');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('chat_id', channelId);
      formData.append('video', file);
      
      // Build caption with title and tags
      let fullCaption = '';
      if (title) fullCaption += `🎬 ${title}\n\n`;
      if (caption) fullCaption += `${caption}\n\n`;
      if (tags) {
        const tagList = tags.split(',').map(tag => `#${tag.trim().replace('#', '')}`).join(' ');
        fullCaption += `${tagList}\n\n`;
      }
      fullCaption += `📱 Uploaded from ProxyHub DevTool\n📅 ${new Date().toLocaleString()}`;
      
      formData.append('caption', fullCaption);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      setUploadStatus('Uploading video...');

      // Upload via secure proxy
      const result = await callTelegramAPI({
        method: 'sendVideo',
        data: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.ok) {
        setUploadStatus('✅ Upload successful!');
        console.log('✅ Video uploaded successfully:', result);
        
        setTimeout(() => {
          onUploadSuccess();
          handleClose();
        }, 1500);
      } else {
        throw new Error(result.description || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadStatus(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setTitle('');
      setCaption('');
      setTags('');
      setUploadProgress(0);
      setUploadStatus('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Upload Video to Channel</CardTitle>
          <button 
            onClick={handleClose}
            disabled={isUploading}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Video File
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {file ? (
                <div className="space-y-2">
                  <Video className="w-8 h-8 text-green-500 mx-auto" />
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-sm text-red-500 hover:text-red-700"
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to select a video file (Max: 50MB)
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-file-input"
                    disabled={isUploading}
                  />
                  <label 
                    htmlFor="video-file-input"
                    className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Choose Video</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title..."
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={isUploading}
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter video description..."
              rows={3}
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              disabled={isUploading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="anime, premium, new (comma separated)"
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate tags with commas. # will be added automatically.
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{uploadStatus}</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUploadModal;
