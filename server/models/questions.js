const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const answerSchema = new mongoose.Schema({

});

const questionSchema = new mongoose.Schema({
    question: {
            type: String,
            required: true,
        },
    answers: [
        {
            option: {
                type: String,
                required: true
            },
            isCorrect: {
                type: String,
                required: true,
                default: false
            }
        }
    ]
});

questionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Question', questionSchema, 'questions');

