'use strict';

/** @type {import(sequelize'-'cli).Migration} */
module.exports = {
    async up(queryInterface) {
        const materials = [
            {
                material: 'Plastic',
                subMaterial: '-',
                taeFeeMtTon: 19050,
                impactFactor: 3,
                taeFeeMtKg: 57.15,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Glass',
                subMaterial: '-',
                taeFeeMtTon: 1706,
                impactFactor: 1,
                taeFeeMtKg: 0.17,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Paper',
                subMaterial: '-',
                taeFeeMtTon: 3113,
                impactFactor: 1,
                taeFeeMtKg: 0.31,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Card',
                subMaterial: '-',
                taeFeeMtTon: 3113,
                impactFactor: 1,
                taeFeeMtKg: 0.31,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Metal',
                subMaterial: '-',
                taeFeeMtTon: 5925,
                impactFactor: 2,
                taeFeeMtKg: 11.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Multilayer',
                subMaterial: '-',
                taeFeeMtTon: 19050,
                impactFactor: 3,
                taeFeeMtKg: 57.15,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Biodegradable',
                subMaterial: '-',
                taeFeeMtTon: 1706,
                impactFactor: 1,
                taeFeeMtKg: 11.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Hazardous',
                subMaterial: '-',
                taeFeeMtTon: 24765,
                impactFactor: 3,
                taeFeeMtKg: 74.30,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                material: 'Others',
                subMaterial: '-',
                taeFeeMtTon: 9769,
                impactFactor: 2,
                taeFeeMtKg: 33.74,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        await queryInterface.bulkInsert('TaeFees', materials, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('TaeFees', null, {});
    },
};
