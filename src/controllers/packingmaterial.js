const { responseHelper } = require('../helpers');
const packingmaterialService = require('../services/packingmaterial');

exports.getMaterials = async (req, res, next) => {
    try {
        const materials = await packingmaterialService.getMaterials();
        return responseHelper.success(res, materials);
    } catch (error) {
        next(error);
    }
};
