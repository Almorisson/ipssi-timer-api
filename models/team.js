const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const teamSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		createdBy: {
			type: ObjectId,
			ref: 'User'
		},
		users: {
			type: Array,
			default: []
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', teamSchema);
