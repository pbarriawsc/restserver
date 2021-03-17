'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('region', [
      { codigo:'II', nombre:'ANTOFAGASTA', fk_pais:1},
      { codigo:'V', nombre:'VALPARAISO', fk_pais:1},
      { codigo:'IX', nombre:'LA ARAUCANÍA', fk_pais:1},
      { codigo:'XIV', nombre:'LOS RÍOS', fk_pais:1},
      { codigo:'X', nombre:'LOS LAGOS', fk_pais:1},
      { codigo:'XII', nombre:'MAGALLANES Y DE LA ANTÁRTICA CHILENA', fk_pais:1},
      { codigo:'XI', nombre:'AYSÉN DEL GENERAL CARLOS IBÁÑEZ DEL CAMPO', fk_pais:1},
      { codigo:'VIII', nombre:'BIOBÍO', fk_pais:1},
      { codigo:'III', nombre:'ATACAMA', fk_pais:1},
      { codigo:'IV', nombre:'COQUIMBO', fk_pais:1},
      { codigo:'VII', nombre:'MAULE', fk_pais:1},
      { codigo:'RM', nombre:'METROPOLITANA DE SANTIAGO', fk_pais:1},
      { codigo:'I', nombre:'TARAPACÁ', fk_pais:1},
      { codigo:'XV', nombre:'ARICA Y PARINACOTA', fk_pais:1},
      { codigo:'VI', nombre:'LIBERTADOR GENERAL BERNARDO OHIGGINS', fk_pais:1},
    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {

     await queryInterface.bulkDelete('region', null, {});

  }
};
