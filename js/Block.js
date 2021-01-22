export class Block {
    constructor(x, y, canvas, grid, utilityWidth) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.motionX = 0;
        this.motionY = 0;
        this.textColor = '#000';
        this.textSize = '36px';
        this.blockSizeW = (canvas.width - utilityWidth) / grid.column;
        this.blockSizeH = canvas.height / grid.column;
        this.moveSpeed = 5; // val up = speed down
        this.isUp = false;

        this.exponent = Math.random() * 10 >= 2.5 ? 1 : 2;
        this.setInit();
        this.isShow = false;
        this.show();
    }

    show() {
        if (this.isShow) return;

        if(!this.showCnt) this.showCnt = this.blockSizeW > this.blockSizeH ? this.blockSizeW : this.blockSizeW;

        const val = this.showCnt / this.moveSpeed;
        this.showCnt = Math.abs(this.showCnt - val) < 2 ? 0 : this.showCnt - val;

        if( !this.showCnt ) this.isShow = true;
    }

    motion() {
        if (Math.abs(this.motionX) <= 0 && Math.abs(this.motionY) <= 0) {
            this.isUp = false;
            return;
        }

        const moveValX = this.motionX / this.moveSpeed;
        const moveValY = this.motionY / this.moveSpeed;

        this.motionX = Math.abs(this.motionX - moveValX) < 2 ? 0 : this.motionX - moveValX;
        this.motionY = Math.abs(this.motionY - moveValY) < 2 ? 0 : this.motionY - moveValY;
    }

    setMoveDirection(beforeLocation) {
        const x = this.x - beforeLocation.x;
        const y = this.y - beforeLocation.y;

        this.motionX = x * this.blockSizeW * -1;
        this.motionY = y * this.blockSizeH * -1;
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
                if (this.mapArr[this.x][this.y].exponent === this.exponent) {
                    this.exponent += 1;
                    this.isUp = true;
                    this.setInit();
                } else {
                    this.x -= plusX;
                    this.y -= plusY;
                }
                this.mapArr[this.x][this.y] = this;
                return;
            }

            this.mapArr[this.x][this.y] = 0;
            moveInterval(plusX, plusY);
        }

        this.isShow = true;
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

        if (nowLocation === `${this.x}@${this.y}`) return false;
        else return true;
    }

    setInit(exponent = this.exponent) {
        this.number = Math.pow(2, exponent);

        const green = Math.floor(255 / exponent).toString(16);
        this.color = `#ff${green}00`;
    }

    draw(canvas, ctx, grid) {
        if( !this.isShow ) return;

        if (this.isUp) this.setInit(this.exponent - 1);
        else this.setInit();

        if (this.isUp) {
            // fake block
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.x * this.blockSizeW + grid.width / 2,
                this.y * this.blockSizeH + grid.width / 2,
                this.blockSizeW - grid.width,
                this.blockSizeH - grid.width
            );
            ctx.fillStyle = this.textColor;
            ctx.textAlign = 'middle';
            ctx.textBaseline = 'center';
            ctx.font = this.textSize + ' Arial';
            ctx.fillText(
                this.number,
                this.x * this.blockSizeW + grid.width / 2 + (this.blockSizeW - grid.width) / 2,
                this.y * this.blockSizeH + grid.width / 2 + (this.blockSizeH - grid.width) / 2
            );
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.blockSizeW + grid.width / 2 + this.motionX,
            this.y * this.blockSizeH + grid.width / 2 + this.motionY,
            this.blockSizeW - grid.width,
            this.blockSizeH - grid.width
        );

        ctx.fillStyle = this.textColor;
        ctx.textAlign = 'middle';
        ctx.textBaseline = 'center';
        ctx.font = this.textSize + ' Arial';
        ctx.fillText(
            this.number,
            this.x * this.blockSizeW + grid.width / 2 + (this.blockSizeW - grid.width) / 2 + this.motionX,
            this.y * this.blockSizeH + grid.width / 2 + (this.blockSizeH - grid.width) / 2 + this.motionY
        );
    };
}