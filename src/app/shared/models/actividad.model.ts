export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  asignatura: string;
  tipo: 'taller' | 'examen' | 'proyecto';
  prioritaria: boolean;
  recursos: string[];
  estado: 'pendiente' | 'completada';
}

export interface AsignaturaInfo {
  nombre: string;
  docente: string;
  descripcion: string;
}