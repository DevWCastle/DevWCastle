import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>© DevWCastle. Todos os direitos reservados.</div>
        <div>Design Minimalista — Preto &amp; Lime</div>
      </div>
    </footer>
  );
}