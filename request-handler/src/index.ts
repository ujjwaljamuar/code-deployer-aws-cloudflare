import { S3 } from "aws-sdk";
import express from "express";

const s3 = new S3({
    
});

const app = express();

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
