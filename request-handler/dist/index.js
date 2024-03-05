"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const express_1 = __importDefault(require("express"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "ba26fa4a0e8e28c1b5307c54d94ebae0",
    secretAccessKey: "5e39d15245b05eb1148ddc1cfb22dcf57ce90a66db6acd9773dc319eb1c0fc74",
    endpoint: "https://732f56d8ec1d69381f60cd9865ba8d62.r2.cloudflarestorage.com",
});
const app = (0, express_1.default)();
app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;
    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path;
    console.log(filePath);
    const contents = await s3
        .getObject({
        Bucket: "vercel-project-bucket",
        Key: `dist/${id}${filePath}`,
    })
        .promise();
    const type = filePath.endsWith("html")
        ? "text/html"
        : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";
    res.set("Content-Type", type);
    res.send(contents.Body);
});
app.listen(3001);
