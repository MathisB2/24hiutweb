<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup-content">
      <button class="close-btn" @click="close">×</button>
      <h2>{{ title }}</h2>

      <div class="media-gallery">
        <img :src="photo" alt="photo" />
      </div>

      <p class="description">{{ description }}</p>

      <div v-if="videoUrl" class="video-container">
        <video controls :src="videoUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import { buildings } from '../data/buildings.js'

export default {
  name: 'InfoPopup',
  props: {
    id: Number
  },
  emits: ['close'],
  computed: {
    title() {
      // Convert id to string to match buildings data
      const building = buildings.find(b => b.id === String(this.id))
      return building ? building.name : 'Bâtiment inconnu'
    },
    description() {
      const building = buildings.find(b => b.id === String(this.id))
      return building ? building.desc : 'Aucune description disponible.'
    },
    photo() {
      const building = buildings.find(b => b.id === String(this.id))
      return building ? building.photo : []
    },
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.popup-content {
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%);
  border-radius: 30px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 40px 0 rgba(255, 215, 0, 0.25), 0 0 80px 0 rgba(0,0,0,0.7);
  padding: 40px 30px 30px 30px;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-align: center;
  scrollbar-width: thin;
  scrollbar-color: #ffd700 #222;
}

.popup-content::-webkit-scrollbar {
  width: 8px;
}
.popup-content::-webkit-scrollbar-thumb {
  background: #ffd70099;
  border-radius: 8px;
}
.popup-content::-webkit-scrollbar-track {
  background: #222;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 22px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #222;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.7em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px #ffd70080;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 10;
}
.close-btn:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 0 30px #ffd700cc;
}

.popup-content h2 {
  font-size: 2.2rem;
  margin-bottom: 25px;
  color: #ffd700;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700, #ffb347);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease-in-out infinite;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.media-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 18px;
}

.media-gallery img {
  width: 100%;
  max-width: 500px;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  border-radius: 16px;
  border: 2px solid #ffd70040;
  box-shadow: 0 0 12px #ffd70033;
  background: #222;
  transition: transform 0.2s, box-shadow 0.2s;
}
.media-gallery img:hover {
  transform: scale(1.07);
  box-shadow: 0 0 24px #ffd70099;
}

.description {
  margin-bottom: 18px;
  font-size: 1.15rem;
  color: #fffbe7;
  opacity: 0.92;
  line-height: 1.7;
  text-shadow: 0 0 10px #ffd70022;
}

.video-container {
  margin-top: 18px;
}
.video-container video {
  width: 100%;
  border-radius: 16px;
  border: 2px solid #ffd70040;
  box-shadow: 0 0 18px #ffd70033;
  background: #111;
}

@media (max-width: 600px) {
  .popup-content {
    padding: 18px 6px 18px 6px;
    border-radius: 18px;
    max-width: 98vw;
    max-height: 95vh;
  }
  .media-gallery img {
    width: 100%;
    max-width: 80vw;
    height: auto;
    max-height: 160px;
    border-radius: 10px;
  }
  .popup-content h2 {
    font-size: 1.3rem;
  }
}
</style>