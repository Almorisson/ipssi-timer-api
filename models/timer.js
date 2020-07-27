const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const timerSchema = mongoose.Schema(
	{
            loggedTime: {
                type: Number,
                required: true,
                default: 0
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            project: {
                type: ObjectId,
                ref: 'Project'
            }

	},
	{ timestamps: true }
);

module.exports = mongoose.model('Timer', timerSchema);

