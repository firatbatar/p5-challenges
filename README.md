# p5-challenges

A content-only Hugo bundle of my [p5.js](https://p5js.org/) sketch "challenges". It is mounted as a git submodule by [firatbatar.github.io](https://github.com/firatbatar/firatbatar.github.io) at `content/p5-challenges/`, which owns the layouts and styling. Published at <https://firatbatar.com/p5-challenges>.

Pushing to `main` here triggers an automatic rebuild of the main site via a `repository_dispatch` event — no manual deploy.

## Coding in p5.js

One of the first things I did when I started learning programming was to learn how to code in [p5.js](https://p5js.org/) — JavaScript was easy to pick up and p5.js made it fun. I followed [The Coding Train](https://www.youtube.com/user/shiffman) on YouTube and coded along with the "challenges". I've decided to start coding them again and post them here.

## Challenges

- [Double Pendulum](https://firatbatar.com/p5-challenges/challenge/double-pendulum) ([The Coding Train video](https://youtu.be/uWzPe_S-RVE?si=3FK4b-3gD-8_fLiP))
- [Sand Simulation](https://firatbatar.com/p5-challenges/challenge/sand) (inspired by [The Coding Train's challenge](https://thecodingtrain.com/challenges/180-falling-sand))
- [Recamán Sequence](https://firatbatar.com/p5-challenges/challenge/recaman-sequence) (inspired by the Numberphile video by Brady Haran and Alex Bellos)

## Adding a new challenge

Create a page bundle at `content/challenge/<slug>/` with:

- `index.md` — front matter (`title`, `date`, `coverImage`, `summary`) and a `<div id="sketch-holder">` that loads `./sketch.js`.
- `sketch.js` — the p5 sketch.
- a cover image.

Use an existing challenge (e.g. [recaman-sequence/](content/challenge/recaman-sequence/)) as a template. Commit and push — the main site rebuilds itself.
