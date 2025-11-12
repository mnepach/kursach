function LessonComplete({ onNext, correctAnswers, totalQuestions }) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <img 
          src="../trickle/assets/clap.png" 
          alt="Congratulations"
          className="w-48 h-48 mx-auto mb-8"
        />
        
        <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-12">
          Конец урока!
        </h1>
        
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 inline-block">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎯</div>
            <div className="text-left">
              <div className="text-gray-600 text-sm mb-1">ОТЛИЧНО</div>
              <div className="text-6xl font-bold text-[var(--primary-color)]">{percentage}%</div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onNext} 
          className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all"
        >
          ДАЛЕЕ
        </button>
      </div>
    </div>
  );
}