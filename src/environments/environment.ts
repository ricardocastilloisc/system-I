export const environment = {
  production: false,

  SESConfig: {
    accessKeyId: 'AKIAU4J45SEJH3NKEMHX',
    secretAccessKey: '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',
    region: 'us-east-1',
  },

  // urlExternalLogin: 'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=https://dev.d23mbxjbgl0msz.amplifyapp.com/&response_type=code&client_id=5cvq4jop6octili7583n597kd1&scope=phone%20email%20openid%20profile',

  urlExternalLogin: 'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=http://localhost:4200/dashboard&response_type=code&client_id=5cvq4jop6octili7583n597kd1&scope=phone%20email%20openid%20profile',

  amplifyConfig: {
    Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_Ftm7m3Om2',
      userPoolWebClientId: '5cvq4jop6octili7583n597kd1',
      limit: 50,
      oauth: {
        domain: 'sia-app-up.auth.us-east-1.amazoncognito.com',
        scope: ['phone', 'email', 'openid', 'profile'],
/*
        redirectSignIn: 'https://dev.d23mbxjbgl0msz.amplifyapp.com/',
        redirectSignOut: 'https://dev.d23mbxjbgl0msz.amplifyapp.com/',
*/
        redirectSignIn: 'http://localhost:4200/dashboard',
        redirectSignOut: 'http://localhost:4200',

        responseType: 'code'
      },
    }
  },
  API: {
    endpoints: [
      {
        name: 'sqs-auditoria',
        endpoint: 'https://sqs.us-east-1.amazonaws.com/335672086802/sia-utileria-encolamiento-mensajes-monitoreo-dev.fifo'
      },
      {
        name: 'catalogos',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/utileria/'
      },
      {
        name: 'auditoria',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/utileria/auditoria/interfaces'
      },
      {
        name: 'AIMS Y EXCEDENTES',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/aimsexcedentes'
      },
      {
        name: 'MD',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/md'
      },
      {
        name: 'INT CASH',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/intcash'
      },
      {
        name: 'MO',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/mo'
      },
      {
        name: 'CRD',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/fondos/crd'
      },
      {
        name: 'MANDATOS',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/fondos/mandatos'
      }
    ],
  },
};
