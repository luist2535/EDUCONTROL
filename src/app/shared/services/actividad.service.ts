import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actividad, AsignaturaInfo } from '../models/actividad.model';

export type { Actividad, AsignaturaInfo };

const STORAGE_KEY = 'actividades';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private actividades: Actividad[] = [];
  private nextId = 1;
  private actividadesSubject = new BehaviorSubject<Actividad[]>([]);
  public actividades$ = this.actividadesSubject.asObservable();

  constructor() {
    this.recuperarActividades(true);
  }

  // =========================================================================
  // OPERACIONES REQUERIDAS POR EL EXAMEN:
  // 1. Convertir objetos a JSON
  // 2. Convertir JSON a objetos
  // 3. Guardar actividades (en LocalStorage con clave 'actividades')
  // 4. Recuperar actividades (desde LocalStorage con clave 'actividades')
  // =========================================================================

  /**
   * Operación: Convertir objetos a JSON
   * Transforma el arreglo de objetos o cualquier objeto Actividad a string JSON
   */
  convertirObjetosAJson(actividades: Actividad[]): string {
    return JSON.stringify(actividades);
  }

  /**
   * Operación: Convertir JSON a objetos
   * Parsea un string en formato JSON y lo retorna como arreglo de objetos Actividad
   */
  convertirJsonAObjetos(json: string): Actividad[] {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? (parsed as Actividad[]) : [];
    } catch (e) {
      console.error('Error al convertir JSON a objetos:', e);
      return [];
    }
  }

  /**
   * Alias de compatibilidad
   */
  convertirAJson(actividades: Actividad[]): string {
    return this.convertirObjetosAJson(actividades);
  }

  /**
   * Alias de compatibilidad
   */
  convertirDesdeJson(json: string): Actividad[] {
    return this.convertirJsonAObjetos(json);
  }

  /**
   * Operación: Recuperar actividades
   * Recupera las actividades almacenadas en LocalStorage bajo la clave 'actividades'
   * convirtiendo el JSON almacenado a objetos y asignándolos al arreglo
   */
  recuperarActividades(notificar = false): Actividad[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        // Conversión de JSON a objetos
        this.actividades = this.convertirJsonAObjetos(data);
        const maxId = this.actividades.length > 0
          ? Math.max(...this.actividades.map(a => Number(a.id) || 0))
          : 0;
        this.nextId = maxId + 1;
      } else {
        return this.cargarDatosDemo();
      }
    } catch (error) {
      console.error('Error al recuperar actividades desde LocalStorage:', error);
      this.actividades = [];
      this.nextId = 1;
    }
    if (notificar) {
      this.actividadesSubject.next([...this.actividades]);
    }
    return [...this.actividades];
  }

  /**
   * Operación: Guardar actividades
   * Guarda el arreglo de actividades en LocalStorage bajo la clave 'actividades'
   * convirtiendo primero el arreglo de objetos a formato JSON
   */
  guardarActividades(actividades: Actividad[] = this.actividades): void {
    try {
      this.actividades = [...actividades];
      // Conversión de objetos a JSON
      const json = this.convertirObjetosAJson(this.actividades);
      localStorage.setItem(STORAGE_KEY, json);
      this.actividadesSubject.next([...this.actividades]);
    } catch (error) {
      console.error('Error al guardar actividades en LocalStorage:', error);
    }
  }

  getAll(): Actividad[] {
    return this.recuperarActividades();
  }

  getById(id: number): Actividad | undefined {
    this.recuperarActividades();
    return this.actividades.find(a => a.id === id);
  }

  crear(actividad: Omit<Actividad, 'id' | 'estado'>): Actividad {
    this.recuperarActividades();
    const nuevaActividad: Actividad = {
      ...actividad,
      id: this.nextId++,
      estado: 'pendiente'
    };
    this.actividades.push(nuevaActividad);
    this.guardarActividades(this.actividades);
    return nuevaActividad;
  }

  actualizar(id: number, datos: Partial<Actividad>): Actividad | undefined {
    this.recuperarActividades();
    const index = this.actividades.findIndex(a => a.id === id);
    if (index !== -1) {
      this.actividades[index] = { ...this.actividades[index], ...datos, id };
      this.guardarActividades(this.actividades);
      return this.actividades[index];
    }
    return undefined;
  }

  eliminar(id: number): boolean {
    this.recuperarActividades();
    const index = this.actividades.findIndex(a => a.id === id);
    if (index !== -1) {
      this.actividades.splice(index, 1);
      this.guardarActividades(this.actividades);
      return true;
    }
    return false;
  }

  completar(id: number): Actividad | undefined {
    return this.actualizar(id, { estado: 'completada' });
  }

  /**
   * Carga un conjunto de actividades académicas de ejemplo en LocalStorage
   * ideal para sustentación y pruebas completas de todos los módulos
   */
  cargarDatosDemo(): Actividad[] {
    const demo: Actividad[] = [
      {
        id: 1,
        nombre: 'Desarrollo de App EduControl en Ionic',
        descripcion: 'Implementar aplicación móvil con Angular Standalone, navegación, listas deslizables, acordeones y persistencia en LocalStorage.',
        asignatura: 'Programación Móvil',
        tipo: 'proyecto',
        prioritaria: true,
        recursos: ['internet', 'computador'],
        estado: 'completada'
      },
      {
        id: 2,
        nombre: 'Taller de Componentes e Interfaz Gráfica',
        descripcion: 'Crear prototipo interactivo utilizando ion-card, ion-segment, ion-fab, ion-toast e ion-alert.',
        asignatura: 'Programación Móvil',
        tipo: 'taller',
        prioritaria: false,
        recursos: ['computador', 'internet'],
        estado: 'completada'
      },
      {
        id: 3,
        nombre: 'Optimización de Consultas e Índices SQL',
        descripcion: 'Analizar planes de ejecución y diseñar índices compuestos para mejorar el tiempo de respuesta en tablas transaccionales.',
        asignatura: 'Bases de Datos Avanzadas',
        tipo: 'taller',
        prioritaria: true,
        recursos: ['computador', 'biblioteca'],
        estado: 'pendiente'
      },
      {
        id: 4,
        nombre: 'Examen Parcial: Transacciones y Concurrencia',
        descripcion: 'Evaluación teórico-práctica sobre niveles de aislamiento, propiedades ACID y control de bloqueos.',
        asignatura: 'Bases de Datos Avanzadas',
        tipo: 'examen',
        prioritaria: true,
        recursos: ['biblioteca'],
        estado: 'completada'
      },
      {
        id: 5,
        nombre: 'Arquitectura Limpia y Patrones de Diseño',
        descripcion: 'Documentar el diagrama de componentes, casos de uso y aplicar patrones creacionales y estructurales al proyecto.',
        asignatura: 'Ingeniería de Software',
        tipo: 'proyecto',
        prioritaria: true,
        recursos: ['internet', 'computador', 'biblioteca'],
        estado: 'pendiente'
      },
      {
        id: 6,
        nombre: 'Taller de Pruebas Unitarias e Integración Continua',
        descripcion: 'Configurar suite de pruebas automatizadas y validar cobertura de código de los módulos principales.',
        asignatura: 'Ingeniería de Software',
        tipo: 'taller',
        prioritaria: false,
        recursos: ['internet', 'computador'],
        estado: 'completada'
      }
    ];

    this.nextId = 7;
    this.guardarActividades(demo);
    return [...demo];
  }

  getEstadisticas() {
    this.recuperarActividades();
    const total = this.actividades.length;
    const completadas = this.actividades.filter(a => a.estado.toLowerCase() === 'completada').length;
    const pendientes = total - completadas;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return { total, completadas, pendientes, progreso };
  }

  private normalizarTexto(texto: string): string {
    return (texto || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  getPorAsignatura(asignatura: string): Actividad[] {
    this.recuperarActividades();
    const objetivo = this.normalizarTexto(asignatura);
    return this.actividades.filter(a => this.normalizarTexto(a.asignatura) === objetivo);
  }

  getEstadisticasPorAsignatura(asignatura: string) {
    const actividadesAsignatura = this.getPorAsignatura(asignatura);
    const total = actividadesAsignatura.length;
    const completadas = actividadesAsignatura.filter(a => a.estado.toLowerCase() === 'completada').length;
    const pendientes = total - completadas;

    return { total, completadas, pendientes };
  }
}
