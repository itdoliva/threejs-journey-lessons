import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
  constructor() {
    super() 

    // Setup
    this.updateSizes()

    // Resize event
    window.addEventListener('resize', () => {
      this.updateSizes()
      this.trigger('resize')
    })
  }

  updateSizes() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }
}