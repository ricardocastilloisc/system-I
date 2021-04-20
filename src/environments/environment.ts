// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlExternalLogin:
    'https://auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=jll4ul3pmr6rb37i0fmtmctf&redirect_uri=https://dev.d23mbxjbgl0msz.amplifyapp.com/',
  amplifyConfig: {
    Auth: {
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_mRG6EmrII',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: 'jll4ul3pmr6rb37i0fmtmctf',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      // mandatorySignIn: false,

      oauth: {
        domain: 'auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com',

        scope: ['phone', 'email', 'openid', 'profile'],

        redirectSignIn: 'localhost:4200/dashboard',

        redirectSignOut: 'localhost:4200',

        responseType: 'token', // or token
      },

      /*// OPTIONAL - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
        path: '/',
        // OPTIONAL - Cookie expiration in days
        expires: 365,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: true
      },

      // OPTIONAL - customized storage object
      storage: new MyStorage(),

      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH'*/
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
