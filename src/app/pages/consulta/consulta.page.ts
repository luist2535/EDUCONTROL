import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController, AlertController, ModalController, IonItemSliding } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActividadService, Actividad } from '../../shared/services/actividad.service';
import { DetalleModalComponent } from './detalle-modal.component';

type SegmentoValor = 'todas' | 'pendientes' | 'completadas';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ConsultaPage implements OnInit {
  actividades: Actividad[] = [];
  actividadesFiltradas: Actividad[] = [];
  busqueda = '';
  segmento: SegmentoValor = 'todas';
  cargando = true;

  constructor(
    private actividadService: ActividadService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarActividades();
  }

  ionViewWillEnter() {
    this.cargarActividades();
  }

  private async cargarActividades() {
    this.cargando = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    this.actividades = this.actividadService.getAll();
    this.filtrarActividades();
    this.cargando = false;
  }

  private refrescarLista() {
    this.actividades = this.actividadService.getAll();
    this.filtrarActividades();
  }

  get totalCount(): number {
    return this.actividades.length;
  }

  get pendientesCount(): number {
    return this.actividades.filter(a => a.estado === 'pendiente').length;
  }

  get completadasCount(): number {
    return this.actividades.filter(a => a.estado === 'completada').length;
  }

  filtrarActividades() {
    let resultado = [...this.actividades];

    // Filtrar por segmento
    if (this.segmento === 'pendientes') {
      resultado = resultado.filter(a => a.estado === 'pendiente');
    } else if (this.segmento === 'completadas') {
      resultado = resultado.filter(a => a.estado === 'completada');
    }

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase().trim();
      resultado = resultado.filter(a =>
        a.nombre.toLowerCase().includes(termino) ||
        a.asignatura.toLowerCase().includes(termino)
      );
    }

    this.actividadesFiltradas = resultado;
  }

  onBusquedaChange() {
    this.filtrarActividades();
  }

  onSegmentChange(event: any) {
    this.segmento = event.detail.value;
    this.filtrarActividades();
  }

  async toggleDeslizar(slidingItem: IonItemSliding, event: Event) {
    event.stopPropagation();
    const ratio = await slidingItem.getSlidingRatio();
    if (ratio !== 0) {
      await slidingItem.close();
    } else {
      await slidingItem.open('end');
    }
  }

  getEmptyIcon(): string {
    if (this.busqueda.trim()) {
      return 'search-outline';
    }
    if (this.segmento === 'completadas') {
      return 'checkmark-circle-outline';
    }
    if (this.segmento === 'pendientes') {
      return 'time-outline';
    }
    return 'folder-open-outline';
  }

  getEmptyTitle(): string {
    if (this.busqueda.trim()) {
      return 'Sin resultados de búsqueda';
    }
    if (this.segmento === 'completadas') {
      return 'No hay actividades completadas';
    }
    if (this.segmento === 'pendientes') {
      return 'No hay actividades pendientes';
    }
    return 'No hay actividades registradas';
  }

  getEmptyMessage(): string {
    if (this.busqueda.trim()) {
      return `No se encontraron actividades que coincidan con "${this.busqueda}".`;
    }
    if (this.segmento === 'completadas') {
      return 'Completa tus actividades pendientes para verlas reflejadas aquí.';
    }
    if (this.segmento === 'pendientes') {
      return '¡Excelente! No tienes actividades pendientes por el momento.';
    }
    return 'Registra tu primera actividad académica para visualizarla en esta lista.';
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'taller': return 'Taller';
      case 'examen': return 'Examen';
      case 'proyecto': return 'Proyecto';
      default: return tipo;
    }
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

  getEstadoColor(estado: string): string {
    return estado === 'completada' ? 'success' : 'warning';
  }

  getEstadoIcon(estado: string): string {
    return estado === 'completada' ? 'checkmark-circle' : 'time';
  }

  async verDetalle(actividad: Actividad, slidingItem?: IonItemSliding, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (slidingItem) {
      await slidingItem.close();
    }
    const modal = await this.modalController.create({
      component: DetalleModalComponent,
      componentProps: { actividad },
      cssClass: 'detalle-modal'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.accion === 'completar') {
      await this.completarActividad(actividad);
    } else if (data?.accion === 'editar') {
      this.router.navigate(['/registro'], { queryParams: { id: actividad.id } });
    }
  }

  async editarActividad(actividad: Actividad, slidingItem?: IonItemSliding, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (slidingItem) {
      await slidingItem.close();
    }
    this.router.navigate(['/registro'], { queryParams: { id: actividad.id } });
  }

  async completarActividad(actividad: Actividad, slidingItem?: IonItemSliding, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (slidingItem) {
      await slidingItem.close();
    }

    if (actividad.estado === 'completada') {
      await this.mostrarToast('La actividad ya se encuentra completada', 'medium');
      return;
    }

    this.actividadService.completar(actividad.id);
    await this.mostrarToast(`Actividad "${actividad.nombre}" marcada como completada`, 'success');
    this.refrescarLista();
  }

  async eliminarActividad(actividad: Actividad, slidingItem?: IonItemSliding, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (slidingItem) {
      await slidingItem.close();
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar la actividad "${actividad.nombre}"? Esta acción actualizará LocalStorage y no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.actividadService.eliminar(actividad.id);
            this.mostrarToast(`Actividad "${actividad.nombre}" eliminada correctamente`, 'danger');
            this.refrescarLista();
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  trackById(index: number, actividad: Actividad): number {
    return actividad.id;
  }
}
