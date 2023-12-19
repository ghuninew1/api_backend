import Visit from "#models/Visit.model.js";

export const visit = async (req, res, next) => {
    try {
        const url = req.originalUrl || req.url;
        const ips = req?.ip || req.connection.remoteAddress;
        const ip = ips?.split(":").pop();
        const visit = await Visit.findOne({ url: url });

        if (visit && ip === visit?.ip) {
            await Visit.updateOne(
                { url: url },
                { $inc: { counter: 1 }, $set: { ip: ip }, new: true }
            );

            next();
        } else {
            const visitip = await Visit?.findOne({ ip: ip });

            if (ip === visitip?.ip && visit) {
                await Visit.updateOne(
                    { ip: ip },
                    { $inc: { counter: 1 }, $set: { url: url }, new: true }
                );

                next();
            } else {
                const visitTs = new Visit({
                    url: url,
                    counter: 1,
                    ip: ip,
                });
                await visitTs.save();

                next();
            }
        }
    } catch (err) {
        next(err);
    }
};

export const view = (req, res, next) => {
    try {
        const pathname = req.originalUrl || req.url;

        if (!req.session.views) {
            req.session.views = {
                [pathname]: 0,
            };
        }

        req.session.views[pathname] = req.session.views[pathname]
            ? req.session.views[pathname] + 1
            : 1;

        next();
    } catch (err) {
        next(err);
    }
};
