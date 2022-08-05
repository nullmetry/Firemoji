const canvas = document.querySelector('.c')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')
ctx.font = "15px monospace"
let fws = [] //fireworks
let ems = [] //emojis
class Emoji {
  constructor(x, y, char){
    this.alive = true
    this.char = char
    this.x = x
    this.y = y

    this.speed = 2 + Math.random() * 3
    this.angle = -(Math.random() * Math.PI*2)
    this.vx = Math.cos(this.angle) * this.speed
    this.vy = Math.sin(this.angle) * this.speed
  }
  update(){
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.1
    if(this.y > canvas.height){
      this.alive = false
    }
  }
  draw(){
    ctx.beginPath()
    ctx.fillText(this.char, this.x, this.y)
    ctx.stroke()
  }
}

class Firework {
  constructor(tgX, tgY){//tg: target
    this.alive = true
    this.x = window.innerWidth/2
    this.y = window.innerHeight - 10
    
    this.speed = 5 + Math.random()*5
    this.angle = -(Math.random() * Math.PI/2) - Math.PI/4
    let dX = tgX - this.x
    let dY = this.y - tgY
    let dt = (dX**2 + dY**2)**.5
    console.log(`dx: ${dX}, dy: ${dY}, dt: ${dt}, dx/dt: ${dX/dt}`)
    this.angle = -Math.atan2(dY, dX)
    console.log(`angle ${this.angle}`)
    this.vx = Math.cos(this.angle) * this.speed
    this.vy = Math.sin(this.angle) * this.speed
  }
  update(){
    if(this.vy < 1){
      this.x += this.vx
      this.y += this.vy
      this.vy += 0.1
    } else{
      this.explode()
    }
  }
  draw(){
    ctx.beginPath()
    let r = 10 + ((this.y/2)%1)*5
    ctx.arc(this.x, this.y, r, 0, 2*Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }
  explode(){
    this.alive = false
    // ea: emojis amount
    let ea = 15 + Math.random() * 8
    for(let i = 0; i < ea; i++){
      let char = allEmjs[Math.round(Math.random()*allEmjs.length)]
      let emoji = new Emoji(this.x, this.y, char)
      ems.push(emoji)
    }
  }
}

function createFirework(e){
  fws.push(new Firework(e.clientX, e.clientY))
}
canvas.addEventListener('click', createFirework)


function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  fws = fws.filter(fw => fw.alive)
  ems = ems.filter(e => e.alive)
  fws.forEach((fw)=>{
    fw.update()
    fw.draw()
  })
  ems.forEach((e)=>{
    e.update()
    e.draw()
  })
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)