<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      开始了你的 Vue 3 之旅！
    </p>
    <ul class="links">
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Vue 官方文档</a></li>
      <li><a href="https://vitejs.dev" target="_blank" rel="noopener">Vite 文档</a></li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  msg: String
})
</script>

<style scoped>
.hello {
  text-align: center;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.links {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}
.links li {
  margin: 0.5rem 0;
}
.links a {
  color: #ffffff;
  text-decoration: underline;
  transition: opacity 0.3s;
}
.links a:hover {
  opacity: 0.8;
}
</style>