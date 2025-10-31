# 💰 Sistema de Gestión de Finanzas Personales

Aplicación **full-stack** desarrollada con **Spring Boot**, **Angular** y **PostgreSQL**, que permite gestionar ingresos, gastos y presupuestos personales de forma segura e intuitiva.  
El sistema ofrece autenticación JWT, dashboards interactivos y análisis financiero por categorías y períodos.

---

## 🚀 Características principales

- 🔑 **Autenticación y autorización** con Spring Security + JWT.  
- 💵 Registro de **ingresos, gastos y transacciones** categorizadas.  
- 🗂️ Creación de **presupuestos personalizados** por categoría.  
- 📊 Dashboards interactivos para analizar **ingresos vs gastos**.  
- 🔍 Filtros y visualizaciones por tipo de transacción y período.  
- 🧩 Arquitectura cliente-servidor con API REST y base de datos PostgreSQL.

---

## ⚙️ Tecnologías utilizadas

**Backend:** Java · Spring Boot · Spring Security · JPA/Hibernate · PostgreSQL  
**Frontend:** Angular · TypeScript · Chart.js · Bootstrap  
**Otros:** JWT · Maven · REST API · Arquitectura MVC  

---

## 🧠 Arquitectura general

**Personal-Finance-Manager-System/**

**backend/ (Spring Boot)**
- controllers/ → Endpoints REST
- services/ → Lógica de negocio y seguridad
- models/ → Entidades JPA
- security/ → Configuración JWT
  
**frontend/ (Angular)**

- features/ → Dashboard, login, registros
- services/ → Comunicación HTTP con backend
- guards/ → Protección de rutas autenticadas

---

## 📡 Endpoints principales

| Método | Endpoint | Descripción |
|--------|-----------|--------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| `GET` | `/api/transactiones` | Listar transacciones |
| `POST` | `/api/transactiones` | Crear transacción |
| `GET` | `/api/presupuestos` | Consultar presupuestos |
| `GET` | `/api/transacciones/tipo-monto-total` | Resumen de ingresos, gastos y saldo |

**Ejemplo – Login**
```json
POST /api/auth/login
{
  "email": "matias@example.com",
  "password": "123456"
}
```

**Respuesta**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
## 🔐 Seguridad

- Implementación de **Spring Security + JWT** para autenticación sin estado.  
- Validación del token JWT en cada solicitud protegida.  
- Roles de usuario (`ROLE_USER`, `ROLE_ADMIN`).  
- Encriptación de contraseñas y manejo seguro de sesiones.

## 📊 Dashboards y análisis financiero
La interfaz Angular permite visualizar:
- Resumen mensual de ingresos, gastos y saldo.
- Gráficos por categoría (Chart.js).
- Transacciones filtradas por tipo de movimiento.
- Presupuestos configurables con alertas al superarlos.

## 🖼️ Vista previa del sistema
## 🔐 Pantalla de inicio de sesión
- Permite a los usuarios autenticarse mediante correo electrónico y contraseña.
- Integra Spring Security + JWT para garantizar sesiones seguras.

## 📊 Panel principal del usuario
Una vez autenticado, el usuario accede a su panel con un resumen financiero del mes:
- Visualización de ingresos, gastos y saldo total.
- Gráfico circular de gastos por categoría.
- Listado de transacciones y filtros por tipo (gasto/ingreso).

## 🧩 Ejecución local
## 🖥️ Backend (Spring Boot + PostgreSQL)
1.  Crear la base de datos:
  ```bash
  CREATE DATABASE personal_finance_db;
  ```
2. Configurar credenciales en application.properties:
  ```bash
  spring.datasource.url=jdbc:postgresql://localhost:5432/personal_finance_db
  spring.datasource.username=postgres
  spring.datasource.password=tu_contraseña
  spring.jpa.hibernate.ddl-auto=update
  jwt.secret=claveSecretaSegura
  ```
3. Ejecutar:
   ```bash
   cd personal-finance-manager/personal-finance-manager
   mvn spring-boot:run
   ```
## 💻 Frontend (Angular)
1.Instalar dependencias:
```bash
cd personal-finance-manager-frontend/app
npm install
```
2. Ejecutar servidor:
```bash
ng serve --open
```
- Backend → http://localhost:8080
- Frontend → http://localhost:4200

## 💡 Mejoras futuras
- Exportación de reportes en PDF/Excel.
- Soporte multimoneda y tasas de cambio.
- Pruebas unitarias e integración continua.

## 👨‍💻 Autor
- Matías Haspert
- Sistema de gestión de finanzas personales
- Proyecto Full-Stack — 2025 



