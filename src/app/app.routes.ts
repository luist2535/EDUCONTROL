import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'consulta',
    loadComponent: () => import('./pages/consulta/consulta.page').then(m => m.ConsultaPage)
  },
  {
    path: 'informacion',
    loadComponent: () => import('./pages/informacion/informacion.page').then(m => m.InformacionPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];