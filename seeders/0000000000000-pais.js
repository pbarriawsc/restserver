'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('pais', [
      { codigo:'CL', nombre:'CHILE'},
      { codigo:'CHI', nombre:'CHINA'},
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('pais', null, {});

  }
};
