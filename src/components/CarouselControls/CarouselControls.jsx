import Icon from '../Icon/Icon';
import './CarouselControls.css';

const pad = (value) => String(value).padStart(2, '0');

function CarouselControls({ current, total, onPrev, onNext, onSelect, labels = [] }) {
  return (
    <div className="carousel">
      {/* <p className="carousel__count data" aria-hidden="true">
        <span>{pad(current + 1)}</span> / {pad(total)}
      </p> */}

      {/* índice com os títulos (como a lista lateral do carousel 1) */}
      <ol className="carousel__index">
        {Array.from({ length: total }, (_, index) => (
          <li key={index}>
            <button
              type="button"
              className="carousel__item"
              aria-current={index === current}
              onClick={() => onSelect(index)}
            >
              <span className="data">{pad(index + 1)}</span>
              {labels[index] ?? `Projeto ${index + 1}`}
            </button>
          </li>
        ))}
      </ol>

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
