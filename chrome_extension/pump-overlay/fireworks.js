(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

function startFireworks(canvasId, duration) {
    var canvas = document.getElementById(canvasId) || createCanvas(canvasId),
        ctx = canvas.getContext("2d"),
        width = window.innerWidth,
        height = window.innerHeight,
        vanishPointY = height / 5,
        vanishPointX = width / 5,
        focalLength = 300,
        angleX = 180,
        angleY = 180,
        angleZ = 180,
        angle = 0,
        cycle = 0,
        colors = { r: 255, g: 0, b: 0 },
        lastShot = new Date().getTime();

    var emitters = [];
    var animationFrameId;

    canvas.width = width;
    canvas.height = height;

    console.log('Canvas width:', canvas.width);
    console.log('Canvas height:', canvas.height);

    function Emitter() {
        this.reset();
    }

    Emitter.prototype.reset = function() {
        var PART_NUM = 200,
            x = (Math.random() * 400) - 200,
            y = (Math.random() * 400) - 200,
            z = (Math.random() * 800) - 200;

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

        var color = [~~(Math.random() * 150) + 10, ~~(Math.random() * 150) + 10, ~~(Math.random() * 150) + 10]
        this.particles = [];

        for (var i = 0; i < PART_NUM; i++) {
            this.particles.push(new Particle(this.x, this.y, this.z, {
                r: colors.r,
                g: colors.g,
                b: colors.b
            }));
        }
    }

    Emitter.prototype.update = function() {
        var partLen = this.particles.length;

        angleY = (angle - vanishPointX) * 0.0001;
        angleX = (angle - vanishPointX) * 0.0001;

        this.particles.sort(function(a, b) {
            return b.z - a.z;
        });

        for (var i = 0; i < partLen; i++) {
            this.particles[i].update();
        }

        if (this.particles.length <= 0) {
            this.reset();
        }
    };

    Emitter.prototype.render = function(imgData) {
        var data = imgData.data;

        for (i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i],
                dist = Math.sqrt((particle.x - particle.ox) * (particle.x - particle.ox) + (particle.y - particle.oy) * (particle.y - particle.oy) + (particle.z - particle.oz) * (particle.z - particle.oz));

            if (dist > 255) {
                particle.render = false;
                this.particles.splice(i, 1);
                this.particles.length--;
            }

            if (particle.render && particle.xPos < width && particle.xPos > 0 && particle.yPos > 0 && particle.yPos < height) {
                for (w = 0; w < particle.size; w++) {
                    for (h = 0; h < particle.size; h++) {
                        if (particle.xPos + w < width && particle.xPos + w > 0 && particle.yPos > 0 && particle.yPos < height) {
                            pData = (~~(particle.xPos + w) + (~~(particle.yPos + h) * width)) * 4;
                            data[pData] = particle.color[0];
                            data[pData + 1] = particle.color[1];
                            data[pData + 2] = particle.color[2];
                            data[pData + 3] = 255 - dist;
                        }
                    }
                }
            }
        }
    };

    function Particle(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.startX = this.x;
        this.startY = this.y;
        this.startZ = this.z;

        this.ox = this.x;
        this.oy = this.y;
        this.oz = this.z;

        this.xPos = 0;
        this.yPos = 0;

        this.vx = (Math.random() * 10) - 5;
        this.vy = (Math.random() * 10) - 5;
        this.vz = (Math.random() * 10) - 5;

        this.color = [color.r, color.g, color.b];
        this.render = true;

        this.size = Math.round(1 + Math.random() * 1);
    }

    Particle.prototype.rotate = function() {
        var x = this.startX * Math.cos(angleZ) - this.startY * Math.sin(angleZ),
            y = this.startY * Math.cos(angleZ) + this.startX * Math.sin(angleZ);

        this.x = x;
        this.y = y;
    }

    Particle.prototype.update = function() {
        var cosY = Math.cos(angleX),
            sinY = Math.sin(angleX);

        this.x = (this.startX += this.vx);
        this.y = (this.startY += this.vy);
        this.z = (this.startZ -= this.vz);
        this.rotate();

        this.vy += 0.1;
        this.x += this.vx;
        this.y += this.vy;
        this.z -= this.vz;

        this.render = false;

        if (this.z > -focalLength) {
            var scale = focalLength / (focalLength + this.z);

            this.size = scale * 2;
            this.xPos = vanishPointX + this.x * scale;
            this.yPos = vanishPointY + this.y * scale;
            this.render = true;
        }
    };

    function render() {
        colorCycle();
        angleY = Math.sin(angle += 0.01);
        angleX = Math.sin(angle);
        angleZ = Math.sin(angle);

        var imgData = ctx.createImageData(width, height);

        for (var e = 0; e < 30; e++) {
            emitters[e].update();
            emitters[e].render(imgData);
        }
        ctx.putImageData(imgData, 0, 0);
        animationFrameId = requestAnimationFrame(render);
    }

    function colorCycle() {
        cycle += .6;
        if (cycle > 100) {
            cycle = 0;
        }
        colors.r = ~~(Math.sin(.3 * cycle + 0) * 127 + 128);
        colors.g = ~~(Math.sin(.3 * cycle + 2) * 127 + 128);
        colors.b = ~~(Math.sin(.3 * cycle + 4) * 127 + 128);
    }

    for (var e = 0; e < 30; e++) {
        colorCycle();
        emitters.push(new Emitter());
    }

    setTimeout(function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.body.offsetHeight;
        vanishPointY = height / 2;
        vanishPointX = width / 2;
        render();
    }, 500);

    // Stop the animation after the specified duration
    setTimeout(function() {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, width, height);
        canvas.style.display = 'none';
    }, duration);
}

// Expose the startFireworks function to the global scope
window.startFireworks = startFireworks;

// Function to create the canvas element
function createCanvas(id) {
    var canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';  // Make sure it doesn't block any other elements
    canvas.style.zIndex = '999999';  // Ensure it is on top of other elements
    document.body.appendChild(canvas);
    return canvas;
}
