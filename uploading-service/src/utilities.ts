import fs from "fs";
import path from "path";

const MAX_LENGTH = 5;

export function generateID() {
    let id: string = "";
    const subset = "1234567890qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < MAX_LENGTH; i++) {
        id += subset[Math.floor(Math.random() * subset.length)];
    }

    return id;
}

export const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach((item) => {
        const fullFilePath = path.join(folderPath, item).replaceAll("\\", "/");
        // console.log(fullFilePath);

        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });

    return response;
};
