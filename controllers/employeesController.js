const Employee = require("../model/Employee");


const getAllEmployees = async (req, res) => {
    const result = await Employee.find();

    console.log("employees" , result)
    res.json(result);
}

const createNewEmployee = async (req, res) => {


    if (!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }

    try {
        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })


        res.status(201).json(newEmployee)
    }

    catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `Employee ID ${req.body.id} not found` });
    }

    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save()
    res.json(result);
}

const deleteEmployee = async (req, res) => {

    if (!req.body.id) {
        return res.status(400).json({ "message": 'Employee id is required' })
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const result = employee.deleteOne({ _id: req.body.id });

    res.json(result);
}

const getEmployee = async (req, res) => {


    if (!req.params.id) {
        return res.status(400).json({ "message": 'Employee id is required' })
    }

    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
}



module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}