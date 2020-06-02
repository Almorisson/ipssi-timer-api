
const timerSchema = mongoose.Schema(
	{
		tasks: {
            type: Array,
            loggedTime: {
                type: Date,
                required: true,
                default: Date("00:00:00").now
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: Text
            }
        }

	},
	{ timestamps: true }
);

module.exports = mongoose.model('Timer', timerSchema);

