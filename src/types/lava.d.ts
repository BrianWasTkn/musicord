declare namespace Lava {
    import { Client } from 'eris'
    
    class Bot extends Client {}
    interface Config {
        token?: string;
        prefix?: string | string[];
        owners?: string | string[];
    }
}