export class Block {
    constructor(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.textColor = '#000';
        this.textSize = '36px';
        this.exponent = Math.random() * 10 >= 2.5 ? 1 : 2;
        this.setInit();
    }

    move(direction, arr) {
        const moveInterval = (plusX, plusY) => {
            this.x += plusX;
            this.y += plusY;
            if (this.x < 0 || this.y < 0 || this.x >= this.mapArr.length || this.y >= this.mapArr[0].length) {
                // out map
                this.x -= plusX;
                this.y -= plusY;
                this.mapArr[this.x][this.y] = this;
                return;
            }
            if (!!this.mapArr[this.x][this.y]) {
                // meet block
                if( this.mapArr[this.x][this.y].exponent === this.exponent ){
                    this.exponent+=1;
                    this.setInit();
                }else{
                    this.x -= plusX;
                    this.y -= plusY;
                }
                this.mapArr[this.x][this.y] = this;
                return;
            }

            this.mapArr[this.x][this.y] = 0;
            moveInterval(plusX, plusY);
        }

        this.mapArr = arr;
        this.mapArr[this.x][this.y] = 0;
        const nowLocation = `${this.x}@${this.y}`;
        switch (direction) {
            case 'left':
                moveInterval(-1, 0, this.mapArr);
                break;
            case 'right':
                moveInterval(1, 0, this.mapArr);
                break;
            case 'top':
                moveInterval(0, -1, this.mapArr);
                break;
            case 'bottom':
                moveInterval(0, 1, this.mapArr);
                break;
        }

        if( nowLocation === `${this.x}@${this.y}` ) return false;
        else return true;
    }

    setInit() {
        this.number = Math.pow(2, this.exponent);

        const green = Math.floor(255 / this.exponent).toString(16);
        this.color = `#ff${green}00`;
    }

    draw(canvas, ctx, grid, utilityWidth) {
        const blockSizeW = (canvas.width-utilityWidth) / grid.column;
        const blockSizeH = canvas.height / grid.column;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * blockSizeW + grid.width / 2, this.y * blockSizeH + grid.width / 2, blockSizeW - grid.width, blockSizeH - grid.width);

        ctx.fillStyle = this.textColor;
        ctx.textAlign = 'middle';
        ctx.textBaseline = 'center';
        ctx.font = this.textSize + ' Arial';
        ctx.fillText(this.number, this.x * blockSizeW + grid.width / 2 + (blockSizeW - grid.width) / 2, this.y * blockSizeH + grid.width / 2 + (blockSizeH - grid.width) / 2);
    };
}
