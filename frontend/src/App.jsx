import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, clearSession, getStoredUser, setSession } from './api';

import huellaPulgarDerecha from './assets/fingerprints/huellas_Pulgarderecha.jpg';
import huellaPulgarIzquierdo from './assets/fingerprints/huellas_Pulgarizquierdo.jpg';
import huellaIndiceIzquierdo from './assets/fingerprints/huellas_Indiceizquierdo.jpg';
import huellaIndiceDerecho from './assets/fingerprints/huellas_Indicederecho.jpg';

const HOLD_MS = 5000;

const fingerLabels = [
  'Pulgar izquierdo',
  'Índice izquierdo',
  'Pulgar derecho',
  'Índice derecho'
];

const fingerImages = {
  'Pulgar izquierdo': huellaPulgarIzquierdo,
  'Índice izquierdo': huellaIndiceIzquierdo,
  'Pulgar derecho': huellaPulgarDerecha,
  'Índice derecho': huellaIndiceDerecho
};

function Icon({ name, className = '' }) {
  const paths = {
    lock: 'M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6V10Z',
    fp: 'M12 3c-4.4 0-8 3.4-8 7.7 0 2.7.9 4.9 2.4 6.7M12 6c-2.8 0-5 2.1-5 4.7 0 2.8 1.8 4.6 2.8 6.5M12 9c-1.2 0-2.2.9-2.2 2.1 0 1.2 1.1 1.8 1.6 2.7M14.4 9.8c1.4 1.4 1.5 3.6.2 5.1-1.6 1.8-4.3 1.6-5.6-.3M16.4 7.5c2.4 2.5 2.5 6.3.3 8.9-1.5 1.8-2.2 3.4-2.3 5.6',
    doc: 'M7 3h7l4 4v14H7V3Z M14 3v5h5 M9 13h6 M9 17h6',
    out: 'M10 5H6v14h4M14 8l4 4-4 4M18 12H9',
    search: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM16 16l4 4',
    edit: 'M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4',
    back: 'M15 6 9 12l6 6'
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.fp} />
    </svg>
  );
}

function FingerprintSVG({ dark = false, className = '', style = {} }) {
  const s = dark ? '#020617' : 'currentColor';

  return (
    <svg viewBox="0 0 220 300" className={className} style={style} fill="none">
      <path d="M111 38c-45 0-81 34-81 77 0 27 9 49 25 67" stroke={s} strokeWidth="8" strokeLinecap="round" />
      <path d="M111 58c-34 0-62 26-62 58 0 35 22 57 35 80" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M112 78c-24 0-43 18-43 40 0 24 20 39 25 62" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M113 97c-13 0-24 10-24 22 0 13 12 20 17 30" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M115 118c8 3 11 12 5 19-6 8-17 9-22 1" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M133 101c16 14 17 36 3 51-16 18-43 15-56-5" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M149 84c26 24 27 61 4 87-25 28-69 28-95-2" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M164 66c37 34 40 88 8 124-37 43-96 42-133 2" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M183 87c17 31 16 70-9 101-15 19-23 37-24 62" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M130 170c-14 24-17 49-9 82" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M102 168c-7 26-5 55 8 91" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M78 156c-9 32-4 69 15 107" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M55 134c-8 44 2 91 32 133" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M166 207c-6 17-9 36-8 57" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M187 181c-16 29-24 57-23 88" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M198 126c3 38-7 70-30 95" stroke={s} strokeWidth="7" strokeLinecap="round" />
      <path d="M73 38c24-14 56-15 83-3" stroke={s} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Matrix() {
  return <div className="matrix" />;
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Input(p) {
  return <input {...p} className={`input ${p.className || ''}`} />;
}

function Textarea(p) {
  return <textarea {...p} className="textarea" />;
}

function Header({ title, subtitle, onLogout }) {
  return (
    <div className="header card p">
      <div>
        <Badge>OSINT Forensic Suite</Badge>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>

      <button className="btn secondary" onClick={onLogout}>
        <Icon name="out" /> Salir
      </button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(getStoredUser());

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <main className="app">
      <div className="wrap">
        <AnimatePresence mode="wait">
          {!user ? (
            <Login onLogin={setUser} />
          ) : user.role === 'admin' ? (
            <Admin user={user} onLogout={logout} />
          ) : (
            <Client user={user} onLogout={logout} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');

    try {
      const data = await api.login(form);
      setSession(data.token, data.user);
      onLogin(data.user);
    } catch (ex) {
      setErr(ex.message);
    }
  }

  return (
    <motion.div className="card login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hero">
        <Matrix />

        <div className="heroContent">
          <div>
            <Badge>OSINT · Forensic Identity Suite</Badge>
            <h1>Análisis OSINT, biometría y custodia digital.</h1>
            <p className="muted">
              Sistema de digitalización dactilar Zeenblock para la gestión de denuncias y procesos de recuperación de capitales.
            </p>
          </div>

          <div className="grid2">
            <div className="statBox">Seguridad</div>
            <div className="statBox">Transparencia</div>
            <div className="statBox">Auditorias</div>
            <div className="statBox">Biometria</div>
          </div>
        </div>
      </div>

      <div className="p">
        <h2>Acceso forense</h2>

        <form onSubmit={submit}>
          <Field label="Correo">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          <Field label="Contraseña">
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          {err && <p style={{ color: '#fecaca' }}>{err}</p>}

          <button className="btn" style={{ width: '100%' }}>
            <Icon name="lock" /> Entrar
          </button>
        </form>

        
      </div>
    </motion.div>
  );
}

function Admin({ onLogout }) {
  const empty = {
    name: '',
    email: '',
    dni: '',
    password: '',
    age: '',
    amount: '',
    recoveryAmount: '',
    process: '',
    paid: false
  };

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [q, setQ] = useState('');

  async function load() {
    setUsers(await api.listUsers());
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      amount: Number(form.amount),
      recoveryAmount: Number(form.recoveryAmount)
    };

    if (editId) {
      await api.updateUser(editId, payload);
    } else {
      await api.createUser(payload);
    }

    setForm(empty);
    setEditId(null);
    load();
  }

  function edit(u) {
    setEditId(u._id);
    setForm({
      ...u,
      password: '',
      age: String(u.age),
      amount: String(u.amount),
      recoveryAmount: String(u.recoveryAmount || 0)
    });
  }

  async function toggle(id) {
    await api.togglePaid(id);
    load();
  }

  const filtered = useMemo(
    () =>
      users.filter((u) =>
        [u.name, u.email, u.dni, u.process]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [users, q]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Header
        title="Panel administrativo"
        subtitle="Registro de expedientes, pago, valor a recuperar y usuarios."
        onLogout={onLogout}
      />

      <div className="grid2">
        <div className="card p">
          <h2>{editId ? 'Editar expediente' : 'Nuevo expediente'}</h2>

          <form onSubmit={save}>
            <Field label="Nombre">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            <div className="row">
              <Field label="Correo">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Field>

              <Field label="DNI">
                <Input
                  value={form.dni}
                  onChange={(e) => setForm({ ...form, dni: e.target.value })}
                  required
                />
              </Field>
            </div>

            <div className="row">
              <Field label="Contraseña">
                <Input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editId ? 'Dejar vacío para no cambiar' : ''}
                />
              </Field>

              <Field label="Edad">
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                />
              </Field>
            </div>

            <div className="row">
              <Field label="Monto a pagar">
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </Field>

              <Field label="Valor a recuperar">
                <Input
                  type="number"
                  value={form.recoveryAmount}
                  onChange={(e) => setForm({ ...form, recoveryAmount: e.target.value })}
                  required
                />
              </Field>
            </div>

            <Field label="Proceso">
              <Textarea
                value={form.process}
                onChange={(e) => setForm({ ...form, process: e.target.value })}
              />
            </Field>

            <Field label="Estado de pago">
              <select
                className="select"
                value={form.paid ? 'si' : 'no'}
                onChange={(e) => setForm({ ...form, paid: e.target.value === 'si' })}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </Field>

            <button className="btn">Guardar expediente</button>
          </form>
        </div>

        <div className="card p">
          <h2>Expedientes</h2>

          <Input placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />

          <div className="list">
            {filtered.map((u) => (
              <div className="clientItem" key={u._id}>
                <b>{u.name}</b>
                <p className="muted">
                  {u.email} · DNI {u.dni}
                </p>

                <p>
                  Valor a recuperar: €
                  {Number(u.recoveryAmount || 0).toLocaleString('es-ES')}
                </p>

                <div className="row">
                  <button className="btn secondary" onClick={() => toggle(u._id)}>
                    {u.paid ? 'Marcar no pagado' : 'Marcar pagado'}
                  </button>

                  <button className="btn" onClick={() => edit(u)}>
                    <Icon name="edit" /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Client({ user, onLogout }) {
  const [current, setCurrent] = useState(user);
  const [step, setStep] = useState('profile');
  const [active, setActive] = useState(null);
  const [scanned, setScanned] = useState([]);
  const [progress, setProgress] = useState(0);

  const raf = useRef(null);
  const start = useRef(0);

  useEffect(() => {
    api.me().then((d) => setCurrent(d.user));
  }, []);

  function reset() {
    cancelAnimationFrame(raf.current);
    setActive(null);
    setProgress(0);
  }

  function hold(label) {
    if (active || scanned.includes(label)) return;

    setActive(label);
    start.current = performance.now();

    const tick = (now) => {
      const p = Math.min(100, ((now - start.current) / HOLD_MS) * 100);
      setProgress(p);

      if (p >= 100) {
        setScanned((v) => {
          const n = [...v, label];

          if (n.length === 4) {
            setTimeout(() => setStep('payment'), 500);
          }

          return n;
        });

        reset();
        return;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (active && progress < 100) reset();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Header
        title={`Expediente: ${current.name}`}
        subtitle="Captura biométrica por presión sostenida durante 5 segundos."
        onLogout={onLogout}
      />

      {step === 'profile' && (
        <Profile
          user={current}
          onStart={() => {
            setScanned([]);
            setStep('scan');
          }}
        />
      )}

      {step === 'scan' && (
        <Scan
          active={active}
          progress={progress}
          scanned={scanned}
          onStart={hold}
          onCancel={cancel}
        />
      )}

      {step === 'payment' && (
        <Payment
          user={current}
          scanned={scanned}
          onBack={() => setStep('profile')}
          onContinue={() => setStep('document')}
        />
      )}

      {step === 'document' && (
        <Document user={current} onBack={() => setStep('profile')} />
      )}
    </motion.div>
  );
}

function Profile({ user, onStart }) {
  return (
    <div className="card p grid2">
      <div>
        <FingerprintSVG className="fingerSvg" />
        <h2>{user.name}</h2>
        <p>DNI: {user.dni}</p>
        <p>Edad: {user.age}</p>
        <p>Pago: {user.paid ? 'Pagado' : 'Pendiente'}</p>
      </div>

      <div>
        <h2>Proceso asignado</h2>
        <p className="muted">{user.process}</p>
        <p>Debe mantener cada huella presionada durante 5 segundos.</p>
        <button className="btn" onClick={onStart}>
          Iniciar escáner
        </button>
      </div>
    </div>
  );
}

function Scan({ active, progress, scanned, onStart, onCancel }) {
  return (
    <div className="card p">
      <h2>Escáner biométrico OSINT</h2>
      <p className="muted">Mantenga presionada cada huella hasta completar 100%.</p>

      <div className="scanner">
        <div className="scannerScreen">
          <Matrix />
          {active && <div className="laser" />}
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
          <FingerprintSVG className="fingerSvg" />
          <div className="screenLabel">
            {active ? `SCANNING ${Math.floor(progress)}%` : 'READY'}
          </div>
        </div>
      </div>

      <div className="grid4">
        {fingerLabels.map((label) => (
          <button
            key={label}
            disabled={(active && active !== label) || scanned.includes(label)}
            onPointerDown={() => onStart(label)}
            onPointerUp={onCancel}
            onPointerLeave={onCancel}
            className={`fingerBtn ${active === label ? 'active' : ''} ${
              scanned.includes(label) ? 'done' : ''
            }`}
          >
            <FingerprintSVG className="fingerSvg" style={{ width: 70, height: 90 }} />
            <b>{label}</b>
            <p>
              {scanned.includes(label)
                ? 'Validada'
                : active === label
                ? 'No sueltes'
                : 'Mantén presionado'}
            </p>
          </button>
        ))}
      </div>

      <div className="progress">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Payment({ user, onBack, onContinue }) {
  return (
    <div className="card p" style={{ textAlign: 'center' }}>
      {user.paid ? (
        <>
          <h2>Pago validado</h2>
          <p>Las 4 huellas fueron capturadas.</p>
          <button className="btn" onClick={onContinue}>
            Ver hoja biométrica
          </button>
        </>
      ) : (
        <>
          <h2>Pago pendiente</h2>
          <p>El administrador debe marcar el pago como realizado.</p>
          <h1>${Number(user.amount).toFixed(2)}</h1>
          <button className="btn secondary" onClick={onBack}>
            Volver
          </button>
        </>
      )}
    </div>
  );
}

function Document({ user, onBack }) {
  const [sent, setSent] = useState(false);

  async function send() {
    await api.sendEmail(user._id);
    setSent(true);
    setTimeout(() => setSent(false), 4500);
  }

  const rec = Number(user.recoveryAmount || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2
  });

  return (
    <div>
      <div className="print-hidden row" style={{ marginBottom: 16 }}>
        <button className="btn secondary" onClick={onBack}>
          <Icon name="back" /> Volver
        </button>

        <button className="btn" onClick={send}>
          <Icon name="doc" /> Enviar por correo electrónico
        </button>
      </div>

      {sent && (
        <div className="card p print-hidden">
          Documento enviado correctamente al correo de su abogado
        </div>
      )}

      <div className="document">
        <section className="docSection">
          <h1>Constancia interna de expediente</h1>

         

          <p>
            Por medio de la presente se deja constancia interna de que la persona{' '}
            <b>{user.name}</b>, identificada con Documento Nacional de Identidad número{' '}
            <b>{user.dni}</b>, consta registrada en el expediente digital.
          </p>

          <p>
            El importe total registrado como valor a recuperar asciende a{' '}
            <b>{rec} euros</b>.
          </p>

          <p>
            Descripción del proceso: <b>{user.process}</b>
          </p>

          <div className="grid2">
            <div>
              <h3>Cliente</h3>
              <Info label="Nombre" value={user.name} />
              <Info label="Correo" value={user.email} />
              <Info label="DNI" value={user.dni} />
              <Info label="Edad" value={`${user.age} años`} />
            </div>

            <div>
              <h3>Datos económicos</h3>
              <Info label="Pago proceso" value={`$${Number(user.amount).toFixed(2)}`} />
              <Info label="Valor a recuperar" value={`${rec} euros`} />
              <Info label="Estado" value="Pagado" />
            </div>
          </div>
        </section>

        <section className="docSection">
          <h1>Anexo biométrico</h1>
          <p>Capturas biométricas asociadas al expediente.</p>

          <div className="grid2">
            {fingerLabels.map((label) => (
              <div className="fingerPrintBox" key={label}>
                <div
                  style={{
                    height: 280,
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={fingerImages[label]}
                    alt={`Huella dactilar - ${label}`}
                    className="fingerprintRealImg"
                    style={{
                      width: 170,
                      height: 240,
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </div>

                <b>{label}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="infoRow">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}