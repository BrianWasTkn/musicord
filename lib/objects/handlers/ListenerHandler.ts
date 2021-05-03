import { HandlerPlus, HandlerPlusOptions } from '../interface/HandlerPlus';
import { isEventEmitter } from 'lib/utility/akairo';
import { EventEmitter } from 'events';
import { AkairoError } from 'lib/utility/error';
import { Collection } from 'discord.js';
import { Listener } from '..';
import { Lava } from 'lib/Lava';

export class ListenerHandler<Mod extends Listener = Listener> extends HandlerPlus<Mod> {
	public emitters: Collection<string, EventEmitter>;
	public constructor(client: Lava, {
		directory = './listeners',
		classToHandle = Listener,
		extensions = ['.js', '.ts'],
		automateCategories = true,
		loadFilter = (() => true)
	}: HandlerPlusOptions = {}) {
		if (
			!(classToHandle.prototype instanceof Listener || classToHandle === Listener)
		) {
			throw new AkairoError(
				'INVALID_CLASS_TO_HANDLE',
				classToHandle.name,
				Listener.name
			);
		}

		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});

		this.emitters = new Collection();
		this.emitters.set('client', this.client);
	}

	register(listener: Mod, filepath: string) {
        super.register(listener, filepath);
        listener.exec = listener.exec.bind(listener);
        this.addToEmitter(listener.id);
        return listener;
    }

    deregister(listener: Mod) {
        this.removeFromEmitter(listener.id);
        super.deregister(listener);
    }

    addToEmitter(id: string) {
        const listener = this.modules.get(id.toString());
        if (!listener) throw new AkairoError('MODULE_NOT_FOUND', this.classToHandle.name, id);

        const emitter = isEventEmitter(listener.emitter as EventEmitter) ? listener.emitter : this.emitters.get(listener.emitter as string);
        if (!isEventEmitter(emitter as EventEmitter)) throw new AkairoError('INVALID_TYPE', 'emitter', 'EventEmitter', true);

        if (listener.type === 'once') {
            (emitter as EventEmitter).once(listener.event, listener.exec);
            return listener;
        }

        (emitter as EventEmitter).on(listener.event, listener.exec);
        return listener;
    }

    removeFromEmitter(id: string) {
        const listener = this.modules.get(id.toString());
        if (!listener) throw new AkairoError('MODULE_NOT_FOUND', this.classToHandle.name, id);

        const emitter = isEventEmitter(listener.emitter as EventEmitter) ? listener.emitter : this.emitters.get(listener.emitter as string);
        if (!isEventEmitter(emitter as EventEmitter)) throw new AkairoError('INVALID_TYPE', 'emitter', 'EventEmitter', true);

        (emitter as EventEmitter).removeListener(listener.event, listener.exec);
        return listener;
    }

    setEmitters(emitters: { [emitter: string]: EventEmitter }) {
        for (const [key, value] of Object.entries(emitters)) {
            if (!isEventEmitter(value)) throw new AkairoError('INVALID_TYPE', key, 'EventEmitter', true);
            this.emitters.set(key, value);
        }

        return this;
    }
}