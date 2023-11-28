import { mailSend } from "./mailSend.js";
import { lineNotify } from "./lineNotify.js";
import { createError } from "./createError.js";
import { verify, sign, decode, useDecode, useSign } from "./auth.js";
import {
    convertToAvif,
    convertToAvifs,
    convertToWebp,
    convertToWebps,
    resizeFile,
    resizeFiles,
} from "./sharp.js";

export default {
    mailSend,
    lineNotify,
    createError,
    verify,
    sign,
    decode,
    convertToAvif,
    convertToAvifs,
    convertToWebp,
    convertToWebps,
    resizeFile,
    resizeFiles,
    useDecode,
    useSign,
};

export {
    mailSend,
    lineNotify,
    createError,
    verify,
    sign,
    decode,
    convertToAvif,
    convertToAvifs,
    convertToWebp,
    convertToWebps,
    resizeFile,
    resizeFiles,
    useDecode,
    useSign,
};
