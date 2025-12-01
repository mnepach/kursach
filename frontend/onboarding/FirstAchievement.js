function FirstAchievement({ onNext, selectedLanguage }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-8"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(./trickle/assets/onboarding_background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: -1
        }}
      ></div>

      <div className="flex-1"></div>

      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-12 mb-8">
          <div
            style={{
              width: '384px',
              height: '384px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="./trickle/assets/exitement1.gif"
              alt="Hello Kitty"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 78%)',
                maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 78%)'
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <img
              src={selectedLanguage?.flag}
              alt={selectedLanguage?.name}
              className="w-20 h-20 object-contain"
              style={{ border: 'none' }}
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
