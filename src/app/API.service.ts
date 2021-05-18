/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type CreateAUDGENUSUARIOSInput = {
  ID: string;
};

export type AUDGENUSUARIOS = {
  __typename: "AUDGENUSUARIOS";
  ID?: string;
};

export type UpdateAUDGENUSUARIOSInput = {
  ID: string;
};

export type DeleteAUDGENUSUARIOSInput = {
  ID: string;
};

export type CreateAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type AUDGENPROCESOS = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: PROCESO;
  SERVICIOAWS?: string | null;
  USUARIO?: USUARIO;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
  ACTIVIDAD?: string | null;
};

export type PROCESO = {
  __typename: "PROCESO";
  EJECUCION?: string | null;
  TIPO?: string | null;
};

export type USUARIO = {
  __typename: "USUARIO";
  CORREO?: string | null;
  ROL?: string | null;
};

export type UpdateAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type DeleteAUDGENPROCESOSInput = {
  ID_REGISTRO: string;
};

export type CreateCATPROCESOSInput = {
  PROCESO: string;
};

export type CATPROCESOS = {
  __typename: "CATPROCESOS";
  PROCESO?: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type UpdateCATPROCESOSInput = {
  PROCESO: string;
};

export type DeleteCATPROCESOSInput = {
  PROCESO: string;
};

export type CreateCATPERMISOSInput = {
  ID: string;
};

export type CATPERMISOS = {
  __typename: "CATPERMISOS";
  ID?: string;
  AREA?: string | null;
  AUDITORIA?: AUDITORIA;
  CATALOGOS?: CATALOGOS;
  FLUJO?: string | null;
  PROCESOS?: PROCESOS;
  ROL?: string | null;
  USUARIOS?: USUARIOS;
  NEGOCIO?: string | null;
};

export type AUDITORIA = {
  __typename: "AUDITORIA";
  ARCHIVOS?: boolean | null;
  CATALOGOS?: boolean | null;
  PROCESOS?: boolean | null;
};

export type CATALOGOS = {
  __typename: "CATALOGOS";
  ACTUALIZAR?: boolean | null;
  BORRAR?: boolean | null;
  CONSULTAR?: boolean | null;
  CREAR?: boolean | null;
};

export type PROCESOS = {
  __typename: "PROCESOS";
  DETENER?: boolean | null;
  INICIAR?: boolean | null;
  MONITOREAR?: boolean | null;
};

export type USUARIOS = {
  __typename: "USUARIOS";
  ACTUALIZAR?: boolean | null;
  BORRAR?: boolean | null;
  CONSULTAR?: boolean | null;
};

export type UpdateCATPERMISOSInput = {
  ID: string;
};

export type DeleteCATPERMISOSInput = {
  ID: string;
};

export type CreateSiaGenAudEstadoProcesosDevInput = {
  ID_PROCESO: string;
  INTERFAZ?: string | null;
};

export type SiaGenAudEstadoProcesosDev = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO?: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type UpdateSiaGenAudEstadoProcesosDevInput = {
  ID_PROCESO: string;
  INTERFAZ?: string | null;
};

export type DeleteSiaGenAudEstadoProcesosDevInput = {
  ID_PROCESO: string;
};

export type TableAUDGENUSUARIOSFilterInput = {
  ID?: TableStringFilterInput | null;
};

export type TableStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type AUDGENUSUARIOSConnection = {
  __typename: "AUDGENUSUARIOSConnection";
  items?: Array<AUDGENUSUARIOS | null> | null;
  nextToken?: string | null;
};

export type AUDGENPROCESOSConnection = {
  __typename: "AUDGENPROCESOSConnection";
  items?: Array<AUDGENPROCESOS | null> | null;
  nextToken?: string | null;
};

export type TableCATPROCESOSFilterInput = {
  PROCESO?: TableStringFilterInput | null;
  TIPO?: TableStringFilterInput | null;
  NEGOCIO?: TableStringFilterInput | null;
};

export type CATPROCESOSConnection = {
  __typename: "CATPROCESOSConnection";
  items?: Array<CATPROCESOS | null> | null;
  nextToken?: string | null;
};

export type CATPERMISOSConnection = {
  __typename: "CATPERMISOSConnection";
  items?: Array<CATPERMISOS | null> | null;
  nextToken?: string | null;
};

export type TableSiaGenAudEstadoProcesosDevFilterInput = {
  FECHA_CREADO?: TableStringFilterInput | null;
  ID_PROCESO?: TableStringFilterInput | null;
  INTERFAZ?: TableStringFilterInput | null;
  FECHA_ACTUALIZACION?: TableStringFilterInput | null;
};

export type SiaGenAudEstadoProcesosDevConnection = {
  __typename: "SiaGenAudEstadoProcesosDevConnection";
  items?: Array<SiaGenAudEstadoProcesosDev | null> | null;
  nextToken?: string | null;
};

export type CreateAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type UpdateAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type DeleteAUDGENUSUARIOSMutation = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type CreateAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type UpdateAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type DeleteAUDGENPROCESOSMutation = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type CreateCATPROCESOSMutation = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type UpdateCATPROCESOSMutation = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type DeleteCATPROCESOSMutation = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type CreateCATPERMISOSMutation = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type UpdateCATPERMISOSMutation = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type DeleteCATPERMISOSMutation = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type CreateSiaGenAudEstadoProcesosDevMutation = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type UpdateSiaGenAudEstadoProcesosDevMutation = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type DeleteSiaGenAudEstadoProcesosDevMutation = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type GetAUDGENUSUARIOSQuery = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type ListAUDGENUSUARIOSQuery = {
  __typename: "AUDGENUSUARIOSConnection";
  items?: Array<{
    __typename: "AUDGENUSUARIOS";
    ID: string;
  } | null> | null;
  nextToken?: string | null;
};

export type GetAUDGENPROCESOSQuery = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type ListAUDGENPROCESOSQuery = {
  __typename: "AUDGENPROCESOSConnection";
  items?: Array<{
    __typename: "AUDGENPROCESOS";
    DESTINO?: string | null;
    ETAPA?: string | null;
    FECHA?: string | null;
    ID_PROCESO?: string | null;
    ID_REGISTRO?: string | null;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    MENSAJE_NEGOCIO?: string | null;
    MENSAJE_SOPORTE?: string | null;
    NEGOCIO?: string | null;
    PROCESO?: {
      __typename: "PROCESO";
      EJECUCION?: string | null;
      TIPO?: string | null;
    } | null;
    SERVICIOAWS?: string | null;
    USUARIO?: {
      __typename: "USUARIO";
      CORREO?: string | null;
      ROL?: string | null;
    } | null;
    TIPO?: string | null;
    NIVEL?: string | null;
    STEP?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type GetCATPROCESOSQuery = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type ListCATPROCESOSQuery = {
  __typename: "CATPROCESOSConnection";
  items?: Array<{
    __typename: "CATPROCESOS";
    PROCESO: string;
    ARRANQUE?: string | null;
    DESCRIPCION?: string | null;
    NEGOCIO?: string | null;
    TIPO?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type GetCATPERMISOSQuery = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type ListCATPERMISOSQuery = {
  __typename: "CATPERMISOSConnection";
  items?: Array<{
    __typename: "CATPERMISOS";
    ID: string;
    AREA?: string | null;
    AUDITORIA?: {
      __typename: "AUDITORIA";
      ARCHIVOS?: boolean | null;
      CATALOGOS?: boolean | null;
      PROCESOS?: boolean | null;
    } | null;
    CATALOGOS?: {
      __typename: "CATALOGOS";
      ACTUALIZAR?: boolean | null;
      BORRAR?: boolean | null;
      CONSULTAR?: boolean | null;
      CREAR?: boolean | null;
    } | null;
    FLUJO?: string | null;
    PROCESOS?: {
      __typename: "PROCESOS";
      DETENER?: boolean | null;
      INICIAR?: boolean | null;
      MONITOREAR?: boolean | null;
    } | null;
    ROL?: string | null;
    USUARIOS?: {
      __typename: "USUARIOS";
      ACTUALIZAR?: boolean | null;
      BORRAR?: boolean | null;
      CONSULTAR?: boolean | null;
    } | null;
    NEGOCIO?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type GetSiaGenAudEstadoProcesosDevQuery = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type ListSiaGenAudEstadoProcesosDevsQuery = {
  __typename: "SiaGenAudEstadoProcesosDevConnection";
  items?: Array<{
    __typename: "SiaGenAudEstadoProcesosDev";
    ESTADO?: string | null;
    ESTADO_EJECUCION?: string | null;
    ETAPA?: string | null;
    FECHA_ACTUALIZACION?: string | null;
    FECHA_CREADO?: string | null;
    ID_PROCESO: string;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    TIPO_PROCESO?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type QuerySiaGenAudEstadoProcesosDevsByINTERFAZIndexQuery = {
  __typename: "SiaGenAudEstadoProcesosDevConnection";
  items?: Array<{
    __typename: "SiaGenAudEstadoProcesosDev";
    ESTADO?: string | null;
    ESTADO_EJECUCION?: string | null;
    ETAPA?: string | null;
    FECHA_ACTUALIZACION?: string | null;
    FECHA_CREADO?: string | null;
    ID_PROCESO: string;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    TIPO_PROCESO?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type ListSiaGenAudEstadoProcesosDevsPorFechaQuery = {
  __typename: "SiaGenAudEstadoProcesosDevConnection";
  items?: Array<{
    __typename: "SiaGenAudEstadoProcesosDev";
    ESTADO?: string | null;
    ESTADO_EJECUCION?: string | null;
    ETAPA?: string | null;
    FECHA_ACTUALIZACION?: string | null;
    FECHA_CREADO?: string | null;
    ID_PROCESO: string;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    TIPO_PROCESO?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type OnCreateAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnUpdateAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnDeleteAUDGENUSUARIOSSubscription = {
  __typename: "AUDGENUSUARIOS";
  ID: string;
};

export type OnCreateAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type OnUpdateAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type OnDeleteAUDGENPROCESOSSubscription = {
  __typename: "AUDGENPROCESOS";
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: "PROCESO";
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: "USUARIO";
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
};

export type OnCreateCATPROCESOSSubscription = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type OnUpdateCATPROCESOSSubscription = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type OnDeleteCATPROCESOSSubscription = {
  __typename: "CATPROCESOS";
  PROCESO: string;
  ARRANQUE?: string | null;
  DESCRIPCION?: string | null;
  NEGOCIO?: string | null;
  TIPO?: string | null;
};

export type OnCreateCATPERMISOSSubscription = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type OnUpdateCATPERMISOSSubscription = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type OnDeleteCATPERMISOSSubscription = {
  __typename: "CATPERMISOS";
  ID: string;
  AREA?: string | null;
  AUDITORIA?: {
    __typename: "AUDITORIA";
    ARCHIVOS?: boolean | null;
    CATALOGOS?: boolean | null;
    PROCESOS?: boolean | null;
  } | null;
  CATALOGOS?: {
    __typename: "CATALOGOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
    CREAR?: boolean | null;
  } | null;
  FLUJO?: string | null;
  PROCESOS?: {
    __typename: "PROCESOS";
    DETENER?: boolean | null;
    INICIAR?: boolean | null;
    MONITOREAR?: boolean | null;
  } | null;
  ROL?: string | null;
  USUARIOS?: {
    __typename: "USUARIOS";
    ACTUALIZAR?: boolean | null;
    BORRAR?: boolean | null;
    CONSULTAR?: boolean | null;
  } | null;
  NEGOCIO?: string | null;
};

export type OnCreateSiaGenAudEstadoProcesosDevSubscription = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type OnUpdateSiaGenAudEstadoProcesosDevSubscription = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

export type OnDeleteSiaGenAudEstadoProcesosDevSubscription = {
  __typename: "SiaGenAudEstadoProcesosDev";
  ESTADO?: string | null;
  ESTADO_EJECUCION?: string | null;
  ETAPA?: string | null;
  FECHA_ACTUALIZACION?: string | null;
  FECHA_CREADO?: string | null;
  ID_PROCESO: string;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  TIPO_PROCESO?: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateAUDGENUSUARIOS(
    input: CreateAUDGENUSUARIOSInput
  ): Promise<CreateAUDGENUSUARIOSMutation> {
    const statement = `mutation CreateAUDGENUSUARIOS($input: CreateAUDGENUSUARIOSInput!) {
        createAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateAUDGENUSUARIOSMutation>response.data.createAUDGENUSUARIOS;
  }
  async UpdateAUDGENUSUARIOS(
    input: UpdateAUDGENUSUARIOSInput
  ): Promise<UpdateAUDGENUSUARIOSMutation> {
    const statement = `mutation UpdateAUDGENUSUARIOS($input: UpdateAUDGENUSUARIOSInput!) {
        updateAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateAUDGENUSUARIOSMutation>response.data.updateAUDGENUSUARIOS;
  }
  async DeleteAUDGENUSUARIOS(
    input: DeleteAUDGENUSUARIOSInput
  ): Promise<DeleteAUDGENUSUARIOSMutation> {
    const statement = `mutation DeleteAUDGENUSUARIOS($input: DeleteAUDGENUSUARIOSInput!) {
        deleteAUDGENUSUARIOS(input: $input) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteAUDGENUSUARIOSMutation>response.data.deleteAUDGENUSUARIOS;
  }
  async CreateAUDGENPROCESOS(
    input: CreateAUDGENPROCESOSInput
  ): Promise<CreateAUDGENPROCESOSMutation> {
    const statement = `mutation CreateAUDGENPROCESOS($input: CreateAUDGENPROCESOSInput!) {
        createAUDGENPROCESOS(input: $input) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateAUDGENPROCESOSMutation>response.data.createAUDGENPROCESOS;
  }
  async UpdateAUDGENPROCESOS(
    input: UpdateAUDGENPROCESOSInput
  ): Promise<UpdateAUDGENPROCESOSMutation> {
    const statement = `mutation UpdateAUDGENPROCESOS($input: UpdateAUDGENPROCESOSInput!) {
        updateAUDGENPROCESOS(input: $input) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateAUDGENPROCESOSMutation>response.data.updateAUDGENPROCESOS;
  }
  async DeleteAUDGENPROCESOS(
    input: DeleteAUDGENPROCESOSInput
  ): Promise<DeleteAUDGENPROCESOSMutation> {
    const statement = `mutation DeleteAUDGENPROCESOS($input: DeleteAUDGENPROCESOSInput!) {
        deleteAUDGENPROCESOS(input: $input) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteAUDGENPROCESOSMutation>response.data.deleteAUDGENPROCESOS;
  }
  async CreateCATPROCESOS(
    input: CreateCATPROCESOSInput
  ): Promise<CreateCATPROCESOSMutation> {
    const statement = `mutation CreateCATPROCESOS($input: CreateCATPROCESOSInput!) {
        createCATPROCESOS(input: $input) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateCATPROCESOSMutation>response.data.createCATPROCESOS;
  }
  async UpdateCATPROCESOS(
    input: UpdateCATPROCESOSInput
  ): Promise<UpdateCATPROCESOSMutation> {
    const statement = `mutation UpdateCATPROCESOS($input: UpdateCATPROCESOSInput!) {
        updateCATPROCESOS(input: $input) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateCATPROCESOSMutation>response.data.updateCATPROCESOS;
  }
  async DeleteCATPROCESOS(
    input: DeleteCATPROCESOSInput
  ): Promise<DeleteCATPROCESOSMutation> {
    const statement = `mutation DeleteCATPROCESOS($input: DeleteCATPROCESOSInput!) {
        deleteCATPROCESOS(input: $input) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteCATPROCESOSMutation>response.data.deleteCATPROCESOS;
  }
  async CreateCATPERMISOS(
    input: CreateCATPERMISOSInput
  ): Promise<CreateCATPERMISOSMutation> {
    const statement = `mutation CreateCATPERMISOS($input: CreateCATPERMISOSInput!) {
        createCATPERMISOS(input: $input) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateCATPERMISOSMutation>response.data.createCATPERMISOS;
  }
  async UpdateCATPERMISOS(
    input: UpdateCATPERMISOSInput
  ): Promise<UpdateCATPERMISOSMutation> {
    const statement = `mutation UpdateCATPERMISOS($input: UpdateCATPERMISOSInput!) {
        updateCATPERMISOS(input: $input) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateCATPERMISOSMutation>response.data.updateCATPERMISOS;
  }
  async DeleteCATPERMISOS(
    input: DeleteCATPERMISOSInput
  ): Promise<DeleteCATPERMISOSMutation> {
    const statement = `mutation DeleteCATPERMISOS($input: DeleteCATPERMISOSInput!) {
        deleteCATPERMISOS(input: $input) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteCATPERMISOSMutation>response.data.deleteCATPERMISOS;
  }
  async CreateSiaGenAudEstadoProcesosDev(
    input: CreateSiaGenAudEstadoProcesosDevInput
  ): Promise<CreateSiaGenAudEstadoProcesosDevMutation> {
    const statement = `mutation CreateSiaGenAudEstadoProcesosDev($input: CreateSiaGenAudEstadoProcesosDevInput!) {
        createSiaGenAudEstadoProcesosDev(input: $input) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateSiaGenAudEstadoProcesosDevMutation>(
      response.data.createSiaGenAudEstadoProcesosDev
    );
  }
  async UpdateSiaGenAudEstadoProcesosDev(
    input: UpdateSiaGenAudEstadoProcesosDevInput
  ): Promise<UpdateSiaGenAudEstadoProcesosDevMutation> {
    const statement = `mutation UpdateSiaGenAudEstadoProcesosDev($input: UpdateSiaGenAudEstadoProcesosDevInput!) {
        updateSiaGenAudEstadoProcesosDev(input: $input) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSiaGenAudEstadoProcesosDevMutation>(
      response.data.updateSiaGenAudEstadoProcesosDev
    );
  }
  async DeleteSiaGenAudEstadoProcesosDev(
    input: DeleteSiaGenAudEstadoProcesosDevInput
  ): Promise<DeleteSiaGenAudEstadoProcesosDevMutation> {
    const statement = `mutation DeleteSiaGenAudEstadoProcesosDev($input: DeleteSiaGenAudEstadoProcesosDevInput!) {
        deleteSiaGenAudEstadoProcesosDev(input: $input) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteSiaGenAudEstadoProcesosDevMutation>(
      response.data.deleteSiaGenAudEstadoProcesosDev
    );
  }
  async GetAUDGENUSUARIOS(ID: string): Promise<GetAUDGENUSUARIOSQuery> {
    const statement = `query GetAUDGENUSUARIOS($ID: String!) {
        getAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetAUDGENUSUARIOSQuery>response.data.getAUDGENUSUARIOS;
  }
  async ListAUDGENUSUARIOS(
    filter?: TableAUDGENUSUARIOSFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListAUDGENUSUARIOSQuery> {
    const statement = `query ListAUDGENUSUARIOS($filter: TableAUDGENUSUARIOSFilterInput, $limit: Int, $nextToken: String) {
        listAUDGENUSUARIOS(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            ID
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListAUDGENUSUARIOSQuery>response.data.listAUDGENUSUARIOS;
  }
  async GetAUDGENPROCESOS(ID_PROCESO: string): Promise<GetAUDGENPROCESOSQuery> {
    const statement = `query GetAUDGENPROCESOS($ID_PROCESO: String!) {
        getAUDGENPROCESOS(ID_PROCESO: $ID_PROCESO) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID_PROCESO
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetAUDGENPROCESOSQuery>response.data.getAUDGENPROCESOS;
  }
  async ListAUDGENPROCESOS(
    ID_PROCESO?: string,
    FECHA?: string
  ): Promise<ListAUDGENPROCESOSQuery> {
    const statement = `query ListAUDGENPROCESOS($ID_PROCESO: String, $FECHA: String) {
        listAUDGENPROCESOS(ID_PROCESO: $ID_PROCESO, FECHA: $FECHA) {
          __typename
          items {
            __typename
            DESTINO
            ETAPA
            FECHA
            ID_PROCESO
            ID_REGISTRO
            INSUMO
            INTERFAZ
            MENSAJE_NEGOCIO
            MENSAJE_SOPORTE
            NEGOCIO
            PROCESO {
              __typename
              EJECUCION
              TIPO
            }
            SERVICIOAWS
            USUARIO {
              __typename
              CORREO
              ROL
            }
            TIPO
            NIVEL
            STEP
            ACTIVIDAD
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_PROCESO) {
      gqlAPIServiceArguments.ID_PROCESO = ID_PROCESO;
    }
    if (FECHA) {
      gqlAPIServiceArguments.FECHA = FECHA;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListAUDGENPROCESOSQuery>response.data.listAUDGENPROCESOS;
  }
  async GetCATPROCESOS(PROCESO: string): Promise<GetCATPROCESOSQuery> {
    const statement = `query GetCATPROCESOS($PROCESO: String!) {
        getCATPROCESOS(PROCESO: $PROCESO) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      PROCESO
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetCATPROCESOSQuery>response.data.getCATPROCESOS;
  }
  async ListCATPROCESOS(
    filter?: TableCATPROCESOSFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListCATPROCESOSQuery> {
    const statement = `query ListCATPROCESOS($filter: TableCATPROCESOSFilterInput, $limit: Int, $nextToken: String) {
        listCATPROCESOS(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            PROCESO
            ARRANQUE
            DESCRIPCION
            NEGOCIO
            TIPO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListCATPROCESOSQuery>response.data.listCATPROCESOS;
  }
  async GetCATPERMISOS(ID: string): Promise<GetCATPERMISOSQuery> {
    const statement = `query GetCATPERMISOS($ID: String!) {
        getCATPERMISOS(ID: $ID) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetCATPERMISOSQuery>response.data.getCATPERMISOS;
  }
  async ListCATPERMISOS(
    NEGOCIOS?: Array<string | null>,
    AREA?: string,
    ROL?: string
  ): Promise<ListCATPERMISOSQuery> {
    const statement = `query ListCATPERMISOS($NEGOCIOS: [String], $AREA: String, $ROL: String) {
        listCATPERMISOS(NEGOCIOS: $NEGOCIOS, AREA: $AREA, ROL: $ROL) {
          __typename
          items {
            __typename
            ID
            AREA
            AUDITORIA {
              __typename
              ARCHIVOS
              CATALOGOS
              PROCESOS
            }
            CATALOGOS {
              __typename
              ACTUALIZAR
              BORRAR
              CONSULTAR
              CREAR
            }
            FLUJO
            PROCESOS {
              __typename
              DETENER
              INICIAR
              MONITOREAR
            }
            ROL
            USUARIOS {
              __typename
              ACTUALIZAR
              BORRAR
              CONSULTAR
            }
            NEGOCIO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (NEGOCIOS) {
      gqlAPIServiceArguments.NEGOCIOS = NEGOCIOS;
    }
    if (AREA) {
      gqlAPIServiceArguments.AREA = AREA;
    }
    if (ROL) {
      gqlAPIServiceArguments.ROL = ROL;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListCATPERMISOSQuery>response.data.listCATPERMISOS;
  }
  async GetSiaGenAudEstadoProcesosDev(
    ID_PROCESO: string
  ): Promise<GetSiaGenAudEstadoProcesosDevQuery> {
    const statement = `query GetSiaGenAudEstadoProcesosDev($ID_PROCESO: String!) {
        getSiaGenAudEstadoProcesosDev(ID_PROCESO: $ID_PROCESO) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {
      ID_PROCESO
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSiaGenAudEstadoProcesosDevQuery>(
      response.data.getSiaGenAudEstadoProcesosDev
    );
  }
  async ListSiaGenAudEstadoProcesosDevs(
    filter?: TableSiaGenAudEstadoProcesosDevFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSiaGenAudEstadoProcesosDevsQuery> {
    const statement = `query ListSiaGenAudEstadoProcesosDevs($filter: TableSiaGenAudEstadoProcesosDevFilterInput, $limit: Int, $nextToken: String) {
        listSiaGenAudEstadoProcesosDevs(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            ESTADO
            ESTADO_EJECUCION
            ETAPA
            FECHA_ACTUALIZACION
            FECHA_CREADO
            ID_PROCESO
            INSUMO
            INTERFAZ
            TIPO_PROCESO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSiaGenAudEstadoProcesosDevsQuery>(
      response.data.listSiaGenAudEstadoProcesosDevs
    );
  }
  async QuerySiaGenAudEstadoProcesosDevsByINTERFAZIndex(
    INTERFAZ: string,
    first?: number,
    after?: string
  ): Promise<QuerySiaGenAudEstadoProcesosDevsByINTERFAZIndexQuery> {
    const statement = `query QuerySiaGenAudEstadoProcesosDevsByINTERFAZIndex($INTERFAZ: String!, $first: Int, $after: String) {
        querySiaGenAudEstadoProcesosDevsByINTERFAZIndex(INTERFAZ: $INTERFAZ, first: $first, after: $after) {
          __typename
          items {
            __typename
            ESTADO
            ESTADO_EJECUCION
            ETAPA
            FECHA_ACTUALIZACION
            FECHA_CREADO
            ID_PROCESO
            INSUMO
            INTERFAZ
            TIPO_PROCESO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      INTERFAZ
    };
    if (first) {
      gqlAPIServiceArguments.first = first;
    }
    if (after) {
      gqlAPIServiceArguments.after = after;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <QuerySiaGenAudEstadoProcesosDevsByINTERFAZIndexQuery>(
      response.data.querySiaGenAudEstadoProcesosDevsByINTERFAZIndex
    );
  }
  async ListSiaGenAudEstadoProcesosDevsPorFecha(
    FECHA?: string
  ): Promise<ListSiaGenAudEstadoProcesosDevsPorFechaQuery> {
    const statement = `query ListSiaGenAudEstadoProcesosDevsPorFecha($FECHA: String) {
        listSiaGenAudEstadoProcesosDevsPorFecha(FECHA: $FECHA) {
          __typename
          items {
            __typename
            ESTADO
            ESTADO_EJECUCION
            ETAPA
            FECHA_ACTUALIZACION
            FECHA_CREADO
            ID_PROCESO
            INSUMO
            INTERFAZ
            TIPO_PROCESO
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (FECHA) {
      gqlAPIServiceArguments.FECHA = FECHA;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSiaGenAudEstadoProcesosDevsPorFechaQuery>(
      response.data.listSiaGenAudEstadoProcesosDevsPorFecha
    );
  }
  OnCreateAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnCreateAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnCreateAUDGENUSUARIOS($ID: String) {
        onCreateAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateAUDGENUSUARIOSSubscription>>;
  }

  OnUpdateAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnUpdateAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnUpdateAUDGENUSUARIOS($ID: String) {
        onUpdateAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateAUDGENUSUARIOSSubscription>>;
  }

  OnDeleteAUDGENUSUARIOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnDeleteAUDGENUSUARIOSSubscription>> {
    const statement = `subscription OnDeleteAUDGENUSUARIOS($ID: String) {
        onDeleteAUDGENUSUARIOS(ID: $ID) {
          __typename
          ID
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteAUDGENUSUARIOSSubscription>>;
  }

  OnCreateAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnCreateAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnCreateAUDGENPROCESOS($ID_REGISTRO: String) {
        onCreateAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateAUDGENPROCESOSSubscription>>;
  }

  OnUpdateAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnUpdateAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnUpdateAUDGENPROCESOS($ID_REGISTRO: String) {
        onUpdateAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateAUDGENPROCESOSSubscription>>;
  }

  OnDeleteAUDGENPROCESOSListener(
    ID_REGISTRO?: string
  ): Observable<SubscriptionResponse<OnDeleteAUDGENPROCESOSSubscription>> {
    const statement = `subscription OnDeleteAUDGENPROCESOS($ID_REGISTRO: String) {
        onDeleteAUDGENPROCESOS(ID_REGISTRO: $ID_REGISTRO) {
          __typename
          DESTINO
          ETAPA
          FECHA
          ID_PROCESO
          ID_REGISTRO
          INSUMO
          INTERFAZ
          MENSAJE_NEGOCIO
          MENSAJE_SOPORTE
          NEGOCIO
          PROCESO {
            __typename
            EJECUCION
            TIPO
          }
          SERVICIOAWS
          USUARIO {
            __typename
            CORREO
            ROL
          }
          TIPO
          NIVEL
          STEP
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_REGISTRO) {
      gqlAPIServiceArguments.ID_REGISTRO = ID_REGISTRO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteAUDGENPROCESOSSubscription>>;
  }

  OnCreateCATPROCESOSListener(
    PROCESO?: string
  ): Observable<SubscriptionResponse<OnCreateCATPROCESOSSubscription>> {
    const statement = `subscription OnCreateCATPROCESOS($PROCESO: String) {
        onCreateCATPROCESOS(PROCESO: $PROCESO) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PROCESO) {
      gqlAPIServiceArguments.PROCESO = PROCESO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateCATPROCESOSSubscription>>;
  }

  OnUpdateCATPROCESOSListener(
    PROCESO?: string
  ): Observable<SubscriptionResponse<OnUpdateCATPROCESOSSubscription>> {
    const statement = `subscription OnUpdateCATPROCESOS($PROCESO: String) {
        onUpdateCATPROCESOS(PROCESO: $PROCESO) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PROCESO) {
      gqlAPIServiceArguments.PROCESO = PROCESO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateCATPROCESOSSubscription>>;
  }

  OnDeleteCATPROCESOSListener(
    PROCESO?: string
  ): Observable<SubscriptionResponse<OnDeleteCATPROCESOSSubscription>> {
    const statement = `subscription OnDeleteCATPROCESOS($PROCESO: String) {
        onDeleteCATPROCESOS(PROCESO: $PROCESO) {
          __typename
          PROCESO
          ARRANQUE
          DESCRIPCION
          NEGOCIO
          TIPO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (PROCESO) {
      gqlAPIServiceArguments.PROCESO = PROCESO;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteCATPROCESOSSubscription>>;
  }

  OnCreateCATPERMISOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnCreateCATPERMISOSSubscription>> {
    const statement = `subscription OnCreateCATPERMISOS($ID: String) {
        onCreateCATPERMISOS(ID: $ID) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnCreateCATPERMISOSSubscription>>;
  }

  OnUpdateCATPERMISOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnUpdateCATPERMISOSSubscription>> {
    const statement = `subscription OnUpdateCATPERMISOS($ID: String) {
        onUpdateCATPERMISOS(ID: $ID) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnUpdateCATPERMISOSSubscription>>;
  }

  OnDeleteCATPERMISOSListener(
    ID?: string
  ): Observable<SubscriptionResponse<OnDeleteCATPERMISOSSubscription>> {
    const statement = `subscription OnDeleteCATPERMISOS($ID: String) {
        onDeleteCATPERMISOS(ID: $ID) {
          __typename
          ID
          AREA
          AUDITORIA {
            __typename
            ARCHIVOS
            CATALOGOS
            PROCESOS
          }
          CATALOGOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
            CREAR
          }
          FLUJO
          PROCESOS {
            __typename
            DETENER
            INICIAR
            MONITOREAR
          }
          ROL
          USUARIOS {
            __typename
            ACTUALIZAR
            BORRAR
            CONSULTAR
          }
          NEGOCIO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID) {
      gqlAPIServiceArguments.ID = ID;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<SubscriptionResponse<OnDeleteCATPERMISOSSubscription>>;
  }

  OnCreateSiaGenAudEstadoProcesosDevListener(
    ID_PROCESO?: string,
    INTERFAZ?: string
  ): Observable<
    SubscriptionResponse<OnCreateSiaGenAudEstadoProcesosDevSubscription>
  > {
    const statement = `subscription OnCreateSiaGenAudEstadoProcesosDev($ID_PROCESO: String, $INTERFAZ: String) {
        onCreateSiaGenAudEstadoProcesosDev(ID_PROCESO: $ID_PROCESO, INTERFAZ: $INTERFAZ) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_PROCESO) {
      gqlAPIServiceArguments.ID_PROCESO = ID_PROCESO;
    }
    if (INTERFAZ) {
      gqlAPIServiceArguments.INTERFAZ = INTERFAZ;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<OnCreateSiaGenAudEstadoProcesosDevSubscription>
    >;
  }

  OnUpdateSiaGenAudEstadoProcesosDevListener(
    ID_PROCESO?: string,
    INTERFAZ?: string
  ): Observable<
    SubscriptionResponse<OnUpdateSiaGenAudEstadoProcesosDevSubscription>
  > {
    const statement = `subscription OnUpdateSiaGenAudEstadoProcesosDev($ID_PROCESO: String, $INTERFAZ: String) {
        onUpdateSiaGenAudEstadoProcesosDev(ID_PROCESO: $ID_PROCESO, INTERFAZ: $INTERFAZ) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_PROCESO) {
      gqlAPIServiceArguments.ID_PROCESO = ID_PROCESO;
    }
    if (INTERFAZ) {
      gqlAPIServiceArguments.INTERFAZ = INTERFAZ;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<OnUpdateSiaGenAudEstadoProcesosDevSubscription>
    >;
  }

  OnDeleteSiaGenAudEstadoProcesosDevListener(
    ID_PROCESO?: string,
    INTERFAZ?: string
  ): Observable<
    SubscriptionResponse<OnDeleteSiaGenAudEstadoProcesosDevSubscription>
  > {
    const statement = `subscription OnDeleteSiaGenAudEstadoProcesosDev($ID_PROCESO: String, $INTERFAZ: String) {
        onDeleteSiaGenAudEstadoProcesosDev(ID_PROCESO: $ID_PROCESO, INTERFAZ: $INTERFAZ) {
          __typename
          ESTADO
          ESTADO_EJECUCION
          ETAPA
          FECHA_ACTUALIZACION
          FECHA_CREADO
          ID_PROCESO
          INSUMO
          INTERFAZ
          TIPO_PROCESO
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (ID_PROCESO) {
      gqlAPIServiceArguments.ID_PROCESO = ID_PROCESO;
    }
    if (INTERFAZ) {
      gqlAPIServiceArguments.INTERFAZ = INTERFAZ;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<OnDeleteSiaGenAudEstadoProcesosDevSubscription>
    >;
  }
}
