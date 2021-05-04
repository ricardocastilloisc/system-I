export const environment = {
  production: false,

  UserPoolId: "us-east-1_Ftm7m3Om2",
  Limit: 50,

  SESConfig: {
    accessKeyId: "AKIAU4J45SEJGVOZU7M6",
    secretAccessKey: "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",
    region: "us-east-1",
  },

  urlExternalLogin:
    'https://sia-app-up.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=http://localhost:4200/dashboard&response_type=token&client_id=v0pu39f7uvsr127og546qjope&state=usSu0K88JAUtvsDi9ldADWEezLdvFzqQ&code_challenge=GpAjcPWwYZ7Xrge2-dS2BdA7C4UNJcOfNzQVpdp2tN8&code_challenge_method=S256&scope=phone%20email%20openid%20profile',
  amplifyConfig: {
    Auth: {
      region: "us-east-1",
      userPoolId: "us-east-1_Ftm7m3Om2",
      userPoolWebClientId: "v0pu39f7uvsr127og546qjope",
      oauth: {
        domain: "sia-app-up.auth.us-east-1.amazoncognito.com",
        scope: ["phone", "email", "openid", "profile"],
        redirectSignIn: "localhost:4200/dashboard",
        redirectSignOut: "localhost:4200",
        responseType: "token"
      },
    },
    API: {
      endpoints: [
        {
          name: 'main',
          endpoint:
            'https://tnjo8cjoj1.execute-api.us-east-1.amazonaws.com/prod/', // for local test change to something such as 'http://localhost:3001'
        },
        {
          name: 'sqs-dev',
          endpoint: 'https://sqs.us-east-1.amazonaws.com/335672086802/sia-encolamiento-mensajes-monitoreo-dev'
        }
      ],
    },
  },
};
