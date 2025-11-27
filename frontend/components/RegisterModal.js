function RegisterModal({ onClose, onRegister, onSwitchToLogin, onboardingData, selectedPlan }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const requirements = [
    { id: 'length', text: 'Минимум 6 символов', check: () => password.length >= 6 },
    { id: 'digit', text: 'Цифры', check: () => /\d/.test(password) },
    { id: 'lowercase', text: 'Строчные буквы', check: () => /[a-zа-я]/.test(password) },
    { id: 'special', text: 'Спецсимволы', check: () => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const completedRequirements = requirements.filter(req => req.check()).length;
  const progress = (completedRequirements / requirements.length) * 100;
  const allRequirementsMet = completedRequirements === requirements.length;

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Пароль не соответствует всем требованиям');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!name.trim()) {
      setError('Введите ваше имя');
      return;
    }

    setLoading(true);

    try {
      await api.register({
        email,
        password,
        name,
        onboardingData: onboardingData || {},
        selectedPlan: selectedPlan || 'free'
      });
      onRegister();
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{
        backgroundImage: 'url(./trickle/assets/profile_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'crisp-edges'
      }}
    >
      <BubbleAnimation />
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">Регистрация</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="Ваше имя"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] pr-12"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Подтверждение пароля</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 pr-12 ${
                  passwordsMatch 
                    ? 'border-green-500 focus:ring-green-500' 
                    : passwordsDontMatch 
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[var(--primary-color)]'
                }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {passwordsMatch && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Пароли совпадают
              </p>
            )}
            {passwordsDontMatch && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Пароли не совпадают
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
            style={{
              opacity: (loading || !allRequirementsMet || !passwordsMatch) ? 0.5 : 1,
              cursor: (loading || !allRequirementsMet || !passwordsMatch) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-[var(--primary-color)] hover:underline"
            disabled={loading}
          >
            Уже есть аккаунт? Войти
          </button>
        </div>

        {password && (
          <div className="absolute top-[240px] right-[-260px] bg-white shadow-lg border border-gray-200 rounded-xl p-5 w-60 z-20 animate-fade-in">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-5 h-5 bg-white rotate-45"></div>

            <p className="text-sm font-medium mb-2">Надёжность пароля</p>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: allRequirementsMet ? '#10B981' : '#EF4444'
                }}
              ></div>
            </div>

            {requirements.map(req => {
              const isMet = req.check();
              return (
                <div key={req.id} className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[10px]"
                    style={{ backgroundColor: isMet ? '#10B981' : '#EF4444' }}
                  >
                    {isMet ? '✓' : '✕'}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: isMet ? '#10B981' : '#EF4444' }}
                  >
                    {req.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BubbleAnimation() {
  return (
    <>
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(100vh) translateX(0) scale(1);
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) translateX(var(--float-x)) scale(1.2);
              opacity: 0;
            }
          }

          .bubble {
            position: fixed;
            bottom: -100px;
            width: var(--size);
            height: var(--size);
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(96, 165, 250, 0.4));
            border-radius: 50%;
            pointer-events: none;
            z-index: 49;
            animation: float-up var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            box-shadow: 
              inset 0 0 20px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(96, 165, 250, 0.3);
          }

          .bubble::before {
            content: '';
            position: absolute;
            top: 10%;
            left: 15%;
            width: 40%;
            height: 40%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent);
            border-radius: 50%;
          }

          .bubble::after {
            content: '';
            position: absolute;
            bottom: 15%;
            right: 20%;
            width: 20%;
            height: 20%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
            border-radius: 50%;
          }
        `}
      </style>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            '--size': `${Math.random() * 60 + 40}px`,
            '--duration': `${Math.random() * 5 + 8}s`,
            '--delay': `${Math.random() * 5}s`,
            '--float-x': `${(Math.random() - 0.5) * 200}px`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </>
  );
}