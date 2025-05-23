import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const starTexture = textureLoader.load('/textures/particles/1.png')

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


// const particlesGeometry = new THREE.SphereGeometry(1, 10, 32)
const particlesGeometry = new THREE.BufferGeometry()

const count = 10000

const vertices = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count*3; i++) {
    const random = Math.random()
    vertices[i] = (random - .5) * 10
    colors[i] = random
}

particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(vertices, 3)
)

particlesGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)

const particlesMaterial = new THREE.PointsMaterial({ size: .1, sizeAttenuation: true })
particlesMaterial.alphaMap = starTexture
particlesMaterial.transparent = true
particlesMaterial.alphaTest = 0.001
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

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
camera.position.z = 3
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

    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        particlesGeometry.attributes.position.array[i3 + 1] = vertices[i3 + 1] + Math.sin(elapsedTime + vertices[i3])/100
        particlesGeometry.attributes.position.array[i3 + 2] = vertices[i3 + 2] + Math.cos(elapsedTime + vertices[i3])/50

    }

    particlesGeometry.attributes.position.needsUpdate = true

    particles.rotation.y = 2 * Math.PI * elapsedTime/40
    particles.rotation.x = 2 * Math.PI * elapsedTime/20

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()