import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    // items: the loaded resources
    // toLoad: the number of sources to load (sources.length)
    // loaded: the number of loaded sources (starts at 0)

    // Setup
    this.sources = sources
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltf = new GLTFLoader()
    this.loaders.texture = new THREE.TextureLoader()
    this.loaders.cubeTexture = new THREE.CubeTextureLoader()
  }

  startLoading() {
    for (const source of this.sources) {
      const loader = this.loaders[source.type]
      this.load(loader, source)
    }
  }

  load(loader, source) {
    loader.load(
      source.path,
      // On success
      (file) => {
        this.onSuccess(source.name, file)
      },
      // On progress
      () => {},
      (error) => {
        throw new Error(`Error loading ${source.name}: ${error.message}`)
      }
    )
  }

  onSuccess(sourceName, file) {
    this.items[sourceName] = file
    this.loaded++

    if (this.loaded === this.toLoad) {
      this.trigger('loaded')
    }
  }

}