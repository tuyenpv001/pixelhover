const data = []
const imageArray = document.querySelectorAll('.image')

// console.log(imageArray)
window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas')

  // console.log(image1)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')

//   console.log(ctx)

  //blueprint to create individual particle objects
  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect
      this.x = Math.random() * this.effect.width
      this.y = Math.random() * this.effect.height
      this.originX = Math.floor(x)
      this.originY = Math.floor(y)
      this.color = color
      this.size = this.effect.gap

      this.vx = 0
      this.vy = 0
      this.ease = 0.2

      this.dx = 0
      this.dy = 0
      this.distance = 0
      this.force = 0
      this.angle = 0
      this.friction = 0.8
    }

    draw(context) {
      context.fillStyle = this.color
      context.fillRect(this.x, this.y, this.size, this.size)
    }

    update() {
      this.dx = this.effect.mouse.x - this.x
      this.dy = this.effect.mouse.y - this.y
      this.distance = this.dx * this.dx + this.dy * this.dy
      this.force = -this.effect.mouse.radius / this.distance
      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx)
        this.vx += this.force * Math.cos(this.angle)
        this.vy += this.force * Math.sin(this.angle)
      }

      this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
      this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
    }
  }

  //handle all particles at the same time
  class Effect {
    constructor(width, height) {
      this.width = width
      this.height = height
      this.particlesArray = []
      // this.image = document.getElementById('image1')
      this.image = imageArray[Math.floor(Math.random() * imageArray.length)]
      this.centerX = this.width * 0.5
      this.centerY = this.height * 0.5

      this.x = this.centerX - this.image.width * 0.5
      this.y = this.centerY - this.image.height * 0.5

      this.gap = 5
      this.mouse = {
        radius: 3000,
        x: undefined,
        y: undefined,
      }

      window.addEventListener('mousemove', (event) => {
        this.mouse.x = event.x
        this.mouse.y = event.y

        // console.log(this.mouse.x, this.mouse.y)
      })
    }

    init(context) {
      // for (let i = 0; i < 20; i++) {
      //   this.particlesArray.push(new Particle(this))
      // }
      // console.log(this.image)
      context.drawImage(this.image, this.x, this.y)
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data
//       console.log(pixels)

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4

          const red = pixels[index]
          const green = pixels[index + 1]
          const blue = pixels[index + 2]
          const alpha = pixels[index + 3]
          const color = `rgb(${red},${green},${blue})`

          // console.log(pixels[index])
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color))
          }
        }
      }
    }

    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context))
      // context.drawImage(this.image, this.x, this.y)
    }
    update() {
      // this.x++
      this.particlesArray.forEach((particle) => particle.update())
    }
  }

  const effect = new Effect(canvas.width, canvas.height)
  effect.init(ctx)
//   console.log(effect)
  // effect.draw(ctx)
  // ctx.fillRect(50, 50, 100, 200)
  // ctx.drawImage(image1, 100, 100)

  // make all animated and ỉnteractive
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.draw(ctx)
    effect.update()

    requestAnimationFrame(animate)
  }

  animate()
})

/**
 * Every particle will be a piece of an image, a pixel
 * =>So xác định vị trí x, y cho chúng
 *
 */
