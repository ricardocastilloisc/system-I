# Sistema Integral Automatizado

Es una plataforma que permite tener control, visibilidad y auditorías sobre los procesos de negocio tanto para Fondos de Inversión y Afore.

Facilita la integración de las plataformas legadas y sistemas de terceros (Blackrock, PIP), brinda independencia en la administración de catálogos y seguimiento de procesos por cada área de negocio (Fondos y Afore). Impulsando así la transformación digital a través de servicios en la nube e intercambio de información entre aplicaciones.


Ver documentación asociada al proyecto en Confluence [clic aquí](https://docs.principal.com/display/PPC/Manual+de+Usuario):
- `Manual de Usuario`

# Detalles de la aplicación

**Tecnologias:**
- Angular [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.
- AWS Amplify [Amplify CLI](https://docs.amplify.aws/cli) version 4.48.0.

**Versión:** 1.0

**Dependencias:**
- Azure Active Directory (AD) 
- AWS Appsync
- AWS DynamoBD
- AWS Cognito
- API Catalogos
- API Estadisticas Interfaces
- API CRD
- API MD
- API MO
- API AIMS Y EXCEDENTES
- API INT CASH
- API MANDATOS

**Desarrolladores:** Team SPS [[Brenda Galicia - bgalicia@spsolutions.com.mx](mailto:bgalicia@spsolutions.com.mx)] [[Victor Hernández - vhernandez@spsolutions.com.mx](mailto:vhernandez@spsolutions.com.mx)] [[Ricardo Castillo - rcastillo@spsolutions.com.mx](mailto:rcastillo@spsolutions.com.mx)] 


## Pasos para replicar la ejecución 

- Para ejecutar la aplicación en un ambiente local, es necesdario tener el CLI de AWS Amplify instalado [Amplify CLI](https://docs.amplify.aws/cli).
- Acceder a la consola de amplify, seleccionar la aplicacion y el backend correspondientes y realizar un pull desde el CLI de AWS Amplify, en la carpeta de la applicacion web con el `comando amplify pull --appId XXXXXXX --envName XXXXXXX`.
- Una vez que se tienen los ultimos cambios descargados, a traves del CLI de Angular, ejecutar `ng serve`, navega a `http://localhost:4200/` y la aplicacion estara corriendo en tu ambiente local.

**NOTA:** En la consola de Amplify, te mostrara el comando del pull con el appId y environment correspondiete. 

# Despliegue de la aplicación

Cómo desarrollador el despliegue se realiza a traves del CLI de Amplify forma manual o empleando la estrategia de CI/CD establecida para el proyecto. La recomentación es utilizar la segunda opción una vez se han realizado los ajustes correspondientes mencionados. 

## Despliegue Manual

Para realizar el desplegue manual,  una vez que se tengan los cambios necesarios y el ambiente configurado, se deberan seguir los siguientes pasos:

Si se realizaron cambios al backend:

- Hacer un push de los cambios a Amplify con el comando  `amplify push`

Si solo se realizaron cambios en el front end sin afectar al backend:

- Hacer el commit del respectivo cambio, hacer un push al repositorio de git.
- Publicar la aplicación en AMplify con el comando `amplify publish`

## Despliegue automatizado

Para realizar un depsliegue automatizado, es necesario hacer un pull request hacia la rama correspondiente con el commit que se quiera desplegar, una vez que el pull request sea aceptado, la estrategia planteada se encargara de realizar el despligue, tanto para backend como para front end.

**NOTA:** Debera tener acceso a la Wiki Monex de gitea, en caso de no ser así solicitar el acceso con el administrador correspondiente. Para siguientes ambientes a desarrollo se deberá hacer uso de la estrategia de CI/CD.

## Consideraciones
