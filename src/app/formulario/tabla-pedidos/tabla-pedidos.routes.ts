import{Routes} from "@angular/router";


export default[
    {
        path: 'tabla-pedidos',  
        loadComponent:()=>import('./tabla-pedidos.component'),
    }, 
]as Routes 


