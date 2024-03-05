import { exec } from "child_process";
import path from "path";

export async function buildProject(id: string) {
    return new Promise((resolve) => {
        console.log("Started Building");

        const child = exec(
            `cd ${path.join(
                __dirname,
                `output/${id}`
            )} && npm install && npm run build`
        );

        child.stdout?.on("data", function (data) {
            console.log("stdout - " + data);
        });

        child.stderr?.on("data", function (data) {
            console.log("Error - " + data);
        });

        child.on("close", function (code) {
            resolve("");
        });
    });
}
