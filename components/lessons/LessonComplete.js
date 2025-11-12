function LessonComplete({ onNext, correctAnswers, totalQuestions }) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="card">
          <img 
            src="../trickle/assets/clap.png" 
            alt="Congratulations"
            className="w-48 h-48 mx-auto mb-8"
          />
          
          <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-4">
            Урок завершён!
          </h1>
          
          <p className="text-2xl text-[var(--text-light)] mb-8">
            Отличная работа!
          </p>
          
          <div className="bg-gradient-blue rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-4xl font-bold mb-2">{correctAnswers}</div>
                <div className="text-sm opacity-90">Правильно</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{totalQuestions - correctAnswers}</div>
                <div className="text-sm opacity-90">Ошибок</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{percentage}%</div>
                <div className="text-sm opacity-90">Точность</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
            <p className="text-xl font-bold text-yellow-900 mb-2">
              🌟 Вы заработали 50 XP!
            </p>
            <p className="text-yellow-700">
              Продолжайте в том же духе!
            </p>
          </div>
          
          <button onClick={onNext} className="btn-primary w-full">
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}