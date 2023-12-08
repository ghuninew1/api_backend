import fs from "node:fs";
import path from "node:path";

Symbol.dispose ??= Symbol("Symbol.dispose");
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");

export function openFile(path) {
    if (!fs.existsSync(dirPath)) return;

    const file = fs.openSync(path, "w+");

    return {
        file,
        [Symbol.dispose]() {
            fs.closeSync(file);
        },
    };
}

export function readFile(path) {
    if (!fs.existsSync(dirPath)) return;

    return fs.readFileSync(path);
}

export const mkdirRecursive = (dirPath) => {
    if (dirPath === "." || dirPath === "/") return;

    if (!fs.existsSync(dirPath)) {
        const parent = path.dirname(dirPath);
        if (parent && parent !== dirPath) {
            mkdirRecursive(parent);
        }
        fs.mkdirSync(dirPath);
    }
};

export const getFiles = (dirPath) => {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);
    const result = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat == null) continue;
        if (stat < 0) continue;

        if (stat.isDirectory()) {
            result.push(...getFiles(filePath));
        } else {
            result.push(filePath);
        }
    }

    return result;
};

export const getDirectories = (dirPath) => {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);
    const result = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            result.push(filePath, ...getDirectories(filePath));
        }
    }

    return result;
};

export function getFilesFoldersNumber(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const files = getFiles(dirPath);
    const folders = getDirectories(dirPath);
    return {
        files: files.length,
        folders: folders.length,
    };
}

export function getFilesFoldersSize(dirPath) {
    const files = getFiles(dirPath);
    const folders = getDirectories(dirPath);
    let size = 0;

    for (const file of files) {
        size += fs.statSync(file).size;
    }

    for (const folder of folders) {
        size += fs.statSync(folder).size;
    }

    return {
        size: size,
        files: files.length,
        folders: folders.length,
        Kb: size / 1000,
        Mb: size / 1000000,
        Gb: size / 1000000000,
    };
}

export function fileInfo(path) {
    const paths = process.cwd().split("/");
    paths.pop();
    paths.push(path.split("/").pop());
    const newPath = paths.join("/");
    const stat = fs.statSync(path);
    stat.path = newPath;
    stat.name = path.split("/").pop();

    return stat;
}

export function fileExists(path) {
    return fs.existsSync(path);
}

export function deleteFile(path) {
    if (!fileExists(path)) return;
    fs.unlinkSync(path);
}

export function deleteFolder(path) {
    if (!fileExists(path)) return;

    fs.rmdirSync(path);
}

export function mvFile(oldPath, newPath) {
    if (!fileExists(oldPath)) return;
    fs.renameSync(oldPath, newPath);
}

export function cpFile(oldPath, newPath) {
    if (!fileExists(oldPath)) return;
    fs.copyFileSync(oldPath, newPath);
}

export function cpFolder(oldPath, newPath) {
    if (!fileExists(oldPath)) return;
    fs.copySync(oldPath, newPath);
}

export const uploadPath = path.join(process.cwd(), "public/uploads");

export function uploadFile(file, name) {
    if (!file) return;

    const { path: filePath, name: fileName } = file;
    const newPath = path.join(uploadPath, name || fileName);

    cpFile(filePath, newPath);
    deleteFile(filePath);

    return newPath;
}

export function uploadFiles(files, names) {
    if (!files) return;

    const newPaths = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = names[i];
        const newPath = uploadFile(file, name);
        newPaths.push(newPath);
    }

    return newPaths;
}

export function getUploadFiles() {
    const files = getFiles(uploadPath);
    const folders = getDirectories(uploadPath);
    return [...files, ...folders];
}
