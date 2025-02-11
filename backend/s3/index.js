const { S3 } = require("aws-sdk");
const { slugify } = require("transliteration");

let s3 = null;

const initialize = async () => {
    try {
        s3 = new S3({
            region: "eu-west-1",
            endpoint: "https://playlist-memories.s3.eu-west-1.amazonaws.com/",
            s3ForcePathStyle: true,
            signatureVersion: "v4",
        });

        return true;
    } catch (e) {
        console.error(e.message, "Unable to connect to S3!");
        return false;
    }
};

const getSignedUrl = async ({
    id,
    name,
    type,
    contentType,
    action = "getObject",
    bucketName = process.env.BUCKET_NAME,
}) => {
    const parameters = { Bucket: bucketName, Key: id, Expires: 60 * 60 * 8 };
    if (action === "getObject") {
        parameters.ResponseContentType = contentType;
        parameters.ResponseContentDisposition = `${type}; filename="${slugify(
            name,
            {
                ignore: ["."],
            }
        )}"`;
    }
    try {
        return await s3.getSignedUrlPromise(action, parameters);
    } catch (e) {
        console.error(e.message, "Failed to generate signed url!");
        return null;
    }
};

const deleteBlob = async ({ BucketName = process.env.BUCKET_NAME, id }) =>
    s3
        .deleteObject({
            Bucket: BucketName,
            Key: id,
        })
        .promise();

module.exports = {
    initialize,
    getSignedUrl,
    deleteBlob,
};
