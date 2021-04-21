// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /*urlExternalLogin:
    'https://auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=jll4ul3pmr6rb37i0fmtmctf&redirect_uri=https://dev.d23mbxjbgl0msz.amplifyapp.com/',
  
  urlExternalLogin:
    'https://auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=http://localhost:4200/dashboard&response_type=token&client_id=jll4ul3pmr6rb37i0fmtmctf&identity_provider=Okta&scope=phone%20email%20openid%20profile&state=aYnW5M8HLLjqDNFngU8Zut5Y5piMOrwC&code_challenge=nfmOGFZT1-rvebusaLLXJzVRvLPdChqT8OahbWfcRK&code_challenge_method=S256',
    */
    urlExternalLogin:
    'https://sia-app.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Azure&redirect_uri=http://localhost:4200/dashboard&response_type=token&client_id=24jfvl8v3gb5peslfvaf036m5l&state=usSu0K88JAUtvsDi9ldADWEezLdvFzqQ&code_challenge=GpAjcPWwYZ7Xrge2-dS2BdA7C4UNJcOfNzQVpdp2tN8&code_challenge_method=S256&scope=phone%20email%20openid%20profile',  
  amplifyConfig: {
    Auth: {
      region: "us-east-1",
      userPoolId: "us-east-1_Cx1XNNQxU",
      userPoolWebClientId: "24jfvl8v3gb5peslfvaf036m5l",
      oauth: {
        domain: "sia-app.auth.us-east-1.amazoncognito.com",
        scope: ["phone", "email", "openid", "profile"],
        redirectSignIn: "localhost:4200/dashboard",
        redirectSignOut: "localhost:4200",
        responseType: "token"
      },
      /*region: "us-east-1",
      userPoolId: "us-east-1_mRG6EmrII",
      userPoolWebClientId: "jll4ul3pmr6rb37i0fmtmctf",
      oauth: {
        domain: "auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com",
        scope: ["phone", "email", "openid", "profile"],
        redirectSignIn: "localhost:4200/dashboard",
        redirectSignOut: "localhost:4200",
        responseType: "token"
      },*/
    },
    API: {
      endpoints: [
        {
          name: 'main',
          endpoint:
            'https://tnjo8cjoj1.execute-api.us-east-1.amazonaws.com/prod/', // for local test change to something such as 'http://localhost:3001'
        },
      ],
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
