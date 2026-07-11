# Database Design

The Prisma schema lives in `apps/server/prisma/schema.prisma`.

Core models:

| Model | Purpose |
| --- | --- |
| `User` | Guest or registered identity, profile, rating, and rating uncertainty |
| `LearningProgress` | Completed lessons and learning nodes |
| `TrainingTask` | Daily puzzles and drills |
| `TrainingAttempt` | User attempts and completions |
| `Game` | Match record and current/final state |
| `GameMove` | Move-by-move history for replay and analytics |

Guests are stored as normal users with `accountType = guest`. A future
registration flow can attach a username, password hash, email, or social login
to the same row, preserving the guest's rating and game history.

## Why Save Moves

The MVP stores move history, not only final results. This enables:

- Replays
- Dispute review
- Future AI analysis
- Puzzle generation
- Rating and learning analytics
