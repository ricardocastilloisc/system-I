import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService, CreateCATGENDIASFERIADOSInput } from '../../../../../API.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit {

  public createForm: FormGroup;

  inputFecha = formatDate(new Date(),'yyyy-MM-dd', 'en-US');

  constructor(private router: Router, private api: APIService, private fb: FormBuilder, private rutaActiva: ActivatedRoute) { }

  diasFeriados: Array<CreateCATGENDIASFERIADOSInput>;
  ngOnInit(): void {
    this.createForm = this.fb.group({
      'ID': ['', Validators.required],
      'FECHA_FERIADO': ['', Validators.required]
    });
  }

  botonActivado = (parametocomparar:string):boolean => {
    return this.rutaActiva.snapshot.params.tipo===parametocomparar?true:false;
  }

  consultar(){
    this.router.navigate(['/'+window.location.pathname+'/proceso']);
  }

  public onCreate(restaurant: CreateCATGENDIASFERIADOSInput) {
    this.api.CreateCATGENDIASFERIADOS(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating restaurant...', e);
    });
  }

  async consultarCatalogo(){
    console.log("Entre a la funcion")
    this.api.ListCATGENDIASFERIADOS().then(event => {
      this.diasFeriados = event.items;
      console.log('Lista', this.diasFeriados);
    })
    .catch(e => {
      console.log('error...', e);
    });
  }
}
