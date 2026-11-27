import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActividadService, Actividad } from '../../shared/services/actividad.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class HomePage implements OnInit {
  estadisticas = { total: 0, completadas: 0, pendientes: 0, progreso: 0 };
  actividadesDestacadas: Actividad[] = [];
  cargando = true;

  constructor(
    private actividadService: ActividadService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.actividadService.actividades$.subscribe(() => {
      if (!this.cargando) {
        this.actualizarEstadisticas();
      }
    });
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  private async cargarDatos() {
    this.cargando = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    this.actualizarEstadisticas();
    this.cargando = false;
  }

  private actualizarEstadisticas() {
    this.estadisticas = this.actividadService.getEstadisticas();
    const todas = this.actividadService.getAll();
    // Ordenar pendientes mostrando primero las prioritarias
    this.actividadesDestacadas = todas
      .filter(a => a.estado === 'pendiente')
      .sort((a, b) => Number(b.prioritaria) - Number(a.prioritaria))
      .slice(0, 3);
  }

  getMensajeProgreso(): string {
    if (this.estadisticas.total === 0) {
      return 'Registra tu primera actividad para comenzar el seguimiento.';
    }
    if (this.estadisticas.progreso === 100) {
      return '¡Felicitaciones! Has completado el 100% de tus actividades académicas registradas.';
    }
    if (this.estadisticas.progreso >= 60) {
      return '¡Excelente ritmo! Ya superaste más de la mitad de las entregas del semestre.';
    }
    if (this.estadisticas.progreso >= 25) {
      return 'Buen avance. Mantén el enfoque en tus actividades prioritarias pendientes.';
    }
    return 'Semestre en marcha. Organiza tus entregas para avanzar en tu progreso.';
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'Taller';
      case 'examen': return 'Examen';
      case 'proyecto': return 'Proyecto';
      default: return tipo;
    }
  }

  async completarRapido(actividad: Actividad, event: Event) {
    event.stopPropagation();
    this.actividadService.completar(actividad.id);
    this.actualizarEstadisticas();
    await this.mostrarToast(`¡Actividad "${actividad.nombre}" completada!`, 'success');
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2400,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
