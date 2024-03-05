"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
async function main() {
    while (1) {
        const response = await subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), "build-queue", 0);
        //@ts-ignore
        const id = response.element;
        console.log(`${id} found in Queue`);
        await (0, aws_1.downloadS3Folder)(`output/${id}/`);
        await (0, utils_1.buildProject)(id);
        (0, aws_1.copyFinalDist)(id);
        publisher.hSet("status", id, "deployed");
    }
}
main();
