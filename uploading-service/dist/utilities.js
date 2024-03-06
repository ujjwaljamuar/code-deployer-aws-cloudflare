"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = exports.generateID = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MAX_LENGTH = 5;
function generateID() {
    let id = "";
    const subset = "1234567890qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < MAX_LENGTH; i++) {
        id += subset[Math.floor(Math.random() * subset.length)];
    }
    return id;
}
exports.generateID = generateID;
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach((item) => {
        const fullFilePath = path_1.default.join(folderPath, item).replaceAll("\\", "/");
        // console.log(fullFilePath);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat((0, exports.getAllFiles)(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
exports.getAllFiles = getAllFiles;
