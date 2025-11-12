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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-4 mb-8">
          <img 
            src="../trickle/assets/hello.png" 
            alt="Hello Kitty"
            className="w-20 h-20 rounded-full shadow-lg object-cover flex-shrink-0"
          />
          <div className="bg-white rounded-3xl px-6 py-4 shadow-xl flex-1">
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
                <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="lucide-clock text-xl text-[var(--primary-color)]"></i>
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