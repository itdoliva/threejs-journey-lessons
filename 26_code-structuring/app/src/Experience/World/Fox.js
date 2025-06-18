import * as THREE from "three";
import Experience from "../Experience.js";

export default class Fox {
  constructor() {
    this.experience = new Experience()

    this.resource = this.experience.resources.items.fox

    this.setModel()
    this.setAnimation()

    this.experience.scene.add(this.model)

    window.addEventListener('keydown', event => {
      if (event.key === ' ') {
        switch (this.animation.currentAction) {
          case 'idle':
            this.switchAnimation('walk')
            break
          case 'walk':
            this.switchAnimation('run')
            break
          case 'run':
            this.switchAnimation('idle')
            break
        }
      }
    })

    if (this.experience.debug.active) {
      this.setTweaks()
    }

  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(.015, .015, .015)

    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)
    
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[2])

    this.animation.currentAction = 'idle'

    this.animation.actions[this.animation.currentAction].play()
  }

  switchAnimation(name) {
    const previousAction = this.animation.actions[this.animation.currentAction]
    const nextAction = this.animation.actions[name]

    previousAction.fadeOut(0.5)
    nextAction.reset().fadeIn(0.5).play()

    this.animation.currentAction = name
  }


  update(deltaTime) {
    if (this.animation) {
      this.animation.mixer.update(deltaTime * 0.001)
    }
  }

  setTweaks() {
    this.debugFolder = this.experience.debug.ui.addFolder('Fox')
    
    const debugObject = {
      playIdle: () => this.switchAnimation('idle'),
      playWalk: () => this.switchAnimation('walk'),
      playRun: () => this.switchAnimation('run'),
    }

    this.debugFolder.add(debugObject, 'playIdle').name('Play Idle')
    this.debugFolder.add(debugObject, 'playWalk').name('Play Walk')
    this.debugFolder.add(debugObject, 'playRun').name('Play Run')
  }
}