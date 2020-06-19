const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const timerSchema = mongoose.Schema(
	{
            loggedTime: {
                type: Date,
                required: true,
                default: Date.now
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

