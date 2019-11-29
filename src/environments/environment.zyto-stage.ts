/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  baseURL: "https://stage-vendorportal-productx.zyto.com/",
  zytoAccountURL: "https://test-account.zyto.com/",
  auth0_Domain: "zytotest.auth0.com",
  ApiBaseUrl: "https://zytoproductxwebapi-staging.azurewebsites.net/api/",
  auth: {
    clientID: "AYDiF85cR6CfZN6wZdup4SS7jZp7CHL1",
    domain: "zytotest.auth0.com",
    responseType: "token id_token",
    //audience: 'https://zytostage.auth0.com/userinfo',
    redirectUri: "https://stage-vendorportal-productx.zyto.com/callback",
    scope: "openid roles email user_id"
  },
  AppInsights : {
    InstrumentalKey: "663b9841-4f28-4926-8f72-5793d9907cf9"
  }
};
