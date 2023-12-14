class Store {
	#luaSource: string | undefined;

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
}

export const store = new Store();
