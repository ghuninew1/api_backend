var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    i = new Array(
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        62,
        -1,
        -1,
        -1,
        63,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        -1,
        -1,
        -1,
        -1,
        -1
    );
function x(c) {
    var e, a, f, r;
    for (e = "", f = c.length, a = 0; a < f; a++)
        (r = c.charCodeAt(a)),
            r >= 1 && r <= 127
                ? (e += c.charAt(a))
                : r > 2047
                ? ((e += String.fromCharCode(224 | ((r >> 12) & 15))),
                  (e += String.fromCharCode(128 | ((r >> 6) & 63))),
                  (e += String.fromCharCode(128 | ((r >> 0) & 63))))
                : ((e += String.fromCharCode(192 | ((r >> 6) & 31))),
                  (e += String.fromCharCode(128 | ((r >> 0) & 63))));
    return e;
}
function n(c) {
    var e, a, f, r, h, t;
    for (e = "", f = c.length, a = 0; a < f; )
        switch (((r = c.charCodeAt(a++)), r >> 4)) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                e += c.charAt(a - 1);
                break;
            case 12:
            case 13:
                (h = c.charCodeAt(a++)),
                    (e += String.fromCharCode(((r & 31) << 6) | (h & 63)));
                break;
            case 14:
                (h = c.charCodeAt(a++)),
                    (t = c.charCodeAt(a++)),
                    (e += String.fromCharCode(
                        ((r & 15) << 12) | ((h & 63) << 6) | ((t & 63) << 0)
                    ));
        }
    return e;
}
function C(c) {
    var e, a, f, r, h, t;
    for (f = c.length, a = 0, e = ""; a < f; ) {
        if (((r = c.charCodeAt(a++) & 255), a == f)) {
            (e += o.charAt(r >> 2)), (e += o.charAt((r & 3) << 4)), (e += "==");
            break;
        }
        if (((h = c.charCodeAt(a++)), a == f)) {
            (e += o.charAt(r >> 2)),
                (e += o.charAt(((r & 3) << 4) | ((h & 240) >> 4))),
                (e += o.charAt((h & 15) << 2)),
                (e += "=");
            break;
        }
        (t = c.charCodeAt(a++)),
            (e += o.charAt(r >> 2)),
            (e += o.charAt(((r & 3) << 4) | ((h & 240) >> 4))),
            (e += o.charAt(((h & 15) << 2) | ((t & 192) >> 6))),
            (e += o.charAt(t & 63));
    }
    return e;
}
// module.exports = { ezEncode: C, utf16to8: x, utf8to16: n };
export default { ezEncode: C, utf16to8: x, utf8to16: n };
export { ezEncode as ezEncode, utf16to8 as utf16to8, utf8to16 as utf8to16 };
