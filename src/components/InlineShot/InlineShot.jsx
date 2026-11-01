import './InlineShot.css';

/**
 * Imagem real embutida no meio de um título gigante (referência: The Romans).
 * Abre quando o título é revelado na rolagem e cresce no hover.
 * É decorativa: o título continua legível sem ela.
 */
export default function InlineShot({ src, position = '50% 50%' }) {
  return (
    <span className="inline-shot" aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: position }} />
    </span>
  );
}
