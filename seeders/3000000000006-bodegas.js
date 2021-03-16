'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('bodegas', [
      {
    		estado:true
    		, nombre:'YIWU'
    		, fk_zonaTarifaria:1
    		, fk_empresa:1
      },
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('bodegas', null, {});

  }
};
