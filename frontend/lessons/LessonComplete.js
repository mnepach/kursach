function LessonComplete({ onNext, correctAnswers, totalQuestions }) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  let status = 'ОТЛИЧНО';
  let borderColor = '#10B981';
  let bgColor = 'rgb(240, 253, 244)';
  let textColor = 'rgb(22, 101, 52)';
  let percentageColor = 'rgb(34, 197, 94)';

  if (correctAnswers < 2) {
    status = 'ПЛОХО';
    borderColor = '#EF4444';
    bgColor = 'rgb(254, 242, 242)';
    textColor = 'rgb(127, 29, 29)';
    percentageColor = 'rgb(239, 68, 68)';
  } else if (correctAnswers < 4) {
    status = 'НЕПЛОХО';
    borderColor = '#F59E0B';
    bgColor = 'rgb(255, 251, 235)';
    textColor = 'rgb(120, 53, 15)';
    percentageColor = 'rgb(245, 158, 11)';
  }

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

      <div className="max-w-2xl w-full text-center">
        <img 
          src="./trickle/assets/clap.png" 
          alt="Congratulations"
          className="w-64 h-64 mx-auto mb-8 object-contain"
          style={{
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 75%)',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 75%)'
          }}
        />
        
        <h1 className="text-4xl font-bold text-[var(--text-dark)] mb-12">
          Конец урока!
        </h1>
        
        <div 
          className="rounded-3xl p-8 shadow-xl mb-8 inline-block"
          style={{ 
            minWidth: '280px', 
            maxWidth: '350px',
            backgroundColor: bgColor,
            border: `4px solid ${borderColor}`
          }}
        >
          <div className="flex items-center gap-6">
            <div className="text-6xl">🎯</div>
            <div className="text-left">
              <div 
                className="text-lg font-bold mb-2"
                style={{ color: textColor }}
              >
                {status}
              </div>
              <div 
                className="text-7xl font-bold"
                style={{ color: percentageColor }}
              >
                {percentage}%
              </div>
              <div 
                className="text-sm mt-2"
                style={{ color: textColor }}
              >
                Правильно: {correctAnswers} из {totalQuestions}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-2xl border-t border-gray-200 pt-6">
        <button 
          onClick={onNext} 
          className="w-full max-w-md mx-auto block py-4 bg-[var(--primary-color)] text-white rounded-2xl font-bold text-xl hover:bg-[var(--accent-color)] transition-all"
        >
          Далее
        </button>
      </div>
    </div>
  );
}

export default LessonComplete;