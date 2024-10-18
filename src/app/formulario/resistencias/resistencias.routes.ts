import{Routes} from "@angular/router";


export default[
    {
        path: 'resistencias',  
        loadComponent:()=>import('./resistencias.component'),
    }, 
]as Routes 

