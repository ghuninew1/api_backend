import fs from "node:fs";
import createError from "#utils/createError.js";
// import db from "#models/index.js";
import { connectDBs } from "#models/index.js";

const { deadlineDB } = connectDBs();

export const findAll = async (req, res, next) => {
    try {
        const dbAll = await deadlineDB.db.listCollections().toArray();
        const data = dbAll.map((item) => {
            const name = item.name && item.name;
            const type = item.type && item.type;
            const timeseries =
                item.options.timeseries && item.options.timeseries;
            return (item = { name, type, timeseries });
        });

        return res.status(200).json({
            data,
            count: data.length,
        });
    } catch (err) {
        next(err);
    }
};
// export const findAll = async (req, res, next) => {
//     try {
//         const dbAll = await deadlineDB.db.listCollections().toArray();
//         const data = dbAll.map((item) => {
//             const name = item.name && item.name;
//             const type = item.type && item.type;
//             const timeseries =
//                 item.options.timeseries && item.options.timeseries;
//             return (item = { name, type, timeseries });
//         });

//         return res.status(200).json({
//             data,
//             count: data.length,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// export const findOne = async (req, res, next) => {
//     try {
//         const name = req.params.name;
//         let limit = parseInt(req.query.limit) || 20;
//         // sort =_id || name || createdAt || updatedAt
//         // order =asc || desc
//         const { sort, order } = req.query;

//         if (name === "" || name == null) {
//             return next(createError(404, "please enter name"));
//         }

//         const data = await db[name]
//             .find()
//             .sort({ [sort]: order === "asc" ? 1 : -1 })
//             .limit(limit ? (limit > 1 ? limit : 0) : 20)
//             .exec();

//         return res.status(200).json(data);
//     } catch (err) {
//         next(err);
//     }
// };

// export const findById = async (req, res, next) => {
//     try {
//         const { name, id } = req.params;

//         if (name === "" || name == null) {
//             return next(createError(404, "please enter name"));
//         }

//         const data = await db[name].findOne({ _id: id }).exec();

//         return res.status(200).json(data);
//     } catch (err) {
//         next(err);
//     }
// };

// export const createByName = async (req, res, next) => {
//     try {
//         const name = req.params.name;

//         if (name === "" || name == null) {
//             return next(createError(404, "please enter name"));
//         }

//         const data = req.body;
//         if (req?.file) {
//             data.file = req.file.filename && req.file.filename;
//         }

//         const fileCreate = new db[name](data);
//         await fileCreate.save();

//         return res.status(201).json(fileCreate);
//     } catch (err) {
//         next(err);
//     }
// };

// export const updateByid = async (req, res, next) => {
//     try {
//         const { name, id } = req.params;

//         if (name === "" || name == null || id == null) {
//             return next(createError(404, "please enter name and id"));
//         }

//         const data = req.body;
//         if (req?.file) {
//             data.file = req.file.filename && req.file.filename;
//         }

//         const fileUpdate = await db[name].findOneAndUpdate({ _id: id }, data);

//         if (fileUpdate?.file) {
//             fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
//                 if (err) return next(err);

//                 return res.status(200).json(data);
//             });
//         }

//         return res.status(200).json(data);
//     } catch (err) {
//         next(err);
//     }
// };

// export const deleteByid = async (req, res, next) => {
//     try {
//         const { name, id } = req.params;

//         if (name === "" || name == null || id == null) {
//             return next(createError(404, "please enter name and id"));
//         }

//         const fileRemove = await db[name].findOneAndDelete({ _id: id }).exec();

//         if (fileRemove?.file) {
//             fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
//                 if (err) return next(err);
//             });

//             res.status(200).json("Delete Success " + id);
//         }

//         return res.status(200).json("Delete Success" + id);
//     } catch (err) {
//         next(err);
//     }
// };

// export const deleteAll = async (req, res, next) => {
//     try {
//         const name = req.params.name;

//         if (name === "" || name == null) {
//             return next(createError(404, "please enter name"));
//         }

//         const modelDelete = await db[name].deleteMany({}).exec();

//         if (!modelDelete && modelDelete.deletedCount === 0) {
//             return next(createError(404, "Not Found"));
//         } else return res.status(200).json("Delete Success");
//     } catch (err) {
//         next(err);
//     }
// };
