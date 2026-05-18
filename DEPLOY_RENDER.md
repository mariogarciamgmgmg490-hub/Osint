# Despliegue en Render

Esta app esta preparada para desplegar dos servicios en Render:

- `osint-biometric-api`: backend Node/Express.
- `osint-biometric-frontend`: frontend React/Vite como Static Site.

## 1. Antes de subir

Sube este proyecto a GitHub. No subas archivos `.env`; el `.gitignore` ya los excluye.

En MongoDB Atlas:

1. Entra a tu cluster.
2. Ve a **Database Access** y crea un usuario con password.
3. Ve a **Network Access** y agrega `0.0.0.0/0` para permitir conexiones desde Render.
4. Copia tu connection string y ponle nombre de base de datos al final, por ejemplo:

```txt
mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/osint-biometric-app
```

## 2. Crear Blueprint en Render

1. Entra a Render.
2. Click en **New +**.
3. Selecciona **Blueprint**.
4. Conecta el repositorio de GitHub.
5. Render detectara `render.yaml`.
6. Click en **Apply**.

Render creara el frontend y backend.

## 3. Variables que debes llenar

En el servicio `osint-biometric-api`, Render pedira estas variables porque estan como `sync: false`:

```txt
MONGO_URI=tu_connection_string_de_mongodb_atlas
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Solo `MONGO_URI` es obligatoria.

`JWT_SECRET` se genera solo.

`FRONTEND_URL` ya queda configurada como:

```txt
https://osint-biometric-frontend.onrender.com
```

En el servicio `osint-biometric-frontend`, `VITE_API_URL` ya queda configurada como:

```txt
https://osint-biometric-api.onrender.com/api
```

## 4. Usuario admin inicial

Render ejecuta automaticamente este comando una sola vez despues del primer despliegue exitoso del backend:

```bash
npm run seed
```

Ese comando crea los usuarios demo solo si no existen:

```txt
Admin: admin@app.com / admin123
Cliente: cliente@app.com / 123456
```

Si necesitas ejecutarlo manualmente despues, entra al servicio `osint-biometric-api` en Render, abre **Shell** y ejecuta:

```bash
npm run seed
```

## 5. Verificar

Abre:

```txt
https://osint-biometric-api.onrender.com/api/health
```

Debe responder:

```json
{"ok":true}
```

Luego abre la URL del frontend:

```txt
https://osint-biometric-frontend.onrender.com
```

## 6. Si cambias nombres

Si cambias los nombres de servicios en Render, actualiza tambien los nombres y las URLs en `render.yaml`:

```yaml
name: osint-biometric-api
name: osint-biometric-frontend
FRONTEND_URL=https://osint-biometric-frontend.onrender.com
VITE_API_URL=https://osint-biometric-api.onrender.com/api
```

## 7. Nota sobre plan gratis

En el plan gratis, el backend puede dormir despues de un rato sin uso. La primera carga despues de estar dormido puede tardar. Para uso real, cambia `plan: free` a un plan pago desde Render.
