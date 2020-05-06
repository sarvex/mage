export class Universe {

	constructor() {
		this.reality = {};
		this.realityUUID = {};
		this.worker = undefined;
	}

	get(id) {
		return this.reality[id];
	}

	getByUUID(uuid) {
		const id = this.realityUUID[uuid.toString()];

		if (id) {
			return this.get(id);
		}
	}

	set(id, value) {
		this.reality[id] = value;
	}

	reset = () => {
		this.reality = {};
		this.realityUUID = {};
	}

	storeUUIDToElementNameReference(uuid, name) {
		this.realityUUID[uuid] = name;
	}

	remove(id) {
		delete this.reality[id];
	}

	forEach = (callback) => {
		const keys = Object.keys(this.reality);

		keys.forEach(k => callback(this.reality[k]));
	};

	forEachAsync = (callback) => {
		const keys = Object.keys(this.reality);

		return new Promise(resolve => {
			Promise
				.all(keys.map(k => callback(this.reality[k])))
				.then(resolve);
		});
	};

	update(delta) {
		return new Promise(resolve => {
			Object
				.keys(this.reality)
				.map(k => this.reality[k].update(delta))
			resolve();
		});
	}

	bigfreeze = () => {
		this.forEach(o => o.dispose());
		this.reset();
	}

	toJSON() {
		const meshes = Object.keys(this.reality)
			.map(k => this.get(k))
			.filter(m => m.serializable && m.isMesh())
			.map(m => m.toJSON());

		return { meshes }
	}
}

export default new Universe();
