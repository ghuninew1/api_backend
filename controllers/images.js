import path from "node:path";
import fs from "node:fs";

import {
    createError,
    resizeFile,
    resizeFiles,
    convertToAvif,
    convertToWebp,
} from "../utils/index.js";

const pathUpload = path.join(__dirname, "../public/uploads");
const hostPublic = (req) => req.protocol + "://" + req.get("host") + "/uploads";
const timestamp = new Date().toISOString().split("T")[0];
const source = pathUpload + `/${timestamp}`;

export const getResizeFile = async (req, res, next) => {
    try {
        let data = req.body;
        const width = data.width ? data.width : 200;
        const height = data.height
            ? data.height
            : data.width
            ? data.width
            : 200;
        if (req?.file) {
            data.file = req.file.filename;
        }

        if (data.file) {
            await resizeFile(source + `/${data.file}`, width, height);
            const ext = path.extname(data.file);

            return res.status(200).send({
                msg: "success",
                url:
                    hostPublic(req) +
                    `/${timestamp}/${data.file.slice(0, -4)}-${width}x${
                        height ? height : width
                    }${ext}`,
            });
        } else {
            return next(createError(404, "file not found"));
        }
    } catch (err) {
        next(err);
    }
};

export const resizeMultiple = async (req, res, next) => {
    try {
        let data = req.body;
        const width = data.width ? data.width : 200;
        const height = data.height
            ? data.height
            : data.width
            ? data.width
            : 200;
        if (req?.files) {
            data.files = req.files;
        }

        const result = await resizeFiles(source, width, height);
        if (result) {
            return res.status(200).send({
                msg: "success",
                url: hostPublic(req) + `/${timestamp}`,
            });
        } else {
            return next(createError(404, "file not found"));
        }
    } catch (err) {
        next(err);
    }
};

export const getConvertToWebp = async (req, res, next) => {
    try {
        const directory = req.query.directory;

        if (directory == null || directory == "") {
            return next(createError(404, "input directory"));
        }

        const result = convertToWebp(directory);
        if (result) {
            return res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
};

export const getConvertToAvif = async (req, res, next) => {
    try {
        const directory = req.query.directory;

        if (directory == null || directory == "") {
            return next(createError(404, "input directory"));
        }

        const result = convertToAvif(directory);
        if (result) {
            return res.status(200).json(result);
        }
    } catch (err) {
        next(err);
    }
};

export const listFiles = (req, res, next) => {
    try {
        let folders = [];
        if (req.params.folder) {
            folders.push(req.params.folder);
        }
        if (req.params.folder2) {
            folders.push(req.params.folder2);
        }
        if (req.params.folder3) {
            folders.push(req.params.folder3);
        }
        if (folders.length > 0) {
            const filesList = fs.readdirSync(
                pathUpload + "/" + folders.join("/")
            );
            const files = filesList.map((file) => {
                const isFolder = fs.lstatSync(
                    pathUpload + "/" + folders.join("/") + "/" + file
                );

                return {
                    isFolder: isFolder.isDirectory(),
                    file,
                    url: hostPublic(req) + "/" + folders.join("/") + "/" + file,
                };
            });

            res.status(200).send(files);
        } else {
            return next(createError(404, "file not found"));
        }
    } catch (err) {
        next(err);
    }
};
