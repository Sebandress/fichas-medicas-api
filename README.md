
# Fichas Médicas API

API REST para gestión de fichas médicas electrónicas (Node.js + TypeScript + MongoDB).

Resumen rápido
- Stack: Node 18, Express, TypeScript, Mongoose (MongoDB).
- Auth: JWT (registro/login).
- Documentación: Swagger UI en `/api-docs`.
- Tests: Jest + Supertest + mongodb-memory-server (tests aislados en memoria).

Requisitos previos
- Node >= 18
- npm
- (Opcional) Docker

Instalación y ejecución en desarrollo

1. Clona el repo y entra al directorio:

```bash
cd fichas-medicas-api
npm install
cp .env.example .env
```

2. Ajusta `MONGO_URI` en `.env` si deseas conectar a MongoDB Atlas o local.

3. Ejecuta en modo desarrollo:

```bash
npm run dev
```

Construir para producción

```bash
npm run build
npm start
```

Tests

Los tests usan una base de datos en memoria; no requieren MongoDB externo.

```bash
npm test
```

Variables de entorno
- `MONGO_URI` — cadena de conexión a MongoDB
- `PORT` — puerto de la API (por defecto 3000)
- `JWT_SECRET` — secreto para firmar tokens JWT
- `ADMIN_SECRET` — secreto opcional para crear usuarios admin sin token JWT

Endpoints principales

- POST `/auth/register` — registrar usuario
	- Body: `{ "username": "user", "password": "pass" }`
- POST `/auth/login` — obtener token
	- Body: `{ "username": "user", "password": "pass" }`
	- Respuesta: `{ "token": "<jwt>" }`
- GET `/pacientes?nombre=` — listar pacientes (no requiere auth)
- GET `/pacientes/:rut` — obtener paciente por RUT (no requiere auth)
- POST `/pacientes` — crear paciente (requiere header `Authorization: Bearer <token>`)
	- Ejemplo body mínimo: `{ "nombre": "Juan Pérez", "rut": "12.345.678-9" }`
- POST `/pacientes/:id/consulta` — agregar consulta (requiere auth)
	- Ejemplo body: `{ "fecha": "2026-05-01", "motivo": "Dolor", "diagnostico": "Migraña" }`

Documentación interactiva

Abre `http://localhost:3000/api-docs` una vez corra la app para explorar y probar los endpoints via Swagger UI.

### Probar en Swagger UI

1. Abre `http://localhost:3000/api-docs`
2. Usa `POST /auth/register` para crear un usuario.
3. Usa `POST /auth/login` para obtener el token JWT.
4. Haz clic en el botón `Authorize` en Swagger UI.
5. Ingresa el token en el formato `Bearer <tu_token>` y confirma.
6. Prueba los endpoints protegidos como `POST /pacientes` y `POST /pacientes/{id}/consulta`.

### Endpoints interactivos

- `POST /auth/register` — registrar usuario
  - Body: `{ "username": "user", "password": "pass" }`
- `POST /auth/login` — obtener token
  - Body: `{ "username": "user", "password": "pass" }`
  - Respuesta: `{ "token": "<jwt>" }`
- `GET /pacientes?nombre=` — listar pacientes (no requiere auth)
- `GET /pacientes/:rut` — obtener paciente por RUT (no requiere auth)
- `POST /pacientes` — crear paciente (requiere header `Authorization: Bearer <token>`)
  - Ejemplo body mínimo: `{ "nombre": "Juan Pérez", "rut": "12.345.678-9" }`
- `POST /pacientes/:id/consulta` — agregar consulta (requiere auth)
  - Ejemplo body: `{ "fecha": "2026-05-01", "motivo": "Dolor", "diagnostico": "Migraña" }`
- `DELETE /pacientes/:id` — eliminar paciente (requiere auth de admin)

Ejemplos rápidos (curl)

1) Registrar y loguear:

```bash
curl -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"test","password":"secret"}'
curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"test","password":"secret"}' | jq
```

2) Crear paciente (usa token devuelto por login):

```bash
TOKEN=<tu_jwt>
curl -X POST http://localhost:3000/pacientes -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
	-d '{"nombre":"Ana","rut":"11.111.111-1"}'
```

3) Obtener paciente por RUT:

```bash
curl http://localhost:3000/pacientes/11.111.111-1
```

Docker

Construir imagen y ejecutar (puedes pasar `MONGO_URI` como variable):

```bash
docker build -t fichas-medicas-api .
docker run -e MONGO_URI="mongodb://host.docker.internal:27017/fichasdb" -p 3000:3000 fichas-medicas-api
```

Despliegue (Render)

- Subir el repo a GitHub.
- Conectar repo en Render, seleccionar `npm install && npm run build` como build command y `npm start` como start command.
- Añadir variables de entorno (`MONGO_URI`, `JWT_SECRET`, `ADMIN_SECRET`).
- También puedes usar el archivo `render.yaml` incluido para crear el servicio automáticamente.

CI

Se incluye un workflow básico de GitHub Actions en `.github/workflows/ci.yml` que ejecuta `npm test` en pushes/pull requests.

Notas de desarrollo
- Los tests se ejecutan con `mongodb-memory-server`; los datos no persisten entre ejecuciones.
- Actualmente las rutas `POST /pacientes` y `POST /pacientes/:id/consulta` requieren autenticación JWT; los `GET` son públicos por simplicidad del MVP.

