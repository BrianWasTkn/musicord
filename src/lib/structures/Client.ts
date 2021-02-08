import { Client, Collection } from 'discord.js'

export class LavaClient extends Client {
    public modules!: Collection<string, any>;
    constructor(public config?: any) { 
        super(config);
        /** @type {any} Bot Config */
        this.config = config;

        this._patch(); 
    }
    
    /**
     * build and patch handlers and modules
     * @param {any} config bot config in root
     */
    private _patch(): void {}

    /**
     * build
     */
    public build(): string {
        return 'yes';
    }
}