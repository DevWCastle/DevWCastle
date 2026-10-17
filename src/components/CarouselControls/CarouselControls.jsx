import './CarouselControls.css';

function CarouselControls({ current, total, onPrev, onNext, onSelect }) {
  const pad = (value) => String(value).padStart(2, '0');

  return (
    <>
      <div className="carousel-controls">
        <button type="button" className="carousel-controls__arrow" aria-label="Projeto anterior" onClick={onPrev}>
          ←
        </button>
        <div className="carousel-controls__dots">
          {Array.from({ length: total }, (_, index) => (
            <button
              type="button"
              key={index}
              className="carousel-controls__dot"
              aria-label={`Ir para o projeto ${index + 1}`}
              aria-current={index === current}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
        <button type="button" className="carousel-controls__arrow" aria-label="Próximo projeto" onClick={onNext}>
          →
        </button>
      </div>
      <p className="carousel-controls__count mono">{`${pad(current + 1)} / ${pad(total)}`}</p>
    </>
  );
}

export default CarouselControls;
