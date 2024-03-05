import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "ba26fa4a0e8e28c1b5307c54d94ebae0",
    secretAccessKey:
        "5e39d15245b05eb1148ddc1cfb22dcf57ce90a66db6acd9773dc319eb1c0fc74",
    endpoint:
        "https://732f56d8ec1d69381f60cd9865ba8d62.r2.cloudflarestorage.com",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3
        .upload({
            Body: fileContent,
            Bucket: "vercel-project-bucket",
            Key: fileName,
        })
        .promise();

    console.log(response);
};
