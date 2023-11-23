const googleTranslate = require("google-translate")("YOUR-API-KEY");

let translate = async (text, lang, cb) => {
    await googleTranslate.translate(text, lang, function (err, translation) {
        if (!translation) cb(err, null);
        cb(err, translation.translatedText);
    });
};

exports.translate = (req, res, next) => {
    try {
        if (req.method === "GET") {
            let lang = "en";
            let langs = req.acceptsLanguages();
            if (langs[0] !== "*") {
                if (langs[0].length > 2) {
                    // ex: en-US
                    lang = langs[0].substring(0, 2);
                } else {
                    // ex: en
                    lang = langs[0];
                }
            }

            if (lang !== res.body.lang) {
                return translate(
                    res.body.message,
                    lang,
                    function (err, translation) {
                        res.body.message = translation;
                        res.body.lang = lang;
                        next();
                    }
                );
            }
        }

        next();
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};
