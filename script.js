import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        // Text (Updated to "Rommel Buenavidez")
        const textGeometry = new TextGeometry(
            'Rommel Buenavidez',
            {
                font: font,
                size: 1,  // You can adjust the size as needed
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
        const donuts = []

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
            donuts.push(donut)
        }

        // Add GUI controls
        const params = {
            textRotationSpeed: 0.01,
            donutRotationSpeed: 0.02,
            textSize: 1
        }

        gui.add(params, 'textRotationSpeed', 0, 0.1)
        gui.add(params, 'donutRotationSpeed', 0, 0.1)
        gui.add(params, 'textSize', 0.1, 3).onChange(() => {
            // Update text size dynamically when slider is changed
            text.geometry.dispose()
            text.geometry = new TextGeometry(
                'Rommel Buenavidez',
                {
                    font: font,
                    size: params.textSize,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            )
            text.geometry.center()
        })

        // Spin effect for both text and donuts
        const tick = () => {
            const elapsedTime = clock.getElapsedTime()

            // Rotate text and donuts
            text.rotation.y += params.textRotationSpeed
            donuts.forEach(donut => {
                donut.rotation.x += params.donutRotationSpeed
                donut.rotation.y += params.donutRotationSpeed
            })

            // Update controls
            controls.update()

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        tick()
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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