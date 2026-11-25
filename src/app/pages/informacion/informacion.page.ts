import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActividadService } from '../../shared/services/actividad.service';
import { AsignaturaInfo } from '../../shared/models/actividad.model';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class InformacionPage implements OnInit {
  private readonly asignaturasBase: AsignaturaInfo[] = [
    {
      nombre: 'Programación Móvil',
      docente: 'Dr. Carlos Rodríguez',
      descripcion: 'Desarrollo de aplicaciones nativas e híbridas para dispositivos móviles utilizando Ionic Framework y Angular Standalone. Incluye diseño de interfaces móviles, navegación, almacenamiento local y buenas prácticas de experiencia de usuario.'
    },
    {
      nombre: 'Bases de Datos Avanzadas',
      docente: 'Mtra. Ana Martínez',
      descripcion: 'Diseño, implementación y optimización de bases de datos relacionales y NoSQL. Modelado de datos, normalización, transacciones, índices, procedimientos almacenados y administración de rendimiento.'
    },
    {
      nombre: 'Ingeniería de Software',
      docente: 'Dr. Luis González',
      descripcion: 'Metodologías ágiles, análisis de requerimientos, patrones de diseño, arquitectura de software, pruebas automatizadas, control de versiones y gestión de proyectos tecnológicos.'
    }
  ];

  asignaturas: AsignaturaInfo[] = [...this.asignaturasBase];
  statsPorAsignatura: Record<string, { total: number; completadas: number; pendientes: number }> = {};

  constructor(private actividadService: ActividadService) {}

  ngOnInit() {
    this.calcularEstadisticas();
  }

  ionViewWillEnter() {
    this.calcularEstadisticas();
  }

  private normalizar(texto: string): string {
    return (texto || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private calcularEstadisticas() {
    const todasLasActividades = this.actividadService.getAll();
    const listaAsignaturas: AsignaturaInfo[] = [...this.asignaturasBase];

    // Si hay actividades registradas con otras asignaturas personalizadas, agregarlas dinámicamente
    todasLasActividades.forEach(act => {
      const nombreLimpio = (act.asignatura || '').trim();
      if (nombreLimpio) {
        const existe = listaAsignaturas.some(
          a => this.normalizar(a.nombre) === this.normalizar(nombreLimpio)
        );
        if (!existe) {
          listaAsignaturas.push({
            nombre: nombreLimpio,
            docente: 'Docente Titular Asignado',
            descripcion: `Asignatura académica de ${nombreLimpio} registrada en el semestre actual.`
          });
        }
      }
    });

    this.asignaturas = listaAsignaturas;
    this.statsPorAsignatura = {};

    this.asignaturas.forEach(asig => {
      this.statsPorAsignatura[asig.nombre] = this.actividadService.getEstadisticasPorAsignatura(asig.nombre);
    });
  }

  getStats(nombreAsignatura: string) {
    return this.statsPorAsignatura[nombreAsignatura] || { total: 0, completadas: 0, pendientes: 0 };
  }

  getAccordionValue(nombre: string): string {
    return this.normalizar(nombre).replace(/\s+/g, '-');
  }

  getAsignaturaIcon(nombre: string): string {
    const norm = this.normalizar(nombre);
    if (norm.includes('movil')) return 'phone-portrait-outline';
    if (norm.includes('datos')) return 'server-outline';
    if (norm.includes('software')) return 'code-slash-outline';
    return 'book-outline';
  }

  getProgreso(nombreAsignatura: string): number {
    const stats = this.getStats(nombreAsignatura);
    return stats.total > 0 ? stats.completadas / stats.total : 0;
  }

  getProgresoPorcentaje(nombreAsignatura: string): number {
    const stats = this.getStats(nombreAsignatura);
    return stats.total > 0 ? Math.round((stats.completadas / stats.total) * 100) : 0;
  }

  trackByNombre(index: number, asig: AsignaturaInfo): string {
    return asig.nombre;
  }
}
