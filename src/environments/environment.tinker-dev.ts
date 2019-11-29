/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  baseURL:'http://zytovp.iserver.purelogics.net/',
  zytoAccountURL:'https://test-account.zyto.com/',
  auth0_Domain:'zytotest.auth0.com',
  ApiBaseUrl: 'http://zytoproductxwebapi-testing.azurewebsites.net/api/',
  auth:{
    clientID: 'AYDiF85cR6CfZN6wZdup4SS7jZp7CHL1',
    domain: 'zytotest.auth0.com',
    responseType: 'token id_token',
    //audience: 'https://zytotest.auth0.com/userinfo',
    redirectUri: 'http://zytovp.iserver.purelogics.net/callback',
    scope: 'openid roles email user_id',
  },
  AppInsights : {
    InstrumentalKey: "0459955c-4e41-4cf1-a516-8ed478279f5c"
  }
};
