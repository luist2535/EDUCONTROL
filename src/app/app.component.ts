import { Component, OnInit } from '@angular/core';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  addCircleOutline,
  listOutline,
  schoolOutline,
  timeOutline,
  checkmarkCircleOutline,
  checkmarkCircle,
  time,
  add,
  constructOutline,
  documentTextOutline,
  briefcaseOutline,
  helpCircleOutline,
  star,
  chevronForwardOutline,
  createOutline,
  trashOutline,
  checkmarkDoneOutline,
  checkmarkOutline,
  close,
  idCardOutline,
  layersOutline,
  wifiOutline,
  desktopOutline,
  libraryOutline,
  helpOutline,
  searchOutline,
  phonePortraitOutline,
  serverOutline,
  codeSlashOutline,
  eyeOutline,
  alertCircleOutline,
  bookOutline,
  folderOpenOutline,
  sparklesOutline,
  swapHorizontalOutline,
  personCircleOutline,
  ribbonOutline,
  trendingUpOutline,
  flameOutline,
  arrowForwardOutline,
  ellipsisHorizontalOutline,
  refreshOutline
} from 'ionicons/icons';
import { ActividadService } from './shared/services/actividad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, RouterLinkActive]
})
export class AppComponent implements OnInit {
  appPages = [
    { title: 'Inicio', subtitle: 'Resumen y progreso', url: '/home', icon: 'home-outline' },
    { title: 'Nueva Actividad', subtitle: 'Registrar tarea o examen', url: '/registro', icon: 'add-circle-outline' },
    { title: 'Mis Actividades', subtitle: 'Consultar y administrar', url: '/consulta', icon: 'list-outline', showBadge: true },
    { title: 'Información Académica', subtitle: 'Asignaturas del semestre', url: '/informacion', icon: 'school-outline' }
  ];

  estadisticas = { total: 0, completadas: 0, pendientes: 0, progreso: 0 };

  constructor(
    private menuController: MenuController,
    private router: Router,
    private actividadService: ActividadService,
    private toastController: ToastController
  ) {
    addIcons({
      'home-outline': homeOutline,
      'add-circle-outline': addCircleOutline,
      'list-outline': listOutline,
      'school-outline': schoolOutline,
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'checkmark-circle': checkmarkCircle,
      'time': time,
      'add': add,
      'construct-outline': constructOutline,
      'document-text-outline': documentTextOutline,
      'briefcase-outline': briefcaseOutline,
      'help-circle-outline': helpCircleOutline,
      'star': star,
      'chevron-forward-outline': chevronForwardOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'checkmark-outline': checkmarkOutline,
      'close': close,
      'id-card-outline': idCardOutline,
      'layers-outline': layersOutline,
      'wifi-outline': wifiOutline,
      'desktop-outline': desktopOutline,
      'library-outline': libraryOutline,
      'help-outline': helpOutline,
      'search-outline': searchOutline,
      'phone-portrait-outline': phonePortraitOutline,
      'server-outline': serverOutline,
      'code-slash-outline': codeSlashOutline,
      'eye-outline': eyeOutline,
      'alert-circle-outline': alertCircleOutline,
      'book-outline': bookOutline,
      'folder-open-outline': folderOpenOutline,
      'sparkles-outline': sparklesOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
      'person-circle-outline': personCircleOutline,
      'ribbon-outline': ribbonOutline,
      'trending-up-outline': trendingUpOutline,
      'flame-outline': flameOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'ellipsis-horizontal-outline': ellipsisHorizontalOutline,
      'refresh-outline': refreshOutline
    });
  }

  ngOnInit() {
    this.actividadService.actividades$.subscribe(() => {
      this.estadisticas = this.actividadService.getEstadisticas();
    });
  }

  async navegar(url: string) {
    await this.menuController.close();
    this.router.navigateByUrl(url);
  }

  async cargarDemoDesdeMenu() {
    this.actividadService.cargarDatosDemo();
    await this.menuController.close();
    const toast = await this.toastController.create({
      message: '¡6 actividades de demostración cargadas en LocalStorage!',
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
    this.router.navigateByUrl('/home');
  }
}
