# Database Design

The Prisma schema lives in `apps/server/prisma/schema.prisma`.

Core models:

| Model | Purpose |
| --- | --- |
| `User` | Account, profile, avatar, rating |
| `LearningProgress` | Completed lessons and learning nodes |
| `TrainingTask` | Daily puzzles and drills |
| `TrainingAttempt` | User attempts and completions |
| `Game` | Match record and current/final state |
| `GameMove` | Move-by-move history for replay and analytics |

## Why Save Moves

The MVP stores move history, not only final results. This enables:

- Replays
- Dispute review
- Future AI analysis
- Puzzle generation
- Rating and learning analytics

