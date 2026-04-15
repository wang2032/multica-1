<template>
  <div class="statistics">
    <h1 class="page-title">数据统计</h1>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon"><span>📊</span></div>
        <div class="stat-info">
          <span class="stat-value">¥{{ formatNumber(yearIncome) }}</span>
          <span class="stat-label">年度总收入</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon expense"><span>📉</span></div>
        <div class="stat-info">
          <span class="stat-value">¥{{ formatNumber(yearExpense) }}</span>
          <span class="stat-label">年度总支出</span>
        </div>
      </div>
      <div class="stat-card highlight">
        <div class="stat-icon"><span>💹</span></div>
        <div class="stat-info">
          <span class="stat-value" :class="yearNet >= 0 ? 'income' : 'expense'">
            {{ yearNet >= 0 ? '+' : '' }}¥{{ formatNumber(yearNet) }}
          </span>
          <span class="stat-label">年度净收益</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span>📅</span></div>
        <div class="stat-info">
          <span class="stat-value">{{ avgDaily }}</span>
          <span class="stat-label">日均消费</span>
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card full">
        <h3>月度支出趋势</h3>
        <div class="line-chart">
          <div class="chart-grid">
            <div v-for="i in 5" :key="i" class="grid-line"></div>
          </div>
          <svg viewBox="0 0 400 150" class="chart-svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#lineGradient)" />
            <path :d="linePath" fill="none" stroke="#667eea" stroke-width="3" stroke-linecap="round" />
            <circle v-for="(point, index) in chartPoints" :key="index" :cx="point.x" :cy="point.y" r="5"
              fill="#667eea" class="chart-point" />
          </svg>
          <div class="chart-x-axis">
            <span v-for="month in months" :key="month">{{ month }}</span>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>收入来源分布</h3>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <svg viewBox="0 0 100 100">
              <circle v-for="(segment, index) in incomeSegments" :key="index" cx="50" cy="50" r="35"
                fill="none" :stroke="segment.color" stroke-width="20"
                :stroke-dasharray="segment.dashArray" :stroke-dashoffset="segment.offset"
                :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }" />
            </svg>
            <div class="pie-center">
              <span class="pie-value">¥{{ formatNumber(yearIncome) }}</span>
              <span class="pie-label">总收入</span>
            </div>
          </div>
          <div class="pie-legend">
            <div v-for="item in incomeBreakdown" :key="item.name" class="legend-item">
              <span class="legend-color" :style="{ background: item.color }"></span>
              <span class="legend-name">{{ item.name }}</span>
              <span class="legend-value">¥{{ formatNumber(item.value) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>支出类别排名</h3>
        <div class="rank-list">
          <div v-for="(item, index) in expenseRank" :key="item.name" class="rank-item">
            <span class="rank-number" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <div class="rank-bar-container">
              <div class="rank-bar" :style="{ width: item.percent + '%', background: item.color }"></div>
            </div>
            <span class="rank-value">¥{{ formatNumber(item.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="insights-section">
      <h3>💡 财务洞察</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h4>消费趋势</h4>
            <p>相比上月，您的支出下降了 <strong>12.5%</strong>，继续保持良好势头。</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">⚠️</div>
          <div class="insight-content">
            <h4>注意</h4>
            <p>餐饮支出已超过预算的 <strong>85%</strong>，建议适当控制。</p>
          </div>
        </div>
        <div class="insight-card positive">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>建议</h4>
            <p>您的储蓄率达到 <strong>35%</strong>，已超过平均水平，继续保持！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const months = ['1月', '2月', '3月', '4月', '5月', '6月']

const monthlyExpense = ref([8500, 9200, 7800, 6800, 7500, 6200])
const monthlyIncome = ref([18000, 15000, 20000, 17000, 19000, 21000])

const yearIncome = computed(() => monthlyIncome.value.reduce((a, b) => a + b, 0))
const yearExpense = computed(() => monthlyExpense.value.reduce((a, b) => a + b, 0))
const yearNet = computed(() => yearIncome.value - yearExpense.value)
const avgDaily = computed(() => '¥' + (yearExpense.value / 120).toFixed(0))

const maxExpense = computed(() => Math.max(...monthlyExpense.value, 1))

const chartPoints = computed(() => {
  const spacing = 400 / (months.length - 1)
  return monthlyExpense.value.map((val, i) => ({
    x: i * spacing,
    y: 140 - (val / maxExpense.value * 130)
  }))
})

const linePath = computed(() => {
  const points = chartPoints.value
  return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
})

const areaPath = computed(() => {
  const points = chartPoints.value
  const linePart = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  return linePart + ` L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`
})

const incomeBreakdown = ref([
  { name: '工资', value: 72000, percent: 75, color: '#4CAF50' },
  { name: '兼职', value: 14400, percent: 15, color: '#2196F3' },
  { name: '投资', value: 9600, percent: 10, color: '#FF9800' },
])

const incomeSegments = computed(() => {
  let offset = 0
  return incomeBreakdown.value.map(item => {
    const dashArray = (item.percent / 100 * 219.9).toFixed(2) + ' 219.9'
    const segment = { ...item, dashArray, offset: -offset.toFixed(2) }
    offset += item.percent / 100 * 219.9
    return segment
  })
})

const expenseRank = ref([
  { name: '居住', value: 18000, percent: 35, color: '#667eea' },
  { name: '餐饮', value: 12000, percent: 23, color: '#FF6B6B' },
  { name: '购物', value: 8500, percent: 16, color: '#4ECDC4' },
  { name: '交通', value: 5000, percent: 10, color: '#45B7D1' },
  { name: '娱乐', value: 4200, percent: 8, color: '#96CEB4' },
  { name: '其他', value: 3700, percent: 8, color: '#DDA0DD' },
])

const formatNumber = (num) => Math.abs(num).toLocaleString('zh-CN')
</script>

<style scoped>
.statistics { padding: 20px; }
.page-title { font-size: 1.8rem; color: #1a1a2e; margin-bottom: 24px; }
.stats-overview {
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
}
.stat-card.highlight { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.stat-icon.expense { background: #FFEBEE; }
.stat-card.highlight .stat-icon { background: rgba(255,255,255,0.2); }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.4rem; font-weight: 700; }
.stat-value.income { color: #4CAF50; }
.stat-value.expense { color: #F44336; }
.stat-label { font-size: 0.85rem; opacity: 0.7; }
.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.chart-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.chart-card.full { grid-column: 1 / -1; }
.chart-card h3 { font-size: 1rem; color: #1a1a2e; margin-bottom: 16px; }
.line-chart { position: relative; }
.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.grid-line { border-bottom: 1px dashed #f0f0f0; }
.chart-svg { width: 100%; height: 150px; }
.chart-point { transition: r 0.2s; }
.chart-point:hover { r: 7; }
.chart-x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
  color: #999;
}
.pie-chart-container { display: flex; align-items: center; gap: 30px; }
.pie-chart { position: relative; width: 140px; height: 140px; }
.pie-chart svg { width: 100%; height: 100%; }
.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.pie-value { display: block; font-size: 1rem; font-weight: 700; color: #333; }
.pie-label { font-size: 0.75rem; color: #999; }
.pie-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
.legend-color { width: 10px; height: 10px; border-radius: 50%; }
.legend-name { flex: 1; }
.rank-list { display: flex; flex-direction: column; gap: 12px; }
.rank-item { display: flex; align-items: center; gap: 12px; }
.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
}
.rank-number.top { background: #667eea; color: white; }
.rank-name { width: 50px; font-size: 0.85rem; }
.rank-bar-container { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
.rank-bar { height: 100%; border-radius: 4px; transition: width 0.3s; }
.rank-value { font-size: 0.85rem; font-weight: 600; width: 70px; text-align: right; }
.insights-section { margin-top: 24px; }
.insights-section h3 { font-size: 1.1rem; color: #1a1a2e; margin-bottom: 16px; }
.insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.insight-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.insight-card.positive { border-left: 4px solid #4CAF50; }
.insight-icon { font-size: 24px; }
.insight-content h4 { font-size: 0.95rem; color: #333; margin-bottom: 8px; }
.insight-content p { font-size: 0.85rem; color: #666; line-height: 1.5; }
.insight-content strong { color: #667eea; }
@media (max-width: 1024px) {
  .stats-overview { grid-template-columns: repeat(2, 1fr); }
  .charts-container { grid-template-columns: 1fr; }
  .insights-grid { grid-template-columns: 1fr; }
}
</style>