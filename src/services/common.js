const commonRepository = require('../repository/common');

exports.listCountries = async (params) => {
    const countryList = await commonRepository.listAllCountry(params);
    return countryList;
};

exports.listCities = async (params, id) => {
    const cityList = await commonRepository.listAllCity(params, id);
    return cityList;
};

exports.listPorts = async (params, id) => {
    const portList = await commonRepository.listAllPorts(params, id);
    return portList;
};
