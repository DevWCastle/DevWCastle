import { useRef, useState } from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Icon from '../Icon/Icon';
import { contact } from '../../data/site';
import './Contact.css';

const MESSAGE_MAX = 1200;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELDS = {
  name: {
    validate: (v) => (v.trim().length >= 2 ? '' : 'Escreva seu nome (pelo menos 2 letras).'),
  },
  email: {
    validate: (v) => (EMAIL_PATTERN.test(v.trim()) ? '' : 'Confira o e-mail: algo como voce@empresa.com.'),
  },
  message: {
    validate: (v) =>
      v.trim().length >= 10 ? '' : 'Conte um pouco mais (pelo menos 10 caracteres).',
  },
};

const LINKS = [
  { key: 'email', label: 'E-mail', value: contact.emailLabel, href: `mailto:${contact.email}`, icon: <Icon name="mail" size={20} /> },
  { key: 'github', label: 'GitHub', value: contact.githubLabel, href: contact.github, icon: <FaGithub aria-hidden="true" />, external: true },
  { key: 'linkedin', label: 'LinkedIn', value: 'Conecte-se comigo', href: contact.linkedin, icon: <FaLinkedinIn aria-hidden="true" />, external: true },
];

/**
 * Formulário sem backend: ao enviar, abre o app de e-mail da pessoa com a
 * mensagem pronta para o endereço do link de e-mail (antes o envio era só
 * simulado). Validação ao sair do campo e no envio, com mensagens por campo.
 */
export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | opened
  const formRef = useRef(null);

  const errors = Object.fromEntries(
    Object.entries(FIELDS).map(([key, field]) => [key, field.validate(values[key])])
  );

  const fieldState = (key) => {
    if (!touched[key]) return values[key] ? 'filled' : 'empty';
    return errors[key] ? 'invalid' : 'valid';
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status === 'opened') setStatus('idle');
  };

  const onBlur = (event) => {
    const { name, value } = event.target;
    if (value) setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = Object.keys(FIELDS).find((key) => errors[key]);
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    const subject = `Contato pelo portfólio: ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('opened');
  };

  const describedBy = (key) => (fieldState(key) === 'invalid' ? `${key}-error` : undefined);

  return (
    <section className="section section--night contact" id="contato" aria-labelledby="contato-title">
      <div className="w contact__grid">
        <div className="contact__info">
          <h2 className="section__title" id="contato-title">
            Vamos <em>conversar?</em>
          </h2>
          <p className="contact__sub">
            Disponível para oportunidades de trabalho, projetos freelance ou parcerias na área de tecnologia.
          </p>

          <ul className="contact__links">
            {LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="contact__icon">{link.icon}</span>
                  <span className="contact__label">{link.label}</span>
                  <span className="contact__value">{link.value}</span>
                  <Icon name="arrow-up-right" size={18} className="contact__arrow" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form ref={formRef} className="contact__form" onSubmit={onSubmit} noValidate>
          <div className={`field field--${fieldState('name')}`}>
            <label htmlFor="name">Nome</label>
            <div className="field__control">
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Seu nome completo"
                value={values.name}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={fieldState('name') === 'invalid'}
                aria-describedby={describedBy('name')}
                required
              />
              <Icon name="check" size={18} className="field__ok" />
            </div>
            {fieldState('name') === 'invalid' && (
              <p className="field__error" id="name-error">{errors.name}</p>
            )}
          </div>

          <div className={`field field--${fieldState('email')}`}>
            <label htmlFor="email">E-mail</label>
            <div className="field__control">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="voce@email.com"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={fieldState('email') === 'invalid'}
                aria-describedby={describedBy('email')}
                required
              />
              <Icon name="check" size={18} className="field__ok" />
            </div>
            {fieldState('email') === 'invalid' && (
              <p className="field__error" id="email-error">{errors.email}</p>
            )}
          </div>

          <div className={`field field--area field--${fieldState('message')}`}>
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={MESSAGE_MAX}
              placeholder="Conte sobre a vaga, o projeto ou a ideia."
              value={values.message}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={fieldState('message') === 'invalid'}
              aria-describedby={`message-count${describedBy('message') ? ' message-error' : ''}`}
              required
            />
            <p className="field__count data" id="message-count">
              {values.message.length} / {MESSAGE_MAX}
            </p>
            {fieldState('message') === 'invalid' && (
              <p className="field__error" id="message-error">{errors.message}</p>
            )}
          </div>

          <div className="contact__submit">
            <button className="btn btn--primary" type="submit">
              Enviar mensagem
              <Icon name="arrow-up-right" size={16} />
            </button>
            <p className="contact__status" role="status">
              {status === 'opened' && (
                <>
                  Seu app de e-mail foi aberto com a mensagem pronta. Se nada abriu, escreva para{' '}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
