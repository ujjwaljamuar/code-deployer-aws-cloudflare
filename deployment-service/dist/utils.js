"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
async function buildProject(id) {
    return new Promise((resolve) => {
        console.log("Started Building");
        const child = (0, child_process_1.exec)(`cd ${path_1.default.join(__dirname, `output/${id}`)} && npm install && npm run build`);
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
exports.buildProject = buildProject;
