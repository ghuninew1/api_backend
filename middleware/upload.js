const multer = require("multer");
const fs = require("fs");

const timestamp = new Date().toISOString().split("T")[0];
const path = `./public/uploads/${timestamp}`;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");

        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

exports.upload = (req, res, next) => {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 10000 },
        }).single("file");

        upload(req, res, (err) => {
            if (err instanceof multer.MulterError)
                return res.status(500).json({ msg: err.message });
            else if (err)
                return res
                    .status(500)
                    .json({ msg: `Error retrieving data: ${err}` });

            next();
        });
    } catch (err) {
        next(err);
    }
};

exports.uploadMultiple = (req, res, next) => {
    try {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 10000 },
        }).array("files", 50);

        upload(req, res, (err) => {
            if (err instanceof multer.MulterError)
                return res.status(500).json({ msg: err.message });
            else if (err)
                return res
                    .status(500)
                    .json({ msg: `Error retrieving data: ${err}` });

            next();
        });
    } catch (err) {
        next(err);
    }
};

exports.progressUpload = (req, res, next) => {
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
            console.log(
                `Upload Success ${(progres / 1024 / 1024).toFixed(3)} MB , ${
                    req?.upload
                }`
            );
        });
        next();
    } catch (err) {
        return res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};
