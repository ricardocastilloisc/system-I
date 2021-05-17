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

@Component({
  selector: 'app-detalle-catalogo',
  templateUrl: './detalle-catalogo.component.html',
  styleUrls: ['./detalle-catalogo.component.css'],
})
export class DetalleCatalogoComponent implements OnInit, OnDestroy {
  //CatalogosService
  DetailCatalogos$: Subscription;

  ColumDinamicData: STRUCTURE_CAT[] = [];

  DetailCats: any = [];

  paginaDetailCats: number = 1;

  FormsDinamic: FormGroup;


  mostrarEjecucionesProcesos = true;

  constructor(
    private CatalogosService: CatalogosService,
    private store: Store<AppState>
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
          this.makeFormsDinamic(res);
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

  makeFormsDinamic = (dataValues) => {
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
    return (
      this.viewPrimaryKey(colum) &&
      this.viewFECHA(colum.VALUE) &&
      colum.TYPE === 'S' &&
      !colum.DATE
    );
  };
  viewInputNumber = (colum: STRUCTURE_CAT) => {
    return (
      this.viewPrimaryKey(colum) &&
      this.viewFECHA(colum.VALUE) &&
      colum.TYPE === 'N' &&
      !colum.DATE
    );
  };
  viewInputDate = (colum: STRUCTURE_CAT) => {
    return (
      this.viewPrimaryKey(colum) && this.viewFECHA(colum.VALUE) && colum.DATE
    );
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


  mostrarCardAgregarResgistro = () =>{

    this.mostrarEjecucionesProcesos = false;
  }
  ocultarCardAgregarResgistro = () =>{

    this.mostrarEjecucionesProcesos = true;
  }

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
            arrayNumbers.push(parseInt(e[dataColum.VALUE]));
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
            valueFormControl = parseInt(valueFormControl);
          }
        }
      }
*/