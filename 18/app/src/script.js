import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {}
parameters.count = 10000
parameters.size = .01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = .02
parameters.randomnessPower = 5
parameters.innerColor = '#ff6030'
parameters.outerColor = '#1b3984'

let geometry = null
let material = null
let particles = null

function generateGalaxy() {
    if (particles !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }

    const angleGap = 2*Math.PI / parameters.branches

    const vertices = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInner = new THREE.Color(parameters.innerColor)
    const colorOuter = new THREE.Color(parameters.outerColor)


    for (let i = 0; i < parameters.count; i++) {
        const j = i*3

        const branch = Math.floor(Math.random() * parameters.branches)

        const radius = (Math.random()*1.5) * parameters.radius
        const radians = angleGap * branch
        const spinRadians = radius * parameters.spin

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness

        vertices[j    ] = Math.cos(radians+spinRadians) * radius + randomX
        vertices[j + 1] = randomY
        vertices[j + 2] =  Math.sin(radians+spinRadians) * radius + randomZ

        // Color
        const mixedColors = colorInner.clone()
        mixedColors.lerp(colorOuter, radius / parameters.radius)

        colors[j    ] = mixedColors.r
        colors[j + 1] = mixedColors.g
        colors[j + 2] = mixedColors.b
    }

    geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({ 
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })
    material.vertexColors = true

    particles = new THREE.Points(geometry, material)

    scene.add(particles)
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(1e6).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(.01).max(.1).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(.001).max(20).step(.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'innerColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outerColor').onFinishChange(generateGalaxy)


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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()