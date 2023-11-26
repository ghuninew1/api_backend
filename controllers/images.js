const {
    convertToAvif,
    convertToWebp,
    resizeFile,
    resizeFileSingle,
} = require("../utils/sharp");
const fs = require("fs");
const { createError } = require("../utils/error");
const path = require("path");

exports.getResizeFile = async (req, res, next) => {
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
        const timestamp = new Date().toISOString().split("T")[0];
        const source = `./public/uploads/${timestamp}`;

        if (data.file) {
            await resizeFileSingle(source + `/${data.file}`, width, height);
            const ext = path.extname(data.file);
            return res.status(200).send({
                msg: "success",
                url:
                    req.protocol +
                    "://" +
                    req.get("host") +
                    "/uploads" +
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

exports.resizeMultiple = async (req, res, next) => {
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
        const timestamp = new Date().toISOString().split("T")[0];
        const source = `./public/uploads/${timestamp}`;

        const result = resizeFile(source, width, height);
        if (result) {
            return res.status(200).send({
                msg: "success",
                url:
                    req.protocol +
                    "://" +
                    req.get("host") +
                    "/uploads" +
                    `/${timestamp}`,
            });
        } else {
            return next(createError(404, "file not found"));
        }
    } catch (err) {
        next(err);
    }
};

exports.getConvertToWebp = async (req, res, next) => {
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

exports.getConvertToAvif = async (req, res, next) => {
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
