class Store {
	#luaSource?: string;
	#placeName?: string;

	get luaSource() {
		if (!this.#luaSource) {
			throw new Error('luaSource is not set');
		}
		return this.#luaSource;
	}

	set luaSource(content: string) {
		if (this.#luaSource) {
			throw new Error('Cannot set luaSource multiple times');
		}
		this.#luaSource = content;
	}

	get placeName() {
		if (!this.#placeName) {
			throw new Error('placePath is not set');
		}
		return this.#placeName;
	}

	set placeName(path: string) {
		if (this.#placeName) {
			throw new Error('Cannot set placePath multiple times');
		}
		this.#placeName = path;
	}
}

export const store = new Store();

/** @internal */
export { Store as TestStore };
