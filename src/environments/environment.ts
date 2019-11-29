/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseURL:'http://localhost:4200/',
  zytoAccountURL:'https://test-account.zyto.com/',
  auth0_Domain:'zytotest.auth0.com',
  ApiBaseUrl: 'http://zytoproductxwebapi-testing.azurewebsites.net/api/',
  auth:{
    clientID: 'AYDiF85cR6CfZN6wZdup4SS7jZp7CHL1',
    domain: 'zytotest.auth0.com',
    responseType: 'token id_token',
    //audience: 'https://zytotest.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid roles email user_id',
  },
  AppInsights : {
    InstrumentalKey: "0459955c-4e41-4cf1-a516-8ed478279f5c"
  }
};


// export const environment = {
//   production: false,
//   baseURL:'http://localhost:4200/',
//   zytoAccountURL:'https://test-account.zyto.com/',
//   auth0_Domain:'haroonabbasi-tk.auth0.com',
//   ApiBaseUrl: 'http://zytoproductxwebapi-testing.azurewebsites.net/api/',
//   auth:{
//     clientID: '8nS3WuM0eHsJOtVgnB4XEqYhXmnCnQuJ',
//     domain: 'haroonabbasi-tk.auth0.com',
//     responseType: 'token id_token',
//     //audience: 'https://zytotest.auth0.com/userinfo',
//     redirectUri: 'http://localhost:4200/callback',
//     scope: 'openid roles email user_id',
//   }
// };
