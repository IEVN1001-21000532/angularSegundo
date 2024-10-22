import{Routes} from "@angular/router";

export default[
    {
        path: 'empleados',  
        loadComponent:()=>import('./empleados.component'),
    }
]as Routes 


