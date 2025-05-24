<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import * as THREE from "three";
import {EffectComposer, GLTFLoader, OrbitControls, RenderPass, UnrealBloomPass} from "three/addons";
import {buildings} from "../data/buildings.js";


const container = ref(null)

let renderer, scene, camera, controls, animationId

onMounted(() => {



  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hoveredObject = null
  let originalMaterial = null
  const selectableObjects = [];

  window.addEventListener('mousemove', (event) => {
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  })


  window.addEventListener('click', (event) => {
  if(!hoveredObject) return

    for (const building of buildings) {
      if(building.id === hoveredObject.name) {
        console.log(building.name)
      }
    }
  })



  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff99,
    emissive: 0xffff66,
    emissiveIntensity: 1,
    metalness: 0,
    roughness: 0
  })

  const importantMaterial = new THREE.MeshStandardMaterial({
    color: 0xff7729,
    emissive: 0xff7729,
    emissiveIntensity: 1,
    metalness: 0,
    roughness: 0
  })

  const defautlMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.5,
    roughness: 0.5
  })





  // === Scene setup ===
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x202020)

  const planeGeometry = new THREE.PlaneGeometry(1000, 1000).rotateX(- Math.PI / 2)
  scene.add(new THREE.Mesh(planeGeometry, defautlMaterial))

  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 4000)
  camera.position.set(10, 15, 30)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)


  const renderScene = new RenderPass(scene, camera)

  const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6 , // strength
      1, // radius
      0.85 // threshold
  )

  const composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)



  // === Lights ===
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
  scene.add(light)

  // === OrbitControls ===
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true


  // === GLTF Model ===
  const loader = new GLTFLoader()
  loader.load('/files/lyon_buildings.glb', gltf => {
    scene.add(gltf.scene)
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        selectableObjects.push(child)
        child.material = defautlMaterial
        for (const building of buildings) {
          if(building.id === child.name) {
            child.material = importantMaterial
          }
        }
      }
    })
  })


  // === Handle resize ===
  window.addEventListener('resize', onWindowResize)

  function onWindowResize() {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }

  // === Animation loop ===
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(selectableObjects, true)

    if (intersects.length > 0) {
      const object = intersects[0].object

      if (hoveredObject !== object) {
        // Reset previous
        if (hoveredObject && originalMaterial) {
          hoveredObject.material = originalMaterial
        }

        // Apply highlight
        hoveredObject = object
        originalMaterial = object.material
        object.material = highlightMaterial
      }
    } else {
      if (hoveredObject && originalMaterial) {
        hoveredObject.material = originalMaterial
      }
      hoveredObject = null
      originalMaterial = null
    }

    controls.update()
    composer.render(scene, camera)
  }

  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  controls.dispose()
  renderer.dispose()
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>