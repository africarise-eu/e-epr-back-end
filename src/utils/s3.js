const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

exports.uploadFile = (file, path) => {
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path, // File name you want to save as in S3
        Body: file.data,
        ContentType: file.mimetype,
    };

    return s3.upload(uploadParams).promise();
};

exports.signedUrl = (path) => {
    try {
        return s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: path,
            Expires: 60 * 5,
        });
    } catch (error) {
        return false;
    }
};
