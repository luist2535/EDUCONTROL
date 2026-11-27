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

  // Convertir objetos a JSON
  convertirObjetosAJson(actividades: Actividad[]): string {
    return JSON.stringify(actividades);
  }

  // Convertir JSON a objetos
  convertirJsonAObjetos(json: string): Actividad[] {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? (parsed as Actividad[]) : [];
    } catch (e) {
      console.error('Error al convertir JSON a objetos:', e);
      return [];
    }
  }

  convertirAJson(actividades: Actividad[]): string {
    return this.convertirObjetosAJson(actividades);
  }

  convertirDesdeJson(json: string): Actividad[] {
    return this.convertirJsonAObjetos(json);
  }

  // Recuperar actividades de LocalStorage
  recuperarActividades(notificar = false): Actividad[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        this.actividades = this.convertirJsonAObjetos(data);
        const maxId = this.actividades.length > 0
          ? Math.max(...this.actividades.map(a => Number(a.id) || 0))
          : 0;
        this.nextId = maxId + 1;
      } else {
        this.actividades = [];
        this.nextId = 1;
      }
    } catch (error) {
      console.error('Error al recuperar actividades:', error);
      this.actividades = [];
      this.nextId = 1;
    }
    if (notificar) {
      this.actividadesSubject.next([...this.actividades]);
    }
    return [...this.actividades];
  }

  // Guardar actividades en LocalStorage
  guardarActividades(actividades: Actividad[] = this.actividades): void {
    try {
      this.actividades = [...actividades];
      const json = this.convertirObjetosAJson(this.actividades);
      localStorage.setItem(STORAGE_KEY, json);
      this.actividadesSubject.next([...this.actividades]);
    } catch (error) {
      console.error('Error al guardar actividades:', error);
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
