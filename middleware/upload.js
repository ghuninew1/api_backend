import multer from "multer";
import fs from "node:fs";

const timestamp = new Date().toISOString().split("T")[0];
const path = `./public/uploads/${timestamp}`;

if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = new Date().toISOString().slice(0, 12);

        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10000 },
});

export const progressUpload = (req, res, next) => {
    try {
        let progres = 0;
        let file_size = req.headers["content-length"]
            ? parseInt(req.headers["content-length"])
            : 0;

        req.on("data", (chunk) => {
            progres += chunk.length;
            const persent = Math.floor((progres / file_size) * 100).toFixed(2);
            req.upload = `${persent}%`;
            console.log(`Upload Progress ${persent}%`);
        });
        req.on("end", () => {
            const log = `Upload Success ${(progres / 1024 / 1024).toFixed(
                3
            )} MB , ${req.upload}`;
            req.upload = log;
            console.log(log);
        });

        next();
    } catch (err) {
        next(err);
    }
};
