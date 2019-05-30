import $ from 'jquery';

; (function () {
    var Game = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = { x: canvas.width, y: canvas.height };
        var timer = 0;



        var self = this;
        this.NumObjects = 10;
        this.bodies = CreateInvarders(this, gameSize);
        this.bursts = [];

        var tick = function () {
            self.update(gameSize, timer);
            self.draw(screen, gameSize);

            requestAnimationFrame(tick);
        }

        tick();
    }

    Game.prototype = {
        update: function (gameSize, timer) {
            var bodies = this.bodies;

            var notCollidingWithAnithing = function (b1) {
                return bodies.filter(function (b2) { return colliding(b1, b2); }).length == 0;
            }

            var Active = function (b1) {
                return NotOutOfScreen(b1, gameSize);
            }

            var Burning = function (b1) {
                return NotOutOfTime(b1);
            }

            this.bodies = this.bodies.filter(Active);
            this.bodies = this.bodies.filter(notCollidingWithAnithing);
            this.bursts = this.bursts.filter(Burning);

            if (this.bodies.length < this.NumObjects) {
                this.addBody(new Invarder(this, gameSize, Math.random() * gameSize.x, Math.random()));
            }



            //Обновление
            for (var i = 0; i < this.bursts.length; i++) { //Взрывов
                this.bursts[i].update(this.bursts[i]);
            }


            for (var i = 0; i < bodies.length; i++) { //Игроков
                bodies[i].update();
            }
        },

        draw: function (screen, gameSize) {
            clearCanvas(screen, gameSize);
            screen.fillStyle = '#FFFFFF';
            screen.fillRect(0, 0, gameSize.x, gameSize.y);
            screen.fillStyle = '#000000';

            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].draw(screen, gameSize);
            }

            for (var i = 0; i < this.bursts.length; i++) {
                this.bursts[i].draw(screen, gameSize);
            }
        },

        addBody: function (body) {
            this.bodies.push(body);
        },

        addBurst: function (burst) {
            this.bursts.push(burst);
        }
    }

    var Player = function (game, gameSize, name) {
        this.name = name;
        this.game = game;
        this.size = { width: 16, height: 16 };
        this.position = { x: gameSize.x / 2, y: gameSize.y / 2 };
        this.acceleration = 0;
        this.rocket = document.getElementById("rocket");
        this.StopAcceleration = 0.2;
        this.speedX = 0;
        this.speedY = 0;
        this.rotation = 0;
        this.gameSize = gameSize;
        this.keyboard = new Keyboard();
        this.bullets = 0;
        this.timer = 0;
    }

    Player.prototype =
        {
            update: function () {
                if (this.keyboard.isDown(this.keyboard.KEYS.TOP)) {
                    this.acceleration = 0.07;
                }
                else {
                    this.acceleration = 0;
                    var speed = Math.sqrt((this.speedX * this.speedX) + (this.speedY * this.speedY));
                    if (speed != 0) {
                        var rotcos = this.speedX / speed;
                        var rotsin = this.speedY / speed;
                        if (speed - this.StopAcceleration > 0) {
                            speed -= this.StopAcceleration;
                        }
                        else { speed = 0; }
                        this.speedX = speed * rotcos;
                        this.speedY = speed * rotsin;
                    }
                }

                if (this.keyboard.isDown(this.keyboard.KEYS.BOTTOM)) {
                    this.StopAcceleration++;
                }
                else { this.StopAcceleration = 0.2; }

                if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT))
                { this.rotation += 0.015 * Math.PI; }

                if (this.keyboard.isDown(this.keyboard.KEYS.LEFT))
                { this.rotation -= 0.015 * Math.PI; }

                if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
                    if (this.bullets < 2) {
                        this.game.addBody(new InvarderBullet(this.position.x, this.position.y, this.rotation, this.name));
                        this.bullets++;
                    }
                }

                DoMove(this, this.gameSize);

                this.timer++;
                if (this.timer % 1 == 0) {
                    this.bullets = 0;
                }

            },

            draw: function (screen, gameSize) {
                screen.save();
                screen.translate(this.position.x, this.position.y);
                screen.rotate(this.rotation);
                screen.drawImage(this.rocket, -10, -10);
                screen.restore();
            },

            Dead: function (player) {
                $("#restartBtn").css("display", "block");
            }
        }



    var InvarderBullet = function (PositionX, PositionY, Rotation, name) {
        this.name = name;
        this.position = { x: PositionX, y: PositionY };
        this.size = { width: 6, height: 6 };
        //this.rotation = Rotation;
        this.speedX = 10 * Math.cos(Rotation);
        this.speedY = 10 * Math.sin(Rotation);
    }

    InvarderBullet.prototype =
        {
            update: function () {
                this.position.x += this.speedX;
                this.position.y += this.speedY;
            },

            draw: function (screen, gameSize) {
                screen.save();
                screen.translate(this.position.x, this.position.y);
                screen.rotate(this.rotation);
                screen.fillRect(-this.size.width / 2, -this.size.width / 2, this.size.width / 2, this.size.width / 2);
                screen.restore();
            },

            Dead: function (bullet) {

            }
        }



    var Invarder = function (game, gameSize, posX, name) {
        this.name = name;
        this.game = game;
        this.size = { width: 16, height: 16 };
        this.position = { x: posX, y: 0 };
        this.acceleration = 0.07;
        var a = Math.random();
        if (a < 0.25) { this.dron = document.getElementById("dron"); }
        if ((a > 0.25) && (a < 0.5)) { this.dron = document.getElementById("meteor"); }
        if ((a > 0.5) && (a < 0.75)) { this.dron = document.getElementById("heart"); }
        if ((a > 0.75) && (a < 1)) { this.dron = document.getElementById("three"); }
        this.StopAcceleration = 0.2;
        this.speedX = 0;
        this.speedY = 0;
        this.rotation = 0;
        this.gameSize = gameSize;
        this.bullets = 0;
        this.Wait = 0;
    }

    Invarder.prototype =
        {
            update: function (game) {
                if (Math.random() < 0.007) {
                    this.rotation = 360 * Math.random();
                    this.Wait = 100;
                }

                if (Math.random() < 0.02) {
                    this.game.addBody(new InvarderBullet(this.position.x, this.position.y, this.rotation, this.name));
                }

                if (this.Wait == 0) {
                    if (Math.random() > 0.5) {
                        this.rotation = this.rotation + 20 * Math.random();
                    }
                    else {
                        this.rotation = this.rotation - 20 * Math.random();
                    }

                    this.Wait = 80;
                }
                else {
                    this.Wait--;
                }


                DoMove(this, this.gameSize);
            },

            draw: function (screen, gameSize) {
                screen.save();
                screen.translate(this.position.x, this.position.y);
                screen.rotate(this.rotation);
                screen.drawImage(this.dron, -10, -10);
                screen.restore();
            },

            Dead: function (enemy) {
                enemy.game.addBurst(new Burst(enemy.position));
            }
        }




    var Burst = function (pos) {
        this.vzryv = document.getElementById('vzryv');
        this.position = { x: pos.x, y: pos.y };
        this.timer = 300;
    }

    Burst.prototype =
        {
            update: function (burst) {
                burst.timer--;
            },

            draw: function (screen, gameSize) {
                screen.save();
                screen.translate(this.position.x, this.position.y);
                //screen.rotate(this.rotation);
                screen.drawImage(this.vzryv, -15, -15);
                screen.restore();
            },
        }




    var Keyboard = function () {
        var KeyState = {};
        this.KEYS = { SPACE: 32, LEFT: 65, TOP: 87, RIGHT: 68, BOTTOM: 83 };

        window.onkeydown = function (e)
        { KeyState[e.keyCode] = true; };

        window.onkeyup = function (e)
        { KeyState[e.keyCode] = false; };

        this.isDown = function (keyCode)
        { return (KeyState[keyCode]) };
    }



    var DoMove = function (body, gameSize) {
        var speed = Math.abs(body.speedX) + Math.abs(body.speedY);
        var Cos = Math.cos(body.rotation);
        var Sin = Math.sin(body.rotation);

        if (speed < 5) {
            body.speedX += body.acceleration * Cos;
            body.speedY += body.acceleration * Sin;
        }
        else {
            body.speedX += body.acceleration * Cos;
            body.speedY += body.acceleration * Sin;
            var speed2 = Math.abs(body.speedX) + Math.abs(body.speedY);
            if (speed2 > 7) {
                var proporciaX = body.speedX / speed2;
                var proporciaY = body.speedY / speed2;
                body.speedX = 7 * proporciaX;
                body.speedY = 7 * proporciaY;
            }
        }



        if ((body.position.x + body.speedX) > gameSize.x) {
            body.speedX = -body.speedX;
            //body.rotation += 180;
        }

        if ((body.position.x + body.speedX) < 0) {
            body.speedX = -body.speedX;
            //body.rotation += 180;
        }

        if ((body.position.y + body.speedY) > gameSize.y) {
            body.speedY = -body.speedY;
            //body.rotation += 180;
        }

        if ((body.position.y + body.speedY) < 0) {
            body.speedY = -body.speedY;
            //body.rotation += 180;
        }


        body.position.x += body.speedX;
        body.position.y += body.speedY;
    }

    var CreateInvarders = function (game, gameSize) {
        var Invarders = [];
        for (var i = 0; i < 6; i++) {
            var invarder = new Invarder(game, gameSize, 150 * i, 5 * i);
            Invarders.push(invarder);
        }
        return Invarders;
    }


    var colliding = function (b1, b2) {
        var result = !(b1.name == b2.name ||
            b1.position.x + b1.size.width / 2 < b2.position.x - b2.size.width / 2 ||
            b1.position.y + b1.size.height / 2 < b2.position.y - b2.size.height / 2 ||
            b1.position.x - b1.size.width / 2 > b2.position.x + b2.size.width / 2 ||
            b1.position.y - b1.size.height / 2 > b2.position.y + b2.size.height / 2
            );

        if (result == true) {
            b1.Dead(b1);
            b2.Dead(b2);
        }

        return result;
    }

    var NotOutOfScreen = function (b1, gameSize) {
        return (b1.position.x < (gameSize.x + 5) &&
            b1.position.x > -5 &&
            b1.position.y < (gameSize.y + 5) &&
            b1.position.y > -5);
    }

    var NotOutOfTime = function (b1) {
        return (b1.timer > 0);
    }

    var countSin = function (grad) {
        return (Math.sin(grad * Math.PI / 180));
    }

    var countCos = function (grad) {
        return (Math.cos(grad * Math.PI / 180));
    }

    var clearCanvas = function (screen, gameSize) {
        screen.clearRect(0, 0, gameSize.x, gameSize.y)
    }

    window.onload = function () {
        var screenId = "screen";
        var body = document.getElementById('body');
        var World = document.getElementById(screenId);
        World.width = body.offsetWidth-2;
        World.height = body.offsetHeight-2;

        Game = new Game(screenId);
        var gameSize = { x: World.width, y: World.height };
        $("#startBtn").click(function () {
            $("#startBtn").css("display", "none");
            Game.addBody(new Player(Game, gameSize, 1));
        })

        $("#restartBtn").click(function () {
            $("#restartBtn").css("display", "none");
            Game.addBody(new Player(Game, gameSize, 1));
        })

        $("#settingsBtn").click(function () {
            $("#NumObjectsInput").val(Game.NumObjects);
        })

        $("#NumObjectsBtn").click(function () {
            Game.NumObjects = $("#NumObjectsInput").val();
        })

        $("#fullScreenBtn").click(function () {
            document.location.href = "/";
        })
    }
})();
