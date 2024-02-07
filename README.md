# Trade Runners

## Original concept
This is the initial prototype for a game idea I had for some time. It is somewhat based on drugwars and
the more modern interpretation, dopewars.

Play as Trade Runner: a wandering trader in an alternate timeline where escalating global conflicts
make people live underground for decades and just now reemerge.

Trade to pay a family debt with a local gang. Rake profits from strategic commerce. Or just steal and see
if you can get away with it.

## Development

### History
The game is implemented as an Angular 17 application, although, I'll admit it doesn't fully use all of it's features, neither does it use the features that it does consistently. The original version of this
was implemented in Vue, Vanilla JS and, more recently, older versions of Angular. This version is a revision of a mashup of the last 2-4 versions plus the core game classes that were implemented for a text-only initial prototype, which turned out way too complex to realistically become a game. I plan to refactor and write some proper unit tests in the future.

### Running
To run the development server simply `npm i` and `npm run start`. `http://localhost:4200` will have the game. Start screen is the simple, hopefully self-explanatory main menu at `/menu`.
