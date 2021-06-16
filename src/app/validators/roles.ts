// callbackAwsDetalle --> var rol = data['UserAttributes'].find((el) => el.Name == 'custom:rol')['Value'];
export enum ERole {
  Administrador = 'Administrador',
  Monitor = 'Monitor',
  Soporte = 'Soporte'
}
// callbackAwsDetalle --> var negocio = data['UserAttributes'].find((el) => el.Name == 'custom:negocio')['Value'];
export enum ENegocio {
  Afore = 'Afore',
  Fondos = 'Fondos'
}
// DataUser --> user.usuario.groups
export enum EArea {
  Tesoreria = 'Tesoreria',
  Inversiones_Riesgos = 'Riesgos',
  Contabilidad = 'Contabilidad',
  Custodia = 'Custodia',
  Soporte = 'Soporte'
}
