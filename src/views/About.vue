<template>
  <div class="about">
    <h1>关于</h1>
    <p>这是一个使用 Vue 3 + Vite 构建的现代 Web 应用。</p>
    <div class="info">
      <p><strong>版本:</strong> 1.0.0</p>
      <p><strong>框架:</strong> Vue 3</p>
      <p><strong>构建工具:</strong> Vite</p>
    </div>
    <button @click="goBack" class="btn">返回首页</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.about {
  padding: 40px;
  text-align: center;
}
h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  margin: 30px auto;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.info p {
  padding: 0.5rem 0;
  color: #555;
}
.btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn:hover {
  background: #3aa876;
}
</style>