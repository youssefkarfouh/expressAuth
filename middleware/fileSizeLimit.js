
const MB = 2;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const filesSizeLimit = (req, res, next) => {

    const files = req.files;
    let notAllowedFiles = [];

    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            notAllowedFiles.push(files[key].name)
        }
    })


    if (notAllowedFiles.length > 0) {
        const message = `${notAllowedFiles.toString()} are not allowed because they are exceed the ${MB} MB`
        return res.status(400).json({ status: "error", message })
    }

    next()
}

module.exports = filesSizeLimit;