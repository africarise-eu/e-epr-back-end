const { responseHelper } = require('../helpers');
const i18n = require('i18n');
const s3 = require('../utils/s3');

exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        let uploadFileData = req.files.file;
        if (!req.headers.path) return res.status(400).send('No files were uploaded.');
        const path = `${req.headers.path}/${Date.now()}_${uploadFileData.name}`;
        const response = await s3.uploadFile(uploadFileData, path);
        return responseHelper.created(res, response.Key, i18n.__('FILE.UPLOAD_SUCCESS'));
    } catch (error) {
        next(error);
    }
};

exports.getSignedUrl = async (req, res, next) => {
    try {
        const response = await s3.signedUrl(req.query.path);
        return responseHelper.success(res, response, i18n.__('FILE.URL_GENERATED'));
    } catch (error) {
        next(error);
    }
};

exports.uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || !req.files.files) {
            return res.status(400).send('No files were uploaded.');
        }

        const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

        if (files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const fileUploadPromises = files.map((file) => {
            const path = `compensationDocuments/${Date.now()}_${file.name}`;
            return s3.uploadFile(file, path).then((uploadResult) => ({ url: uploadResult.Key, filename: file.name }));
        });

        const results = await Promise.all(fileUploadPromises);

        return responseHelper.success(res, results, 'Files uploaded successfully');
    } catch (error) {
        next(error);
    }
};
