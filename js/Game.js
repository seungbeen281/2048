import {
    Block
} from './Block.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid = {
            column: 4,
            width: 5,
            color: "#333",
        };
        this.utilityWidth = 100;
        this.defaultBlockCnt = 2;
        this.score = 0;

        this.setEvent();
        this.initBlockArr();
        this.animation();
    }

    move(e) {
        let isMove = false;
        switch (e.keyCode) {
            case 37:
                // left
                isMove = this.control('left');
                break;
            case 38:
                // top
                isMove = this.control('top');
                break;
            case 39:
                // right
                isMove = this.control('right');
                break;
            case 40:
                // bottom
                isMove = this.control('bottom');
                break;
        }
        if (isMove) this.createBlock();
    }

    control(direction, keep = false) {
        let isMove = false;
        switch (direction) {
            case 'left':
                // left
                for (let x = 0; x < this.blockArr.length; x++) {
                    for (let y = 0; y < this.blockArr[x].length; y++) {
                        const block = this.blockArr[x][y];
                        if (!!block) {
                            const isChange = block.move('left', this.blockArr);
                            if (isChange) isMove = true;
                            else this.blockArr = block.mapArr;
                        }
                    }
                }
                break;
            case 'top':
                // top
                for (let x = 0; x < this.blockArr.length; x++) {
                    for (let y = 0; y < this.blockArr[x].length; y++) {
                        const block = this.blockArr[x][y];
                        if (!!block) {
                            const isChange = block.move('top', this.blockArr);
                            if (isChange) isMove = true;
                            else this.blockArr = block.mapArr;
                        }
                    }
                }
                break;
            case 'right':
                // right
                for (let x = this.blockArr.length - 1; x >= 0; x--) {
                    for (let y = 0; y < this.blockArr[x].length; y++) {
                        const block = this.blockArr[x][y];
                        if (!!block) {
                            const isChange = block.move('right', this.blockArr);
                            if (isChange) isMove = true;
                            else this.blockArr = block.mapArr;
                        }
                    }
                }
                break;
            case 'bottom':
                // bottom
                for (let x = 0; x < this.blockArr.length; x++) {
                    for (let y = this.blockArr[x].length - 1; y >= 0; y--) {
                        const block = this.blockArr[x][y];
                        if (!!block) {
                            const isChange = block.move('bottom', this.blockArr);
                            if (isChange) isMove = true;
                            else this.blockArr = block.mapArr;
                        }
                    }
                }
                break;
        }
        return isMove;
    }

    setEvent() {
        window.addEventListener('keydown', this.move.bind(this));
    }

    inspectionOver() {
        let full = true;
        this.blockArr.map(x => {
            x.map(block => {
                if (block === 0) full = false;
            })
        })

        if (!full) return false;

        for (let x = 0; x < this.blockArr.length; x++) {
            for (let y = 0; y < this.blockArr[x].length; y++) {
                const block = this.blockArr[x][y];
                if (block.x - 1 > 0 && this.blockArr[block.x - 1][block.y].exponent === block.exponent) return false;
                if (block.y - 1 > 0 && this.blockArr[block.x][block.y - 1].exponent === block.exponent) return false;
                if (block.x + 1 < this.blockArr.length && this.blockArr[block.x + 1][block.y].exponent === block.exponent) return false;
                if (block.y + 1 < this.blockArr[x].length && this.blockArr[block.x][block.y + 1].exponent === block.exponent) return false;
            }
        }

        return true;
    }

    gameOver() {
        alert('Game Over!');
        location.reload();
    }

    createBlock() {
        const emptyList = [];
        for (let x = 0; x < this.grid.column; x++) {
            for (let y = 0; y < this.grid.column; y++) {
                if (!this.blockArr[x][y]) {
                    emptyList.push(`${x}@${y}`);
                }
            }
        }

        const location = emptyList[Math.floor(Math.random() * emptyList.length)].split("@");
        this.blockArr[location[0]][location[1]] = new Block(location[0], location[1]);
        this.score += this.blockArr[location[0]][location[1]].number;

        if (this.inspectionOver()) {
            this.gameOver();
        }
    }

    initBlockArr() {
        this.blockArr = [];
        for (let x = 0; x < this.grid.column; x++) {
            this.blockArr.push([]);
            for (let y = 0; y < this.grid.column; y++) {
                this.blockArr[x][y] = 0;
            }
        }

        while (this.defaultBlockCnt--) {
            this.createBlock();
        }
    }

    drawScore() {
        this.ctx.fillStyle = '#fff';
        this.ctx.textBaseline = 'center';
        this.ctx.textAlign = 'middle';

        this.ctx.font = '16px Arial';
        this.ctx.fillText('score', this.canvas.width - this.utilityWidth / 2, this.canvas.height / 3 * 0 + this.canvas.height / 3 / 6 * 1);

        this.ctx.font = '28px Arial';
        this.ctx.fillText(this.score, this.canvas.width - this.utilityWidth / 2, this.canvas.height / 3 * 0 + this.canvas.height / 3 / 6 * 3);
    }

    animation() {
        this.clear();

        this.blockArr.map(x => {
            x.map(block => {
                if (!!block) block.draw(this.canvas, this.ctx, this.grid, this.utilityWidth);
            })
        })
        this.drawScore();

        window.requestAnimationFrame(this.animation.bind(this));
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.grid.color;
        this.ctx.fillRect(0, 0, this.canvas.width - this.utilityWidth, this.canvas.height);

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0 + this.grid.width / 2 - this.utilityWidth, 0 + this.grid.width / 2, this.canvas.width - this.grid.width, this.canvas.height - this.grid.width);

        this.ctx.fillStyle = this.grid.color;
        let i = this.grid.column - 1;
        while (i--) {
            const x = (this.canvas.width - this.utilityWidth) / this.grid.column * (i + 1);
            this.ctx.fillRect(x - this.grid.width / 2, 0, this.grid.width, this.canvas.height);
            const y = this.canvas.height / this.grid.column * (i + 1);
            this.ctx.fillRect(0, y - this.grid.width / 2, this.canvas.width - this.utilityWidth, this.grid.width);
        }
    }
}