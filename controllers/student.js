const Student = require('../models/student');

module.exports.add = function(req, res){
    res.render('student', {
        title: 'Add Student',
        user: req.user
    });
};

module.exports.create = async function(req, res){
    const { name, email, college, batch, status, dsa, web, react } = req.body;

    const studentExists = await Student.findOne({ name });

    if (studentExists) {
        req.flash('error_msg', 'Student with this name already exists');
        return res.redirect('back');
    }

    const newStudent = Student({
        name,
        email,
        college,
        batch,
        status: status === 'Yes' ? true : false,
        dsa,
        web,
        react
    });
    await newStudent.save();

    req.flash('success_msg', 'New student added successfully');

    res.redirect('/dashboard');
};