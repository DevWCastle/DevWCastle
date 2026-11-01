/*
 * Dados compartilhados entre hero, navegação, contato e rodapé.
 * Pendente: o LinkedIn ainda não tem URL (era "#" no site original),
 * e o e-mail exibido (emailLabel) difere do endereço do link (email).
 */
export const contact = {
  email: 'pedrocastelobrancodosantos@gmail.com',
  emailLabel: 'contato@devwcastle.com',
  github: 'https://github.com/DevWCastle',
  githubLabel: 'github.com/DevWCastle',
  linkedin: '#',
};

export const sections = [
  { id: 'projetos', label: 'Projetos' },
  { id: 'stack', label: 'Stack' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
];

/*
 * Camadas "do chão de fábrica ao deploy". Usa apenas o que o site já
 * listava: as 17 tecnologias da seção Stack + o CLP dos projetos.
 */
export const stackLayers = [
  {
    id: 'sinal',
    shape: 'signal',
    title: 'Sinal',
    line: 'Tudo começa num sinal de campo: um CLP ligando e desligando máquinas.',
    tech: ['CLP'],
  },
  {
    id: 'controlador',
    shape: 'chip',
    title: 'Controlador',
    line: 'Um controlador lê esse sinal e o transforma em dado.',
    tech: ['Arduino', 'Raspberry Pi'],
  },
  {
    id: 'api',
    shape: 'cube',
    title: 'API',
    line: 'Uma API dá regras, permissões e contrato ao dado.',
    tech: ['Node.js', 'NestJS', 'Express', 'Prisma'],
  },
  {
    id: 'banco',
    shape: 'cylinder',
    title: 'Banco',
    line: 'O banco guarda o histórico que a operação consulta depois.',
    tech: ['PostgreSQL', 'MySQL', 'TypeORM'],
  },
  {
    id: 'interface',
    shape: 'window',
    title: 'Interface',
    line: 'A interface devolve tudo para quem decide.',
    tech: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'],
  },
  {
    id: 'deploy',
    shape: 'container',
    title: 'Deploy',
    line: 'E o deploy mantém o sistema de pé, versionado e reproduzível.',
    tech: ['Docker', 'Git & GitHub', 'Linux', 'Vercel'],
  },
];
