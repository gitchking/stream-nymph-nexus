
import Header from '../components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
            Your Premium
            <br />
            <span className="text-primary">Video Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Discover, stream, and manage your video content with our sophisticated platform designed for the modern viewer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="btn-primary text-lg px-8 py-4">
              Explore Content
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card rounded-xl p-8 shadow-punch border border-border/50 card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">Experience content in the highest quality with our advanced streaming technology.</p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-punch border border-border/50 card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Smart Management</h3>
              <p className="text-muted-foreground">Organize and manage your content library with intelligent categorization and search.</p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-punch border border-border/50 card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-md"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure Access</h3>
              <p className="text-muted-foreground">Your content is protected with enterprise-grade security and privacy controls.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-blur mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 ProxyHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
