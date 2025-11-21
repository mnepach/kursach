function SubscriptionPlans({ onClose, onUpgrade }) {
  const [plans, setPlans] = React.useState([]);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.getPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Ошибка загрузки планов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      return; // Бесплатный план уже активен
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="loader"></div>
      </div>
    );
  }

  if (showPayment && selectedPlan) {
    return (
      <PaymentModal 
        plan={selectedPlan}
        onClose={() => setShowPayment(false)}
        onSuccess={onUpgrade}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-dark)]">Выберите план</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <div className="icon-x text-2xl"></div>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${plan.id === 'premium' ? 'ring-4 ring-[var(--primary-color)]' : ''}`}
            >
              {plan.id === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--primary-color)] text-white px-4 py-1 rounded-full text-sm font-bold">
                  Популярный
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">{plan.name}</h3>
                <p className="text-[var(--text-light)] mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-4xl font-bold text-[var(--text-dark)]">Бесплатно</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-[var(--text-dark)]">
                        {plan.price} ₽
                      </div>
                      <div className="text-sm text-[var(--text-light)]">в месяц</div>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="icon-check text-green-500 mt-1"></div>
                    <span className="text-[var(--text-dark)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={plan.id === 'free'}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.id === 'free'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : plan.id === 'premium'
                    ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]'
                    : 'bg-white border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--secondary-color)]'
                }`}
              >
                {plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ plan, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', icon: 'credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'wallet' },
    { id: 'apple_pay', name: 'Apple Pay', icon: 'smartphone' },
    { id: 'google_pay', name: 'Google Pay', icon: 'smartphone' }
  ];

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      await api.upgradeSubscription(plan.id, paymentMethod);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при оплате');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">Оплата подписки</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <div className="icon-x text-2xl"></div>
          </button>
        </div>

        <div className="mb-6 p-4 bg-[var(--secondary-color)] rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[var(--text-dark)]">{plan.name}</span>
            <span className="text-2xl font-bold text-[var(--primary-color)]">{plan.price} ₽</span>
          </div>
          <p className="text-sm text-[var(--text-light)]">Ежемесячная подписка</p>
        </div>

        <h3 className="font-bold text-[var(--text-dark)] mb-4">Выберите способ оплаты</h3>

        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                paymentMethod === method.id
                  ? 'border-[var(--primary-color)] bg-[var(--secondary-color)]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`icon-${method.icon} text-2xl text-[var(--primary-color)]`}></div>
              <span className="font-medium text-[var(--text-dark)]">{method.name}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Обработка...' : `Оплатить ${plan.price} ₽`}
        </button>

        <p className="text-xs text-[var(--text-light)] text-center mt-4">
          Нажимая "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности
        </p>
      </div>
    </div>
  );
}