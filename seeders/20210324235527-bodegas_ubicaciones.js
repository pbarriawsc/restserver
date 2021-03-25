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
    await queryInterface.bulkInsert('bodegas_ubicaciones', [
      {
        estado:true
        , nombre:'A0001'
        , fk_bodega:1
      },
      {
        estado:true
        , nombre:'A0002'
        , fk_bodega:1
      },
      {
        estado:true
        , nombre:'A0003'
        , fk_bodega:1
      },
      {
        estado:true
        , nombre:'B0001'
        , fk_bodega:2
      },
      {
        estado:true
        , nombre:'B0002'
        , fk_bodega:2
      },
      {
        estado:true
        , nombre:'B0003'
        , fk_bodega:2
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('bodegas_ubicaciones', null, {});
  }
};
