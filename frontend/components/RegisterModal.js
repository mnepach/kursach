function RegisterModal({ onClose, onRegister, onSwitchToLogin, onboardingData }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const requirements = [
    { id: 'length', text: 'Минимум 6 символов', check: () => password.length >= 6 },
    { id: 'digit', text: 'Цифры', check: () => /\d/.test(password) },
    { id: 'lowercase', text: 'Строчные буквы', check: () => /[a-zа-я]/.test(password) },
    { id: 'special', text: 'Спецсимволы', check: () => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const completedRequirements = requirements.filter(req => req.check()).length;
  const progress = (completedRequirements / requirements.length) * 100;
  const allRequirementsMet = completedRequirements === requirements.length;

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
        onboardingData: onboardingData || {}
      });
      onRegister();
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">Регистрация</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <div className="icon-x text-2xl"></div>
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Подтверждение пароля</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !allRequirementsMet}
            style={{
              opacity: (loading || !allRequirementsMet) ? 0.5 : 1,
              cursor: (loading || !allRequirementsMet) ? 'not-allowed' : 'pointer'
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