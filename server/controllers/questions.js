const mongoose = require('mongoose');
const Question = require("../models/questions");

const questionCreate = (req, res) => {
    const question = new Question({
        question: req.body.question,
        answers: [
            {
                option: req.body.answers[0].option,
                isCorrect: req.body.answers[0].isCorrect
            },
            {
                option: req.body.answers[1].option,
                isCorrect: req.body.answers[1].isCorrect
            },
            {
                option: req.body.answers[2].option,
                isCorrect: req.body.answers[2].isCorrect
            },
            {
                option: req.body.answers[3].option,
                isCorrect: req.body.answers[3].isCorrect
            },

        ]
    });
    console.log((req.body.question).question);
    //req.body.answers.forEach(x => console.log(x.option));
    console.log(req.body.isCorrect);
    question
        .save()
        .then(result => {
            //console.log(result.answers.filter(x=> x.isCorrect === "true")[0].option);
            res
                .status(201)
                .json({
                message: "Created question successfully",
                createdQuestion: {
                    name: result.question,
                    answer : result.answers.filter(x=> x.isCorrect === "true")[0].option,
                    request: {
                        type: "GET",
                        url: "http://localhost:5000/api/questions/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({
                    error: err
                });
        });
};

module.exports = {
    questionCreate
};
