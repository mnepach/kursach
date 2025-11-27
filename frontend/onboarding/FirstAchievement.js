function FirstAchievement({ onNext, selectedLanguage }) {
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
        <div className="flex items-center justify-center gap-8 mb-8">
          <img
            src="./trickle/assets/exitement1.gif"
            alt="Hello Kitty"
            className="w-96 h-96 object-contain"
          />

          <div className="flex flex-col items-center gap-4">
            <img
              src={selectedLanguage?.flag}
              alt={selectedLanguage?.name}
              className="w-24 h-24 object-contain rounded-lg shadow-md"
            />
            <div className="text-8xl font-bold text-[var(--primary-color)]">
              5
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-8 leading-snug">
          Вы получили свою первую<br />
          оценку <span style={{ color: '#60A5FA' }}>LinguaPlay</span> в курсе<br />
          {selectedLanguage?.name
            ? selectedLanguage.name.charAt(0).toUpperCase() + selectedLanguage.name.slice(1)
            : 'Английского'}
          !
        </h1>
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

export default FirstAchievement;