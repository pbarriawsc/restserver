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
    await queryInterface.bulkInsert('usuario', [{
       nombre: 'Pablo Barria',
       password: '123456',
       //createdAt:'2020-11-24 00:00:00',
      // updatedAt:'2020-11-24 00:00:00'
    },
    {
      nombre: 'Eduardo Vidal',
      password: '123456',
      //createdAt:'2020-11-24 00:00:00',
      //updatedAt:'2020-11-24 00:00:00'
   }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('usuario', null, {});
  }
};
