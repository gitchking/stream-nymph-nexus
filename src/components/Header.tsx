
import { useState } from 'react';
import { Search, Menu, X, Settings, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Animated Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 group">
          <div className="relative">
            <Globe className="w-8 h-8 text-primary animate-pulse group-hover:animate-spin transition-all duration-500" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
          </div>
          <span className="text-xl font-bold text-gradient">ProxyHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/studio" className="text-sm font-medium hover:text-primary transition-colors">
            Studio
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search videos, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link
            to="/dev-tool"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Control Panel"
          >
            <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5 text-muted-foreground" /> : <Menu className="w-5 h-5 text-muted-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search videos, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="p-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/studio"
                className="p-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Studio
              </Link>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                to="/dev-tool"
                className="p-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Control Panel</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
