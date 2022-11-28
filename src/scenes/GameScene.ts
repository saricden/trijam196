import { Scene, GameObjects, Display, Sound, Math as pMath } from "phaser";

class GameScene extends Scene {
  private baddy!: any;
  private staticTile!: any;
  private ost!: Sound.BaseSound;
  private player!: any;
  private platform!: GameObjects.Rectangle;
  private cursors!: any;
  private activeBricks: any[] = [];

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


    // Line logic for enemy attack
    const gfx = this.add.graphics();
    function spawnLine(): any {
      let x = pMath.Between(window.innerWidth - 256, window.innerWidth -64);
      let y = pMath.Between(64, window.innerHeight - 400);
      gfx.lineStyle(2, 0xFF0000, 1);
      gfx.lineBetween(142, 442, x, y);
      return {x, y};
    }
    spawnLine();

    // Main platform (and screen bounds)
    this.platform = this.add.rectangle(0, window.innerHeight / 2 + 100, window.innerWidth, window.innerHeight / 2, 0xFFFFFF, 1);
    this.platform.setOrigin(0, 0);

    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight / 2 + 100);

    // Start spawn clock
    let speed = 100;

    this.time.addEvent({
      callback: () => {
        const x = this.player.x + 300;
        const brick = this.physics.add.sprite(x, window.innerHeight / 2 - 100, 'static');
        const mass = pMath.FloatBetween(0.25, 0.8);

        brick.play('static-flicker');
        brick.body.setCollideWorldBounds(true);
        brick.body.setVelocityX(-speed);
        brick.body.setBounce(mass, mass);
        brick.setScale(1, 0.9 + (mass * 2));

        this.physics.add.overlap(this.player, brick, (p: any, b: any) => {
          if (p.y < b.y + b.displayHeight * 0.33) {
            b.body.setCollideWorldBounds(false);
            b.setAlpha(0.5);
            p.setVelocityY(-200);
          }
        });

        this.activeBricks.push(brick);

        speed *= 1.05;
      },
      delay: 4000,
      repeat: -1
    });
  }

  update(time: number, delta: number) {
    
    // Sync baddy + static tile positioning
    this.staticTile.setPosition(this.baddy.x, this.baddy.y);

    // Player jumping
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-500);
    }

    // Brick cleanup
    this.activeBricks.forEach((brick, i) => {
      if (
        brick.y > window.innerHeight + brick.displayHeight ||
        brick.x <= this.baddy.x
      ) {
        brick.destroy();
        this.activeBricks.splice(i, 1);
      }
    });
  }
}

export default GameScene;