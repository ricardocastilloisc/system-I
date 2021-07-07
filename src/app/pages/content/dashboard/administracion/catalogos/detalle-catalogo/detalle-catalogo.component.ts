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
  loadingCompleteDetailCatalogos,
  loadingDetailCatalogos,
  unSetDetailCatalogos,
} from '../../../../../../ReduxStore/actions/catalogos/catalogoDetail.actions';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ERole, EArea } from '../../../../../../validators/roles';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuariosService } from '../../../../../../services/usuarios.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { APIService } from '../../../../../../API.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-catalogo',
  templateUrl: './detalle-catalogo.component.html',
  styleUrls: ['./detalle-catalogo.component.css'],
})
export class DetalleCatalogoComponent implements OnInit, OnDestroy {
  @ViewChild('ejecucionesInexistentes')
  templateRefEjecuciones: TemplateRef<any>;
  filtroEjecucionesForm: FormGroup;

  DetailCatalogos$: Subscription;
  ColumDinamicData: STRUCTURE_CAT[] = [];
  DetailCats: any = [];
  paginaDetailCats = 1;
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
  DataUser$: Observable<Usuario>;
  DataUser: Usuario;
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
  flagConsultar = false;
  flagAgregar = false;
  flagEditar = false;
  flagEliminar = false;
  errorBack = false;

  constructor(
    private catalogoService: CatalogosService,
    private store: Store<AppState>,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private api: APIService,
    private usuario: UsuariosService,
    public LOC: Location
  ) { }

  ngOnDestroy(): void {
    localStorage.removeItem('tokenPageBefore');
    localStorage.removeItem('tokenPageActuality');
    localStorage.removeItem('tokenPageNext');
    localStorage.removeItem('PageNumerPageCat');
    localStorage.removeItem('Paginas');
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

  ejecucionesInexistentesModal() {
    this.modalService.open(this.templateRefEjecuciones, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  cerrarModales = () => {
    this.modalService.dismissAll();
    this.LOC.back();
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
    let flag = false;
    if (this.ColumDinamicData.length > 1) {
      if (this.flagEditar === true) {
        flag = true;
      }
    }
    return flag;
  }

  ngOnInit(): void {
    this.validarPermisos();
    this.getDataCat();
    this.DetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.DetailCatalogos)
      .subscribe((res) => {
        if (res) {
          if (this.ColumDinamicData.length > 0) {
            this.makeFormsDinamic();
          }

          if (res.length > 0) {
            if (res[0]?.error) {
              this.ejecucionesInexistentesModal();
              this.errorBack = true;
            } else {
              // DetailCats
              this.DetailCats = res;
              this.DetailCatsStatic = res;

              if (this.AgregarRegistroLoading) {
                this.abrirToass();
                this.AgregarRegistroLoading = false;
              }
            }
          }
        }
      });
  }

  openModalConfirmacionEliminar(content, object): void {
    localStorage.setItem('RegisterAction', 'ELIMINAR');
    localStorage.setItem('ObjectNewRegister', JSON.stringify(null));
    localStorage.setItem('ObjectOldRegister', JSON.stringify(object));

    this.elementoEliminar = object;

    const objectReferencePk = this.ColumDinamicData.filter(
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

  verAtras = () => {
    return !(JSON.parse(localStorage.getItem('PageNumerPageCat')) === 0)
  }

  veraAdelante = () => {
    return !(localStorage.getItem('tokenPageNext') === 'null')
  }

  transformDateOrString = (value, isDate) => {
    if (value === null || value === undefined) {
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
    this.catalogoService.structureCat().then((res: STRUCTURE_CAT[]) => {
      if (res.length > 0) {
        this.primaryKeyOrder = res.filter(
          (e) => e.llavePrimaria === true
        )[0].campo;

        this.ColumDinamicData = res;

        this.cargarConInicialOPaginado();
      } else {
        this.store.dispatch(loadingCompleteDetailCatalogos());
        this.ejecucionesInexistentesModal();
        this.errorBack = true;
      }
    });
  };

  //-1 es a la izquierda y 1 es a la derecha
  cargarConInicialOPaginado = (izquierdaOderecha = 0) => {
    let tokenPageActuality = null;

    if (izquierdaOderecha === 0) {
      tokenPageActuality = localStorage.getItem('tokenPageActuality');

      if (tokenPageActuality === 'null') {
        tokenPageActuality = null;
        localStorage.setItem('PageNumerPageCat', '0');
      }

      if (!tokenPageActuality) {
        tokenPageActuality = null;
        localStorage.setItem('PageNumerPageCat', '0');
      }
    }

    if (izquierdaOderecha === 1) {
      this.store.dispatch(loadingDetailCatalogos());
      tokenPageActuality = localStorage.getItem('tokenPageNext');

      let PageNumerPageCat =
        JSON.parse(localStorage.getItem('PageNumerPageCat')) + 1;

      this.paginaDetailCats = 1;

      localStorage.setItem('PageNumerPageCat', PageNumerPageCat.toString());
      localStorage.setItem('izquierdaOderecha', izquierdaOderecha.toString());
    }

    if (izquierdaOderecha === -1) {
      this.store.dispatch(loadingDetailCatalogos());
      tokenPageActuality = localStorage.getItem('tokenPageBefore');

      if (tokenPageActuality === 'null') {
        tokenPageActuality = null;
      }

      let PageNumerPageCat =
        JSON.parse(localStorage.getItem('PageNumerPageCat')) - 1;

      localStorage.setItem('PageNumerPageCat', PageNumerPageCat.toString());
      localStorage.setItem('izquierdaOderecha', izquierdaOderecha.toString());
    }

    this.store.dispatch(cargarDetailCatalogos({ token: tokenPageActuality }));
  };

  verLabePaginado = (label) => {
    let PageNumerPageCat = JSON.parse(localStorage.getItem('PageNumerPageCat'));

    return parseInt(label) + PageNumerPageCat * 5;
  };

  makeFormsDinamic = () => {
    this.FormsDinamic = null;
    this.FormsDinamic = new FormGroup({});
    this.ColumDinamicData.forEach((dataColum) => {
      // tslint:disable-next-line: prefer-const
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

  // tslint:disable-next-line: variable-name
  bordeError = (boolean) => {
    if (boolean) {
      return { 'border-color': '#dc3545' };
    } else {
      return {};
    }
  };

  // tslint:disable-next-line: typedef
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
            // tslint:disable-next-line: prefer-const
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

    // mensaje = mensaje + 'Registro' 'exitoso';
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

  abrirToassError = (err: any) => {
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
      this.catalogoService.updateDetailsCat(objectFinish).then(
        () => {
          this.updateRegister = true;
          this.AgregarRegistroLoading = true;
          this.ocultarCardAgregarResgistro();
          this.getDataCat();
          this.catalogoService.generarAuditoria('EXITO');
        },
        (err) => {
          this.abrirToassError(err);
          this.catalogoService.generarAuditoria('ERROR');
        }
      );
    } else {
      this.catalogoService.addDetailsCat(objectFinish).then(
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
                // tslint:disable-next-line: radix
                parseInt((this.DetailCats.length / 10).toLocaleString()) + 1;
            }
          });
          this.getDataCat();
          this.catalogoService.generarAuditoria('EXITO');
        },
        (err) => {
          this.abrirToassError(err);
          this.catalogoService.generarAuditoria('ERROR');
        }
      );
    }
    localStorage.setItem('ObjectNewRegister', JSON.stringify(objectFinish));
  };

  eliminarRegistro = () => {
    const objectReferencePk = this.ColumDinamicData.filter(
      (e) => e.llavePrimaria === true
    )[0];
    const registro = this.elementoEliminar[objectReferencePk.campo];
    this.catalogoService.deleteDetailsCat(registro).then(
      () => {
        this.removeRegister = true;
        this.AgregarRegistroLoading = true;
        this.paginaDetailCats = 1;
        this.modalService.dismissAll();
        this.getDataCat();
        this.catalogoService.generarAuditoria('EXITO');
      },
      (err) => {
        this.abrirToassError(err);
        this.catalogoService.generarAuditoria('ERROR');
      }
    );
  };

  verPaginado = () => {
    if (this.DetailCats) {
      if (this.DetailCats.length > 10) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  obtenerBanderaPermiso(item: any): boolean {
    let flag = false;
    if (item !== undefined && item !== null) {
      if (Object.keys(item).length !== 0) {
        flag = true;
      }
    }
    return flag;
  }

  validarPermisos(): void {
    this.flagPermisos = false;
    const catalogo = localStorage.getItem('nameCat');
    const catalogoNegocio = localStorage.getItem('negocioCat');
    const autenticado = this.usuario.validarRolUsuario();
    if (autenticado) {
      this.store
        .select(({ usuario }) => usuario.user)
        .subscribe((user) => {
          if (user) {
            this.DataUser = user;
            const areas = [
              EArea.Tesoreria,
              EArea.Inversiones_Riesgos,
              EArea.Contabilidad,
              EArea.Custodia,
              EArea.Soporte,
            ];
            const areasStore = [];
            user.attributes['cognito:groups'].forEach((e) => {
              if (areas.includes(e)) {
                areasStore.push(e.toUpperCase());
              }
            });
            const area = areasStore[0];
            let negocio = this.DataUser.attributes['custom:negocio'].toUpperCase();
            if (area.includes('SOPORTE')) {
              negocio = 'SOPORTE';
            }
            const rol = this.DataUser.attributes['custom:rol'].toUpperCase();
            this.api.ListCATPERMISOS([negocio], area, rol).then(({ items }: any) => {
              if (Object.keys(items).length !== 0) {
                const consultar = items.find(ai => ai.CATALOGOS.CONSULTAR === true);
                const agregar = items.find(ai => ai.CATALOGOS.CREAR === true);
                const editar = items.find(ai => ai.CATALOGOS.ACTUALIZAR === true);
                const eliminar = items.find(ai => ai.CATALOGOS.BORRAR === true);
                this.flagConsultar = this.obtenerBanderaPermiso(consultar);
                this.flagAgregar = this.obtenerBanderaPermiso(agregar);
                this.flagEditar = this.obtenerBanderaPermiso(editar);
                this.flagEliminar = this.obtenerBanderaPermiso(eliminar);
                if (this.flagAgregar === true || this.flagEditar === true || this.flagEliminar === true) {
                  this.api
                    .GetSiaGenAdmDiccionarioCatalogosDev(catalogo, catalogoNegocio)
                    .then((data) => {
                      const permisoArea = data.AREA;
                      const permisoNegocio = data.NEGOCIO.split(',');
                      if (permisoArea.includes(area)) {
                        if (permisoNegocio.some(ai => negocio.includes(ai))) {
                          if (area.includes('CUSTODIA')) {
                            if (!data.PRIV_CUSTODIA.includes('W')) {
                              this.flagAgregar = false;
                              this.flagEditar = false;
                              this.flagEliminar = false;
                            }
                          }
                          if (area.includes('CONTABILIDAD')) {
                            if (!data.PRIV_CONTABILIDAD.includes('W')) {
                              this.flagAgregar = false;
                              this.flagEditar = false;
                              this.flagEliminar = false;
                            }
                          }
                          if (area.includes('RIESGOS')) {
                            if (!data.PRIV_RIESGOS.includes('W')) {
                              this.flagAgregar = false;
                              this.flagEditar = false;
                              this.flagEliminar = false;
                            }
                          }
                          if (area.includes('TESORERIA')) {
                            if (!data.PRIV_TESORERIA.includes('W')) {
                              this.flagAgregar = false;
                              this.flagEditar = false;
                              this.flagEliminar = false;
                            }
                          }
                        } else if (negocio.includes('SOPORTE')) {
                          if (!data.PRIV_SOPORTE.includes('W')) {
                            this.flagAgregar = false;
                            this.flagEditar = false;
                            this.flagEliminar = false;
                          }
                        }
                      }
                      if (this.flagEditar === true || this.flagEliminar === true) {
                        this.flagPermisos = true;
                      }
                    });
                }
              }
            });
          }
        });
    }
  }

}
