const Interview = require('../models/interview');
const Student = require('../models/student');

module.exports.add = function(req, res){
    return res.render('interview', {
        title: 'Add Interview',
    });
};

module.exports.create = async function(req, res){
    const { company, studentName, profile, date, status } = req.body;

    const student = await Student.findOne({
        name: studentName,
    });

    if(!student){
        req.flash('error_msg', 'No student found with this name');
        return res.redirect('back');
    }

    const interviewExists = await Interview.findOne({ company, student: student._id });

    if(interviewExists && status === interviewExists.status && date === interviewExists.date){
        req.flash('error_msg', 'Interview already created with this status');
        return res.redirect('back');
    }

    if(interviewExists && (status !== 'ON HOLD' || date !== interviewExists.date || profile !== interviewExists.profile)){
        const interview = await Interview.findOneAndUpdate({
            student: student._id,
            company,
        }, {
            profile,
            date,
            status,
        }, { new: true });
        if(!interview){
            req.flash('error_msg', 'Provided wrong information about interview');
            return res.redirect('back');
        }
        req.flash('success_msg', 'Interview status updated successfully');
    }else{
        const interview = new Interview({
            student: student._id,
            status,
            company,
            profile,
            date,
        });
        await interview.save();
        req.flash('success_msg', 'Interview created successfully');
    }
    return res.redirect('/dashboard');
}