'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('zonas_tarifarias', [
      {
        nombre: 'SANTIAGO',
        estado:true,
        fechaCreacion:'2021-01-01 00:00:00-03',
        fechaActualizacion:'2021-01-01 00:00:00-03',
      },
      {
        nombre: 'YIWU',
        estado:true,
        fechaCreacion:'2021-01-01 00:00:00-03',
        fechaActualizacion:'2021-01-01 00:00:00-03',
      },      
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('zonas_tarifarias', null, {});

  }
};
