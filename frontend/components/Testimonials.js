function Testimonials() {
  const testimonials = [
    { name: 'Анна Петрова', role: 'Студентка', text: 'Благодаря LinguaPlay я начала свободно говорить по-английски всего за 6 месяцев!', rating: 5, avatar: '👩‍🎓' },
    { name: 'Михаил Соколов', role: 'Программист', text: 'Лучшее приложение для изучения языков! Геймификация действительно мотивирует.', rating: 5, avatar: '👨‍💻' },
    { name: 'Елена Волкова', role: 'Учитель', text: 'Рекомендую всем своим ученикам! Методика обучения действительно работает.', rating: 5, avatar: '👩‍🏫' },
    { name: 'Дмитрий Иванов', role: 'Менеджер', text: 'Изучал испанский для работы. За 4 месяца вышел на уровень B1! Невероятно удобно.', rating: 5, avatar: '👨‍💼' },
    { name: 'Ольга Смирнова', role: 'Дизайнер', text: 'Милые персонажи и интересные задания делают обучение приятным. Занимаюсь каждый день!', rating: 5, avatar: '👩‍🎨' },
    { name: 'Александр Козлов', role: 'Предприниматель', text: 'Учу корейский для бизнеса. Прогресс виден уже через месяц занятий. Отличное приложение!', rating: 5, avatar: '👨‍💼' },
    { name: 'Мария Новикова', role: 'Врач', text: 'Занимаюсь по 15 минут в день, и этого достаточно! Очень удобная система напоминаний.', rating: 5, avatar: '👩‍⚕️' },
    { name: 'Сергей Павлов', role: 'Инженер', text: 'Начинал с нуля, сейчас уже могу смотреть фильмы на английском. Спасибо LinguaPlay!', rating: 5, avatar: '👨‍🔧' }
  ];

  const [index, setIndex] = React.useState(0);
  const [anim, setAnim] = React.useState(""); // fade-left / fade-right

  const maxIndex = testimonials.length - 3; // последний допустимый старт

  const scroll = (dir) => {
    if (dir === "left" && index > 0) {
      setAnim("fade-right");
      setTimeout(() => {
        setIndex((i) => i - 3);
        setAnim("");
      }, 300);
    } else if (dir === "right" && index < maxIndex) {
      setAnim("fade-left");
      setTimeout(() => {
        setIndex((i) => i + 3);
        setAnim("");
      }, 300);
    }
  };

  const visible = testimonials.slice(index, index + 3);

  return (
    <section id="testimonials" className="snap-section gradient-bg">

      {/* ТАЙНЫЙ ВСТРОЕННЫЙ CSS ДЛЯ АНИМАЦИИ */}
      <style>
        {`
          .fade-left { 
            opacity: 0; 
            transform: translateX(-20px); 
            transition: 0.3s ease; 
          }
          .fade-right { 
            opacity: 0; 
            transform: translateX(20px); 
            transition: 0.3s ease; 
          }
          .fade-none { 
            opacity: 1; 
            transform: translateX(0); 
            transition: 0.3s ease; 
          }
        `}
      </style>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem", width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--text-dark)", marginBottom: "1rem" }}>
            Что говорят <span style={{ color: "var(--primary-color)" }}>наши пользователи</span>
          </h2>
          <p style={{ fontSize: "1.25rem", color: "var(--text-light)", maxWidth: "40rem", margin: "0 auto" }}>
            Более 10 миллионов человек уже достигли своих языковых целей с нами
          </p>
        </div>

        <div style={{ position: "relative" }}>

          {index > 0 && (
            <button
              onClick={() => scroll("left")}
              style={{
                position: "absolute",
                left: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                width: 0,
                height: 0,
                borderTop: "20px solid transparent",
                borderBottom: "20px solid transparent",
                borderRight: "30px solid var(--primary-color)",
                background: "transparent",
                cursor: "pointer",
                filter: "drop-shadow(0 4px 8px rgba(96,165,250,0.3))",
                transition: "0.25s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderRightColor = "var(--accent-color)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderRightColor = "var(--primary-color)")}
            />
          )}

          <div
            className={anim ? anim : "fade-none"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {visible.map((t, i) => (
              <div key={index + i} className="testimonial-card">
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    background: "var(--secondary-color)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.7rem",
                    marginRight: "1rem"
                  }}>
                    {t.avatar}
                  </div>

                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--text-dark)" }}>
                      {t.name}
                    </div>
                    <div style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>
                      {t.role}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <span key={s} style={{ color: "#FCD34D", fontSize: "1.1rem" }}>★</span>
                  ))}
                </div>

                <p style={{ color: "var(--text-light)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>

          {index < maxIndex && (
            <button
              onClick={() => scroll("right")}
              style={{
                position: "absolute",
                right: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                width: 0,
                height: 0,
                borderTop: "20px solid transparent",
                borderBottom: "20px solid transparent",
                borderLeft: "30px solid var(--primary-color)",
                background: "transparent",
                cursor: "pointer",
                filter: "drop-shadow(0 4px 8px rgba(96,165,250,0.3))",
                transition: "0.25s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = "var(--accent-color)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = "var(--primary-color)")}
            />
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: Math.floor(index / 3) === idx ? "var(--primary-color)" : "#E2E8F0",
                  transition: "0.3s"
                }}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;
