import User from "#models/User.model.js";
import bcrypt from "bcryptjs";
import createError from "#utils/createError.js";

const handleRegister = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(createError(400, "Please enter all fields"));
    }

    const user = await User.findOne({ username }).exec();

    if (user) {
        return next(createError(409, "User already exists"));
    }

    try {
        //encrypt the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        //create and store the new user

        const newUser = new User({
            ...req.body,
            roles: 100,
            password: hash,
        });
        await newUser.save();

        newUser.password = undefined;

        res.status(201).json({
            success: `New user ${newUser.username} created!`,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default handleRegister;
