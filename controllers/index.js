const Student = require('../models/student');
const Interview = require('../models/interview');

module.exports.showHome = function(req, res){
    res.render('home', {
        title: 'Placement Cell',
    });
}

module.exports.showDashboard = async function(req, res){
    const students = await Student.aggregate([
        {
            $lookup: {
                from: "interviews",
                let: { studentRef: '$_id'},
                pipeline: [
                    { $match:
                        { $expr: {
                            $eq: ["$student", "$$studentRef" ]
                            },
                        },
                    },
                    {
                        $project: {
                            company: '$company',
                            profile: '$profile',
                            date: '$date',
                            status: '$status',
                        },
                    },
                ],
                as: "interviews",
            },
        },
        {
            $project: {
                name: '$name',
                interviews: '$interviews',
            },
        },
    ]);
    const companies = await Interview.aggregate([
        {
            $group: {
                "_id": {
                    company: "$company",
                    date: "$date",
                },
            },
        },
    ]);
    res.render('dashboard', {
        title: 'Dashboard',
        students,
        companies,
        requestedCompany: null,
        requestedDate: null,
    });
};

module.exports.companyWiseInterviews = async function(req, res){
    const company = req.params.companyName;
    const interviewDate = req.params.interviewDate;
    const students = await Student.aggregate([
        {
            $lookup: {
                from: "interviews",
                let: { studentRef: '$_id'},
                pipeline: [
                    { $match:
                        { $expr: {
                            $eq: ["$student", "$$studentRef" ]
                            },
                        },
                    },
                    {
                        $project: {
                            company: '$company',
                            profile: '$profile',
                            date: '$date',
                            status: '$status',
                        },
                    },
                ],
                as: "interviews",
            },
        },
        {
            $project: {
                name: '$name',
                interviews: '$interviews',
            },
        },
    ]);
    const companies = await Interview.aggregate([
        {
            $group: {
                "_id": {
                    company: "$company",
                    date: "$date",
                },
            },
        },
    ]);
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user,
        students,
        companies,
        requestedCompany: company,
        requestedDate: interviewDate,
    });
};