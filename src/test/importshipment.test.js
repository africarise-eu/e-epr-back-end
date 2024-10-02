const { addImports, updateImports, getImports, getImportById, getImportByYear, deleteImports } = require('../controllers/importshipments');
const importShipmentService = require('../services/importshipments');
const responseHelper = require('../helpers').responseHelper;

jest.mock('../services/importshipments');
jest.mock('../helpers', () => ({
    responseHelper: {
        success: jest.fn(),
    },
}));
jest.mock('i18n', () => ({
    __: jest.fn((key) => key),
}));

describe('Import Shipment Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {},
            user: { id: 'userId' },
        };
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    });

    test('addImports should call importShipmentService.addImports and return success', async () => {
        const mockResponse = { success: true };
        importShipmentService.addImports.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        req.body = { data: 'someData' };
        await addImports(req, res, next);

        expect(importShipmentService.addImports).toHaveBeenCalledWith(req.body, req.user.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.CREATE_SUCCESS');
    });

    test('updateImports should call importShipmentService.updateImports and return success', async () => {
        const mockResponse = { success: true };
        importShipmentService.updateImports.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        req.body = { data: 'someData' };
        await updateImports(req, res, next);

        expect(importShipmentService.updateImports).toHaveBeenCalledWith(req.body, req.user.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.UPDATE_SUCCESS');
    });

    test('getImports should call importShipmentService.getImports and return success', async () => {
        const mockResponse = { data: 'someData' };
        importShipmentService.getImports.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        await getImports(req, res, next);

        expect(importShipmentService.getImports).toHaveBeenCalledWith(req.query, req.user.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.FETCH_SUCCESS');
    });

    test('getImportById should call importShipmentService.getImportById and return success', async () => {
        const mockResponse = { data: 'someData' };
        importShipmentService.getImportById.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        req.params.id = 'importId';
        await getImportById(req, res, next);

        expect(importShipmentService.getImportById).toHaveBeenCalledWith(req.params.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.FETCH_SUCCESS');
    });

    test('getImportByYear should call importShipmentService.getImportByYear and return success', async () => {
        const mockResponse = { data: 'someData' };
        importShipmentService.getImportByYear.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        req.query.year = 2024;
        await getImportByYear(req, res, next);

        expect(importShipmentService.getImportByYear).toHaveBeenCalledWith(req.query.year, req.user.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.FETCH_SUCCESS');
    });

    test('deleteImports should call importShipmentService.deleteImports and return success', async () => {
        const mockResponse = { success: true };
        importShipmentService.deleteImports.mockResolvedValue(mockResponse);
        responseHelper.success.mockImplementation((res, response, message) => {
            res.json({ response, message });
        });

        req.params.id = 'importId';
        await deleteImports(req, res, next);

        expect(importShipmentService.deleteImports).toHaveBeenCalledWith(req.params.id, req.user.id);
        expect(responseHelper.success).toHaveBeenCalledWith(res, mockResponse, 'IMPORTSHIPMENTS.DELETE_SUCCESS');
    });
});
