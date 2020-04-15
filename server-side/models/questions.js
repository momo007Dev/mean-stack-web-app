const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
        enum: ["multiple", "boolean", "fill in"]
    },
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

// /^([a-zA-Z0-9\.-_]+)@([a-zA-Z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
