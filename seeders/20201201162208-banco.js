'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('banco', [{
    nombre: 'Falabella',
    },
    {
      nombre: 'Bci',
    },
    {
      nombre: 'Scotiabank',
    },
    {
      nombre: 'Itaú',
    },
    {
      nombre: 'Banco Estado',
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('banco', null, {});
  }
};
