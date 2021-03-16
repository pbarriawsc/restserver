'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('formas_pago', [
      {
        id:1
        , codigo:'CTD'
        , nombre:'CONTADO'
        , valor:0
      },
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('formas_pago', null, {});

  }
};
