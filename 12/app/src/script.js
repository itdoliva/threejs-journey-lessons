import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

let text

const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture

// Fonts
const fontLoader = new FontLoader()
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry(
        'Lave as maos. Cuidado com os germes!',
        {
            font: font,
            size: .5,
            depth: .2,
            curveSegments:12,
            bevelEnabled: true,
            bevelThickness: .03,
            bevelSize: .02,
            bevelOffset: 0,
            bevelSegments: 4
        }
    )

    textGeometry.center()

    text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
})

/**
 * Object
 */

const donutGeometry = new THREE.TorusGeometry(.3, .2, 20, 45)
for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.x = (Math.random() - .5) * 10
    donut.position.y = (Math.random() - .5) * 10
    donut.position.z = (Math.random() - .5) * 10

    donut.rotation.x = Math.random() * 2*Math.PI
    donut.rotation.y = Math.random() * 2*Math.PI

    const k = Math.random() *.7 + .3
    donut.scale.set(k, k, k)

    scene.add(donut)
}
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()