"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFinalDist = exports.downloadS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    
});
// prefix - output/id
async function downloadS3Folder(prefix) {
    console.log();
    const allFiles = await s3
        .listObjectsV2({
        Bucket: "vercel-project-bucket",
        Prefix: prefix,
    })
        .promise();
    const allPromises = allFiles.Contents?.map(async ({ Key }) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path_1.default.join(__dirname, Key);
            const outputFile = fs_1.default.createWriteStream(finalOutputPath);
            const dirName = path_1.default.dirname(finalOutputPath);
            if (!fs_1.default.existsSync(dirName)) {
                fs_1.default.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "vercel-project-bucket",
                Key,
            })
                .createReadStream()
                .pipe(outputFile)
                .on("finish", () => {
                resolve("");
            });
        });
    }) || [];
    await Promise.all(allPromises?.filter((x) => x !== undefined));
}
exports.downloadS3Folder = downloadS3Folder;
function copyFinalDist(id) {
    const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file) => {
        console.log("uploading build folder");
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
    console.log("uploading build done.");
}
exports.copyFinalDist = copyFinalDist;
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach((file) => {
        const fullFilePath = path_1.default.join(folderPath, file).replaceAll("\\", "/");
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = async (fileName, localFilePath) => {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = await s3
        .upload({
        Body: fileContent,
        Bucket: "vercel-project-bucket",
        Key: fileName,
    })
        .promise();
};
