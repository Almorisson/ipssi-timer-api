const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const projectSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
        description: {
            type: Text,
            required: true
        },
        team: {
            type: ObjectId,
            ref: 'Team'
        },
        tasks: {
            type: Array,
            ref: 'Timer'
        }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
