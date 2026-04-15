<template>
  <div class="reports">
    <h1 class="page-title">财务报表</h1>

    <div class="time-selector">
      <button v-for="period in periods" :key="period.value" class="period-btn"
        :class="{ active: selectedPeriod === period.value }" @click="selectedPeriod = period.value">
        {{ period.label }}
      </button>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon income"><span>↑</span></div>
        <div class="summary-info">
          <span class="summary-label">总收入</span>
          <span class="summary-value income">¥{{ formatNumber(totalIncome) }}</span>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon expense"><span>↓</span></div>
        <div class="summary-info">
          <span class="summary-label">总支出</span>
          <span class="summary-value expense">¥{{ formatNumber(totalExpense) }}</span>
        </div>
      </div>
      <div class="summary-card highlight">
        <div class="summary-icon net"><span>💵</span></div>
        <div class="summary-info">
          <span class="summary-label">净收益</span>
          <span class="summary-value" :class="netIncome >= 0 ? 'income' : 'expense'">
            {{ netIncome >= 0 ? '+' : '' }}¥{{ formatNumber(netIncome) }}
          </span>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container">
        <h3>月度收支对比</h3>
        <div class="bar-chart">
          <div v-for="(month, index) in monthlyData" :key="index" class="bar-group">
            <div class="bars">
              <div class="bar income" :style="{ height: (month.income / maxMonthlyValue * 120) + 'px' }">
                <span class="bar-value" v-if="month.income > 0">¥{{ formatShort(month.income) }}</span>
              </div>
              <div class="bar expense" :style="{ height: (month.expense / maxMonthlyValue * 120) + 'px' }">
                <span class="bar-value" v-if="month.expense > 0">¥{{ formatShort(month.expense) }}</span>
              </div>
            </div>
            <span class="bar-label">{{ month.name }}</span>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>支出构成分析</h3>
        <div class="donut-container">
          <div class="donut-chart">
            <svg viewBox="0 0 100 100">
              <circle v-for="(segment, index) in donutSegments" :key="index" cx="50" cy="50" r="40"
                fill="none" :stroke="segment.color" stroke-width="20"
                :stroke-dasharray="segment.dashArray" :stroke-dashoffset="segment.offset"
                :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }" />
            </svg>
            <div class="donut-center">
              <span class="donut-label">支出</span>
              <span class="donut-value">¥{{ formatNumber(totalExpense) }}</span>
            </div>
          </div>
          <div class="donut-legend">
            <div v-for="cat in expenseBreakdown" :key="cat.name" class="legend-item">
              <span class="legend-dot" :style="{ background: cat.color }"></span>
              <span class="legend-name">{{ cat.name }}</span>
              <span class="legend-percent">{{ cat.percent }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="export-section">
      <button class="btn-export">
        <span>📥</span> 导出报表
      </button>
      <button class="btn-export">
        <span>🖨️</span> 打印
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const periods = [
  { label: '本月', value: 'month' },
  { label: '本季', value: 'quarter' },
  { label: '本年', value: 'year' },
]
const selectedPeriod = ref('month')

const monthlyData = ref([
  { name: '1月', income: 18000, expense: 8500 },
  { name: '2月', income: 15000, expense: 9200 },
  { name: '3月', income: 20000, expense: 7800 },
  { name: '4月', income: 17000, expense: 6800 },
])

const maxMonthlyValue = computed(() =>
  Math.max(...monthlyData.value.flatMap(m => [m.income, m.expense]), 1)
)

const totalIncome = computed(() => monthlyData.value.reduce((sum, m) => sum + m.income, 0))
const totalExpense = computed(() => monthlyData.value.reduce((sum, m) => sum + m.expense, 0))
const netIncome = computed(() => totalIncome.value - totalExpense.value)

const expenseBreakdown = ref([
  { name: '餐饮', amount: 2800, percent: 32, color: '#FF6B6B' },
  { name: '购物', amount: 1800, percent: 21, color: '#4ECDC4' },
  { name: '交通', amount: 900, percent: 10, color: '#45B7D1' },
  { name: '娱乐', amount: 750, percent: 9, color: '#96CEB4' },
  { name: '居住', amount: 3000, percent: 34, color: '#DDA0DD' },
])

const donutSegments = computed(() => {
  let offset = 0
  return expenseBreakdown.value.map(cat => {
    const dashArray = (cat.percent / 100 * 251.2).toFixed(2) + ' 251.2'
    const segment = { ...cat, dashArray, offset: -offset.toFixed(2) }
    offset += cat.percent / 100 * 251.2
    return segment
  })
})

const formatNumber = (num) => Math.abs(num).toLocaleString('zh-CN')
const formatShort = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  return num.toString()
}
</script>

<style scoped>
.reports { padding: 20px; }
.page-title { font-size: 1.8rem; color: #1a1a2e; margin-bottom: 24px; }
.time-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 12px;
  width: fit-content;
}
.period-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}
.period-btn.active {
  background: white;
  color: #4CAF50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.summary-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.summary-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.summary-card.highlight .summary-label { color: rgba(255,255,255,0.8); }
.summary-card.highlight .summary-value { color: white; }
.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.summary-icon.income { background: #E8F5E9; }
.summary-icon.expense { background: #FFEBEE; }
.summary-icon.net { background: rgba(255,255,255,0.2); }
.summary-info { display: flex; flex-direction: column; }
.summary-label { font-size: 0.85rem; color: #666; }
.summary-value { font-size: 1.5rem; font-weight: 700; }
.summary-value.income { color: #4CAF50; }
.summary-value.expense { color: #F44336; }
.charts-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.chart-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.chart-container h3 {
  font-size: 1rem;
  color: #1a1a2e;
  margin-bottom: 20px;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 160px;
  padding-top: 20px;
}
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.bars {
  display: flex;
  gap: 6px;
  align-items: flex-end;
}
.bar {
  width: 28px;
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.3s;
}
.bar.income { background: linear-gradient(180deg, #4CAF50, #81C784); }
.bar.expense { background: linear-gradient(180deg, #F44336, #E57373); }
.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: #666;
  white-space: nowrap;
}
.bar-label { font-size: 0.8rem; color: #999; }
.donut-container {
  display: flex;
  align-items: center;
  gap: 30px;
}
.donut-chart {
  position: relative;
  width: 140px;
  height: 140px;
}
.donut-chart svg { width: 100%; height: 100%; }
.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.donut-label { display: block; font-size: 0.75rem; color: #999; }
.donut-value { font-size: 1rem; font-weight: 700; color: #333; }
.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-name { flex: 1; color: #333; }
.legend-percent { font-weight: 600; color: #666; }
.export-section {
  display: flex;
  gap: 12px;
}
.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.2s;
}
.btn-export:hover { border-color: #4CAF50; color: #4CAF50; }
@media (max-width: 1024px) {
  .summary-cards { grid-template-columns: 1fr; }
  .charts-section { grid-template-columns: 1fr; }
}
</style>