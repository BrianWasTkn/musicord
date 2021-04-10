export interface ItemConfig {
	discount: {
		interval: number;
		min: number;
		max: number;
	}
}

export const itemConfig: ItemConfig = {
	discount: {
		interval: 1e3 * 60 * 15, 
		max: 50,
		min: 1,
	} 
}