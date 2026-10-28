import React from 'react';
import './TechStack.css';

const stackCategories = [
  {
    title: 'FRONTEND',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS']
  },
  {
    title: 'BACKEND',
    items: ['Node.js', 'NestJS', 'Express', 'Prisma']
  },
  {
    title: 'BANCO DE DADOS',
    items: ['PostgreSQL', 'MySQL', 'TypeORM']
  },
  {
    title: 'DEVOPS',
    items: ['Docker', 'Git & GitHub', 'Linux', 'Vercel']
  },
  {
    title: 'AUTOMAÇÃO/IOT',
    items: ['Arduino', 'Raspberry Pi']
  }
];

export default function TechStack() {
  return (
    <section className="dark" id="stack">
      <div className="w">
        <div className="lbl">STACK</div>
        <h2>Ferramentas que uso <em>no dia a dia</em></h2>
        <div className="cols">
          {stackCategories.map((cat, idx) => (
            <div key={idx}>
              <h3>{cat.title}</h3>
              <ul>
                {cat.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}