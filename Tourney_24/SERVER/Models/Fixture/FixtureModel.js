import mongoose from 'mongoose';

/*
 Fixture Schema
 -------------
  • tournament   : reference to Tournament (required)
  • round        : numeric round index (0 = first round) – helps in bracket ordering
  • roundName    : "Round of 16", "Quarter-Final", etc. (redundant but handy for UI)
  • matchIndex   : index of the match inside its round (0-based)
  • teamA/B      : participating team references (required)
  • scheduledAt  : Date & time when the match is scheduled to be played
  • status       : scheduled | ongoing | completed | cancelled
  • scoreA/B     : numeric scores (optional, filled once played)
  • winner       : reference to the winning team (nullable until decided)
  • notes        : any extra notes e.g. walk-over reason, venue, etc.

  The schema is designed to work seamlessly with the existing Tournament and
  Team models and to power the React Fixtures page. Each document represents a
  single match; you can query fixtures by tournament and round, update status
  as the tournament progresses, and fetch participants + winner with .populate().
*/

const FixtureSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tournament',
      required: true,
      index: true,
    },
    round: {
      type: Number,
      required: true,
    },
    roundName: String,
    matchIndex: {
      type: Number,
      required: true,
    },
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
      required: true,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
      required: true,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    scoreA: Number,
    scoreB: Number,
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
    },
    notes: String,
  },
  { timestamps: true }
);

const Fixture = mongoose.model('fixture', FixtureSchema);

export default Fixture;
