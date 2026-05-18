# OSINT Biometric App

Proyecto full-stack listo para abrir en Visual Studio Code.

## Estructura

```txt
osint-biometric-app/
  frontend/
    src/
      assets/fingerprints/   # Aquí puedes poner tus imágenes reales de huellas
      App.jsx
      api.js
      main.jsx
      styles.css
  backend/
    src/
      config/db.js
      controllers/
      middleware/
      models/User.js
      routes/
      services/emailService.js
      seed.js
      server.js
```

## 1. Configurar MongoDB Atlas

1. Crea un cluster en MongoDB Atlas.
2. Crea un usuario de base de datos.
3. En Network Access, permite tu IP o temporalmente `0.0.0.0/0`.
4. Copia tu connection string.
5. En `backend`, copia `.env.example` como `.env` y cambia:

```env
MONGO_URI=mongodb+srv://matiaz490_db_user:<db_password>@cluster0.hx7htdw.mongodb.net/
JWT_SECRET=una_clave_muy_segura
FRONTEND_URL=http://localhost:5173
```

## 2. Instalar backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Credenciales iniciales:

```txt
Admin: admin@app.com / admin123
Cliente: cliente@app.com / 123456
```

## 3. Instalar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre el enlace que muestra Vite, normalmente:

```txt
http://localhost:5173
```

## 4. Cambiar las huellas del PDF por imágenes reales

Guarda tus imágenes aquí:

```txt
frontend/src/assets/fingerprints/
  thumb-left.png
  index-left.png
  thumb-right.png
  index-right.png
```

Después, en `frontend/src/App.jsx`, busca la sección `Anexo biométrico` dentro del componente `Document` y reemplaza `FingerprintSVG` por etiquetas `img`.

Ejemplo:

```jsx
import thumbLeft from './assets/fingerprints/thumb-left.png';

<img src={thumbLeft} alt="Pulgar izquierdo" />
```

## 5. Correo electrónico

Ahora el backend simula el envío y lo muestra en consola.

Si quieres envío real, configura SMTP en `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM="OSINT Forensic Suite <tu_correo@gmail.com>"
```

## 6. Desplegar en Render

El proyecto ya incluye `render.yaml`, `.gitignore`, `backend/.env.example`, `frontend/.env.example` y la guia completa:

```txt
DEPLOY_RENDER.md
```

Resumen:

1. Sube el proyecto a GitHub.
2. En Render crea un **Blueprint** desde el repositorio.
3. Render creara `osint-biometric-api` y `osint-biometric-frontend`.
4. En el backend completa `MONGO_URI`.
5. Cuando el backend este activo, ejecuta una sola vez:

```bash
npm run seed
```

## Nota importante

El documento generado está planteado como constancia interna del sistema. No debe usarse para imitar documentos oficiales.
