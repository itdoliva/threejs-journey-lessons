import EventEmitter from "./EventEmitter"; 

export default class Time extends EventEmitter {
  constructor() {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16 // Avoid 0 (16ms for 60fps) 

    window.requestAnimationFrame(() => {
      this.tick() // So that we avoid delta = 0 for the first frame
    })
  }

  tick() {

    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.trigger('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}