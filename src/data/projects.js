import cbpatioHome from '../assets/cbpatio-home.jpg';
import cbpatioFeatured from '../assets/cbpatio-campeonatos.jpg';

/*
 * media.type === 'screens'  -> pilha de capturas com carrossel próprio
 * media.type === 'diagram'  -> diagrama de arquitetura (nodes + edges por índice)
 */
export const projects = [
  {
    id: 'cbpatio',
    label: 'CBPatio',
    category: 'TCC · ETEC Fernando Prestes',
    title: 'CBPatio — plataforma de campeonatos',
    description:
      'Aplicação cliente para divulgação e inscrição nos campeonatos do evento: campeonatos em destaque, times, classificação e busca de jogadores. Mais de 560 commits.',
    tags: ['Vite', 'SQL', 'Vercel', 'ESLint'],
    links: [
      { label: 'Demo ao vivo ↗', href: 'https://cbpatio.vercel.app', primary: true },
      { label: 'Código ↗', href: 'https://github.com/DevWCastle/cbpatio_client' },
    ],
    media: {
      type: 'screens',
      screens: [
        {
          src: cbpatioHome,
          alt: 'Página inicial do CBPatio E-Sports com partida de Rocket League e botão Inscreva-se',
        },
        {
          src: cbpatioFeatured,
          alt: 'Seção Em destaque do CBPatio com campeonatos de Brawl Stars, Rocket League, Valorant, Clash Royale e Free Fire',
        },
      ],
    },
  },
  {
    id: 'erp',
    label: 'Sistema de Gestão Industrial / ERP',
    category: 'Backend · Manutenção industrial',
    title: 'Sistema de Gestão Industrial / ERP',
    description:
      'API REST para controle de rotinas de manutenção preventiva, estoque de insumos e ordens de serviço em tempo real.',
    tags: ['TypeScript', 'NestJS', 'PostgreSQL', 'TypeORM', 'Docker'],
    // Pendente: trocar pelo link do repositório real do ERP (hoje aponta para o perfil).
    links: [{ label: 'Repositório ↗', href: 'https://github.com/DevWCastle' }],
    media: {
      type: 'diagram',
      nodes: ['Client App', 'Controller / Service', 'PostgreSQL / TypeORM', 'Docker Container'],
      edges: [[0, 1], [1, 2], [3, 2]],
      dashed: 3,
      label:
        'Diagrama: Client App se comunica com Controller e Service, que acessam PostgreSQL com TypeORM; tudo empacotado em Docker.',
    },
  },
  {
    id: 'clp',
    label: 'Permissões com reconhecimento facial para CLP',
    category: 'Backend · Integração com hardware',
    title: 'Permissões com reconhecimento facial para CLP',
    description:
      'Sistema de permissão que libera funções de um CLP apenas para pessoas autorizadas, comunicando um Raspberry Pi 4B com o controlador.',
    tags: ['TypeScript', 'Express', 'SQLite', 'JWT', 'Docker'],
    links: [
      { label: 'Código ↗', href: 'https://github.com/DevWCastle/user-permissions-clp-raspberry' },
    ],
    media: {
      type: 'diagram',
      nodes: ['Raspberry Pi 4B', 'API · Express + JWT', 'SQLite', 'CLP'],
      edges: [[0, 1], [1, 2], [0, 3]],
      label:
        'Diagrama: Raspberry Pi 4B conecta a API com Express e JWT, que persiste em SQLite, e comunica com o CLP.',
    },
  },
];
