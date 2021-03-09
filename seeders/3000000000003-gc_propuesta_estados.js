'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('gc_propuestas_estados', [
      {
        id: 0,
        nombre: 'DESARROLLO',
      },
      {
        id: 1,
        nombre: 'APROBADA',
      },
      {
        id: 2,
        nombre: 'BLOQUEADA',
      },
      {
        id: 3,
        nombre: 'RECHAZADA',
      },
      {
        id: 4,
        nombre: 'ELIMINADA',
      },
      {
        id: 5,
        nombre: 'CADUCADA',
      },

      {
        id: 999,
        nombre: 'ELIMINADA',
      },
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('gc_propuestas_estados', null, {});

  }
};
