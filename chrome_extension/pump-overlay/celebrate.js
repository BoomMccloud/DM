function startCelebrate(canvasId, stopDuration) {
  var canvas = document.getElementById(canvasId) || createCanvas(canvasId);

  // Set the canvas dimensions to cover the entire screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log('Canvas width:', canvas.width);
  console.log('Canvas height:', canvas.height);

  var speed = 50,
    drawDuration = 1.0 / speed,
    confettiRibbonCount = 25,
    confettiPaperCount = 100,
    ribbonPaperCount = 15,
    ribbonPaperDist = 8.0,
    ribbonPaperThick = 8.0,
    DEG_TO_RAD = Math.PI / 180,
    RAD_TO_DEG = 180 / Math.PI,
    colors = [
      ['#df0049', '#660671'],
      ['#00e857', '#005291'],
      ['#2bebbc', '#05798a'],
      ['#ffd200', '#b06c00'],
    ];

  function Vector2(_x, _y) {
    (this.x = _x), (this.y = _y);
    this.Length = function () {
      return Math.sqrt(this.SqrLength());
    };
    this.SqrLength = function () {
      return this.x * this.x + this.y * this.y;
    };
    this.Add = function (_vec) {
      this.x += _vec.x;
      this.y += _vec.y;
    };
    this.Sub = function (_vec) {
      this.x -= _vec.x;
      this.y -= _vec.y;
    };
    this.Div = function (_f) {
      this.x /= _f;
      this.y /= _f;
    };
    this.Mul = function (_f) {
      this.x *= _f;
      this.y *= _f;
    };
    this.Normalize = function () {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / Math.sqrt(sqrLen);
        this.x *= factor;
        this.y *= factor;
      }
    };
    this.Normalized = function () {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / Math.sqrt(sqrLen);
        return new Vector2(this.x * factor, this.y * factor);
      }
      return new Vector2(0, 0);
    };
  }

  Vector2.Lerp = function (_vec0, _vec1, _t) {
    return new Vector2(
      (_vec1.x - _vec0.x) * _t + _vec0.x,
      (_vec1.y - _vec0.y) * _t + _vec0.y
    );
  };
  Vector2.Distance = function (_vec0, _vec1) {
    return Math.sqrt(Vector2.SqrDistance(_vec0, _vec1));
  };
  Vector2.SqrDistance = function (_vec0, _vec1) {
    var x = _vec0.x - _vec1.x;
    var y = _vec0.y - _vec1.y;
    return x * x + y * y;
  };
  Vector2.Scale = function (_vec0, _vec1) {
    return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
  };
  Vector2.Min = function (_vec0, _vec1) {
    return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
  };
  Vector2.Max = function (_vec0, _vec1) {
    return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
  };
  Vector2.ClampMagnitude = function (_vec0, _len) {
    var vecNorm = _vec0.Normalized();
    return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
  };
  Vector2.Sub = function (_vec0, _vec1) {
    return new Vector2(_vec0.x - _vec1.x, _vec1.y - _vec1.y);
  };

  function EulerMass(_x, _y, _mass, _drag) {
    this.position = new Vector2(_x, _y);
    this.mass = _mass;
    this.drag = _drag;
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.AddForce = function (_f) {
      this.force.Add(_f);
    };
    this.Integrate = function (_dt) {
      var acc = this.CurrentForce(this.position);
      acc.Div(this.mass);
      var posDelta = new Vector2(this.velocity.x, this.velocity.y);
      posDelta.Mul(_dt);
      this.position.Add(posDelta);
      acc.Mul(_dt);
      this.velocity.Add(acc);
      this.force = new Vector2(0, 0);
    };
    this.CurrentForce = function (_pos, _vel) {
      var totalForce = new Vector2(this.force.x, this.force.y);
      var speed = this.velocity.Length();
      var dragVel = new Vector2(this.velocity.x, this.velocity.y);
      dragVel.Mul(this.drag * this.mass * speed);
      totalForce.Sub(dragVel);
      return totalForce;
    };
  }

  function ConfettiPaper(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = Math.random() * 600 + 800;
    this.angle = DEG_TO_RAD * Math.random() * 360;
    this.rotation = DEG_TO_RAD * Math.random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = Math.random() * 1.5 + 0.5;
    this.xSpeed = 40.0;
    this.ySpeed = Math.random() * 60 + 50.0;
    this.corners = new Array();
    this.time = Math.random();
    var ci = Math.round(Math.random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    for (var i = 0; i < 4; i++) {
      var dx = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
      var dy = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
      this.corners[i] = new Vector2(dx, dy);
    }
    this.Update = function (_dt) {
      this.time += _dt;
      this.rotation += this.rotationSpeed * _dt;
      this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
      this.pos.x +=
        Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt;
      this.pos.y += this.ySpeed * _dt;
      if (this.pos.y > ConfettiPaper.bounds.y) {
        this.pos.x = Math.random() * ConfettiPaper.bounds.x;
        this.pos.y = 0;
      }
    };
    this.Draw = function (_g) {
      if (this.cosA > 0) {
        _g.fillStyle = this.frontColor;
      } else {
        _g.fillStyle = this.backColor;
      }
      _g.beginPath();
      _g.moveTo(
        (this.pos.x + this.corners[0].x * this.size) * retina,
        (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina
      );
      for (var i = 1; i < 4; i++) {
        _g.lineTo(
          (this.pos.x + this.corners[i].x * this.size) * retina,
          (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina
        );
      }
      _g.closePath();
      _g.fill();
    };
  }
  ConfettiPaper.bounds = new Vector2(0, 0);

  function ConfettiRibbon(
    _x,
    _y,
    _count,
    _dist,
    _thickness,
    _angle,
    _mass,
    _drag
  ) {
    this.particleDist = _dist;
    this.particleCount = _count;
    this.particleMass = _mass;
    this.particleDrag = _drag;
    this.particles = new Array();
    var ci = Math.round(Math.random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.xOff = Math.cos(DEG_TO_RAD * _angle) * _thickness;
    this.yOff = Math.sin(DEG_TO_RAD * _angle) * _thickness;
    this.position = new Vector2(_x, _y);
    this.prevPosition = new Vector2(_x, _y);
    this.velocityInherit = Math.random() * 2 + 4;
    this.time = Math.random() * 100;
    this.oscillationSpeed = Math.random() * 2 + 2;
    this.oscillationDistance = Math.random() * 40 + 40;
    this.ySpeed = Math.random() * 40 + 80;
    for (var i = 0; i < this.particleCount; i++) {
      this.particles[i] = new EulerMass(
        _x,
        _y - i * this.particleDist,
        this.particleMass,
        this.particleDrag
      );
    }
    this.Update = function (_dt) {
      var i = 0;
      this.time += _dt * this.oscillationSpeed;
      this.position.y += this.ySpeed * _dt;
      this.position.x += Math.cos(this.time) * this.oscillationDistance * _dt;
      this.particles[0].position = this.position;
      var dX = this.prevPosition.x - this.position.x;
      var dY = this.prevPosition.y - this.position.y;
      var delta = Math.sqrt(dX * dX + dY * dY);
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      for (i = 1; i < this.particleCount; i++) {
        var dirP = Vector2.Sub(
          this.particles[i - 1].position,
          this.particles[i].position
        );
        dirP.Normalize();
        dirP.Mul((delta / _dt) * this.velocityInherit);
        this.particles[i].AddForce(dirP);
      }
      for (i = 1; i < this.particleCount; i++) {
        this.particles[i].Integrate(_dt);
      }
      for (i = 1; i < this.particleCount; i++) {
        var rp2 = new Vector2(
          this.particles[i].position.x,
          this.particles[i].position.y
        );
        rp2.Sub(this.particles[i - 1].position);
        rp2.Normalize();
        rp2.Mul(this.particleDist);
        rp2.Add(this.particles[i - 1].position);
        this.particles[i].position = rp2;
      }
      if (
        this.position.y >
        ConfettiRibbon.bounds.y + this.particleDist * this.particleCount
      ) {
        this.Reset();
      }
    };
    this.Reset = function () {
      this.position.y = -Math.random() * ConfettiRibbon.bounds.y;
      this.position.x = Math.random() * ConfettiRibbon.bounds.x;
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      this.velocityInherit = Math.random() * 2 + 4;
      this.time = Math.random() * 100;
      this.oscillationSpeed = Math.random() * 2.0 + 1.5;
      this.oscillationDistance = Math.random() * 40 + 40;
      this.ySpeed = Math.random() * 40 + 80;
      var ci = Math.round(Math.random() * (colors.length - 1));
      this.frontColor = colors[ci][0];
      this.backColor = colors[ci][1];
      this.particles = new Array();
      for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(
          this.position.x,
          this.position.y - i * this.particleDist,
          this.particleMass,
          this.particleDrag
        );
      }
    };
    this.Draw = function (_g) {
      for (var i = 0; i < this.particleCount - 1; i++) {
        var p0 = new Vector2(
          this.particles[i].position.x + this.xOff,
          this.particles[i].position.y + this.yOff
        );
        var p1 = new Vector2(
          this.particles[i + 1].position.x + this.xOff,
          this.particles[i + 1].position.y + this.yOff
        );
        if (
          this.Side(
            this.particles[i].position.x,
            this.particles[i].position.y,
            this.particles[i + 1].position.x,
            this.particles[i + 1].position.y,
            p1.x,
            p1.y
          ) < 0
        ) {
          _g.fillStyle = this.frontColor;
          _g.strokeStyle = this.frontColor;
        } else {
          _g.fillStyle = this.backColor;
          _g.strokeStyle = this.backColor;
        }
        if (i == 0) {
          _g.beginPath();
          _g.moveTo(
            this.particles[i].position.x * retina,
            this.particles[i].position.y * retina
          );
          _g.lineTo(
            this.particles[i + 1].position.x * retina,
            this.particles[i + 1].position.y * retina
          );
          _g.lineTo(
            (this.particles[i + 1].position.x + p1.x) * 0.5 * retina,
            (this.particles[i + 1].position.y + p1.y) * 0.5 * retina
          );
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(
            (this.particles[i + 1].position.x + p1.x) * 0.5 * retina,
            (this.particles[i + 1].position.y + p1.y) * 0.5 * retina
          );
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else if (i == this.particleCount - 2) {
          _g.beginPath();
          _g.moveTo(
            this.particles[i].position.x * retina,
            this.particles[i].position.y * retina
          );
          _g.lineTo(
            this.particles[i + 1].position.x * retina,
            this.particles[i + 1].position.y * retina
          );
          _g.lineTo(
            (this.particles[i].position.x + p0.x) * 0.5 * retina,
            (this.particles[i].position.y + p0.y) * 0.5 * retina
          );
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(
            (this.particles[i].position.x + p0.x) * 0.5 * retina,
            (this.particles[i].position.y + p0.y) * 0.5 * retina
          );
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else {
          _g.beginPath();
          _g.moveTo(
            this.particles[i].position.x * retina,
            this.particles[i].position.y * retina
          );
          _g.lineTo(
            this.particles[i + 1].position.x * retina,
            this.particles[i + 1].position.y * retina
          );
          _g.lineTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        }
      }
    };
    this.Side = function (x1, y1, x2, y2, x3, y3) {
      return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2);
    };
  }
  ConfettiRibbon.bounds = new Vector2(window.innerWidth, window.innerHeight);
  confetti = {};
  confetti.Context = function (id) {
    var i = 0;
    var canvas = document.getElementById(id);
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * retina;
    canvas.height = canvasHeight * retina;
    var context = canvas.getContext('2d');
    var confettiRibbons = new Array();
    ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiRibbonCount; i++) {
      confettiRibbons[i] = new ConfettiRibbon(
        Math.random() * canvasWidth,
        -Math.random() * canvasHeight * 2,
        ribbonPaperCount,
        ribbonPaperDist,
        ribbonPaperThick,
        45,
        1,
        0.05
      );
    }
    var confettiPapers = new Array();
    ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiPaperCount; i++) {
      confettiPapers[i] = new ConfettiPaper(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight
      );
    }
    this.resize = function () {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth * retina;
      canvas.height = canvasHeight * retina;
      ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
      ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    };
    this.start = function () {
      this.stop();
      var context = this;
      this.update();
    };
    this.stop = function () {
      cAF(this.interval);
    };
    this.update = function () {
      var i = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < confettiPaperCount; i++) {
        confettiPapers[i].Update(drawDuration);
        confettiPapers[i].Draw(context);
      }
      for (i = 0; i < confettiRibbonCount; i++) {
        confettiRibbons[i].Update(drawDuration);
        confettiRibbons[i].Draw(context);
      }
      this.interval = rAF(function () {
        confetti.update();
      });
    };
  };
  var confetti = new confetti.Context(canvasId);
  confetti.start();

  // Stop the confetti animation after the specified stop duration
  setTimeout(function () {
    confetti.stop();

    // Clear the canvas
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Remove the canvas element from the DOM
    canvas.parentNode.removeChild(canvas);
  }, stopDuration);

  window.addEventListener('resize', function (event) {
    confetti.resize();
  });
}

// Expose the startCelebrate function to the global scope
window.startCelebrate = startCelebrate;

var retina = window.devicePixelRatio,
  // Math shorthands
  PI = Math.PI,
  sqrt = Math.sqrt,
  round = Math.round,
  random = Math.random,
  cos = Math.cos,
  sin = Math.sin,
  // Local WindowAnimationTiming interface
  rAF = window.requestAnimationFrame,
  cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame,
  _now =
    Date.now ||
    function () {
      return new Date().getTime();
    };

(function (w) {
  var prev = _now();
  function fallback(fn) {
    var curr = _now();
    var ms = Math.max(0, 16 - (curr - prev));
    var req = setTimeout(fn, ms);
    prev = curr;
    return req;
  }

  var cancel =
    w.cancelAnimationFrame || w.webkitCancelAnimationFrame || w.clearTimeout;

  rAF = w.requestAnimationFrame || w.webkitRequestAnimationFrame || fallback;

  cAF = function (id) {
    cancel.call(w, id);
  };
})(window);

function createCanvas(id) {
  var canvas = document.createElement('canvas');
  canvas.id = id;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);
  return canvas;
}
