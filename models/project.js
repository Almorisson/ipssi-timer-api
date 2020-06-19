const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const projectSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		assignedTeams: {
			type: Array,
			default: [
                {
                    type: ObjectId,
                    ref: 'Team'
                }
            ]
		},
		tasks: {
			type: Array,
			default: [ {
                task: {
                    type: ObjectId,
                    ref: 'Timer'
                }
            } ]
		},
		createdBy: {
			type: ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
