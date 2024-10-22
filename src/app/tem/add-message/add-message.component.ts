import { Component } from '@angular/core';
import { MessageserviceService } from '../messageservice.service';
@Component({
  selector: 'app-add-message',
  standalone: true,
  imports: [],
  templateUrl: './add-message.component.html',
  styleUrl: './add-message.component.css'
})
export class AddMessageComponent {
  constructor(public messageService: MessageserviceService){ }
  alumno:string = "";

  addAlumno(){
    this.messageService.add(this.alumno);
    this.alumno = ""
  }
}
