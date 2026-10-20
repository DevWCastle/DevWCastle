import { useState } from 'react';
import { 
  SiReact, SiTypescript, SiJavascript, SiHtml5, 
  SiNodedotjs, SiNestjs, SiExpress, 
  SiPostgresql, SiMysql, SiPrisma, SiTypeorm, 
  SiDocker, SiGit, SiGithub, SiLinux, SiPostman, 
  SiArduino, SiRaspberrypi 
} from 'react-icons/si';
import './TechStack.css';

// Lista centralizada de tecnologias reais do DevWCastle divididas por categoria
const TECH_ITEMS = [
  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', icon: <SiReact />, level: 'Avançado', desc: 'Biblioteca para construção de interfaces de usuário reativas e componentizadas.' },
  { id: 'ts', name: 'TypeScript', category: 'Frontend', icon: <SiTypescript />, level: 'Avançado', desc: 'Superset JavaScript com tipagem estática para maior robustez no front e back.' },
  { id: 'js', name: 'JavaScript (ES6+)', category: 'Frontend', icon: <SiJavascript />, level: 'Avançado', desc: 'Linguagem base para desenvolvimento web moderno e dinâmico.' },
  { id: 'html', name: 'HTML5/CSS3', category: 'Frontend', icon: <SiHtml5 />, level: 'Avançado', desc: 'Marcação semântica e estilização avançada com Grid e Flexbox.' },

  // Backend
  { id: 'node', name: 'Node.js', category: 'Backend', icon: <SiNodedotjs />, level: 'Avançado', desc: 'Ambiente de execução JavaScript no servidor para alta performance.' },
  { id: 'nestjs', name: 'NestJS', category: 'Backend', icon: <SiNestjs />, level: 'Intermediário', desc: 'Framework Node.js progressivo para APIs escaláveis e estruturadas em módulos.' },
  { id: 'express', name: 'Express', category: 'Backend', icon: <SiExpress />, level: 'Avançado', desc: 'Framework minimalista e flexível para aplicações web em Node.js.' },

  // Banco de Dados
  { id: 'postgres', name: 'PostgreSQL', category: 'Banco de dados', icon: <SiPostgresql />, level: 'Avançado', desc: 'Banco de dados relacional robusto e focado em integridade e performance.' },
  { id: 'mysql', name: 'MySQL', category: 'Banco de dados', icon: <SiMysql />, level: 'Intermediário', desc: 'SGBD relacional amplamente utilizado em aplicações web e corporativas.' },
  { id: 'prisma', name: 'Prisma', category: 'Banco de dados', icon: <SiPrisma />, level: 'Intermediário', desc: 'ORM moderno e seguro para Node.js e TypeScript.' },
  { id: 'typeorm', name: 'TypeORM', category: 'Banco de dados', icon: <SiTypeorm />, level: 'Intermediário', desc: 'ORM para TypeScript e JavaScript com suporte a padrões Active Record e Data Mapper.' },

  // DevOps & Ferramentas
  { id: 'docker', name: 'Docker', category: 'DevOps', icon: <SiDocker />, level: 'Intermediário', desc: 'Containerização de ambientes para consistência entre desenvolvimento e produção.' },
  { id: 'git', name: 'Git & GitHub', category: 'DevOps', icon: <SiGit />, level: 'Avançado', desc: 'Controle de versão de código e colaboração contínua em projetos.' },
  { id: 'linux', name: 'Linux', category: 'DevOps', icon: <SiLinux />, level: 'Intermediário', desc: 'Sistema operacional base para servidores, automações e infraestrutura.' },
  { id: 'postman', name: 'Postman', category: 'DevOps', icon: <SiPostman />, level: 'Avançado', desc: 'Testes, documentação e validação de rotas em APIs REST.' },

  // Automação e IoT
  { id: 'arduino', name: 'Arduino', category: 'Automação e IoT', icon: <SiArduino />, level: 'Intermediário', desc: 'Prototipagem eletrônica de hardware e integração com sistemas físicos.' },
  { id: 'raspberry', name: 'Raspberry Pi', category: 'Automação e IoT', icon: <SiRaspberrypi />, level: 'Intermediário', desc: 'Computação embarcada para automações industriais e residenciais.' }
];

const CATEGORIES = ['Todos', 'Frontend', 'Backend', 'Banco de dados', 'DevOps', 'Automação e IoT'];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedTech, setSelectedTech] = useState(TECH_ITEMS[0]);

  const filteredTechs = activeCategory === 'Todos' 
    ? TECH_ITEMS 
    : TECH_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section className="wrap" id="tecnologias">
      <p className="mono kick rv">Competências</p>
      <h2 className="rv">Stack <em>técnica</em></h2>

      <div className="tech-container rv">
        <div className="tech-sidebar">
          <p className="tech-description">
            Conjunto de ferramentas e tecnologias que utilizo diariamente para construir aplicações escaláveis e conectar a lógica digital ao mundo físico.
          </p>

          <div className="tech-filters" role="tablist" aria-label="Filtros de categoria da stack">
            {CATEGORIES.map(category => (
              <button
                key={category}
                role="tab"
                aria-selected={activeCategory === category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedTech && (
            <div className="tech-detail-card" aria-live="polite">
              <div className="detail-header">
                <span className="detail-icon">{selectedTech.icon}</span>
                <div>
                  <h4>{selectedTech.name}</h4>
                  <span className="detail-category">{selectedTech.category} · <strong>{selectedTech.level}</strong></span>
                </div>
              </div>
              <p className="detail-desc">{selectedTech.desc}</p>
            </div>
          )}
        </div>

        <div className="tech-cloud-wrapper">
          <div className="tech-cloud">
            {filteredTechs.map((tech) => {
              const isSelected = selectedTech?.id === tech.id;
              return (
                <button
                  key={tech.id}
                  className={`tech-cloud-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedTech(tech)}
                  title={`${tech.name} (${tech.category})`}
                  aria-label={`Selecionar ${tech.name}`}
                >
                  <span className="cloud-icon">{tech.icon}</span>
                  <span className="cloud-label">{tech.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}