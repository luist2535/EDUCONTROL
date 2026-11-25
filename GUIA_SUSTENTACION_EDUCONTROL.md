# 🎓 Guía Maestra de Sustentación: Proyecto EduControl

Bienvenido a la guía completa para exponer y defender el proyecto **EduControl** en clase. Este documento está estructurado de forma pedagógica y técnica para que entiendas **cada archivo, cada componente visual, el flujo de datos y las preguntas que te puede hacer el docente**.

---

## 1. 📋 Resumen Ejecutivo del Proyecto
* **Nombre de la App:** EduControl
* **Propósito:** Aplicación móvil híbrida para la gestión, registro, seguimiento y consulta de actividades académicas (talleres, exámenes, proyectos) por asignaturas.
* **Tecnologías Base:** 
  * **Framework Frontend:** Angular 18 (Arquitectura moderna basada en **Standalone Components**, sin `NgModule`).
  * **Framework UI Móvil:** Ionic Framework 8 (`@ionic/angular`).
  * **Estilos:** SCSS con variables nativas de Ionic / CSS Custom Properties.
  * **Persistencia:** Web Storage API (`LocalStorage`) con serialización/deserialización en formato JSON.
  * **Patrón de Manejo de Estado:** Servicio singleton reactivo con `RxJS` (`BehaviorSubject` / `Observable`).

---

## 2. 🏗️ Arquitectura General y Flujo de Datos

```
[Usuario / Pantalla] ──(Inyecta)──> [ActividadService Singleton]
                                          │          ▲
                               (JSON.stringify)  (JSON.parse)
                                          ▼          │
                                   [(LocalStorage: 'actividades')]
```

### Principio de Responsabilidad Única (SRP):
1. **Modelos (`src/app/shared/models/actividad.model.ts`):** Definen las estructuras e interfaces TypeScript (contratos de datos).
2. **Servicio (`src/app/shared/services/actividad.service.ts`):** Es la única fuente de la verdad (*Single Source of Truth*). Contiene toda la lógica de negocio, cálculos de progreso y acceso a `LocalStorage`.
3. **Páginas (`src/app/pages/`):** Vistas desacopladas que consumen el servicio y muestran la interfaz visual con componentes Ionic.

---

## 3. 🧩 Componentes Utilizados (Pantalla por Pantalla)

Aquí tienes el desglose exacto de **cada componente que se usó y por qué se usó**.

### A. Estructura Global y Menú Lateral (`AppComponent`)
* **Archivos:** `src/app/app.component.html`, `app.component.ts`, `app.component.scss`
* **Componentes clave de Ionic:**
  * `<ion-app>`: Contenedor raíz mandatorio de cualquier app Ionic. Inicializa el ciclo de vida y diseño de plataforma (Android/Material Design o iOS).
  * `<ion-split-pane>`: Permite que en pantallas grandes (tablets/PC) el menú quede fijo a la izquierda, y en móviles se oculte como un menú desplegable lateral.
  * `<ion-menu>`: Menú lateral (*drawer*) con soporte para gestos táctiles.
  * `<ion-router-outlet>`: Lugar donde Angular inyecta dinámicamente las páginas según la URL activa.
  * `<ion-list>`, `<ion-item>`, `<ion-menu-toggle>`: Para los ítems del menú con navegación declarativa (`routerLink`).
  * `<ion-badge>`: Muestra contadores dinámicos (por ejemplo, actividades pendientes).
  * `addIcons` de `ionicons`: Para registrar los íconos vectoriales usados en toda la aplicación de manera optimizada (evitando cargar paquetes completos que hagan la app pesada).

---

### B. Módulo 1: Inicio / Dashboard (`HomePage`)
* **Ruta:** `/home`
* **Propósito:** Mostrar al estudiante un resumen inmediato de su avance, porcentaje completado y tareas urgentes.
* **Componentes clave:**
  * `<ion-card>` con subcomponentes `<ion-card-header>`, `<ion-card-title>`, `<ion-card-content>`: Estructura de tarjetas con sombras y bordes redondeados adaptados a Material Design.
  * `<ion-progress-bar>`: Barra de progreso visual que recibe un valor entre `0` y `1` (porcentaje / 100).
  * `<ion-grid>`, `<ion-row>`, `<ion-col>`: Sistema de rejilla flexible (Flexbox de 12 columnas) para organizar los cuadros estadísticos (Total, Pendientes, Completadas) de forma responsiva.
  * `<ion-chip>`: Pequeñas etiquetas (*badges* estéticos) para identificar rápidamente el tipo de actividad o la asignatura.
  * `<ion-button>`: Botones de llamada a la acción (*Cargar datos demo*, *Ver actividades*, *Marcar completada*).

---

### C. Módulo 2: Formulario de Registro y Edición (`RegistroPage`)
* **Ruta:** `/registro` o `/registro?id=:id` (Modo edición)
* **Propósito:** Captura de datos, validación reactiva y persistencia de actividades.
* **Tecnologías y Componentes clave:**
  * **Angular Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`):** Manejo robusto del estado del formulario, validaciones de obligatoriedad (`Validators.required`) y control de errores.
  * `<ion-input>`: Entrada de texto para el título y nombre.
  * `<ion-textarea>`: Área de texto multilínea para la descripción.
  * `<ion-select>` y `<ion-select-option>`: Menú desplegable nativo para seleccionar la Asignatura y el Tipo (Taller, Examen, Proyecto).
  * `<ion-toggle>`: Interruptor booleano para marcar si la actividad es de alta prioridad (`prioritaria: boolean`).
  * `<ion-checkbox>`: Casillas de selección múltiple para los recursos requeridos (Internet, Computador, Biblioteca).
  * `AlertController`: Muestra una alerta emergente modal cuando el usuario intenta enviar campos vacíos.
  * `ToastController`: Notificaciones flotantes en la parte inferior informando que el registro se guardó con éxito.

---

### D. Módulo 3: Consulta y Administración (`ConsultaPage` + `DetalleModalComponent`)
* **Ruta:** `/consulta`
* **Propósito:** Listar todas las actividades, buscar por nombre, filtrar por estado, deslizar para acciones rápidas o ver el detalle en una ventana modal.
* **Componentes clave:**
  * `<ion-searchbar>`: Barra de búsqueda con limpieza automática e ícono integrado para filtrar en tiempo real.
  * `<ion-segment>` y `<ion-segment-button>`: Pestañas superiores para filtrar entre "Todas", "Pendientes" y "Completadas".
  * `<ion-item-sliding>` + `<ion-item-options>` + `<ion-item-option>`: **Interacción móvil clave**. Permite deslizar un ítem de la lista hacia la izquierda para revelar botones de acción rápida (*Completar*, *Editar*, *Eliminar*).
  * `ModalController`: Abre el componente modal `DetalleModalComponent` encima de la pantalla actual para inspeccionar todos los datos de la actividad sin recargar la página.

---

### E. Módulo 4: Información Académica (`InformacionPage`)
* **Ruta:** `/informacion`
* **Propósito:** Mostrar las asignaturas cursadas, docente a cargo, descripción y progreso individual por materia.
* **Componentes clave:**
  * `<ion-accordion-group>` y `<ion-accordion>`: Contenedores desplegables que permiten expandir y contraer la información de cada materia para no saturar la pantalla.
  * Filtro y cálculo dinámico de estadísticas por materia llamando a `getEstadisticasPorAsignatura()`.

---

## 4. 💾 Cómo Funciona LocalStorage y la Persistencia

Cuando el profesor te pregunte: **"¿Dónde se guardan los datos y cómo no se pierden al recargar la página?"**, respondes:

1. **La clave única:** Todo se guarda en el navegador bajo la llave `'actividades'`.
2. **Serialización:** Como `LocalStorage` solo almacena texto plano (strings), usamos:
   ```typescript
   JSON.stringify(actividades); // Convierte arreglo de objetos TypeScript a texto JSON
   ```
3. **Deserialización:** Al iniciar o consultar la app, leemos el texto y lo convertimos de vuelta en objetos utilizables:
   ```typescript
   JSON.parse(data); // Convierte el texto JSON en Array<Actividad>
   ```
4. **Datos Demo de Respaldo:** Si el usuario entra por primera vez y `localStorage.getItem('actividades')` es `null`, el servicio carga automáticamente 6 actividades de ejemplo para que la app nunca se vea vacía.

---

## 5. ⚠️ El Problema Técnico que se Resolvió (Pregunta de Nivel Alto)

Si te preguntan por qué la app se trababa o consumía mucha memoria antes:
* **Causa:** Había un **bucle infinito reactivo**. Un componente suscrito al observable llamaba a `getEstadisticas()`, el cual volvía a disparar `subject.next()`, ejecutando nuevamente la suscripción miles de veces por segundo hasta colapsar Chrome.
* **Solución Técnica:** Se desacopló la lectura (`recuperarActividades`) de la emisión del observable. Ahora el observable únicamente emite cambios cuando **realmente se altera la base de datos** (`guardarActividades`), manteniendo el consumo de memoria y CPU en niveles óptimos.

---

## 6. 🎯 Posibles Preguntas del Docente y Cómo Responderlas

| Pregunta del Profesor | Tu Respuesta Técnica |
|---|---|
| **¿Por qué usaron Standalone Components en vez de NgModules?** | Porque es el estándar actual y recomendado desde Angular 14+. Elimina código repetitivo (*boilerplate*), mejora la carga diferida (*Lazy Loading*) y hace que cada componente declare explícitamente solo lo que necesita. |
| **¿Cómo funciona la navegación?** | Mediante el router de Angular configurado en `app.routes.ts`, utilizando `loadComponent` con importación dinámica (`import('./...').then(m => m.Page)`), lo que permite que cada página se descargue solo cuando el usuario entra en ella (*Lazy Loading*). |
| **¿Cómo se comunican los componentes entre sí?** | A través de un servicio singleton (`ActividadService`) inyectado en `root`. No se pasan datos desordenados entre páginas, sino que todos consultan y actualizan el mismo servicio central. |
| **¿Cómo aseguraron que funcione como aplicación web en Netlify sin error 404 al recargar?** | Se configuró el archivo `_redirects` con la regla `/* /index.html 200`, para que cualquier subruta sea capturada por el servidor y delegada al enrutador SPA de Angular. |

---

## 7. 🚀 Guión sugerido para tu Exposición (Paso a Paso en 3 minutos)

1. **Introducción (30 seg):**  
   *"Buenos días profesor/compañeros. Presento EduControl, una aplicación móvil desarrollada con Angular 18 y componentes Ionic 8 para la gestión y seguimiento académico del estudiante."*
2. **Dashboard e Inicio (45 seg):**  
   *"En la pantalla de inicio encontramos un resumen visual con tarjetas e indicadores de progreso calculados dinámicamente con base en las actividades pendientes y completadas."*
3. **Registro y Validación (45 seg):**  
   *"En el módulo de registro implementamos Reactive Forms para validar obligatoriedad de campos, tipos de entrega y recursos necesarios. Si falta algún campo se despliega una alerta modal interactiva."*
4. **Gestión y LocalStorage (60 seg):**  
   *"En la pantalla de consulta usamos `ion-item-sliding` para gestos móviles de deslizar, editar, completar o eliminar. Todos estos cambios impactan de inmediato el `LocalStorage` en formato JSON, garantizando persistencia total incluso si el usuario cierra la aplicación o recarga la página."*
