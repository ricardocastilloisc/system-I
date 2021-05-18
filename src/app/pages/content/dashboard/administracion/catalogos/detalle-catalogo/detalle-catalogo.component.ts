import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CatalogosService } from '../../../../../../services/catalogos.service';
import { STRUCTURE_CAT } from '../../../../../../model/catalogos/STRUCTURE_CAT.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../ReduxStore/app.reducers';
import {
  cargarDetailCatalogos,
  loadingDetailCatalogos,
  unSetDetailCatalogos,
} from '../../../../../../ReduxStore/actions/catalogos/catalogoDetail.actions';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications';
import { ToastrService } from 'ngx-toastr';
import { ERole } from '../../../../../../validators/roles';

@Component({
  selector: 'app-detalle-catalogo',
  templateUrl: './detalle-catalogo.component.html',
  styleUrls: ['./detalle-catalogo.component.css'],
})
export class DetalleCatalogoComponent implements OnInit, OnDestroy {
  validarRoles(): boolean {
    let flag = false;
    this.store
      .select(({ usuario }) => usuario.user)
      .subscribe((res) => {
        let rol = res['attributes']['custom:rol'];
        //console.log(rol);
        if (rol === ERole.Administrador) flag = true;
      });
    return flag;
  }
  DetailCatalogos$: Subscription;

  ColumDinamicData: STRUCTURE_CAT[] = [];

  DetailCats: any = [];

  paginaDetailCats: number = 1;

  FormsDinamic: FormGroup;

  mostrarEjecucionesProcesos = true;

  editar = false;

  AgregarRegistroLoading = false;

  constructor(
    private CatalogosService: CatalogosService,
    private store: Store<AppState>,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(unSetDetailCatalogos());
    this.DetailCatalogos$.unsubscribe();
  }

  ngOnInit(): void {
    this.validarRoles();
    this.getDataCat();
    this.DetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.DetailCatalogos)
      .subscribe((res) => {
        this.DetailCats = res;
        if (this.ColumDinamicData.length > 0) {
          this.makeFormsDinamic();
        }

        if (this.AgregarRegistroLoading) {
          this.abrirToass();
          this.AgregarRegistroLoading = false;
        }
      });
  }

  transformDateOrString = (value, isDate) => {
    if (!value) {
      return '';
    }

    let stringReturn = '';
    if (typeof value === 'string') {
      stringReturn = value;
    } else {
      stringReturn = value.toString();
    }

    if (isDate && stringReturn.includes('-')) {
      stringReturn = stringReturn.split('-').join('');
    }
    if (isDate && stringReturn.includes('/')) {
      stringReturn = stringReturn.split('/').join('');
    }

    return isDate
      ? stringReturn.substring(6, 8) +
          '/' +
          stringReturn.substring(4, 6) +
          '/' +
          stringReturn.substring(0, 4)
      : stringReturn;
  };

  removeCharterSpecialSringTh = (value: string) => {
    if (value) {
      return value.split('_').join(' ');
    }
    return '';
  };

  getDataCat = () => {
    this.store.dispatch(loadingDetailCatalogos());
    this.CatalogosService.structureCat().then((res: STRUCTURE_CAT[]) => {
      this.ColumDinamicData = res;
      this.store.dispatch(cargarDetailCatalogos());
    });
  };

  makeFormsDinamic = () => {
    this.FormsDinamic = null;
    this.FormsDinamic = new FormGroup({});
    this.ColumDinamicData.forEach((dataColum) => {
      let valueFormControl = null;
      this.FormsDinamic.addControl(
        dataColum.VALUE,
        new FormControl(valueFormControl, [Validators.required])
      );
    });
  };

  viewInputText = (colum: STRUCTURE_CAT) => {
    return this.viewFECHA(colum.VALUE) && colum.TYPE === 'S' && !colum.DATE;
  };
  viewInputNumber = (colum: STRUCTURE_CAT) => {
    return this.viewFECHA(colum.VALUE) && colum.TYPE === 'N' && !colum.DATE;
  };
  viewInputDate = (colum: STRUCTURE_CAT) => {
    return colum.DATE;
  };

  viewFECHA = (value) => {
    return !value.includes('FECHA_ACTUALIZADO');
  };

  viewPrimaryKey = (colum: STRUCTURE_CAT) => {
    if (colum.PRIMARY_KEY && colum.TYPE == 'S') {
      return true;
    } else {
      return !colum.PRIMARY_KEY;
    }
  };

  arrayFomsInput = (colums: STRUCTURE_CAT[]) => {
    let arrayReturn: STRUCTURE_CAT[] = [];

    arrayReturn = colums.filter((e) => {
      if (this.viewFECHA(e.VALUE)) {
        return e;
      }
    });

    arrayReturn = arrayReturn.filter((e) => {
      if (this.viewPrimaryKey(e)) {
        return e;
      }
    });
    return arrayReturn;
  };

  showHTMLMessage(message, title) {
    this.toastr.success(message, title, {
      enableHtml: true,
    });
  }

  mostrarCardAgregarResgistro = (editar = 0, object = null) => {
    this.mostrarEjecucionesProcesos = false;

    if (editar === 0) {
      this.editar = false;
      this.ColumDinamicData.forEach((dataColum) => {
        let valueFormControl = null;

        if (editar === 0) {
          if (dataColum.PRIMARY_KEY && dataColum.TYPE === 'N') {
            let arrayNumbers: number[] = [];

            this.DetailCats.forEach((e) => {
              if (typeof e[dataColum.VALUE] === 'string') {
                arrayNumbers.push(Number(e[dataColum.VALUE]));
              } else {
                arrayNumbers.push(e[dataColum.VALUE]);
              }
            });

            if (arrayNumbers.length > 0) {
              valueFormControl =
                arrayNumbers.sort((a, b) => a - b)[arrayNumbers.length - 1] + 1;
            } else {
              valueFormControl = 1;
            }
          }

          if (dataColum.DATE) {
            valueFormControl = moment().format('YYYY-MM-DD').toString();
          }

          this.FormsDinamic.get(dataColum.VALUE).setValue(valueFormControl);
        }
      });
    } else {
      this.editar = true;

      this.ColumDinamicData.forEach((dataColum) => {
        let valueTempControl = null;

        valueTempControl = object[dataColum.VALUE];

        if (typeof valueTempControl === 'string') {
          valueTempControl = valueTempControl;
        } else {
          valueTempControl = valueTempControl.toString();
        }

        if (dataColum.DATE) {
          if (this.DetailCats.length > 0) {
            let valueTempDate = this.DetailCats[0][dataColum.VALUE];

            let specialFormat = false;

            if (typeof valueTempDate === 'string') {
              valueTempDate = valueTempDate;
            } else {
              valueTempDate = valueTempDate.toString();
            }

            if (valueTempDate.includes('-')) {
              valueTempControl = moment(object[dataColum.VALUE])
                .format('YYYY-MM-DD')
                .toString();

              specialFormat = true;
            }

            if (valueTempDate.includes('/')) {
              valueTempControl = moment(valueTempDate.split('/').join('-'))
                .format('YYYY-MM-DD')
                .toString();

              specialFormat = true;
            }

            if (!specialFormat) {
              valueTempControl = moment(
                valueTempControl.substring(0, 4) +
                  '-' +
                  valueTempControl.substring(4, 6) +
                  '-' +
                  valueTempControl.substring(6, 8)
              )
                .format('YYYY-MM-DD')
                .toString();
            }
          } else {
            valueTempControl = moment(
              valueTempControl.substring(0, 4) +
                '-' +
                valueTempControl.substring(4, 6) +
                '-' +
                valueTempControl.substring(6, 8)
            )
              .format('YYYY-MM-DD')
              .toString();
          }
        }

        this.FormsDinamic.get(dataColum.VALUE).setValue(valueTempControl);
      });
    }
  };
  ocultarCardAgregarResgistro = () => {
    this.mostrarEjecucionesProcesos = true;
  };

  abrirToass = () => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><img class="successRegistro"/>';

    mensaje = mensaje + 'Registro exitoso';

    mensaje = mensaje + '</div>';

    this.toastr.show(mensaje, null, {
      timeOut: 1500,
      toastClass:
        'etiquetaAddRegistro etiquetaAddRegistro row justify-content-center',
      positionClass: 'toast-top-right',
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  };

  abrirToassError = (err) => {
    console.log(err);

    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><div><img class="iconErrorRegistro"/>';

    mensaje = mensaje + 'Se ha producido un error';

    mensaje = mensaje + '</div><div class="descipcionError">';
    mensaje = mensaje + err['error']['descripcion'];
    mensaje = mensaje + '</div></div>';

    this.toastr.show(mensaje, null, {
      timeOut: 3500,
      toastClass: 'etiquetaErrorRegistro row justify-content-center',
      positionClass: 'toast-top-right',
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  };

  agregarRegistroOActualizarRegistro = () => {
    this.AgregarRegistroLoading = true;

    let ObjectTemp = this.FormsDinamic.value;

    let objectFinish = {};

    this.ColumDinamicData.forEach((dataColum) => {
      let finishTempControl = null;

      let valueTempControl = ObjectTemp[dataColum.VALUE];

      if (dataColum.DATE) {
        if (this.DetailCats.length > 0) {
          let valueTempDate = this.DetailCats[0][dataColum.VALUE];

          let specialFormat = false;

          if (typeof valueTempDate === 'string') {
            valueTempDate = valueTempDate;
          } else {
            valueTempDate = valueTempDate.toString();
          }

          if (valueTempDate.includes('-')) {
            valueTempControl = valueTempControl.toString();

            specialFormat = true;
          }

          if (valueTempDate.includes('/')) {
            valueTempControl = valueTempControl.split('-').join('/').toString();

            specialFormat = true;
          }

          if (!specialFormat) {
            valueTempControl = valueTempControl.split('-').join('').toString();
          }
        } else {
          valueTempControl = valueTempControl.split('-').join('').toString();
        }
      }

      if (typeof valueTempControl === 'string') {
        valueTempControl = valueTempControl;
      } else {
        valueTempControl = valueTempControl.toString();
      }

      if (dataColum.TYPE === 'N') {
        finishTempControl = Number(valueTempControl);
      }

      if (dataColum.TYPE === 'S') {
        finishTempControl = valueTempControl;
      }

      objectFinish[dataColum.VALUE] = finishTempControl;
    });

    if (this.editar) {
      this.CatalogosService.updateDetailsCat(objectFinish).then(
        () => {
          this.ocultarCardAgregarResgistro();
          this.getDataCat();
        },
        (err) => {
          this.abrirToassError(err);
        }
      );
    } else {
      this.CatalogosService.addDetailsCat(objectFinish).then(
        () => {
          this.ocultarCardAgregarResgistro();
          this.getDataCat();
        },
        (err) => {
          this.abrirToassError(err);
        }
      );
    }
  };

  eliminarRegistro = (object = null) => {
    let objectReferencePk = this.ColumDinamicData.filter(
      (e) => e.PRIMARY_KEY === true
    )[0];

    const registro = object[objectReferencePk.VALUE];

    this.CatalogosService.deleteDetailsCat(registro).then((res) => {
      this.getDataCat();
    });
  };

  verPaginado = () => {
    if (this.DetailCats) {
      if (this.DetailCats.length > 10) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  };
}
