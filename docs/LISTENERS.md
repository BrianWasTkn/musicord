# Listeners
Listeners are events emitted by Discord and DisTube. These events have their own brain to display and provide information whenever something happens from their respective APIs. They are processes in short.

* **discordActivityChanger** - **<Client>.on**
`ready`

* **discordCommandListener** - **Collection<Command>**
`message`, `messageUpdate`

* **discordEventListener** - **<Client>.on**
`ready`, `warn`, `error`, `rateLimit`

* **playerEventListener** - **<Client>.<DisTube>.on**
`playSong`, `addSong`, `initQueue`, `noRelated`, `finish`, `empty`, `addList`, `searchResult`, `searchCancel`, `error`