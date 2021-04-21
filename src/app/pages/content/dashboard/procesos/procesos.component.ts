import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataStore } from '@aws-amplify/datastore';
import { APIService, CreateCATGENDIASFERIADOSInput } from '../../../../API.service';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})
export class ProcesosComponent implements OnInit {


  constructor() { }


  ngOnInit(): void {

  }
}
