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

  const handleGetStarted = () => {
    const onboardingScripts = [
      'components/onboarding/LanguageSelection.js',
      'components/onboarding/WelcomeCharacter.js',
      'components/onboarding/HowDidYouHear.js',
      'components/onboarding/LearningGoal.js',
      'components/onboarding/LanguageLevel.js',
      'components/onboarding/DailyGoal.js',
      'components/onboarding/LearningMethod.js',
      'components/lessons/ListenAndArrange.js',
      'components/lessons/SelectWordByImage.js',
      'components/lessons/TranslateToTarget.js',
      'components/lessons/TranslateToRussian.js',
      'components/lessons/LessonComplete.js',
      'components/onboarding/FirstAchievement.js',
      'components/SaveProgressPrompt.js'
    ];

    Promise.all(onboardingScripts.map(src => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'text/babel';
        script.src = src;
        script.onload = resolve;
        script.onerror = resolve;
        document.body.appendChild(script);
      });
    })).then(() => {
      setShowOnboarding(true);
    });
  };

  const handleOnboardingComplete = (userData) => {
    setShowOnboarding(false);
    if (userData.registered) {
      setShowRegisterModal(true);
    }
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="snap-container">
      <Header 
        onAuthClick={() => setShowAuthModal(true)} 
        isLoggedIn={isLoggedIn}
      />
      <Hero onGetStarted={handleGetStarted} />
      <HowItWorks />
      <Features />
      <Languages />
      <Testimonials />
      <Stats />
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