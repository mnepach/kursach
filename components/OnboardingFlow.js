function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = React.useState('languageSelection');
  const [userData, setUserData] = React.useState({});
  const [currentLesson, setCurrentLesson] = React.useState(0);
  const [lessonResults, setLessonResults] = React.useState({
    correct: 0,
    total: 0
  });

  const beginnerLessons = [
    {
      type: 'listen',
      audio: 'hello.mp3',
      words: ['Привет', 'мир', '!'],
      correctAnswer: 'Привет мир !'
    },
    {
      type: 'selectImage',
      word: 'Apple',
      options: [
        { emoji: '🍎', text: 'Apple' },
        { emoji: '🍌', text: 'Banana' },
        { emoji: '🍊', text: 'Orange' }
      ],
      correctAnswer: 'Apple'
    },
    {
      type: 'translateToTarget',
      russianText: 'Привет',
      targetLanguage: 'английский',
      options: ['Hello', 'Goodbye', 'Thanks'],
      correctAnswer: 'Hello'
    },
    {
      type: 'translateToRussian',
      targetText: 'Good morning',
      options: ['Доброе утро', 'Добрый вечер', 'Спокойной ночи'],
      correctAnswer: 'Доброе утро'
    }
  ];

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
      if (currentLesson < beginnerLessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      } else {
        setCurrentStep('lessonComplete');
      }
    } else if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleLessonAnswer = (isCorrect) => {
    setLessonResults({
      correct: lessonResults.correct + (isCorrect ? 1 : 0),
      total: lessonResults.total + 1
    });
    
    handleNext();
  };

  const handleRegister = () => {
    onComplete({ ...userData, registered: true });
  };

  const handleDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  };

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
      const lesson = beginnerLessons[currentLesson];
      
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
          onDownload={handleDownload}
        />
      );
    
    default:
      return null;
  }
}