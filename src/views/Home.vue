<template>
  <div class="home">
    <h1>首页</h1>
    <p>欢迎来到 Vue 3 应用！</p>
    <div class="card">
      <h2>功能特点</h2>
      <ul>
        <li>Vue 3 组合式 API</li>
        <li>Vite 快速构建</li>
        <li>Vue Router 路由管理</li>
        <li>组件化开发</li>
      </ul>
    </div>
    <button @click="goAbout" class="btn">关于页面</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goAbout = () => {
  router.push('/about')
}
</script>

<style scoped>
.home {
  padding: 40px;
  text-align: center;
}
h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  margin: 30px auto;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}
.card ul {
  list-style: none;
  text-align: left;
}
.card li {
  padding: 0.5rem 0;
  color: #555;
}
.card li::before {
  content: "✓ ";
  color: #42b983;
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