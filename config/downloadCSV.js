const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const Student = require('../models/student');

module.exports.downloadingStart = async (req, res) => {
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
            $unwind: {
                path: '$interviews',
            },
        },
    ]);

    const result = [];

    // If students data not available
    if(students.length === 0){
        console.log('No data available');
        req.flash('error_msg', 'No student data available to download');
        return res.redirect('/dashboard');
    }

    students.forEach((student) => {
        let { _id, name, email, college, batch, dsa, web, react, status, interviews } = student;
        let obj = {
            Id: _id.toString(),
            Name: name,
            Email: email, 
            College: college,
            Batch: batch,
            Placed: status,
            DSAScore: dsa,
            WebDevScore: web,
            ReactScore: react,
            CompanyName: interviews.company,
            profile: interviews.profile,
            Result: interviews.status,
            InterviewDate: interviews.date,
        }
        result.push(obj);
    });
    const csv =  new ObjectsToCsv(result);

    // Save to file in codebase
    await csv.toDisk('./downloads/students.csv');
    
    // Download file
    return res.download("./downloads/students.csv", () => {
        // Delete the created file
        fs.unlinkSync("./downloads/students.csv");
    });
}