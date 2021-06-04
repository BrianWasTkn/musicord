# Lava - Docs
> Assuming you know what the heck js and ts is, and a background of what [discord-akairo](https://npmjs.com/package/discord-akairo) does in order to follow through without stuttering.

## Requirements
- **NodeJS 14** - Install the latest "recommended for most users" build of it.
- **Mongo Database** - Ensure you have a URI of your database.
- **Discord Token** - Get one from your applications dashboard.
- **Meme API Key** - Request one from the memegods for image commands.

## Installation
1. Clone this repository: `git clone https://github.com/BrianWasTaken/lava.git`
2. Install bot dependencies: `npm install`
4. Rename `.env-example` to `.env` and fill it in.
3. Build the source files: `npm run build`
5. Run the bot: `npm start`

## Versioning
Lava uses semantic versioning with some additional bullshit:
> **Major.Minor.Semi-Label**
- **Major** - Bot breaking updates, massive refactors, basically anything that leaves an empty hole within the bot or something that adds a big portion of the bot.
- **Minor** - New minor additions, minor refactors, huge bug fixes and any minor crap.
- **Semi** - Small bug fixes, issues fixed or exploits patched occuring within the bot.
- **OPTIONAL - Label** - Indicates the state of the current branch. Major, Minor and Semi pieces are frozen if this is specified.