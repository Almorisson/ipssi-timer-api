const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const teamSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
        description: {
            type: String
        },
		users: {
			type: Array,
			default: []
		},
		admin: {
			type: ObjectId,
			ref: 'User'
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
