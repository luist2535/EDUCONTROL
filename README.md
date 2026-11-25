# 🎓 EduControl - Aplicación Móvil con Ionic + Angular

Aplicación móvil híbrida desarrollada con **Ionic 8** y **Angular 18 (Standalone Components)** para la gestión y control de actividades académicas.

---

## 🚀 Cómo abrir y ejecutar el proyecto en otra PC

Si descargaste o clonaste este proyecto en otra computadora, sigue estos pasos para que abra sin errores:

### Opción 1: Automática (Windows - Recomendado)
Haz doble clic en el archivo **`INICIAR_PROYECTO.bat`**. Este script evita el bloqueo de permisos de PowerShell, instala las dependencias automáticamente y abre la aplicación en el navegador.

---

### Opción 2: Desde la Terminal (VS Code / CMD)

> ⚠️ **Nota importante para usuarios de Windows (PowerShell):**
> Si al escribir `npm` o `ionic` te sale el error *"No se puede cargar el archivo... no está firmado digitalmente (PSSecurityException)"*, abre una terminal **Command Prompt (CMD)** o ejecuta primero este comando en PowerShell:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

1. **Instalar Node.js** (versión 18 o superior) si aún no lo tienes instalado.
2. **Clonar o descargar el repositorio:**
   ```bash
   git clone https://github.com/luist2535/EDUCONTROL.git
   cd EDUCONTROL
   ```
3. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```
   *(O en PowerShell sin permisos: `npm.cmd install`)*
4. **Levantar el proyecto con Ionic o Angular CLI:**
   - Si tienes Ionic CLI instalado (`npm install -g @ionic/cli`):
     ```bash
     ionic serve
     ```
   - O directamente sin instalar nada global:
     ```bash
     npm start
     ```
5. Abre tu navegador en **`http://localhost:4200`**.

---

## 📂 Archivos JSON de configuración incluidos

El proyecto cuenta con todos los archivos de configuración requeridos por **Ionic CLI**, **Capacitor** y **Angular CLI**:

- `ionic.config.json`: Configuración principal del proyecto para que el comando `ionic serve` / `ionic build` y la extensión de Ionic en VS Code reconozcan el proyecto (`angular-standalone`).
- `capacitor.config.json`: Configuración base de Capacitor (`com.educontrol.app`) para empaquetado nativo.
- `angular.json`: Configuración del compilador de Angular e integración con `@ionic/angular-toolkit`.
- `package.json` y `package-lock.json`: Definición exacta de dependencias (`@ionic/angular`, `ionicons`, `@angular/*`).
- `tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json`: Configuración completa del compilador TypeScript.
