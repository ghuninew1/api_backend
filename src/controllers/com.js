import fs from "node:fs";
import createError from "#utils/createError.js";
import Com from "#models/Com.model.js";

export async function list(req, res, next) {
    try {
        let limit = parseInt(req.query.limit) || 20;
        // sort =_id || name || createdAt || updatedAt
        // order =asc || desc
        const { sort, order } = req.query;

        const data = await Com.find({})
            .sort({ [sort]: order === "asc" ? 1 : -1 })
            .limit(limit ? (limit > 1 ? limit : 0) : 20)
            .exec();

        data && res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

export async function findById(req, res, next) {
    try {
        const { id } = req.params;

        if (id === "" || id == null) {
            return next(createError(404, "please enter id"));
        }

        const data = await Com.findOne({ _id: id }).exec();

        data && res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

export async function createNew(req, res, next) {
    try {
        const data = req.body;

        if (!data) {
            return next(createError(404, "please enter data"));
        }

        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }

        const fileCreate = new Com({
            ...req.body,
        });
        const fileSave = await fileCreate.save();

        fileSave && res.status(201).json(fileSave);
    } catch (err) {
        next(err);
    }
}

export async function editByid(req, res, next) {
    try {
        const { id } = req.params;

        if (id == null) {
            return next(createError(404, "please enter name and id"));
        }

        const data = req.body;

        if (req?.file) {
            data.file = req.file.filename && req.file.filename;
        }

        const fileEdit = await Com.findOneAndUpdate({ _id: id }, data, {
            new: true,
        }).exec();

        if (fileEdit?.file) {
            fs.unlinkSync(`./public/uploads/${fileUpdate.file}`, (err) => {
                if (err) return next(err);

                return res.status(200).json(data);
            });
        }

        fileEdit && res.status(200).json(fileEdit);
    } catch (err) {
        next(err);
    }
}

export async function deleteByid(req, res, next) {
    try {
        const { id } = req.params;

        if (id == null) {
            return next(createError(404, "please enter name and id"));
        }

        const fileRemove = await Com.findOneAndDelete({ _id: id }).exec();

        if (fileRemove?.file) {
            fs.unlinkSync(`./public/uploads/${fileRemove.file}`, (err) => {
                if (err) return next(err);
            });

            res.status(200).json("Delete Success " + id);
        }

        fileRemove && res.status(200).json("Delete Success " + id);
    } catch (err) {
        next(err);
    }
}

export async function deleteAll(req, res, next) {
    try {
        const modelDelete = await Com.deleteMany({}).exec();

        if (!modelDelete && modelDelete.deletedCount === 0) {
            return next(createError(404, "Not Found"));
        }

        res.status(200).json("Delete All Success");
    } catch (err) {
        next(err);
    }
}
