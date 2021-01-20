import {
    Game
} from './Game.js';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.init()

        this.isPlaying = false;
        window.addEventListener('keydown', this.gameStart.bind(this));
    }

    gameStart(e) {
        if (e.keyCode != 32 || this.isPlaying) return;

        new Game(this.canvas, this.ctx);
        this.isPlaying = true;
    }

    init() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '32px Arial';
        this.ctx.fillText('2048', this.canvas.width/2, this.canvas.height/2-20);
        this.ctx.font = '18px Arial';
        this.ctx.fillText('게임을 시작하려면 스페이스바를 눌러주세요.', this.canvas.width/2, this.canvas.height/2+20);
        this.ctx.font = '16px Arial';
        this.ctx.fillText('조작: 방향키', this.canvas.width/2, this.canvas.height/2+40);
    }
}

window.onload = () => {
    new App;
}