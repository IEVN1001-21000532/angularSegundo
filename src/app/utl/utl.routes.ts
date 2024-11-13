import { Routes } from "@angular/router";

export default[
    {
        path: 'Listaalumnos',
        loadComponent:()=>import('./alumnos/alumnos.component')
    },
    {
        path: 'agregar',
        loadComponent:()=>import('./agregar/agregar.component')

    }
] as Routes