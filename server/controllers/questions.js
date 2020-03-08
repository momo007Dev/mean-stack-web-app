const mongoose = require('mongoose');
const Question = require("../models/questions");

const question_get_all = (req, res) => {
    let response = [];
    Question.find()
        .select("question answers _id")
        .exec()
        .then(docs => {
            //docs.forEach(x => console.log(x.question));
            //console.log(docs[0].question);
            //console.log(docs[0].answers[0].option);
            //docs[0].answers.forEach(x => console.log(x));
            if(docs.length === 0) return res.status(204).json(response);

            docs.forEach(x => response.push(x));
            res.status(302).json(response);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                error: err
            });
        });
};

const question_get_one = (req, res, next) => {
    const id = req.params.questionId;
    Question.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


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
    //console.log((req.body.question).question);
    //req.body.answers.forEach(x => console.log(x.option));
    //console.log(req.body.isCorrect);
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
    questionCreate,
    question_get_all,
    question_get_one
};
