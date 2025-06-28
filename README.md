# 🎬 Movie API - Prueba Técnica NestJS + MongoDB

API RESTful desarrollada con **NestJS** y **MongoDB** que permite a los usuarios registrarse, iniciar sesión, buscar películas/series usando la API de OMDb, guardar favoritos y calificarlos. Incluye autenticación JWT, validaciones con Zod y estructura modular.

---

## 🚀 Tecnologías Utilizadas

- **NestJS** (Framework Backend)
- **MongoDB Atlas** (Base de datos NoSQL)
- **Mongoose** (ODM)
- **Zod** (Validaciones de DTOs)
- **JWT** (Autenticación segura)
- **OMDb API** (Base de datos de películas y series)
- **Nodemailer** (Verificación por email)
- **Postman** (Pruebas manuales)

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/movie-api.git
cd movie-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=mongodb+srv://demo:demo123@demo.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=superSecretKey123
JWT_EXPIRES_IN=3600s
OMDB_API_KEY=tu_clave_omdb
OMDB_BASE_URL=https://www.omdbapi.com/

EMAIL_FROM=demo.email@gmail.com
EMAIL_PASSWORD=demoappkey1234
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:4200
```

4. Ejecuta el proyecto:

```bash
npm run start:dev
```

---

## 📚 Endpoints Documentados

> 🔐 Los endpoints protegidos requieren autenticación vía Bearer Token.

---

### 🧑‍💻 Autenticación

#### `POST /auth/register`  
**Registrar nuevo usuario**  
_No requiere token_

```json
{
  "name": "Sebastián Torres",
  "email": "demo@gmail.com",
  "password": "SuperPassword123"
}
```

#### `GET /auth/verify-email?token=UUID`  
**Verificar email**  
_No requiere token_

#### `POST /auth/resend-verification`  
**Reenviar correo de verificación**  
_No requiere token_

```json
{
  "email": "demo@gmail.com"
}
```

#### `POST /auth/login`  
**Iniciar sesión**  
_No requiere token_

```json
{
  "email": "demo@gmail.com",
  "password": "SuperPassword123"
}
```

#### `POST /auth/logout`  
**Cerrar sesión**  
_Requiere token_

---

### 🎞️ Películas y Series

#### `GET /movies/search?title=Matrix`  
**Buscar películas por título**  
_Requiere token_

#### `GET /movies/year-movies`  
**Obtener películas y series del año 2025 (aleatorias)**  
_Requiere token_

---

### ⭐ Favoritos

#### `POST /favorites`  
**Agregar película/serie a favoritos**  
_Requiere token_

```json
{
  "imdbID": "tt9150192"
}
```

#### `GET /favorites`  
**Listar favoritos del usuario autenticado**  
_Requiere token_

#### `DELETE /favorites/:imdbID`  
**Eliminar un favorito por ID**  
_Requiere token_

`DELETE /favorites/tt9150192`

---

### 📝 Calificaciones

#### `POST /favorites/rate`  
**Calificar una película/serie favorita**  
_Requiere token_

```json
{
  "imdbID": "tt9150192",
  "rating": 9,
  "comment": "¡Muy buena película!"
}
```

---

## 🧪 Testing con Postman

Puedes usar [Postman](https://www.postman.com/) para probar cada endpoint. Asegúrate de:

- Iniciar sesión para obtener el Bearer Token.
- Usar el token en la pestaña **Authorization** de tipo `Bearer Token`.
- Reemplazar valores como `imdbID` con datos válidos desde OMDb.

---

## ✅ Buenas Prácticas Implementadas

- ✅ DTOs validados con **Zod** y pipe personalizado.
- ✅ Modularización clara (`auth`, `movies`, `favorites`).
- ✅ Manejo de errores consistente con `HttpException`.
- ✅ Autenticación segura con JWT.
- ✅ Verificación de email antes de permitir acceso.
- ✅ Limpieza de favoritos duplicados.
- ✅ Documentación completa y código limpio.

---

## 🛡️ Seguridad y Restricciones

- Usuarios no pueden acceder a recursos sin validar su correo.
- Usuarios solo pueden ver, calificar y eliminar **sus propios** favoritos.
- No se permite agregar un favorito más de una vez.
- Validación estricta de inputs con Zod.
- Passwords hasheadas con bcrypt.

---

## ✉️ Contacto

Desarrollado por: **Sebastián Torres**  
Correo: [sth.frontend@gmail.com](mailto:sth.frontend@gmail.com)