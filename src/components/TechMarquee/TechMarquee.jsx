import {
  SiArduino,
  SiDocker,
  SiExpress,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiRaspberrypi,
  SiReact,
  SiTypeorm,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';
import { TbCircuitSwitchOpen } from 'react-icons/tb';
import { stackLayers } from '../../data/site';
import './TechMarquee.css';

/* Ícone de cada tecnologia da Stack; o CLP não tem marca, vira um contato elétrico */
const ICONS = {
  CLP: TbCircuitSwitchOpen,
  Arduino: SiArduino,
  'Raspberry Pi': SiRaspberrypi,
  'Node.js': SiNodedotjs,
  NestJS: SiNestjs,
  Express: SiExpress,
  Prisma: SiPrisma,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  TypeORM: SiTypeorm,
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'HTML/CSS': SiHtml5,
  Docker: SiDocker,
  'Git & GitHub': SiGithub,
  Linux: SiLinux,
  Vercel: SiVercel,
};

// as mesmas tecnologias da Stack, na ordem em que o dado atravessa o sistema
const TECH = stackLayers.flatMap((layer) => layer.tech);

// o que essas ferramentas sustentam: a trajetória do Sobre + as camadas da Stack
const FIELDS = [
  'Manutenção industrial',
  'Eletroeletrônica',
  'Automação com CLP',
  'Leitura de sensores',
  'APIs REST',
  'Modelagem de dados',
  'Interfaces em React',
  'Deploy com Docker',
];

/* Uma fileira: o conteúdo vai duas vezes para o loop não ter emenda */
function Row({ items, renderItem, className, label }) {
  return (
    <div className={`marquee__row ${className}`}>
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul
            className="marquee__group"
            key={copy}
            aria-label={copy === 0 ? label : undefined}
            aria-hidden={copy === 1 || undefined}
          >
            {items.map((item) => (
              <li key={item}>{renderItem(item)}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Letreiro entre a Stack e o Sobre (referências: faixa de logos com frase
 * ao lado + nomes espaçados com pontos). Duas fileiras em sentidos opostos:
 * as tecnologias com ícone e as áreas em que elas trabalham.
 */
export default function TechMarquee() {
  return (
    <section className="marquee" aria-labelledby="marquee-title">
      <div className="w marquee__inner">
        <p className="marquee__title rv" id="marquee-title">
          As ferramentas por trás de cada projeto, do sinal de campo ao deploy.
        </p>

        <div className="marquee__rows">
          <Row
            className="marquee__row--tech"
            label="Tecnologias"
            items={TECH}
            renderItem={(name) => {
              const TechIcon = ICONS[name];
              return (
                <>
                  {TechIcon && <TechIcon aria-hidden="true" focusable="false" />}
                  {name}
                </>
              );
            }}
          />
          <Row
            className="marquee__row--fields"
            label="Áreas de atuação"
            items={FIELDS}
            renderItem={(field) => field}
          />
        </div>
      </div>
    </section>
  );
}
