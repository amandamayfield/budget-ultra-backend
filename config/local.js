module.exports = {
  datastores: {
    default: {
      url: 'mysql://root@127.0.0.1:3306/budget-ultra',
    },
  },

  passport: {
    strategies: {
      google: {
        options: {
          clientID: '544079870418-45ui2bihtscet4hvabi6al5833rngdd3.apps.googleusercontent.com',
          clientSecret: 'CK2O3Op4uqRoMC0X7sUOdLLK',
        },
      },
    },
  },

  security: {
    captcha: {
      siteKey: '6Ld7g2EUAAAAAC6ywirDwrmDRmzUnecCyyA0Kr2l',
      secretKey: '6Ld7g2EUAAAAACxvMVTGlVBZ1b70x38_xUMPoAs',
    },
  },

  models: { migrate: 'drop' },
};
