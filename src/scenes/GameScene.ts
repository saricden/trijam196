import { Scene, GameObjects, Display, Sound, Math as pMath } from "phaser";

class GameScene extends Scene {
  private baddy!: any;
  private staticTile!: any;
  private ost!: Sound.BaseSound;
  private player!: any;
  private platform!: GameObjects.Rectangle;
  private cursors!: any;
  private activeBricks: any[] = [];
  private hpGfx: any;
  private hp: number = 3;
  private maxHP: number = 3;
  private score: number = 0;
  private txtScore: any;

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
    this.player.play('player-run');

    // Line logic for enemy attack
    const gfx = this.add.graphics();

    function spawnLine(): any {
      let x = pMath.Between(window.innerWidth - 256, window.innerWidth -64);
      let y = pMath.Between(64, window.innerHeight - 400);
      gfx.setAlpha(1);
      gfx.clear();
      gfx.lineStyle(2, 0xFF0000, 1);
      gfx.lineBetween(142, 492, x, y);
      return {x, y};
    }

    // HP bar
    this.hpGfx = this.add.graphics();

    // Score
    this.txtScore = this.add.text(window.innerWidth / 2, 42 + 20, '0', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#FFF'
    });
    this.txtScore.setOrigin(0.5, 0);

    // Main platform (and screen bounds)
    this.platform = this.add.rectangle(0, window.innerHeight / 2 + 100, window.innerWidth, window.innerHeight / 2, 0xFFFFFF, 1);
    this.platform.setOrigin(0, 0);

    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight / 2 + 100);

    // Start spawn clock
    let speed = 100;

    this.time.addEvent({
      callback: () => {
        const {x, y} = spawnLine();
        const brick = this.physics.add.sprite(x, y, 'static');
        const mass = pMath.FloatBetween(0.25, 0.8);

        brick.play('static-flicker');
        brick.body.setCollideWorldBounds(true);
        brick.body.setVelocityX(-speed);
        brick.body.setBounce(mass, mass);
        brick.setScale(1, 0.9 + (mass * 2));
        brick.setData('wasHit', false);

        this.physics.add.overlap(this.player, brick, (p: any, b: any) => {
          if (!b.getData('wasHit')) {
            b.setData('wasHit', true);
            b.body.setCollideWorldBounds(false);
            b.setAlpha(0.5);
            
            if (p.y < b.y - b.displayHeight * 0.75) {
              p.setVelocityY(-200);
              this.score++;
            }
            else {
              p.setVelocityY(200);

              if (this.hp - 1 > 0) {
                this.hp--;
              }
              else {
                this.hp = 3;
                this.score = 0;
                this.ost.destroy();
                this.scene.restart();
              }
            }
          }
        });

        this.activeBricks.push(brick);

        this.tweens.add({
          targets: gfx,
          alpha: 0,
          duration: 500
        });

        speed *= 1.05;
      },
      delay: 4000,
      repeat: -1
    });

    this.cameras.main.setBackgroundColor(0x333344);
  }

  update() {
    
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

    // Render HP bar
    this.hpGfx.clear();
    this.hpGfx.lineStyle(2, 0xFFFFFF, 1);
    this.hpGfx.fillStyle(0xFFFFFF, 1);

    this.hpGfx.strokeRect(20, 20, window.innerWidth - 40, 20);
    this.hpGfx.fillRect(20, 20, ((window.innerWidth - 40) * this.hp / this.maxHP), 20);

    if (this.player.body.blocked.down) {
      this.player.play('player-run', true);
    } else {
      this.player.play('player-jump', true);
    }

    // Update score
    this.txtScore.setText(this.score);
  }
}

export default GameScene;