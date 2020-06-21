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
			default: []
		},
		tasks: {
			type: Array,
			default: []
		},
		createdBy: {
			type: ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
