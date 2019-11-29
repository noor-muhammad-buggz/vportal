/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  baseURL:'https://productionstage-vendorportal-productx.zyto.com/',
  zytoAccountURL:'https://test-account.zyto.com/',
  auth0_Domain:'zyto.auth0.com',
  ApiBaseUrl: 'https://zytoproductxwebapi-production-stage.azurewebsites.net/api/',
  auth:{
    clientID: 'pPbhwB7BGTL0kcMNT70PScboMc5Kyk7N',
    domain: 'zyto.auth0.com',
    responseType: 'token id_token',
    //audience: 'https://zytotest.auth0.com/userinfo',
    redirectUri: 'https://productionstage-vendorportal-productx.zyto.com/callback',
    scope: 'openid roles email user_id',
  },
  AppInsights : {
    InstrumentalKey: "534b40ad-b395-4294-9912-c302f3d6f988"
  }
};
