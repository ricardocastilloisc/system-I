import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from '../../../../../services/auditoria.service';
@Component({
  selector: 'app-auditoriageneral',
  templateUrl: './auditoriageneral.component.html',
  styleUrls: ['./auditoriageneral.component.css']
})
export class AuditoriageneralComponent implements OnInit {

  constructor(private auditoria: AuditoriaService) { }

  ngOnInit(): void {
    this.auditoria.enviarMensaje();
  }

}
