import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren:()=> import('./auth/features/auth.routes')
  },
  {
    path: 'formulario',
    loadChildren:()=> import('./formulario/ejemplo1/ejemplo1.routes')
  },
  {
    path: 'formulario',
    loadChildren:()=> import('./formulario/resistencias/resistencias.routes')
  },
  {
    path: 'formulario',
    loadChildren:()=> import('./formulario/empleados/empleados.routes')
  },
];
