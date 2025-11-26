function LearningGoal({ onNext }) {
  const [selected, setSelected] = React.useState(null);

  const goals = [
    { icon: './trickle/assets/icons/plane.svg', text: 'Для путешествий' },
    { icon: './trickle/assets/icons/briefcase.svg', text: 'Для работы и карьеры' },
    { icon: './trickle/assets/icons/graduation-cap.svg', text: 'Для учёбы' },
    { icon: './trickle/assets/icons/heart.svg', text: 'Для общения с близкими' },
    { icon: './trickle/assets/icons/book.svg', text: 'Для общего развития' },
    { icon: './trickle/assets/icons/film.svg', text: 'Для фильмов и книг' }
  ];

  const handleSelect = (goal) => {
    setSelected(goal);
  };

  const handleNext = () => {
    if (selected) {
      onNext({ learningGoal: selected });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-6 mb-12">
          <img 
            src="./trickle/assets/mascot3.png" 
            alt="Hello Kitty"
            className="w-32 h-32 object-contain bounce"
          />
          <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl flex-1 relative border-2 border-gray-200">
            <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[24px] border-t-transparent border-b-transparent border-r-gray-200"></div>
            <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[14px] border-b-[14px] border-r-[22px] border-t-transparent border-b-transparent border-r-white"></div>
            <p className="text-2xl font-bold text-[var(--text-dark)]">
              Какая у вас цель изучения?
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {goals.map((goal, index) => (
            <button
              key={index}
              onClick={() => handleSelect(goal)}
              className={`card flex items-center gap-4 text-left transition-all ${
                selected?.text === goal.text ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="w-14 h-14 bg-[var(--secondary-color)] rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={goal.icon} 
                  alt={goal.text} 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-lg font-medium text-[var(--text-dark)]">{goal.text}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            selected 
              ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

export default LearningGoal;
