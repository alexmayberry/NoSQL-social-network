const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        return User.findOneAndUpdate(
          {_id: req.body.userId},
          {$push: {thoughts: thoughtData._id}},
          {new: true}
        )
      .then((userData) => {
        if(!userData) {
          res.status(404).json({message: 'Please enter a valid user ID.'});
          return;
        }
        res.json({message: 'Thought Added!'});
      })
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  addReaction(req, res) {
    // create an instanc of a subdocument
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then((reactionData) => {
      !reactionData
        ? res.status(404).json({ message: "No reaction with this id found"})
        : res.status(200).json(reactionData)
    } )
    .catch((err) => res.status(400).json(err));
  },
  deleteReaction(req, res) {
    // delete an instance of a subdocument 
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
    .then((reactionData) => {
      !reactionData
        ? res.status(404).json({ message: "No reaction with this id found"})
        : res.status(200).json(reactionData)
    } )
    .catch((err) => res.status(500).json(err));
  },
};
