import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Actividad } from '../../shared/models/actividad.model';

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DetalleModalComponent {
  @Input() actividad!: Actividad;

  constructor(private modalController: ModalController) {}

  cerrar(accion?: string) {
    this.modalController.dismiss({ accion });
  }

  getEstadoColor(estado: string): string {
    return estado === 'completada' ? 'success' : 'warning';
  }

  getEstadoIcon(estado: string): string {
    return estado === 'completada' ? 'checkmark-circle' : 'time';
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'construct-outline';
      case 'examen': return 'document-text-outline';
      case 'proyecto': return 'briefcase-outline';
      default: return 'help-circle-outline';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'primary';
      case 'examen': return 'danger';
      case 'proyecto': return 'secondary';
      default: return 'medium';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'Taller';
      case 'examen': return 'Examen';
      case 'proyecto': return 'Proyecto';
      default: return tipo;
    }
  }

  getRecursoLabel(recurso: string): string {
    switch (recurso) {
      case 'internet': return 'Internet';
      case 'computador': return 'Computador';
      case 'biblioteca': return 'Biblioteca';
      default: return recurso;
    }
  }

  getRecursoIcon(recurso: string): string {
    switch (recurso) {
      case 'internet': return 'wifi-outline';
      case 'computador': return 'desktop-outline';
      case 'biblioteca': return 'library-outline';
      default: return 'help-outline';
    }
  }
}
