import Icon from '../Icon/Icon';
import './CarouselControls.css';

const pad = (value) => String(value).padStart(2, '0');

function CarouselControls({ current, total, onPrev, onNext, onSelect, labels = [] }) {
  return (
    <div className="carousel">
      <p className="carousel__count data" aria-hidden="true">
        <span>{pad(current + 1)}</span> / {pad(total)}
      </p>

      <div className="carousel__dots">
        {Array.from({ length: total }, (_, index) => (
          <button
            type="button"
            key={index}
            className="carousel__dot"
            aria-label={`Ir para ${labels[index] ?? `o projeto ${index + 1}`}`}
            aria-current={index === current}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      <div className="carousel__arrows">
        <button type="button" className="carousel__arrow" aria-label="Projeto anterior" onClick={onPrev}>
          <Icon name="arrow-left" size={20} />
        </button>
        <button type="button" className="carousel__arrow" aria-label="Próximo projeto" onClick={onNext}>
          <Icon name="arrow-right" size={20} />
        </button>
      </div>
    </div>
  );
}

export default CarouselControls;
