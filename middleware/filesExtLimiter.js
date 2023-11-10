const path = require('path');

const filesExtLimiter = (allowedExt) => {

    return (req, res , next) => {

        const files = req.files;
        const fileExtensions = [];

        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        const allow = fileExtensions.every(ext => allowedExt.includes(ext))


        if(!allow){
            const message = `only allowed files are ${allowedExt}`;
            return res.status(400).json({status:"error",message})
        }
        next();
    }
}

module.exports = filesExtLimiter;