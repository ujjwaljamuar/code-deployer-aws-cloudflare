import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";

const s3 = new S3({
    // GET FROM .ENV 
});

// prefix - output/id
export async function downloadS3Folder(prefix: string) {
    console.log();

    const allFiles = await s3
        .listObjectsV2({
            Bucket: "vercel-project-bucket",
            Prefix: prefix,
        })
        .promise();

    const allPromises =
        allFiles.Contents?.map(async ({ Key }) => {
            return new Promise(async (resolve) => {
                if (!Key) {
                    resolve("");

                    return;
                }

                const finalOutputPath = path.join(__dirname, Key);
                const outputFile = fs.createWriteStream(finalOutputPath);

                const dirName = path.dirname(finalOutputPath);

                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
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

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file) => {
        console.log("uploading build folder");

        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });

    console.log("uploading build done.");
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach((file) => {
        const fullFilePath = path.join(folderPath, file).replaceAll("\\", "/");
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });

    return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);

    const response = await s3
        .upload({
            Body: fileContent,
            Bucket: "vercel-project-bucket",
            Key: fileName,
        })
        .promise();
};
