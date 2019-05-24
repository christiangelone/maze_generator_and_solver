function Stack() {
  this._representation = [];
  this.push = (element) => this._representation.push(element);
  this.pop = () => this._representation.pop();
  this.empty = () => this._representation.length === 0;
}