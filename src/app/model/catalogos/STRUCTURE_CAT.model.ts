export interface STRUCTURE_CAT {
  campo: string;
  esFecha: { bandera: boolean; formato: any };
  llavePrimaria: boolean;
  maxCaracteres: number;
  minCaracteres: number;
  tipo: string;
  validacion: {
    expresionRegular: string;
    mensaje: string;
  };
  ejemplo: string;
}
