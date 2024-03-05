import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateID, getAllFiles } from "./utilities.js";
import path, { resolve } from "path";
import { uploadFile } from "./aws.js";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/deploy", async (req, res) => {
    const repoURL: string = req.body.repoUrl;
    console.log(repoURL);

    const id = generateID();

    //using simple git we are cloning a repo and storing it in the output folder with their id
    await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`));
    console.log("CLONING DONE!");

    // store all file path in an array
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    console.log("All files' path stored.");

    files.forEach(async (file) => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Uploaded to Bucket");
    

    // push id inside redis queue
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    console.log(`${id} Added to Queue`);

    res.json({
        id,
    });
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);

    res.json({
        status: response,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
