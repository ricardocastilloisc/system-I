import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
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


@Component({
  selector: 'app-detalle-catalogo',
  templateUrl: './detalle-catalogo.component.html',
  styleUrls: ['./detalle-catalogo.component.css'],
})
export class DetalleCatalogoComponent implements OnInit, OnDestroy {

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
    this.getDataCat();
    this.DetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.DetailCatalogos)
      .subscribe((res) => {
        this.DetailCats = res;
        if (this.ColumDinamicData.length > 0) {
          this.makeFormsDinamic();
        }

        if (this.AgregarRegistroLoading) {
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


  showHTMLMessage(message, title){
    this.toastr.success(message, title, {
      enableHtml :  true
    })
  }

  mostrarCardAgregarResgistro = (editar = 0, object = null) => {
    this.mostrarEjecucionesProcesos = false;

    this.showHTMLMessage("<h2>Data shown successfully !!</h2>", "Notification")


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
      this.CatalogosService.updateDetailsCat(objectFinish).then((res) => {
        console.log(res);
        this.ocultarCardAgregarResgistro();
        this.getDataCat();
      },
      (err)=>{

        console.log(err);

      });
    } else {
      this.CatalogosService.addDetailsCat(objectFinish).then((res) => {
        console.log(res);
        this.ocultarCardAgregarResgistro();
        this.getDataCat();
      });
    }
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

/*

      if (dataColum.PRIMARY_KEY && dataColum.TYPE === 'N') {
        let arrayNumbers: number[] = [];

        dataValues.forEach((e) => {
          if (typeof e[dataColum.VALUE] === 'string') {
            arrayNumbers.push(Number(e[dataColum.VALUE]));
          } else {
            arrayNumbers.push(e[dataColum.VALUE]);
          }
        });

        if (arrayNumbers.length > 0) {
          valueFormControl =
            arrayNumbers.sort((a, b) => a - b)[arrayNumbers.length - 1] + 1;
        }
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
            valueFormControl = moment().format('YYYY-MM-DD').toString();

            specialFormat = true;
          }

          if (valueTempDate.includes('/')) {
            valueFormControl = moment().format('YYYY/MM/DD').toString();

            specialFormat = true;
          }

          if (!specialFormat) {
            valueFormControl = moment().format('YYYYMMDD').toString();
          }
        } else {
          valueFormControl = moment().format('YYYYMMDD').toString();
        }

        if (valueFormControl) {
          if (dataColum.TYPE === 'N') {
            valueFormControl = Number(valueFormControl);
          }
        }
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
              valueFormControl = moment().format('YYYY-MM-DD').toString();

              specialFormat = true;
            }

            if (valueTempDate.includes('/')) {
              valueFormControl = moment().format('YYYY/MM/DD').toString();

              specialFormat = true;
            }

            if (!specialFormat) {
              valueFormControl = moment().format('YYYYMMDD').toString();
            }
          } else {
            valueFormControl = moment().format('YYYYMMDD').toString();
          }

          if (valueFormControl) {
            if (dataColum.TYPE === 'N') {
              valueFormControl = Number(valueFormControl);
            }
          }
        }
*/
