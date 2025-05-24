<template>
  <div class="app ">
    <!-- Curseur personnalisé -->
    <div class="cursor" ref="cursor"></div>

    <!-- Particules de lumière -->
    <div class="particles" ref="particles"></div>

    <!-- Section Hero -->
    <section class="hero">
      <h1 ref="title">Lumières de Lyon</h1>
      <p>Explorez la ville de Lyon à travers ses lumières urbaines, cinématographiques et symboliques</p>
      <a href="#info" class="cta-button" @click="scrollToInfo">Commencer l'exploration</a>
      
      <div class="scroll-indicator">
        <span>Découvrez plus</span>
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Section informations -->
    <section class="info-section" id="info">
      <div class="info-container">
        <h2 class="info-title fade-in" :class="{ visible: isVisible.title }">Votre Exploration Interactive</h2>
        <p class="info-subtitle fade-in" :class="{ visible: isVisible.subtitle }">
          Plongez dans une expérience immersive qui révèle les secrets lumineux de Lyon à travers une carte interactive innovante.
        </p>

        <div class="map-preview fade-in" :class="{ visible: isVisible.mapPreview }">
          <h3>🗺️ Carte Interactive des Lumières</h3>
          <p>Naviguez librement dans Lyon et découvrez les points d'intérêt lumineux en temps réel. Chaque zone révèle ses propres histoires et secrets.</p>
          <div class="map-features">
            <div class="map-feature">Navigation intuitive</div>
            <div class="map-feature">Points d'intérêt géolocalisés</div>
            <div class="map-feature">Contenu multimédia</div>
            <div class="map-feature">Parcours thématiques</div>
          </div>
          <br>
          <br>
          <br>
          <div>
            <router-link to="/map" class="map-link">
                <a class="map-button" >Aller à la carte</a>
            </router-link>
          </div>
        </div>

        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card fade-in" 
            :class="{ visible: isVisible.features[index], pulse: feature.isPulsing }"
            @mouseenter="onCardHover"
            @mouseleave="onCardLeave"
          >
            <span class="feature-icon">{{ feature.icon }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LyonLumieres',
  data() {
    return {
      isVisible: {
        title: false,
        subtitle: false,
        mapPreview: false,
        features: [false, false, false, false, false, false]
      },
      features: [
        {
          icon: '🌃',
          title: 'Lumières Urbaines',
          description: 'Explorez les installations de la Fête des Lumières, l\'éclairage architectural emblématique et les parcours nocturnes secrets de la ville.',
          isPulsing: false
        },
        {
          icon: '🎬',
          title: 'Patrimoine Cinématographique',
          description: 'Revivez l\'histoire des frères Lumière, découvrez les lieux de tournage mythiques et explorez l\'héritage du cinéma lyonnais.',
          isPulsing: false
        },
        {
          icon: '💡',
          title: 'Lumières Symboliques',
          description: 'Comprenez Lyon comme symbole de connaissance, d\'innovation et de transmission culturelle à travers les siècles.',
          isPulsing: false
        },
        {
          icon: '🎯',
          title: 'Expériences Immersives',
          description: 'Participez à des reconstitutions historiques, des visites virtuelles et des expériences sensorielles uniques.',
          isPulsing: false
        },
        {
          icon: '📱',
          title: 'Réalité Augmentée',
          description: 'Utilisez votre smartphone pour révéler des éléments cachés et vivre des expériences augmentées dans la ville.',
          isPulsing: false
        },
        {
          icon: '🎵',
          title: 'Ambiances Sonores',
          description: 'Écoutez les sons de la ville, les témoignages historiques et les créations musicales inspirées par Lyon.',
          isPulsing: false
        }
      ]
    }
  },
  mounted() {
    this.initializeApp();
  },
  methods: {
    initializeApp() {
      this.createParticles();
      this.setupCursor();
      this.setupScrollEffects();
      this.startTypeWriter();
      this.startRandomPulse();
    },
    
    createParticles() {
      const particlesContainer = this.$refs.particles;
      const particleCount = 60;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        particlesContainer.appendChild(particle);
      }
    },

    setupCursor() {
      document.addEventListener('mousemove', (e) => {
        this.$refs.cursor.style.left = e.clientX + 'px';
        this.$refs.cursor.style.top = e.clientY + 'px';
      });
    },

    setupScrollEffects() {
      // Animation d'apparition au scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.classList.contains('info-title')) {
              this.isVisible.title = true;
            } else if (element.classList.contains('info-subtitle')) {
              this.isVisible.subtitle = true;
            } else if (element.classList.contains('map-preview')) {
              this.isVisible.mapPreview = true;
            } else if (element.classList.contains('feature-card')) {
              const index = Array.from(element.parentNode.children).indexOf(element);
              this.$set(this.isVisible.features, index, true);
            }
          }
        });
      }, { threshold: 0.1 });

      // Observer les éléments après le prochain tick
      this.$nextTick(() => {
        document.querySelectorAll('.fade-in').forEach(element => {
          observer.observe(element);
        });
      });

      // Effet de parallaxe sur les particules
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
          const speed = (index % 3 + 1) * 0.5;
          particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
      });
    },

    scrollToInfo(e) {
      e.preventDefault();
      const target = document.querySelector('#info');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    },

    startTypeWriter() {
      setTimeout(() => {
        const title = this.$refs.title;
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
          title.textContent += text.charAt(i);
          i++;
          if (i > text.length) {
            clearInterval(timer);
          }
        }, 150);
      }, 800);
    },

    startRandomPulse() {
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.features.length);
        this.$set(this.features[randomIndex], 'isPulsing', true);
        setTimeout(() => {
          this.$set(this.features[randomIndex], 'isPulsing', false);
        }, 3000);
      }, 4000);
    },

    onCardHover() {
      this.$refs.cursor.style.transform = 'scale(2)';
      this.$refs.cursor.style.background = 'radial-gradient(circle, #ffed4e, transparent)';
    },

    onCardLeave() {
      this.$refs.cursor.style.transform = 'scale(1)';
      this.$refs.cursor.style.background = 'radial-gradient(circle, #ffd700, transparent)';
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: 'Arial', sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
  cursor: none;
}

/* Curseur personnalisé */
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #ffd700, transparent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
}

/* Particules de lumière en arrière-plan */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffd700;
  border-radius: 50%;
  animation: float 8s infinite ease-in-out;
  box-shadow: 0 0 10px #ffd700;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
    opacity: 0; 
  }
  25% { 
    transform: translateY(-50px) translateX(30px) rotate(90deg); 
    opacity: 0.7; 
  }
  50% { 
    transform: translateY(-100px) translateX(-20px) rotate(180deg); 
    opacity: 1; 
  }
  75% { 
    transform: translateY(-150px) translateX(40px) rotate(270deg); 
    opacity: 0.7; 
  }
}

/* Section d'accueil principale */
.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
}

.hero h1 {
  font-size: 5rem;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700, #ffb347);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s ease-in-out infinite;
  text-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
  font-weight: bold;
  letter-spacing: 2px;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero p {
  font-size: 1.4rem;
  margin-bottom: 50px;
  opacity: 0.9;
  max-width: 700px;
  line-height: 1.8;
  font-weight: 300;
}

.cta-button {
  padding: 20px 50px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #000;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 50px rgba(255, 215, 0, 0.6);
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.cta-button:hover::before {
  left: 100%;
}
.map-button {
  margin-top: 30px;
  padding: 20px 50px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #000;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}





/* Indicateur de scroll */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
}

.scroll-indicator span {
  font-size: 0.9rem;
  margin-bottom: 10px;
  opacity: 0.7;
}

.scroll-arrow {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, #ffd700, transparent);
  position: relative;
}

.scroll-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -3px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #ffd700;
  border-bottom: 2px solid #ffd700;
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

/* Section informations */
.info-section {
  min-height: 100vh;
  padding: 100px 50px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%);
  position: relative;
  z-index: 2;
}

.info-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.info-title {
  font-size: 3rem;
  margin-bottom: 30px;
  color: #ffd700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.info-subtitle {
  font-size: 1.3rem;
  margin-bottom: 60px;
  opacity: 0.8;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px 30px;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 215, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 25px 50px rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 25px;
  display: block;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #ffd700;
}

.feature-card p {
  line-height: 1.7;
  opacity: 0.9;
  font-size: 1rem;
}

/* Map preview */
.map-preview {
  margin: 80px 0;
  padding: 60px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 30px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  position: relative;
}

.map-preview h3 {
  font-size: 2.2rem;
  margin-bottom: 25px;
  color: #ffd700;
  text-align: center;
}

.map-preview p {
  font-size: 1.2rem;
  line-height: 1.8;
  text-align: center;
  opacity: 0.9;
}

.map-features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.map-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  opacity: 0.8;
}

.map-feature::before {
  content: '✨';
  font-size: 1.2rem;
}

/* Animation d'apparition */
.fade-in {
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Effet de pulsation sur les éléments lumineux */
.pulse {
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }
  
  .hero p {
    font-size: 1.1rem;
    padding: 0 20px;
  }
  
  .info-section {
    padding: 50px 20px;
  }
  
  .info-title {
    font-size: 2.2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .map-preview {
    margin: 40px 0;
    padding: 40px 20px;
  }
  
  .map-features {
    flex-direction: column;
    align-items: center;
  }
}
</style>