function Wall(valueOfCut, firstValueX, lastValueX , firstValueY, lastValueY) {
    this._firstValueX = firstValueX;
    this._lastValueX = lastValueX;
    this._firstValueY = firstValueY;
    this._lastValueY = lastValueY;

    this.firstValueX = () => this._firstValueX;
    this.lastValueX = () => this._lastValueX;
    this.firstValueY = () => this._firstValueY;
    this.lastValueY = () => this._lastValueY;

    this.vertical = () => valueOfCut === 'vertical';
    this.horizontal = () => valueOfCut === 'horizontal';

}