const packingmaterialRepository = require('../repository/packingmaterial');
exports.getMaterials = async () => {
    const materials = await packingmaterialRepository.getMaterials();
    return materials;
};
