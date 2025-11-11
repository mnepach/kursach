class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-4">Извините, произошла непредвиденная ошибка.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
      <div className="snap-container" data-name="app" data-file="app.js">
        <Header 
          onAuthClick={() => setShowAuthModal(true)} 
          isLoggedIn={isLoggedIn}
        />
        <Hero onGetStarted={() => setShowAuthModal(true)} />
        <Features />
        <Download />
        
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={() => {
              setIsLoggedIn(true);
              setShowAuthModal(false);
            }}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);