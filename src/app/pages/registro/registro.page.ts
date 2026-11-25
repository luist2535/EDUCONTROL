import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadService } from '../../shared/services/actividad.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RegistroPage implements OnInit {
  actividadForm: FormGroup;
  enviando = false;
  modoEdicion = false;
  actividadEditId: number | null = null;

  asignaturasSugeridas = [
    'Programación Móvil',
    'Bases de Datos Avanzadas',
    'Ingeniería de Software'
  ];

  tiposActividad = [
    { value: 'taller', label: 'Taller' },
    { value: 'examen', label: 'Examen' },
    { value: 'proyecto', label: 'Proyecto' }
  ];

  recursosDisponibles = [
    { value: 'internet', label: 'Internet' },
    { value: 'computador', label: 'Computador' },
    { value: 'biblioteca', label: 'Biblioteca' }
  ];

  constructor(
    private fb: FormBuilder,
    private actividadService: ActividadService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.actividadForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      asignatura: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      prioritaria: [false],
      recursos: [[]]
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const idParam = params.get('id');
      const asignaturaParam = params.get('asignatura');

      if (idParam) {
        const id = Number(idParam);
        const actividad = this.actividadService.getById(id);
        if (actividad) {
          this.modoEdicion = true;
          this.actividadEditId = actividad.id;
          this.actividadForm.patchValue({
            nombre: actividad.nombre,
            descripcion: actividad.descripcion,
            asignatura: actividad.asignatura,
            tipo: actividad.tipo,
            prioritaria: actividad.prioritaria,
            recursos: [...(actividad.recursos || [])]
          });
          return;
        }
      }

      this.modoEdicion = false;
      this.actividadEditId = null;
      this.limpiarFormulario();

      if (asignaturaParam) {
        this.actividadForm.patchValue({ asignatura: asignaturaParam });
      }
    });
  }

  seleccionarAsignatura(nombre: string) {
    this.actividadForm.patchValue({ asignatura: nombre });
    this.actividadForm.get('asignatura')?.markAsDirty();
    this.actividadForm.get('asignatura')?.markAsTouched();
  }

  onRecursoChange(event: any, recurso: string) {
    const recursosActuales: string[] = this.actividadForm.get('recursos')?.value || [];
    if (event.detail.checked) {
      if (!recursosActuales.includes(recurso)) {
        this.actividadForm.patchValue({
          recursos: [...recursosActuales, recurso]
        });
      }
    } else {
      this.actividadForm.patchValue({
        recursos: recursosActuales.filter((r: string) => r !== recurso)
      });
    }
  }

  async onSubmit() {
    const valores = this.actividadForm.value;
    const nombreValido = (valores.nombre || '').trim().length > 0;
    const asignaturaValida = (valores.asignatura || '').trim().length > 0;
    const tipoValido = (valores.tipo || '').trim().length > 0;

    if (this.actividadForm.invalid || !nombreValido || !asignaturaValida || !tipoValido) {
      this.marcarComoTocado();
      await this.mostrarAlertaValidacion();
      return;
    }

    this.enviando = true;

    try {
      const datosActividad = {
        nombre: valores.nombre.trim(),
        descripcion: (valores.descripcion || '').trim(),
        asignatura: valores.asignatura.trim(),
        tipo: valores.tipo,
        prioritaria: !!valores.prioritaria,
        recursos: valores.recursos || []
      };

      if (this.modoEdicion && this.actividadEditId !== null) {
        const actualizada = this.actividadService.actualizar(this.actividadEditId, datosActividad);
        if (actualizada) {
          await this.mostrarToast(`Actividad "${actualizada.nombre}" modificada correctamente`, 'success');
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.actividadEditId = null;
          this.router.navigate(['/consulta']);
        }
      } else {
        const nuevaActividad = this.actividadService.crear(datosActividad);
        await this.mostrarToast(`Actividad "${nuevaActividad.nombre}" registrada correctamente con estado Pendiente`, 'success');
        this.limpiarFormulario();
      }
    } catch (error) {
      await this.mostrarToast('Error al guardar la actividad', 'danger');
    } finally {
      this.enviando = false;
    }
  }

  private marcarComoTocado() {
    Object.keys(this.actividadForm.controls).forEach(key => {
      this.actividadForm.get(key)?.markAsTouched();
    });
  }

  private async mostrarAlertaValidacion() {
    const alert = await this.alertController.create({
      header: 'Error de validación',
      subHeader: 'Campos obligatorios incompletos',
      message: 'Por favor diligencie el Nombre de la actividad, la Asignatura y el Tipo de actividad antes de guardar.',
      buttons: ['Entendido'],
      cssClass: 'validation-alert'
    });
    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  limpiarFormulario() {
    this.actividadForm.reset({
      nombre: '',
      descripcion: '',
      asignatura: '',
      tipo: '',
      prioritaria: false,
      recursos: []
    });
  }

  onCancelar() {
    if (this.modoEdicion) {
      this.router.navigate(['/consulta']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  get nombre() { return this.actividadForm.get('nombre'); }
  get asignatura() { return this.actividadForm.get('asignatura'); }
  get tipo() { return this.actividadForm.get('tipo'); }
}
