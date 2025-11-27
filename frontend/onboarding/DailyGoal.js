function DailyGoal({ onNext }) {
  const [selected, setSelected] = React.useState(null);
  const [showPrediction, setShowPrediction] = React.useState(false);

  const goals = [
    { minutes: 5, difficulty: 'Легко' },
    { minutes: 10, difficulty: 'Нормально' },
    { minutes: 15, difficulty: 'Серьёзно' },
    { minutes: 20, difficulty: 'Интенсивно' }
  ];

  const handleSelect = (goal) => {
    setSelected(goal);
    setShowPrediction(true);
  };

  const handleNext = () => {
    if (selected) {
      onNext({ dailyGoal: selected });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-8"
      style={{
        backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex-1"></div>

      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-4 mb-8">
          <img 
            src="./trickle/assets/mascot3.png" 
            alt="Hello Kitty"
            className="w-28 h-28 object-contain flex-shrink-0 bounce"
          />
          <div className="bg-white rounded-3xl px-6 py-5 shadow-2xl flex-1 relative border-2 border-gray-200">
            <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[24px] border-t-transparent border-b-transparent border-r-gray-200"></div>
            <div className="absolute top-1/2 left-0 transform -translate-x-[calc(100%-4px)] -translate-y-1/2 w-0 h-0 border-t-[14px] border-b-[14px] border-r-[22px] border-t-transparent border-b-transparent border-r-white"></div>
            <p className="text-xl font-bold text-[var(--text-dark)]">
              {!showPrediction 
                ? 'Какую цель поставим на день?' 
                : (
                  <>
                    В первую неделю вы выучите <span className="text-pink-500">
                      {selected.minutes * 5} новых слов!
                    </span> 🎉
                  </>
                )
              }
            </p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {goals.map((goal, index) => (
            <button
              key={index}
              onClick={() => handleSelect(goal)}
              className={`card w-full flex items-center justify-between text-left transition-all py-3 ${
                selected?.minutes === goal.minutes ? 'ring-4 ring-[var(--primary-color)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img 
                    src="./trickle/assets/icons/clock_32px.svg"
                    alt="clock icon"
                    className="w-9 h-9 object-contain"
                  />  
                </div>
                <span className="text-lg font-bold text-[var(--text-dark)]">
                  {goal.minutes} минут в день
                </span>
              </div>
              <span className="text-base font-medium text-[var(--text-light)]">
                {goal.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-3xl border-t border-gray-200 pt-6">
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

export default DailyGoal;