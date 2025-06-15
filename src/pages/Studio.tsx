
import { useState } from 'react';
import { Upload, Link2, Tag, FileText, Wand2, Save, AlertCircle } from 'lucide-react';
import Header from '../components/Header';

const Studio = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    telegramUrl: '',
    tags: '',
    autotagEnabled: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoTags, setAutoTags] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutoTag = async () => {
    if (!formData.title || !formData.description) {
      return;
    }

    // Simulate auto-tagging API call
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTags = ['hd', 'premium', 'animation', 'collection', 'artistic'];
      setAutoTags(generatedTags);
      setFormData(prev => ({
        ...prev,
        tags: generatedTags.join(', ')
      }));
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        telegramUrl: '',
        tags: '',
        autotagEnabled: true
      });
      setAutoTags([]);
      alert('Video uploaded successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Studio Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload and manage your content
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Video Information</span>
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter video title..."
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter video description..."
                    rows={4}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Telegram URL */}
                <div>
                  <label htmlFor="telegramUrl" className="block text-sm font-medium text-foreground mb-2">
                    Telegram Video URL *
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      id="telegramUrl"
                      name="telegramUrl"
                      value={formData.telegramUrl}
                      onChange={handleInputChange}
                      placeholder="https://t.me/..."
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the direct Telegram video link
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-foreground">
                      Tags
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoTag}
                      disabled={!formData.title || !formData.description || isSubmitting}
                      className="flex items-center space-x-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Auto-tag</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas..."
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas (e.g., animation, hd, premium)
                  </p>
                  
                  {/* Auto-generated tags preview */}
                  {autoTags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Auto-generated tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {autoTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-card rounded-lg p-6 shadow-punch border border-border/50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Upload Guidelines</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ensure the Telegram link is accessible and working</li>
                    <li>• Use descriptive titles and relevant tags</li>
                    <li>• High-quality content is preferred</li>
                    <li>• Content must comply with platform guidelines</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.telegramUrl}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Upload Video</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Studio;
