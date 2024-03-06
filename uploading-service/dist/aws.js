"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "ba26fa4a0e8e28c1b5307c54d94ebae0",
    secretAccessKey: "5e39d15245b05eb1148ddc1cfb22dcf57ce90a66db6acd9773dc319eb1c0fc74",
    endpoint: "https://732f56d8ec1d69381f60cd9865ba8d62.r2.cloudflarestorage.com",
});
const uploadFile = async (fileName, localFilePath) => {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = await s3
        .upload({
        Body: fileContent,
        Bucket: "vercel-project-bucket",
        Key: fileName,
    })
        .promise();
    console.log(response);
};
exports.uploadFile = uploadFile;
