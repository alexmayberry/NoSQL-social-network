const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // Use a getter method to format the timestamp on query
    },
    // username: something,
    // the user who created the thought
    // so you need to create a new reaction schema inside the Thought schema in order to nest it as a subdocument? Can't you import it?
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
