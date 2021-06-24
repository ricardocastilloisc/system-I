import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { ERole } from '../../../../../../validators/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from '../../../../../../../environments/environment';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});

const docClient = new AWS.DynamoDB();
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

  elementoEliminar: any;

  idetentificadorDelObjectoAEliminar;

  addRegister = false;
  removeRegister = false;
  updateRegister = false;

  columnTemp: STRUCTURE_CAT;

  primaryKeyOrder = '';

  DetailCatsStatic = [];

  filter = false;
  flagPermisos = false;
  dropdownListFiltro = [];
  SettingsFiltro: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    allowSearchFilter: true,
    clearSearchFilter: true,
    enableCheckAll: false,
    maxHeight: 200,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Buscar ',
  };
  selectedItemsFiltro = [];

  placeholderFiltro = '';

  constructor(
    private CatalogosService: CatalogosService,
    private store: Store<AppState>,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnDestroy(): void {
    this.store.dispatch(unSetDetailCatalogos());
    this.DetailCatalogos$.unsubscribe();
  }

  openModalFilter = (column: STRUCTURE_CAT, content) => {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'confirmacionUsuariosModal',
    });

    this.dropdownListFiltro = [];

    this.selectedItemsFiltro = [];

    this.placeholderFiltro = column.campo;

    this.DetailCats.forEach((e) => {
      const object = {
        item_id: e[column.campo],
        item_text: this.transformDateOrString(
          e[column.campo],
          column.esFecha.bandera
        ),
      };

      if (
        this.dropdownListFiltro.filter((e) => e.item_id === object.item_id)
          .length === 0
      ) {
        this.dropdownListFiltro.push(object);
      }
    });
  };

  cleanFilter = () => {
    this.filter = false;

    this.DetailCats = this.DetailCatsStatic;
  };
  filtrar = () => {
    let arrayTemp = [];

    this.selectedItemsFiltro.forEach((e) => {
      arrayTemp = [
        ...arrayTemp,
        ...this.DetailCats.filter(
          (f) =>
            window.btoa(
              unescape(
                encodeURIComponent(
                  typeof f[this.placeholderFiltro] === 'string'
                    ? f[this.placeholderFiltro]
                    : f[this.placeholderFiltro].toString()
                )
              )
            ) ===
            window.btoa(
              unescape(
                encodeURIComponent(
                  typeof e.item_id === 'string'
                    ? e.item_id
                    : e.item_id.toString()
                )
              )
            )
        ),
      ];
    });

    this.DetailCats = arrayTemp;

    this.filter = true;

    this.modalService.dismissAll();
  };

  viewUpdateIcon = () => {
    return this.ColumDinamicData.length > 1;
  };
  ngOnInit(): void {

    // this.validarRoles();
    this.validarPermisos();
    this.getDataCat();
    this.DetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.DetailCatalogos)
      .subscribe((res) => {
        //DetailCats
        this.DetailCats = res;
        this.DetailCatsStatic = res;

        if (this.ColumDinamicData.length > 0) {
          this.makeFormsDinamic();
        }

        if (this.AgregarRegistroLoading) {
          this.abrirToass();
          this.AgregarRegistroLoading = false;
        }
      });
  }

  openModalConfirmacionEliminar(content, object) {

    localStorage.setItem('RegisterAction', 'ELIMINAR');
    localStorage.setItem('ObjectNewRegister', JSON.stringify(null));
    localStorage.setItem('ObjectOldRegister', JSON.stringify(object));

    this.elementoEliminar = object;

    let objectReferencePk = this.ColumDinamicData.filter(
      (e) => e.llavePrimaria === true
    )[0];

    const registro = object[objectReferencePk.campo];

    this.idetentificadorDelObjectoAEliminar =
      objectReferencePk.campo + ': ' + registro;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'confirmacionUsuariosModal',
    });
  }

  transformDateOrString = (value, isDate) => {
    if (value === null) {
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

  helperInputs = (column: STRUCTURE_CAT) => {
    this.columnTemp = column;
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
      this.primaryKeyOrder = res.filter(
        (e) => e.llavePrimaria === true
      )[0].campo;

      this.ColumDinamicData = res;

      this.store.dispatch(cargarDetailCatalogos());
    });
  };

  makeFormsDinamic = () => {
    this.FormsDinamic = null;
    this.FormsDinamic = new FormGroup({});
    this.ColumDinamicData.forEach((dataColum) => {
      let valueFormControl = null;
      let arraValidators = [];

      if (!dataColum.esFecha.bandera) {
        arraValidators = [
          Validators.required,
          Validators.minLength(dataColum.minCaracteres),
          Validators.maxLength(dataColum.maxCaracteres),
          Validators.pattern(dataColum.validacion.expresionRegular + '+'),
        ];
      } else {
        arraValidators = [Validators.required];
      }

      this.FormsDinamic.addControl(
        dataColum.campo,
        new FormControl(valueFormControl, arraValidators)
      );
    });
  };

  bordeError = (boolean) => {
    if (boolean) {
      return { 'border-color': '#dc3545' };
    } else {
      return {};
    }
  };

  AJrestriccion(event) {
    if (this.FormsDinamic.get(event.target.id)?.errors) {
      if (
        this.FormsDinamic.get(event.target.id).errors.hasOwnProperty(
          'maxlength'
        )
      ) {
        event.preventDefault();
      }
    }
  }

  viewInputText = (colum: STRUCTURE_CAT) => {
    return (colum.tipo === 'S' || colum.tipo === 'N') && !colum.esFecha.bandera;
  };
  viewInputNumber = (colum: STRUCTURE_CAT) => {
    return colum.tipo === 'N' && !colum.esFecha.bandera;
  };
  viewInputDate = (colum: STRUCTURE_CAT) => {
    return colum.esFecha.bandera;
  };

  viewFECHA = (value) => {
    return !value.includes('FECHA_ACTUALIZADO');
  };

  viewPrimaryKey = (colum: STRUCTURE_CAT) => {
    if (colum.llavePrimaria && colum.tipo == 'S') {
      return true;
    } else {
      return !colum.llavePrimaria;
    }
  };

  arrayFomsInput = (colums: STRUCTURE_CAT[]) => {
    let arrayReturn: STRUCTURE_CAT[] = colums;

    arrayReturn = arrayReturn.filter((e) => {
      if (this.viewPrimaryKey(e)) {
        return e;
      }
    });
    return arrayReturn;
  };

  disabledInput = (colum: STRUCTURE_CAT) => {
    return colum.llavePrimaria && this.editar;
  };

  mostrarCardAgregarResgistro = (editar = 0, object = null) => {

    this.mostrarEjecucionesProcesos = false;

    if (editar === 0) {
      this.editar = false;
      localStorage.setItem('RegisterAction', 'AGREGAR');
      localStorage.setItem('ObjectOldRegister', JSON.stringify(null));
      this.ColumDinamicData.forEach((dataColum) => {
        let valueFormControl = null;

        if (editar === 0) {
          if (dataColum.llavePrimaria && dataColum.tipo === 'N') {
            let arrayNumbers: number[] = [];

            this.DetailCats.forEach((e) => {
              if (typeof e[dataColum.campo] === 'string') {
                arrayNumbers.push(Number(e[dataColum.campo]));
              } else {
                arrayNumbers.push(e[dataColum.campo]);
              }
            });

            if (arrayNumbers.length > 0) {
              valueFormControl =
                arrayNumbers.sort((a, b) => a - b)[arrayNumbers.length - 1] + 1;
            } else {
              valueFormControl = 1;
            }
          }

          if (dataColum.esFecha.bandera) {
            valueFormControl = moment().format('YYYY-MM-DD').toString();
          }
          this.FormsDinamic.get(dataColum.campo).setValue(valueFormControl);
        }
      });
    } else {
      this.editar = true;
      localStorage.setItem('RegisterAction', 'ACTUALIZAR');
      localStorage.setItem('ObjectOldRegister', JSON.stringify(object));
      this.ColumDinamicData.forEach((dataColum) => {
        let valueTempControl = null;

        valueTempControl = object[dataColum.campo];

        if (typeof valueTempControl === 'string') {
          valueTempControl = valueTempControl;
        } else {
          valueTempControl = valueTempControl.toString();
        }

        if (dataColum.esFecha.bandera) {
          if (this.DetailCats.length > 0) {
            let valueTempDate = this.DetailCats[0][dataColum.campo];

            let specialFormat = false;

            if (typeof valueTempDate === 'string') {
              valueTempDate = valueTempDate;
            } else {
              valueTempDate = valueTempDate.toString();
            }

            if (valueTempDate.includes('-')) {
              valueTempControl = moment(object[dataColum.campo])
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

        this.FormsDinamic.get(dataColum.campo).setValue(valueTempControl);

      });

    }

  };

  ocultarCardAgregarResgistro = () => {
    this.mostrarEjecucionesProcesos = true;
    this.FormsDinamic.reset();
  };

  abrirToass = () => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><img class="successRegistro"/>';

    //mensaje = mensaje + 'Registro' 'exitoso';
    mensaje = mensaje + 'Registro';

    if (this.addRegister) {
      mensaje = mensaje + ' añadido ';
    }
    if (this.removeRegister) {
      mensaje = mensaje + ' eliminado ';
    }
    if (this.updateRegister) {
      mensaje = mensaje + ' actualizado ';
    }

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

    this.addRegister = false;
    this.removeRegister = false;
    this.updateRegister = false;
  };

  abrirToassError = (err) => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><div><img class="iconErrorRegistro"/>';

    mensaje = mensaje + 'Se ha producido un error';

    mensaje = mensaje + '</div><div class="descipcionError">';
    mensaje = mensaje + err.error.descripcion;
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

    let ObjectTemp = this.FormsDinamic.value;
    localStorage.setItem('ObjectNewRegister', JSON.stringify(ObjectTemp));

    let objectFinish = {};

    this.ColumDinamicData.forEach((dataColum) => {
      let finishTempControl = null;

      let valueTempControl = ObjectTemp[dataColum.campo];

      if (dataColum.esFecha.bandera) {
        if (this.DetailCats.length > 0) {
          let valueTempDate = this.DetailCats[0][dataColum.campo];

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

      if (dataColum.tipo === 'N') {
        finishTempControl = Number(valueTempControl);
      }

      if (dataColum.tipo === 'S') {
        finishTempControl = valueTempControl;
      }

      objectFinish[dataColum.campo] = finishTempControl;
    });

    if (this.editar) {
      this.CatalogosService.updateDetailsCat(objectFinish).then(
        () => {
          this.updateRegister = true;
          this.AgregarRegistroLoading = true;
          this.ocultarCardAgregarResgistro();
          this.getDataCat();
          this.CatalogosService.generarAuditoria('EXITO');
        },
        (err) => {
          this.abrirToassError(err);
          this.CatalogosService.generarAuditoria('ERROR');
        }
      );
    } else {
      this.CatalogosService.addDetailsCat(objectFinish).then(
        () => {
          this.addRegister = true;
          this.AgregarRegistroLoading = true;
          this.ocultarCardAgregarResgistro();

          new Promise((resolve) => {
            const intervalo = setInterval(() => {
              if (!this.AgregarRegistroLoading) {
                resolve('ok');
                clearInterval(intervalo);
              }
            }, 100);
          }).then(() => {
            if (this.DetailCats.length % 10 !== 0) {
              this.paginaDetailCats =
                parseInt((this.DetailCats.length / 10).toLocaleString()) + 1;
            }
          });
          this.getDataCat();
          this.CatalogosService.generarAuditoria('EXITO');
        },
        (err) => {
          this.abrirToassError(err);
          this.CatalogosService.generarAuditoria('ERROR');
        }
      );
    }
  };

  eliminarRegistro = () => {


    let objectReferencePk = this.ColumDinamicData.filter(
      (e) => e.llavePrimaria === true
    )[0];
    const registro = this.elementoEliminar[objectReferencePk.campo];
    this.CatalogosService.deleteDetailsCat(registro).then(
      () => {
        this.removeRegister = true;
        this.AgregarRegistroLoading = true;
        this.paginaDetailCats = 1;
        this.modalService.dismissAll();
        this.getDataCat();
        this.CatalogosService.generarAuditoria('EXITO');
      },
      (err) => {
        this.abrirToassError(err);
        this.CatalogosService.generarAuditoria('ERROR');
      }
    );
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
  }

  validarRoles(): boolean {
    let flag = false;
    this.store
      .select(({ usuario }) => usuario.user)
      .subscribe((res) => {
        const rol = res.attributes['custom:rol'];
        if (rol === ERole.Administrador) {
          flag = true;
        }
      });
    this.flagPermisos = flag;
    return flag;
  }

  validarPermisos(): void {
    this.flagPermisos = false;
    let rol: string;
    const catalogo = localStorage.getItem('nameCat');
    const negocio = localStorage.getItem('negocio').toUpperCase().split(',');
    const area = localStorage.getItem('area').toUpperCase();
    this.store
      .select(({ usuario }) => usuario.user)
      .subscribe((res) => {
        rol = res.attributes['custom:rol'];
      });
    const params = {
      ExpressionAttributeValues: {
        ':a': {
          S: catalogo
        }
      },
      FilterExpression: 'NOMBRE = :a',
      TableName: environment.diccionarioPermisos
    };
    docClient.scan(params, (err, data) => {
      if (data) {
        if (data.Count > 0) {
          console.log('Permisos', data);
          const permisoArea = data.Items[0].AREA.S;
          const permisoNegocio = data.Items[0].NEGOCIO.S;
          if (permisoArea.includes(area)) {
            // tslint:disable-next-line: forin
            for (let i in negocio) {
              if (permisoNegocio.includes(negocio[i])) {
                switch (area) {
                  case 'CUSTODIA':
                    if (data.Items[0].PRIV_CUSTODIA.S.includes('W')) {
                      this.flagPermisos = true;
                    }
                    break;
                  case 'CONTABILIDAD':
                    if (data.Items[0].PRIV_CONTABILIDAD.S.includes('W')) {
                      this.flagPermisos = true;
                    }
                    break;
                  case 'RIESGOS':
                    if (data.Items[0].PRIV_RIESGOS.S.includes('W')) {
                      this.flagPermisos = true;
                    }
                    break;
                  case 'TESORERIA':
                    if (data.Items[0].PRIV_TESORERIA.S.includes('W')) {
                      this.flagPermisos = true;
                    }
                    break;
                  case 'SOPORTE':
                    if (data.Items[0].PRIV_SOPORTE.S.includes('W')) {
                      this.flagPermisos = true;
                    }
                    break;
                }
              }
            }
          }
        }
      }
    });
  }
}
