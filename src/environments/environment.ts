export const environment = {
  production: false,

  UserPoolId: "us-east-1_Ftm7m3Om2",
  Limit: 50,

  SESConfig: {
    accessKeyId: "AKIAU4J45SEJGVOZU7M6",
    secretAccessKey: "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",
    region: "us-east-1",
  },
  
  //urlExternalLogin: 'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=https://dev.d23mbxjbgl0msz.amplifyapp.com/&response_type=code&client_id=5cvq4jop6octili7583n597kd1&scope=phone%20email%20openid%20profile',
  
  urlExternalLogin: 'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=http://localhost:4200/dashboard&response_type=code&client_id=5cvq4jop6octili7583n597kd1&scope=phone%20email%20openid%20profile',
  
  accessTokenUrl: 'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/token',
  
  clientSecret: 'b4g4f8k4imm3qmc3793cveeu76ikeql5uqgvfh9p56da7nsg0m1',
  amplifyConfig: {
    Auth: {
      region: "us-east-1",
      userPoolId: "us-east-1_Ftm7m3Om2",
      userPoolWebClientId: "5cvq4jop6octili7583n597kd1",
      oauth: {
        domain: "sia-app-up.auth.us-east-1.amazoncognito.com",
        scope: ["phone", "email", "openid", "profile"],
        /*
        redirectSignIn: "https://dev.d23mbxjbgl0msz.amplifyapp.com/",
        redirectSignOut: "https://dev.d23mbxjbgl0msz.amplifyapp.com/",
        */
        redirectSignIn: "http://localhost:4200/dashboard",
        redirectSignOut: "http://localhost:4200",
        
        responseType: "code"
      },
    }
  },
  ENPOINT_RES: {
    catalogos: "https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/utileria/"
  },
  API: {
    endpoints: [
      {
        name: 'sqs-auditoria',
        endpoint: 'https://sqs.us-east-1.amazonaws.com/335672086802/sia-utileria-encolamiento-mensajes-monitoreo-dev.fifo'
      },
      {
        name: 'AIMS y EXCEDENTES',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/aimsexcedentes'
      },
      {
        name: 'MD',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/md'
      },
      {
        name: 'INT CASH',
        endpoint: 'https://ixsp0lvu2h.execute-api.us-east-1.amazonaws.com/dev/sia/afore/intcash'
      }
    ],
  },
};
