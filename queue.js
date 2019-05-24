function Queue() {
    this._representation = Array.prototype.slice.call(arguments, 0);

    this.enqueue = (element) => this._representation.push(element);

    this.dequeue = () => this._representation.shift();
}