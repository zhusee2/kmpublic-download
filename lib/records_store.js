class RecordsStore {
  constructor(initStore = []) {
    this.store = initStore;
    return this;
  }

  getStore() {
    // Return a copy so the original array are not touched.
    return this.store.slice();
  }

  getSize() {
    return this.store.length;
  }

  add(arrayToAdd = []) {
    this.store = this.store.concat(arrayToAdd);
  }
}

module.exports = RecordsStore;
