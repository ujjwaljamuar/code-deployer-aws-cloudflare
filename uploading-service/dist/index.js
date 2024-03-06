"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utilities_js_1 = require("./utilities.js");
const path_1 = __importDefault(require("path"));
const aws_js_1 = require("./aws.js");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.post("/deploy", async (req, res) => {
    const repoURL = req.body.repoUrl;
    console.log(repoURL);
    const id = (0, utilities_js_1.generateID)();
    //using simple git we are cloning a repo and storing it in the output folder with their id
    await (0, simple_git_1.default)().clone(repoURL, path_1.default.join(__dirname, `output/${id}`));
    console.log("CLONING DONE!");
    // store all file path in an array
    const files = (0, utilities_js_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    console.log("All files' path stored.");
    files.forEach(async (file) => {
        await (0, aws_js_1.uploadFile)(file.slice(__dirname.length + 1), file);
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
    const response = await subscriber.hGet("status", id);
    res.json({
        status: response,
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
