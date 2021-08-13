const fs = require('fs');

const environmentFile = `export const environment = {
    production: false,
	logGroup: 'sia/frontend/${process.env.sia_comun_ambiente}',
    SESConfig: {
      accessKeyId: '${process.env.sia_comun_front_llave_acceso}',
      secretAccessKey: '${process.env.sia_comun_front_llave_acceso_privada}',
      region: '${process.env.sia_comun_cognito_region}',
    },
    urlExternalLogin: 'https://${process.env.sia_comun_cognito_domino_base}/oauth2/authorize?identity_provider=Azure&redirect_uri=https://${process.env.sia_comun_dominio_redireccion_url}/&response_type=code&client_id=${process.env.sia_comun_cognito_app_cliente_id}&scope=phone%20email%20openid%20profile',
    amplifyConfig: {
      Auth: {
        region: '${process.env.sia_comun_cognito_region}',
        userPoolId: '${process.env.sia_comun_cognito_grupo_usuarios_id}',
        userPoolWebClientId: '${process.env.sia_comun_cognito_app_cliente_id}',
        limit: 50,
        oauth: {
          domain: '${process.env.sia_comun_cognito_domino_base}',
          scope: ['phone', 'email', 'openid', 'profile'],
          redirectSignIn: 'https://${process.env.sia_comun_dominio_redireccion_url}/',
          redirectSignOut: 'https://${process.env.sia_comun_dominio_redireccion_url}/',
          responseType: 'code'
        },
      }
    },
    API: {
      endpoints: [
        {
          name: 'sqs-auditoria',
          endpoint: 'https://${process.env.sia_comun_sqs_auditoria_punto_acceso}.fifo'
        },
        {
          name: 'catalogos',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/utileria/'
        },
        {
          name: 'auditoria',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/utileria/auditoria/interfaces'
        },
        {
          name: 'AIMS Y EXCEDENTES',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/afore/aimsexcedentes'
        },
        {
          name: 'MD',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/afore/md'
        },
        {
          name: 'INT CASH',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/afore/intcash'
        },
        {
          name: 'MO',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/afore/mo'
        },
        {
          name: 'CRD',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/fondos/crd'
        },
        {
          name: 'MANDATOS',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/fondos/mandatos'
        },
        {
          name: 'INT CASH SANTANDER',
          endpoint: 'https://${process.env.sia_comun_api_gateway_dominio_frontend}/${process.env.sia_comun_ambiente}/sia/afore/intcashsantander'
        }
      ],
    },
  };
`;

const awsExportsConfig = `
const awsmobile = {
    "aws_project_region": '${process.env.sia_comun_cognito_region}',
    "aws_cognito_region": '${process.env.sia_comun_cognito_region}',
    "aws_user_pools_id": '${process.env.sia_comun_cognito_grupo_usuarios_id}',
    "aws_user_pools_web_client_id": '${process.env.sia_comun_cognito_app_cliente_id}',
    "oauth": {
        "domain": '${process.env.sia_comun_cognito_domino_base}',
    },
    "aws_appsync_graphqlEndpoint": '${process.env.sia_comun_grapgql_punto_acceso}',
    "aws_appsync_region": '${process.env.sia_comun_cognito_region}',
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"
};

export default awsmobile;
`

// Generate environment.ts file
fs.writeFile('./src/environments/environment.ts', environmentFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});

fs.writeFile('./src/aws-exports.js', awsExportsConfig, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular aws_export.js file generated`);
  }
});
