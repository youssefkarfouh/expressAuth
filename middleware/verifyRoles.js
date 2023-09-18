const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {

        console.log("verify roles");
        if (!req?.roles) return res.sendStatus(401);
        const alowRoles = [...allowedRoles];
        const result = req.roles.map(role => alowRoles.includes(role)).find(val => val === true);
        console.log("result roles" , result)
        if (!result) return res.status(401).json({"message" : `you're not authorized to make this request , allowedRoles ${allowedRoles} but you are ${req.roles}`});
        next();
    }
}

module.exports = verifyRoles