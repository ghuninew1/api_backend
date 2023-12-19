import fs from "node:fs";
import createError from "#utils/createError.js";
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

        return data
            ? res.status(200).json({
                  data,
                  count: data.length,
              })
            : next(createError(404));
    } catch (err) {
        next(err);
    }
};

export const findOne = async (req, res, next) => {
    try {
        const name = req.params.name;
        const limit = parseInt(req.query.limit) || 20;
        // sort =_id || name || createdAt || updatedAt
        // order =asc || desc
        const { sort, order } = req.query;

        if (name === "" || name == null) {
            return next(createError(404, "please enter name"));
        }

        const data = await deadlineDB
            .collection(name)
            .find({})
            .sort({ [sort]: order === "asc" ? 1 : -1 })
            .limit(limit ? (limit > 1 ? limit : 0) : 20)
            .toArray();

        return data ? res.status(200).json(data) : next(createError(404));
    } catch (err) {
        next(err);
    }
};

export const findById = async (req, res, next) => {
    try {
        const { name, id } = req.params;

        if (name === "" || name == null) {
            return next(createError(404, "please enter name"));
        }

        const data = await deadlineDB.collection(name).findOne({ _id: id });

        return data ? res.status(200).json(data) : next(createError(404));
    } catch (err) {
        next(err);
    }
};

export const createByName = async (req, res, next) => {
    try {
        const name = req.params.name;

        if (name === "" || name == null) {
            return next(createError(404, "please enter name"));
        }

        const data = req.body;
        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }

        const fileCreate = await deadlineDB.collection(name).insertOne(data);

        return fileCreate
            ? res.status(201).json(fileCreate)
            : next(createError(404));
    } catch (err) {
        next(err);
    }
};

export const updateByid = async (req, res, next) => {
    try {
        const { name, id } = req.params;

        if (name === "" || name == null || id == null) {
            return next(createError(404, "please enter name and id"));
        }

        const data = req.body;
        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }

        const fileUpdate = await deadlineDB
            .collection(name)
            .findOneAndUpdate({ _id: id }, data);

        if (fileUpdate?.file) {
            fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                if (err) return next(err);

                return res.status(200).json(data);
            });
        }

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const deleteByid = async (req, res, next) => {
    try {
        const { name, id } = req.params;

        if (name === "" || name == null || id == null) {
            return next(createError(404, "please enter name and id"));
        }

        const fileRemove = await deadlineDB
            .collection(name)
            .findOneAndDelete({ _id: id });

        if (fileRemove?.file) {
            fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
                if (err) return next(err);

                return res.status(200).json("Delete Success " + id);
            });
        }

        return res.status(200).json("Delete Success" + id);
    } catch (err) {
        next(err);
    }
};

export const deleteAll = async (req, res, next) => {
    try {
        const name = req.params.name;

        if (name === "" || name == null) {
            return next(createError(404, "please enter name"));
        }

        const fileRemove = await deadlineDB.collection(name).deleteMany();

        return fileRemove
            ? res.status(200).json("Delete Success")
            : next(createError(404));
    } catch (err) {
        next(err);
    }
};
