import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super('scene-preloader');
  }

  preload() {
    this.load.spritesheet('baddy', '/baddy.png', {
      frameWidth: 150,
      frameHeight: 150
    });

    this.load.spritesheet('static', '/static-sheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('player', '/AnimationSheet_Character.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.audio('ost-loop', '/ost.mp3');
    this.load.audio('sfx-laser', '/enemy_laser.wav');
    this.load.audio('sfx-ouch', '/player_hit.wav');

    this.load.image('static-bg0', '/static-dots0.png');
    this.load.image('static-bg1', '/static-dots1.png');
    this.load.image('static-bg2', '/static-dots2.png');
    this.load.image('static-bg3', '/static-dots3.png');
  }

  create() {
    this.anims.create({
      key: 'baddy-run',
      frames: this.anims.generateFrameNumbers('baddy', {
        start: 0,
        end: 7
      }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'static-flicker',
      frames: this.anims.generateFrameNumbers('static', {
        start: 0,
        end: 3
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'player-run',
      frames: this.anims.generateFrameNumbers('player', { 
        start: 24, 
        end: 33
      }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'player-jump',
      frames: this.anims.generateFrameNames('player', {
        start: 41,
        end: 48
      })
    })

    this.scene.start('scene-game');
  }
}

export default BootScene;