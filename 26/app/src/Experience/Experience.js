import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'
import sources from './sources.js'


let singleton = null

export default class Experience {

  constructor(canvas) {

    if (singleton) {
      return singleton
    }

    singleton = this

    this.canvas = canvas

    // Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.time.on('tick', () => {
      this.update()
    })

    // Global access
    window.experience = this
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.renderer.update()
    this.world.update()
  }

  destroy() {
    // In a complex project we would have a destroy method in each module
    this.sizes.off('resize')
    this.time.off('tick')

    this.scene.traverse(child => {
      // Check if the child is a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose method
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }

      this.camera.controls.dispose()
      this.renderer.renderer.dispose()

      if (this.debug.active) {
        this.debug.ui.destroy()
      }
    })
  }

}