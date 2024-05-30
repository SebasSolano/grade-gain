<script setup>
import { ref, onMounted } from 'vue';

const shapes = ref([]);

const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
const randomSize = () => `${Math.floor(Math.random() * 100) + 200}px`;
const randomPosition = () => `${Math.floor(Math.random() * 100)}%`;
const randomShapeType = () => {
  const types = ['circle', 'triangle', 'square'];
  return types[Math.floor(Math.random() * types.length)];
};

const createShape = () => {
  const type = randomShapeType();
  const size = randomSize();
  return {
    type,
    color: randomColor(),
    size,
    width: type === 'triangle' ? '0' : size,
    height: type === 'triangle' ? '0' : size,
    top: randomPosition(),
    left: randomPosition(),
    animationDelay: `${Math.random() * 2}s` // Delay para la animación de aparición
  };
};

onMounted(() => {
  const numberOfShapes = 10; // Ajusta este número para más o menos figuras
  for (let i = 0; i < numberOfShapes; i++) {
    shapes.value.push(createShape());
  }
});
</script>

<template>
  <main class="flex-1 p-8 bg-white rounded-xl mt-6 mr-3 mb-6 overflow-hidden">
  <div class="shapes-container">
    <div
      v-for="(shape, index) in shapes"
      :key="index"
      :style="shapeStyle(shape)"
      class="shape"
    ></div>
  </div>
</main>
</template>

<script>
const shapeStyle = (shape) => {
  const baseStyle = {
    backgroundColor: shape.color,
    position: 'absolute',
    top: shape.top,
    left: shape.left,
    animationDelay: shape.animationDelay // Usar el delay generado
  };

  switch (shape.type) {
    case 'circle':
      return { ...baseStyle, width: shape.size, height: shape.size, borderRadius: '50%' };
    case 'triangle':
      return { ...baseStyle, width: '0', height: '0', borderBottom: `${shape.size} solid ${shape.color}`, borderLeft: `${parseInt(shape.size)/2}px solid transparent`, borderRight: `${parseInt(shape.size)/2}px solid transparent` };
    case 'square':
      return { ...baseStyle, width: shape.size, height: shape.size };
    default:
      return baseStyle;
  }
};
</script>

<style scoped>
.shapes-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  animation: fadeIn 2s ease-out, rotate 10s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>