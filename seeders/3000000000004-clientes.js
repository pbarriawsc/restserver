'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('clientes', [
      {
        id:1
        , rut:'1-1'
        , codigo:'CLI-PEND'
        , nombre:'CLIENTE PENDIENTE'
        , "razonSocial": 'CLIENTE PENDIENTE'
        , web:''
        , telefono1:''
        , telefono2:''
        , "dteEmail":''
        , "aproComercial":0
        , "aproFinanciera":0
      },
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('clientes', null, {});

  }
};
