<template>
  <div class="dashboard">
    <h1 class="page-title">财务概览</h1>

    <div class="stats-grid">
      <div class="stat-card income">
        <div class="stat-icon">↑</div>
        <div class="stat-info">
          <span class="stat-label">本月收入</span>
          <span class="stat-value">¥{{ formatNumber(totalIncome) }}</span>
        </div>
      </div>
      <div class="stat-card expense">
        <div class="stat-icon">↓</div>
        <div class="stat-info">
          <span class="stat-label">本月支出</span>
          <span class="stat-value">¥{{ formatNumber(totalExpense) }}</span>
        </div>
      </div>
      <div class="stat-card balance">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="stat-label">账户余额</span>
          <span class="stat-value">¥{{ formatNumber(balance) }}</span>
        </div>
      </div>
      <div class="stat-card count">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <span class="stat-label">交易笔数</span>
          <span class="stat-value">{{ transactionCount }}</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <h3>收支趋势</h3>
        <div class="simple-chart">
          <div v-for="(item, index) in chartData" :key="index" class="chart-bar-group">
            <div class="chart-bar income" :style="{ height: (item.income / maxChartValue * 100) + '%' }"></div>
            <div class="chart-bar expense" :style="{ height: (item.expense / maxChartValue * 100) + '%' }"></div>
            <span class="chart-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="dot income"></span> 收入</span>
          <span class="legend-item"><span class="dot expense"></span> 支出</span>
        </div>
      </div>
      <div class="chart-card">
        <h3>支出分类</h3>
        <div class="category-list">
          <div v-for="cat in categoryData" :key="cat.name" class="category-item">
            <div class="category-info">
              <span class="category-dot" :style="{ background: cat.color }"></span>
              <span class="category-name">{{ cat.name }}</span>
            </div>
            <div class="category-bar-container">
              <div class="category-bar" :style="{ width: cat.percent + '%', background: cat.color }"></div>
            </div>
            <span class="category-amount">¥{{ formatNumber(cat.amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <div class="section-header">
        <h3>最近交易</h3>
        <router-link to="/finance/transactions" class="view-all">查看全部</router-link>
      </div>
      <div class="transaction-list">
        <div v-for="item in recentTransactions" :key="item.id" class="transaction-item">
          <div class="transaction-icon" :class="item.type">
            {{ item.type === 'income' ? '↑' : '↓' }}
          </div>
          <div class="transaction-info">
            <span class="transaction-title">{{ item.title }}</span>
            <span class="transaction-date">{{ item.date }}</span>
          </div>
          <div class="transaction-amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-' }}¥{{ formatNumber(item.amount) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const transactions = ref([
  { id: 1, type: 'income', title: '工资收入', amount: 15000, date: '2026-04-01', category: 'salary' },
  { id: 2, type: 'expense', title: '房租', amount: 3000, date: '2026-04-02', category: 'housing' },
  { id: 3, type: 'expense', title: '餐饮', amount: 856, date: '2026-04-03', category: 'food' },
  { id: 4, type: 'expense', title: '交通', amount: 320, date: '2026-04-05', category: 'transport' },
  { id: 5, type: 'income', title: '兼职', amount: 2000, date: '2026-04-06', category: 'freelance' },
  { id: 6, type: 'expense', title: '购物', amount: 1250, date: '2026-04-08', category: 'shopping' },
  { id: 7, type: 'expense', title: '水电费', amount: 280, date: '2026-04-10', category: 'utilities' },
])

const totalIncome = computed(() =>
  transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
)

const totalExpense = computed(() =>
  transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
)

const balance = computed(() => totalIncome.value - totalExpense.value)
const transactionCount = computed(() => transactions.value.length)

const recentTransactions = computed(() =>
  [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
)

const chartData = ref([
  { label: '周一', income: 0, expense: 450 },
  { label: '周二', income: 5000, expense: 300 },
  { label: '周三', income: 0, expense: 600 },
  { label: '周四', income: 10000, expense: 200 },
  { label: '周五', income: 0, expense: 800 },
  { label: '周六', income: 2000, expense: 1500 },
  { label: '周日', income: 0, expense: 700 },
])

const maxChartValue = computed(() =>
  Math.max(...chartData.value.map(d => Math.max(d.income, d.expense)), 1)
)

const categoryData = ref([
  { name: '餐饮', amount: 856, percent: 28, color: '#FF6B6B' },
  { name: '购物', amount: 1250, percent: 41, color: '#4ECDC4' },
  { name: '交通', amount: 320, percent: 10, color: '#45B7D1' },
  { name: '娱乐', amount: 280, percent: 9, color: '#96CEB4' },
  { name: '其他', amount: 350, percent: 12, color: '#DDA0DD' },
])

const formatNumber = (num) => num.toLocaleString('zh-CN')
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.page-title {
  font-size: 1.8rem;
  color: #1a1a2e;
  margin-bottom: 24px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.stat-card.income .stat-icon { background: #E8F5E9; }
.stat-card.expense .stat-icon { background: #FFEBEE; }
.stat-card.balance .stat-icon { background: #E3F2FD; }
.stat-card.count .stat-icon { background: #FFF8E1; }
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-label {
  font-size: 0.85rem;
  color: #666;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}
.charts-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.chart-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.chart-card h3 {
  font-size: 1rem;
  color: #1a1a2e;
  margin-bottom: 16px;
}
.simple-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  padding: 0 10px;
}
.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.chart-bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}
.chart-bar.income { background: linear-gradient(180deg, #4CAF50, #81C784); }
.chart-bar.expense { background: linear-gradient(180deg, #F44336, #E57373); }
.chart-label {
  font-size: 0.7rem;
  color: #999;
}
.chart-legend {
  display: flex;
  gap: 20px;
  margin-top: 12px;
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #666;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.income { background: #4CAF50; }
.dot.expense { background: #F44336; }
.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 70px;
}
.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.category-name {
  font-size: 0.85rem;
  color: #333;
}
.category-bar-container {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.category-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}
.category-amount {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  width: 80px;
  text-align: right;
}
.recent-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-header h3 {
  font-size: 1rem;
  color: #1a1a2e;
}
.view-all {
  font-size: 0.85rem;
  color: #4CAF50;
  text-decoration: none;
}
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}
.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.transaction-icon.income { background: #E8F5E9; color: #4CAF50; }
.transaction-icon.expense { background: #FFEBEE; color: #F44336; }
.transaction-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.transaction-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}
.transaction-date {
  font-size: 0.75rem;
  color: #999;
}
.transaction-amount {
  font-size: 1rem;
  font-weight: 600;
}
.transaction-amount.income { color: #4CAF50; }
.transaction-amount.expense { color: #F44336; }
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>