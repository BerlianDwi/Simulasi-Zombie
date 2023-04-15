let planet = []
let sun
let numPlanet = 4
let g = 100
let kestabilan = 0.15

function setup() {
  createCanvas(windowWidth,windowHeight)
  sun = new Body(50,createVector(0,0),createVector(0,0))


  for (let i = 0; i < numPlanet; i++) {
    let mass =(5, 10)
    let radius = random(sun.d, (windowWidth/2,windowHeight/2))
    let posisi = random(0, TWO_PI)
    let planetPos = createVector(radius * cos(posisi), radius * sin(posisi))

    let planetVel = planetPos.copy()
    if (random(1) < 0.1) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI) 
    planetVel.normalize()
    planetVel.mult( sqrt((g * sun.mass)/(radius)) ) 

    planet.push( new Body(mass, planetPos, planetVel) )
  }
}

function draw() {
  background(180)
 
  translate(width/2, height/2)
  
  for (let i = numPlanet-1; i >= 0; i--) {
    sun.attract(planet[i])
    planet[i].move()
    planet[i].show()
  }
  sun.show()

}


function Body(_mass, _pos, _vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.d = this.mass*2
  this.thetaInit = 0
  this.jalur = []
  this.pathLen = Infinity

  this.show = function() {
    stroke(0,50)
    for (let i = 0; i < this.jalur.length-2; i++) {
      line(this.jalur[i].x, this.jalur[i].y, this.jalur[i+1].x, this.jalur[i+1].y)
    }
    fill(255); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d, this.d)
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.jalur.push(createVector(this.pos.x,this.pos.y))
    if (this.jalur.length > 200) this.jalur.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass
  }

  this.attract = function(kecil) {
    let r = dist(this.pos.x, this.pos.y, kecil.pos.x, kecil.pos.y)
    let f = (this.pos.copy()).sub(kecil.pos)
    f.setMag( (g * this.mass * kecil.mass)/(r * r) )
    kecil.applyForce(f)
  }

}