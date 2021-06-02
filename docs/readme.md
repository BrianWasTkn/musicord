# Lava
This documentation provides essential information about the workaround for this workspace, and in any other parts of the bot, or for other purpose. The docs will cover (for the most part) all the bullshits connected, in and out of the box so let's assume you know meet the following criterias to familiarize yourself within lava:

- Lava, as you see is built with typescript. You statically type more code in development to reduce (un)expected errors in production. You should have at least a decent experience with that language so search typescript by yourself on the web because I'm lazy.
- All things are imported from our `library` folder under `src` in our root. Instead of having to type the whole directory, we should use `src/library` to import anything inside from it.
- Each Akairo handler **is plugged-in** meaning, we have a plugin for each handler so that we won't unload clustermods manually, instead, we would need to load a plugin all of that. What the fuck is this for honestly? I read this last bullet and I feel like I'm about to barf.