// import { Injectable } from '@angular/core' 
// import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from '../ReduxStore/actions/AUDGENPROCESO.actions';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { AppState } from '../ReduxStore/app.reducers';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { AUDGENPROCESO_INERFACE } from '../model/AUDGENPROCESO.model';
// import { AUDGENESTADOPROCESO_INTERFACE } from '../model/AUDGENESTADOPROCESO.model';
// import { map } from "rxjs/operators";
// import { AuthService } from 'src/app/services/auth.service';
// import { Usuario } from '../model/usuario.model';
// import { ERole } from '../validators/roles';
// import { LoadAUDGENESTADOPROCESOS } from 'src/app/ReduxStore/actions';
// import { APIService } from '../API.service' 

// @Injectable()
// export class ProcesosService implements Resolve<any>
// {
//     detalleProceso: any;

//     onProcesoChanged: BehaviorSubject<any>;
    
//     constructor(
//         private store: Store<AppState>,
//         private rutaActiva: ActivatedRoute,
//         private authService: AuthService,
//         private api: APIService
//     ){

//         this.onProcesoChanged = new BehaviorSubject([]);
//     }

//     /**
//      * Resolver
//      * 
//      * @param {ActivatedRouteSnapshot} route
//      * @param {RouterStateSnapshot} state
//      * @returns {Observable<any> | Promise<any> | any}
//      */

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
//     {
//         let responses = [];

//        responses.push(this.getDetalleProceso());
       
//        return Promise.all(responses);
//     }

//     getDetalleProceso(): Promise<any>
//     {
//         return new Promise((resolve, reject) => {
//             this.store.select(
//                 ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
//               ).subscribe((response: any) => {
//                   this.detalleProceso = response;

//                   this.onProcesoChanged.next(this.detalleProceso);
//                   resolve(this.detalleProceso);

//               }, reject)
              
//             //   .pipe(map(res => 
//             //       {
//             //         if(res === null) return res
//             //         else return res.slice().sort(function(a,b)
//             //         {return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()})
//             //       }
                
//             //     ))
            
            

//         });
//     }
// }
