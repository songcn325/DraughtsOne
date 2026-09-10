# DraughtsOne asset library

Assets are grouped by the app module that owns them. Shared images belong in `common`; a module must not import an asset from another module's folder.

```text
assets/
  common/  shared brand and reward artwork
  login/   authentication and onboarding
  learn/   lesson catalogue and lesson viewer
  train/   training exercises
  class/   classroom
  play/    live and local play
  ai/      AI analysis
  me/      profile and account
```

Use lowercase kebab-case names. Name reusable building blocks by purpose (`guide-mascot.png`, `chapter-star.png`), not by an exported design-layer name such as `Vector-1.png`. UI frames, buttons, cards, boards, arrows, and text remain code-native React/CSS components so they can be localized and changed without editing images.
