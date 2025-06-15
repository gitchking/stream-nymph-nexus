
import { useState } from 'react';
import { Tag, Search } from 'lucide-react';
import Header from '../components/Header';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    { name: 'Animation', count: 1247, color: 'bg-blue-500' },
    { name: 'Collection', count: 892, color: 'bg-purple-500' },
    { name: 'Series', count: 634, color: 'bg-green-500' },
    { name: 'Premium', count: 445, color: 'bg-red-500' },
    { name: 'HD', count: 1089, color: 'bg-yellow-500' },
    { name: 'Artistic', count: 332, color: 'bg-pink-500' },
    { name: 'Classic', count: 567, color: 'bg-indigo-500' },
    { name: 'Exclusive', count: 234, color: 'bg-teal-500' },
    { name: 'Remastered', count: 178, color: 'bg-orange-500' },
    { name: 'Studio', count: 423, color: 'bg-cyan-500' },
    { name: 'New', count: 789, color: 'bg-lime-500' },
    { name: 'Featured', count: 156, color: 'bg-rose-500' },
    { name: 'Popular', count: 934, color: 'bg-violet-500' },
    { name: 'Trending', count: 678, color: 'bg-emerald-500' },
    { name: 'Latest', count: 543, color: 'bg-amber-500' },
    { name: 'Masterpiece', count: 89, color: 'bg-fuchsia-500' }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover content by categories and tags
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-punch"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {filteredCategories.map((category, index) => (
            <div
              key={category.name}
              className="group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="bg-card rounded-lg p-6 shadow-punch card-hover border border-border/50 text-center">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count.toLocaleString()} videos
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
            <p className="text-muted-foreground">Try searching with different keywords</p>
          </div>
        )}

        {/* Popular Tags Section */}
        <div className="mt-16 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Popular Tags</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['animation', 'hd', 'premium', 'series', 'collection', 'artistic', 'new', 'trending', 'popular', 'exclusive', 'featured', 'latest'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-sm rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
