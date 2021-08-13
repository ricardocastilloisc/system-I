const ambiente = 'dev';
const accessKey = 'AKIAU4J45SEJKYA4ITEZ';
const secretAccess = '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';
const region = 'us-east-1';
const cognitoDomain = 'sia-app-up.auth.us-east-1.amazoncognito.com';
const redirectUrl = 'localhost:4200';
const appClient = '5cvq4jop6octili7583n597kd1';
const cognitoGrupoUsuarios = 'us-east-1_Ftm7m3Om2';
const sqsAcceso = 'sqs.us-east-1.amazonaws.com/335672086802/sia-utileria-encolamiento-mensajes-monitoreo-dev';
const apiGateway = 'api.sia.dev.principal.com.mx';

export const environment = {
  production: false,
  logGroup: 'sia/frontend/' + ambiente,

  SESConfig: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccess,
    region: region,
  },

  urlExternalLogin: 'https://'+cognitoDomain+'/oauth2/authorize?identity_provider=Azure&redirect_uri=http://'+redirectUrl+'/&response_type=code&client_id='+appClient+'&scope=phone%20email%20openid%20profile',

  amplifyConfig: {
    Auth: {
      region: region,
      userPoolId: cognitoGrupoUsuarios,
      userPoolWebClientId: appClient,
      limit: 50,
      oauth: {
        domain: cognitoDomain,
        scope: ['phone', 'email', 'openid', 'profile'],
        redirectSignIn: 'http://'+redirectUrl+'/',
        redirectSignOut: 'http://'+redirectUrl+'/',
        responseType: 'code'
      },
    }
  },

  API: {
    endpoints: [
      {
        name: 'sqs-auditoria',
        endpoint: 'https://'+sqsAcceso+'.fifo'
      },
      {
        name: 'catalogos',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/utileria/'
      },
      {
        name: 'auditoria',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/utileria/auditoria/interfaces'
      },
      {
        name: 'AIMS Y EXCEDENTES',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/afore/aimsexcedentes'
      },
      {
        name: 'MD',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/afore/md'
      },
      {
        name: 'INT CASH',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/afore/intcash'
      },
      {
        name: 'MO',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/afore/mo'
      },
      {
        name: 'CRD',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/fondos/crd'
      },
      {
        name: 'MANDATOS',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/fondos/mandatos'
      },
      {
        name: 'INT CASH SANTANDER',
        endpoint: 'https://'+apiGateway+'/'+ambiente+'/sia/afore/intcashsantander'
      }
    ],
  },
};
