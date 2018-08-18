export const environment = {
  production: true,
  apiUrl: 'https://gfinancas.herokuapp.com/',

  tokenWhitelistedDomains: [ /gfinancas.herokuapp.com/ ],
  tokenBlacklistedRoutes: [ /\/oauth\/token/  ]
};
