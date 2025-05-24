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
  // const torch = new THREE.PointLight(0xffffff, 1000, 100)
const torch = new THREE.SpotLight(0xffffff, 500, 200);
torch.angle = Math.PI;
const torchTarget = new THREE.Object3D();

torch.target = torchTarget;

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
    emissiveIntensity: 2,
    metalness: 0,
    roughness: 0
  })



  const lowHighlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff99,
    emissive: 0xffff66,
    emissiveIntensity: 0.4,
    metalness: 0,
    roughness: 0
  })

  const importantMaterial = new THREE.MeshStandardMaterial({
    color: 0xff7729,
    emissive: 0xff7729,
    emissiveIntensity: 7,
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

  const planeGeometry = new THREE.PlaneGeometry(10000, 10000).rotateX(- Math.PI / 2)
  const floor = new THREE.Mesh(planeGeometry, defautlMaterial)
  scene.add(floor)
  scene.add(torch);
  scene.add(torch.target)

  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 4000)
  camera.position.set(50, 170, 134)


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
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2)
  scene.add(light)

  // === OrbitControls ===
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  controls.target.set(110, 0, 15) // Remplacez par les coordonnées souhaitées
  controls.update()










  // Définis la zone dans laquelle placer les lucioles
  const fireflyZone = {
    minX: -400, maxX: 400,
    minY: 1, maxY: 20,
    minZ: -200, maxZ: 200
  }

// Matériau réutilisé avec glow
  const fireflyMaterial = new THREE.MeshStandardMaterial({
    emissive: new THREE.Color(0xffffcc),
    emissiveIntensity: 5,
    color: 0x000000,
    metalness: 0,
    roughness: 0.5
  })

// Liste des lucioles
  const fireflies = []

  const fireflyGeometry = new THREE.BoxGeometry(0.1,0.1) // petite sphère, peu de polygones

  for (let i = 0; i < 2000; i++) {
    const mesh = new THREE.Mesh(fireflyGeometry, fireflyMaterial.clone())

    mesh.position.set(
        THREE.MathUtils.randFloat(fireflyZone.minX, fireflyZone.maxX),
        THREE.MathUtils.randFloat(fireflyZone.minY, fireflyZone.maxY),
        THREE.MathUtils.randFloat(fireflyZone.minZ, fireflyZone.maxZ)
    )

    scene.add(mesh)
    fireflies.push(mesh)
  }










  // === GLTF Model ===
  const loader = new GLTFLoader()
  loader.load('/files/lyon_buildings.glb', gltf => {
    scene.add(gltf.scene)
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        selectableObjects.push(child)
        child.castShadow = true
        child.receiveShadow = true
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
    const torchIntersects = raycaster.intersectObjects([floor], true)
    if (torchIntersects.length > 0) {
      torch.position.copy(torchIntersects[0].point.setY(20))
      torchTarget.position.copy(torchIntersects[0].point.setY(0))
    }


    const intersects = raycaster.intersectObjects(selectableObjects, true)

    if (intersects.length > 0) {
      const object = intersects[0].object


      for (const building of buildings) {
        if(building.id === object.name) {
          return
        }
      }


      if (hoveredObject !== object) {
        // Applique le lowHighlightMaterial à l'ancien objet survolé
        if (hoveredObject) {
          hoveredObject.material = lowHighlightMaterial
        }
        // Applique le highlightMaterial au nouvel objet survolé
        hoveredObject = object
        originalMaterial = object.material
        object.material = highlightMaterial
      }
    } else {
      // Si aucun objet n'est survolé, applique le lowHighlightMaterial à l'ancien
      if (hoveredObject) {
        hoveredObject.material = lowHighlightMaterial
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