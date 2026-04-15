<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <img src="./assets/logo.svg" alt="Vue" class="logo">
        <span>财务管理系统</span>
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/finance">概览</router-link>
        <router-link to="/finance/transactions">交易</router-link>
        <router-link to="/finance/accounts">账户</router-link>
        <router-link to="/finance/budget">预算</router-link>
        <router-link to="/finance/reports">报表</router-link>
        <router-link to="/finance/statistics">统计</router-link>
        <router-link to="/about">关于</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f0f2f5;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1a1a2e;
  font-weight: bold;
  font-size: 1.2rem;
}
.nav-brand .logo {
  width: 40px;
}
.nav-links {
  display: flex;
  gap: 8px;
}
.nav-links a {
  color: #666;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.nav-links a:hover {
  background: #f5f5f5;
  color: #1a1a2e;
}
.nav-links a.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.main-content {
  padding: 0;
}
</style>