function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = React.useState('languageSelection');
  const [userData, setUserData] = React.useState({});
  const [currentLesson, setCurrentLesson] = React.useState(0);
  const [lessonResults, setLessonResults] = React.useState({
    correct: 0,
    total: 0
  });
  const [beginnerLessons, setBeginnerLessons] = React.useState([]);
  const [incorrectLessons, setIncorrectLessons] = React.useState([]);
  const [isRetryPhase, setIsRetryPhase] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  React.useEffect(() => {
    if (userData.selectedLanguage && currentStep === 'learningMethod') {
      loadBeginnerLessons();
    }
  }, [userData.selectedLanguage, currentStep]);

  const loadBeginnerLessons = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getBeginnerLessons(userData.selectedLanguage.name);
      setBeginnerLessons(response.lessons);
    } catch (err) {
      console.error('Ошибка загрузки уроков:', err);
      setError('Не удалось загрузить уроки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (data = {}) => {
    setUserData({ ...userData, ...data });

    const steps = [
      'languageSelection',
      'welcomeCharacter',
      'howDidYouHear',
      'learningGoal',
      'languageLevel',
      'dailyGoal',
      'learningMethod',
      'lessons',
      'lessonComplete',
      'firstAchievement',
      'saveProgress'
    ];

    const currentIndex = steps.indexOf(currentStep);

    if (currentStep === 'lessons') {
      const lessonsArray = isRetryPhase ? incorrectLessons : beginnerLessons;
      if (currentLesson < lessonsArray.length - 1) {
        setCurrentLesson(currentLesson + 1);
      } else {
        if (!isRetryPhase && incorrectLessons.length > 0) {
          setIsRetryPhase(true);
          setCurrentLesson(0);
        } else {
          setCurrentStep('lessonComplete');
        }
      }
    } else if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleLessonAnswer = (isCorrect, lessonData) => {
    setLessonResults({
      correct: lessonResults.correct + (isCorrect ? 1 : 0),
      total: lessonResults.total + 1
    });

    if (!isCorrect && !isRetryPhase) {
      setIncorrectLessons([...incorrectLessons, lessonData]);
    }

    handleNext();
  };

  const handleRegister = (selectedPlan) => {
    onComplete({ ...userData, registered: true, selectedPlan });
  };

  const handleLater = () => {
    onComplete({ ...userData, registered: false });
  };

  if (currentStep === 'lessons' && beginnerLessons.length === 0) {
    if (loading) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center">
            <div className="loader mb-4"></div>
            <p className="text-xl text-[var(--text-dark)]">Загружаем уроки...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-8"
          style={{
            backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-4">
              Что-то пошло не так
            </h2>
            <p className="text-[var(--text-light)] mb-6">{error}</p>
            <button 
              onClick={() => setCurrentStep('learningMethod')}
              className="btn-primary w-full"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }
  }

  switch (currentStep) {
    case 'languageSelection':
      return <LanguageSelection onNext={handleNext} />;

    case 'welcomeCharacter':
      return <WelcomeCharacter onNext={handleNext} />;

    case 'howDidYouHear':
      return <HowDidYouHear onNext={handleNext} />;

    case 'learningGoal':
      return <LearningGoal onNext={handleNext} />;

    case 'languageLevel':
      return <LanguageLevel onNext={handleNext} selectedLanguage={userData.selectedLanguage} />;

    case 'dailyGoal':
      return <DailyGoal onNext={handleNext} />;

    case 'learningMethod':
      return <LearningMethod onNext={handleNext} />;

    case 'lessons':
      const lessonsArray = isRetryPhase ? incorrectLessons : beginnerLessons;
      const lesson = lessonsArray[currentLesson];
      switch (lesson.type) {
        case 'listen':
          return <ListenAndArrange lesson={lesson} onAnswer={handleLessonAnswer} />;
        case 'selectImage':
          return <SelectWordByImage lesson={lesson} onAnswer={handleLessonAnswer} />;
        case 'translateToTarget':
          return <TranslateToTarget lesson={lesson} onAnswer={handleLessonAnswer} />;
        case 'translateToRussian':
          return <TranslateToRussian lesson={lesson} onAnswer={handleLessonAnswer} />;
        default:
          return null;
      }

    case 'lessonComplete':
      return (
        <LessonComplete 
          onNext={handleNext}
          correctAnswers={lessonResults.correct}
          totalQuestions={lessonResults.total}
        />
      );

    case 'firstAchievement':
      return (
        <FirstAchievement 
          onNext={handleNext}
          selectedLanguage={userData.selectedLanguage}
        />
      );

    case 'saveProgress':
      return (
        <SaveProgressPrompt 
          onRegister={handleRegister}
          onLater={handleLater}
        />
      );

    default:
      return null;
  }
}

export default OnboardingFlow;