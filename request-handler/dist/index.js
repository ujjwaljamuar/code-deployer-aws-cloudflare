"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const express_1 = __importDefault(require("express"));
const s3 = new aws_sdk_1.S3({
    
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
