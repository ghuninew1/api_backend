function createError(status, message) {
    const err = new Error();
    err.status = status ? status : 500;
    err.message = message ? message : "Internal Server Error";
    return err;
}

export default createError;
