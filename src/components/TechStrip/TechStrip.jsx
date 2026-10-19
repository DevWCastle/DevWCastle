import './TechStrip.css';

export default function TechStrip() {
  const techs = [
    'TypeScript',
    'Node.js',
    'NestJS',
    'React',
    'SQL',
    'Docker',
  ];

  return (
    <div className="wrap-strip">
      <div className="strip-container mono rv">
        <div className="strip-track">
          {/* Primeira repetição */}
          <div className="strip-group">
            {techs.map((tech, i) => (
              <span key={`a-${i}`}>{tech}</span>
            ))}
          </div>
          {/* Segunda repetição (necessária para o loop infinito contínuo) */}
          <div className="strip-group" aria-hidden="true">
            {techs.map((tech, i) => (
              <span key={`b-${i}`}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}