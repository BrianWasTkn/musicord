# Lava
A multi-purpose discord bot for utilizing unique games and events for your [Dank Memer](https://dankmemer.lol 'Visit site')-based discord server.

### Features
* **Spawner** - Spawn events on a channel to earn $$$ (not real ones, ok?).
* **Games** - Gambling games, fight or guess the number games, on the go.

### Self-Hosting
Although the full code is visible here and is available to self-host on any compatible machine, I wouldn't mind you hosting your own version. But please, don't host a public version of this bot. The main reason is lava is not fully dependent to databases yet. So the functionality and everything still depends to the [local config](./src/config.ts) for easy import.

### Install
1. Clone this repository: `git clone https://github.com/BrianWasTkn/lava.git`
2. Open up your terminal and change your dir into lava: `cd lava`
3. Install the required dependencies: `npm i`
4. Since Lava's source is made with typescript, build the source code: `npm run build`
5. Run the bot something: `npm run start` or `node build/lava.js`
6. Done.

### Plans
* [ ] **DankUtils** - Implementation of `taxcalc` or `heiststart` that's fully customizable.
* [ ] **Music** - Usage of Lavalink so ya'll can listen into sick beats.
* [ ] **Modularity** - Modular loading of functions instead of static methods in `ClientUtil`
* [ ] **Premium?** - Eh, i'm not EA whatever. 

### Acknowledgements
* **Dauntless#0711** - Core function of the slot machine

### Author
**Copyright © 2021**\
**Made by [BrianWasTaken](https://github.com/BrianWasTkn)**
