import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

export const convertToWebps = (directory) => {
    fs.readdirSync(directory).forEach(async (file) => {
        const imgName = file.split(".")[0];
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|avif)/gi)) {
            try {
                const res = await sharp(`${directory}/${file}`)
                    .rotate()
                    .webp()
                    .toFile(directory + `/${imgName}.webp`);

                return res;
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};

export const convertToWebp = async (file) => {
    const ext = path.extname(file);
    if (String(ext).match(/(png|jpg|jpeg|avif)/gi)) {
        try {
            const res = await sharp(`${file}`)
                .rotate()
                .webp()
                .toFile(`${file.slice(0, -4)}.webp`);

            return res;
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log(`Skipping ${file}`);
    }
};

export const convertToAvifs = (directory) => {
    fs.readdirSync(directory).forEach(async (file) => {
        const imgName = file.split(".")[0];
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|webp)/gi)) {
            try {
                const res = await sharp(`${directory}/${file}`)
                    .avif()
                    .toFile(directory + `/${imgName}.avif`);

                return res;
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};

export const convertToAvif = async (file) => {
    const ext = path.extname(file);
    if (String(ext).match(/(png|jpg|jpeg|webp)/gi)) {
        try {
            const res = await sharp(`${file}`)
                .avif()
                .toFile(`${file.slice(0, -4)}.avif`);

            return res;
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log(`Skipping ${file}`);
    }
};

export const resizeFiles = async (directory, width, height) => {
    fs.readdirSync(directory).forEach(async (file) => {
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|avif|webp)/gi)) {
            try {
                const res = await sharp(`${directory}/${file}`)
                    .resize(
                        width ? width : 200,
                        height ? height : width ? width : 200
                    )
                    .toFile(
                        directory +
                            `/${file.slice(0, -4)}-${width}x${
                                height ? height : width
                            }${ext}`
                    );

                return res;
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};

export const resizeFile = async (file, width, height) => {
    const ext = path.extname(file);
    if (String(ext).match(/(png|jpg|jpeg|avif|webp)/gi)) {
        try {
            const res = await sharp(`${file}`)
                .resize(
                    width ? width : 200,
                    height ? height : width ? width : 200
                )
                .toFile(
                    `${file.slice(0, -4)}-${width}x${
                        height ? height : width
                    }${ext}`
                );

            return res;
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log(`Skipping ${file}`);
    }
};

export default {
    convertToWebps,
    convertToWebp,
    convertToAvifs,
    convertToAvif,
    resizeFiles,
    resizeFile,
};
