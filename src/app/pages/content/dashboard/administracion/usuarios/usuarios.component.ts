import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private usuarios: UsuariosService) { }

  ngOnInit(): void {
    console.log("USUARIOS COMPONENT");
    this.usuarios.consultarUsuariosEnGrupo();
  }

}
 