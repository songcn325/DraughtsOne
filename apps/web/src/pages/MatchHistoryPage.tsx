export function MatchHistoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-black">Match History</h1>
      <div className="mt-6 space-y-4">
        {["Win by resignation", "Loss by timeout", "Draw"].map((result, index) => (
          <article key={result} className="rounded-xl bg-surface-container-low p-5">
            <p className="font-black">{result}</p>
            <p className="text-sm font-semibold text-on-surface-variant">Room MVP-{index + 1} · replay payload available from `game_moves`</p>
          </article>
        ))}
      </div>
    </div>
  );
}

