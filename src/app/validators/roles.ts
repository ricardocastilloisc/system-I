// callbackAwsDetalle --> var rol = data['UserAttributes'].find((el) => el.Name == 'custom:rol')['Value'];
export enum ERole {
  Administrador = 'Administrador',
  Ejecutor = 'Ejecutor',
  Soporte = 'Soporte'
}
// callbackAwsDetalle --> var negocio = data['UserAttributes'].find((el) => el.Name == 'custom:negocio')['Value'];
export enum ENegocio {
  Afore = 'Afore',
  Fondos = 'Fondos',
  Seguros = 'Seguros',
  Afore_Fondos = 'Afore y Fondos'
}
// DataUser --> user.usuario.groups
export enum AREA {
  Tesoreria = 'Tesoreria',
  Inversiones_Riesgos = 'Inversiones y Riesgos',
  Contabilidad = 'Contabilidad',
  Custodia = 'Custodia'
}