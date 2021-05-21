/// <reference path="../../../typings/mongo.currency.d.ts" />

/**
 * User Entry
*/

import { UserEntry } from '..';

export class CurrencyEntry extends UserEntry<CurrencyData> {
	get props() {
		return this.data.props;
	}

	get settings() {
		return this.data.settings;
	}

	addPocket(amount: number) {
		this.data.props.pocket = Math.trunc(this.props.pocket + amount);
		return this;
	}
}