const fs = require("fs");
const path = require("path");
const express = require("express");

export function mkdirRecursive(dirPath) {
    if (!fs.existsSync(dirPath)) {
        const parent = path.dirname(dirPath);
        if (parent && parent !== dirPath) {
            mkdirRecursive(parent);
        }
        fs.mkdirSync(dirPath);
    }
}

export async function serve(root, options, asyncCallback) {
    const app = express();

    app.use(express.static(root, options));

    await new Promise((resolve, reject) => {
        const listener = app.listen(async () => {
            try {
                await asyncCallback(listener);
                resolve();
            } catch (e) {
                reject(e);
            } finally {
                listener.close();
            }
        });
    });
}

function createApp(workerContent, opts = {}) {
    let workersByOrigin = {};
    let kvStores;
    if (opts.kvStore)
        kvStores = buildKVStores(opts.kvStore(), opts.kvStores || []);
    else kvStores = buildKVStores(new InMemoryKVStore(), opts.kvStores || []);
    const app = express();
    app.use(bodyParser.raw({ type: "*/*", limit: "100GB" }));
    app.use(async (req, res) => {
        try {
            const origin = req.headers.host;
            workersByOrigin[origin] =
                workersByOrigin[origin] ||
                new Worker(origin, workerContent, { ...opts, kvStores });
            const worker = workersByOrigin[origin];
            await callWorker(worker, req, res, { country: opts.country });
        } catch (e) {
            console.warn(e);
            res.status(520);
            res.end("Something Went Wrong!");
        }
    });
    app.updateWorker = (contents) => {
        workerContent = contents;
        workersByOrigin = {};
    };
    app.updateOpts = (newOpts) => {
        opts = Object.assign({}, opts, newOpts);
        workersByOrigin = {};
    };
    app.stores = kvStores;

    return app;
}
