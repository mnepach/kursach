function FirstAchievement({ onNext, selectedLanguage }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">

        <div className="flex items-center justify-center gap-6 mb-8">
          <img
            src="./trickle/assets/exitement1.gif"
            alt="Hello Kitty"
            className="w-64 h-64 object-contain"
          />

          <div className="flex items-center gap-4">
            <img
              src={selectedLanguage?.flag}
              alt={selectedLanguage?.name}
              className="w-16 h-16 object-contain rounded-lg shadow-md"
            />
            <div className="text-6xl font-bold text-[var(--primary-color)]">
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
