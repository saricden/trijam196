import { Scene, GameObjects, Display, Sound, Physics } from "phaser";

class GameScene extends Scene {
  private baddy!: any;
  private staticTile!: any;
  private ost!: Sound.BaseSound;
  private player!: any;
  private platform!: GameObjects.Rectangle;
  private cursors!: any;

  constructor() {
    super('scene-game');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.baddy = this.physics.add.sprite(100, window.innerHeight / 2, 'baddy');
    this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
    this.baddy.play('baddy-run');
    this.baddy.setScale(2);
    this.baddy.body.setCollideWorldBounds(true);

    // Baddy data
    this.staticTile = this.add.sprite(this.baddy.x + 5, this.baddy.y, 'static');
    this.staticTile.play('static-flicker');
    this.staticTile.setScale(3.35, 2.5);

    this.baddy.body.setSize(32, 46);

    this.staticTile.mask = new Display.Masks.BitmapMask(this, this.baddy);
    this.staticTile.setAlpha(0.55);

    // Audio
    this.ost = this.sound.add('ost-loop', {
      loop: true,
      volume: 0.7
    });
    this.ost.play();

    // Player stuff
    this.player.setScale(2);
    this.player.body.setBounce(0.2);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setGravityY(400);
    
    this.anims.create({
      key:'left',
    });
    this.anims.create({
      key:'right',
    });
    this.anims.create({
      key:'up'
    });

    // Main platform (and screen bounds)
    this.platform = this.add.rectangle(0, window.innerHeight / 2 + 100, window.innerWidth, window.innerHeight / 2, 0xFFFFFF, 1);
    this.platform.setOrigin(0, 0);

    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight / 2 + 100);
  }

  update(time: number, delta: number) {
    
    // Sync baddy + static tile positioning
    this.staticTile.setPosition(this.baddy.x, this.baddy.y);

    // Player jumpig
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-600);
    }
  }
}

export default GameScene;