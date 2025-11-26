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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1rem' }}>Что-то пошло не так</h1>
            <p style={{ color: '#64748B', marginBottom: '1rem' }}>Извините, произошла непредвиденная ошибка.</p>
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
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [hideHeader, setHideHeader] = React.useState(false);
  const [sectionsLoaded, setSectionsLoaded] = React.useState({
    hero: true,
    howItWorks: false,
    features: false,
    languages: false,
    testimonials: false,
    stats: false,
    download: false
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  React.useEffect(() => {
    if (showOnboarding) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.dataset.section;
            if (sectionName && !sectionsLoaded[sectionName]) {
              setSectionsLoaded(prev => ({ ...prev, [sectionName]: true }));
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [showOnboarding, sectionsLoaded]);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (userData) => {
    setShowOnboarding(false);
    if (userData.registered) {
      setShowRegisterModal(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setHideHeader(true);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    setHideHeader(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setHideHeader(true);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="snap-container">
      {!hideHeader && (
        <Header 
          onAuthClick={handleAuthClick} 
          isLoggedIn={isLoggedIn}
        />
      )}

      <Hero onGetStarted={handleGetStarted} />
      
      <div data-section="howItWorks">
        {sectionsLoaded.howItWorks ? <HowItWorks /> : <section className="snap-section" style={{ background: 'white' }}></section>}
      </div>

      <div data-section="features">
        {sectionsLoaded.features ? <Features /> : <section className="snap-section gradient-bg"></section>}
      </div>

      <div data-section="languages">
        {sectionsLoaded.languages ? <Languages /> : <section className="snap-section" style={{ background: 'white' }}></section>}
      </div>

      <div data-section="testimonials">
        {sectionsLoaded.testimonials ? <Testimonials /> : <section className="snap-section gradient-bg"></section>}
      </div>

      <div data-section="stats">
        {sectionsLoaded.stats ? <Stats /> : <section className="snap-section" style={{ background: 'white' }}></section>}
      </div>

      <div data-section="download">
        {sectionsLoaded.download ? <Download /> : <section className="snap-section gradient-bg"></section>}
      </div>
      
      {showAuthModal && (
        <AuthModal 
          onClose={handleAuthClose}
          onLogin={handleLogin}
        />
      )}

      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)}
          onRegister={() => {
            setIsLoggedIn(true);
            setShowRegisterModal(false);
          }}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowAuthModal(true);
          }}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);