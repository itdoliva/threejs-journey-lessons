import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

// GUI
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Objects
// Mesh Basic Material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// Mesh Normal Material
// const material = new THREE.MeshNormalMaterial()
// material.map = doorNormalTexture
// material.side = THREE.DoubleSide

// Mesh Matcap Material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
// material.side = THREE.DoubleSide

// Mesh Lambert Material
// const material = new THREE.MeshLambertMaterial()

// Mesh Phong Material
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188dd)

// Mesh Depth Material
// const material = new THREE.MeshDepthMaterial()

// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial()
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 1
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = .1
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.alphaMap = doorAlphaTexture
material.transparent = true

gui.add(material, 'roughness').min(0).max(1).step(.0001)
gui.add(material, 'metalness').min(0).max(1).step(.0001)


const sphereGeometry = new THREE.SphereGeometry(.5, 64, 64)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 128)
const torusGeometry = new THREE.TorusGeometry(.3, .2, 64, 128)

const sphere = new THREE.Mesh(sphereGeometry, material)
const plane = new THREE.Mesh(planeGeometry, material)
const torus = new THREE.Mesh(torusGeometry, material)

sphere.position.x = -1.5
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', environmentMap => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .1 * elapsedTime
    torus.rotation.y = .1 * elapsedTime
    plane.rotation.y = .1 * elapsedTime

    sphere.rotation.x = -.15 * elapsedTime
    torus.rotation.x = -.15 * elapsedTime
    plane.rotation.x = -.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()