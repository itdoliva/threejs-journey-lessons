import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()

    this.scene.add(this.mesh)

  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64)
  }

  setTextures() {
    this.textures = {}

    this.textures.default = this.resources.items.terrainDefaultTexture
    this.textures.default.colorSpace = THREE.SRGBColorSpace
    this.textures.default.repeat.set(1.5, 1.5)
    this.textures.default.wrapS = THREE.RepeatWrapping
    this.textures.default.wrapT = THREE.RepeatWrapping

    this.textures.normal = this.resources.items.terrainNormalTexture
    this.textures.normal.repeat.set(1.5, 1.5)
    this.textures.normal.wrapS = THREE.RepeatWrapping
    this.textures.normal.wrapT = THREE.RepeatWrapping
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.default,
      normalMap: this.textures.normal
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.receiveShadow = true
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.y = -0.01
  }
}