<template>
  <div class="budget">
    <div class="page-header">
      <h1 class="page-title">预算管理</h1>
      <button class="btn-primary" @click="showAddModal = true">+ 添加预算</button>
    </div>

    <div class="budget-summary">
      <div class="summary-item">
        <span class="summary-label">本月预算</span>
        <span class="summary-value">¥{{ formatNumber(totalBudget) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">已使用</span>
        <span class="summary-value used">¥{{ formatNumber(usedBudget) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">剩余可用</span>
        <span class="summary-value remaining">¥{{ formatNumber(remainingBudget) }}</span>
      </div>
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: budgetProgress + '%' }"
            :class="{ warning: budgetProgress > 80, danger: budgetProgress > 95 }"></div>
        </div>
        <span class="progress-text">{{ budgetProgress.toFixed(1) }}%</span>
      </div>
    </div>

    <div class="budget-grid">
      <div v-for="item in budgets" :key="item.id" class="budget-card">
        <div class="budget-header">
          <div class="category-badge" :style="{ background: item.color }">
            {{ item.icon }}
          </div>
          <div class="budget-info">
            <h3>{{ item.name }}</h3>
            <span class="budget-period">本月预算</span>
          </div>
          <button class="menu-btn" @click="editBudget(item)">✎</button>
        </div>
        <div class="budget-amounts">
          <div class="amount-row">
            <span>预算金额</span>
            <span class="amount">¥{{ formatNumber(item.budget) }}</span>
          </div>
          <div class="amount-row">
            <span>已消费</span>
            <span class="amount used">¥{{ formatNumber(item.spent) }}</span>
          </div>
          <div class="amount-row">
            <span>剩余</span>
            <span class="amount remaining" :class="{ negative: item.budget - item.spent < 0 }">
              ¥{{ formatNumber(item.budget - item.spent) }}
            </span>
          </div>
        </div>
        <div class="budget-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: Math.min((item.spent / item.budget) * 100, 100) + '%' }"
              :class="{ warning: (item.spent / item.budget) > 0.8, danger: (item.spent / item.budget) > 0.95 }"></div>
          </div>
          <span class="progress-percent">{{ ((item.spent / item.budget) * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingBudget ? '编辑预算' : '添加预算' }}</h2>
        <form @submit.prevent="saveBudget">
          <div class="form-group">
            <label>预算名称</label>
            <input type="text" v-model="formData.name" required placeholder="例如：餐饮预算" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>预算金额</label>
              <input type="number" v-model.number="formData.budget" required placeholder="0.00" step="0.01" />
            </div>
            <div class="form-group">
              <label>已消费</label>
              <input type="number" v-model.number="formData.spent" required placeholder="0.00" step="0.01" />
            </div>
          </div>
          <div class="form-group">
            <label>图标</label>
            <div class="icon-picker">
              <button type="button" v-for="icon in icons" :key="icon" class="icon-btn"
                :class="{ active: formData.icon === icon }" @click="formData.icon = icon">
                {{ icon }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>颜色</label>
            <div class="color-picker">
              <button type="button" v-for="color in colors" :key="color" class="color-btn"
                :class="{ active: formData.color === color }" :style="{ background: color }"
                @click="formData.color = color"></button>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">取消</button>
            <button type="submit" class="btn-submit">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const budgets = ref([
  { id: 1, name: '餐饮', icon: '🍜', budget: 2000, spent: 856, color: '#FF6B6B' },
  { id: 2, name: '购物', icon: '🛒', budget: 1500, spent: 1250, color: '#4ECDC4' },
  { id: 3, name: '交通', icon: '🚗', budget: 500, spent: 320, color: '#45B7D1' },
  { id: 4, name: '娱乐', icon: '🎮', budget: 800, spent: 120, color: '#96CEB4' },
  { id: 5, name: '居住', icon: '🏠', budget: 3000, spent: 3000, color: '#DDA0DD' },
  { id: 6, name: '医疗', icon: '💊', budget: 500, spent: 0, color: '#FFB6C1' },
])

const showAddModal = ref(false)
const editingBudget = ref(null)
const icons = ['🍜', '🛒', '🚗', '🎮', '🏠', '💊', '📱', '👔', '🎁', '📚']
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#FFB6C1', '#FFA500', '#9B59B6']

const formData = ref({
  name: '',
  budget: 0,
  spent: 0,
  icon: '🍜',
  color: '#FF6B6B'
})

const totalBudget = computed(() => budgets.value.reduce((sum, b) => sum + b.budget, 0))
const usedBudget = computed(() => budgets.value.reduce((sum, b) => sum + b.spent, 0))
const remainingBudget = computed(() => totalBudget.value - usedBudget.value)
const budgetProgress = computed(() => (usedBudget.value / totalBudget.value) * 100)

const formatNumber = (num) => num.toLocaleString('zh-CN', { minimumFractionDigits: 2 })

const editBudget = (budget) => {
  editingBudget.value = budget
  formData.value = { ...budget }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingBudget.value = null
  formData.value = { name: '', budget: 0, spent: 0, icon: '🍜', color: '#FF6B6B' }
}

const saveBudget = () => {
  if (editingBudget.value) {
    Object.assign(editingBudget.value, formData.value)
  } else {
    budgets.value.push({ id: Date.now(), ...formData.value })
  }
  closeModal()
}
</script>

<style scoped>
.budget { padding: 20px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 1.8rem; color: #1a1a2e; }
.btn-primary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}
.budget-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
  color: white;
}
.summary-item { display: flex; flex-direction: column; }
.summary-label { font-size: 0.85rem; opacity: 0.8; margin-bottom: 4px; }
.summary-value { font-size: 1.5rem; font-weight: 700; }
.summary-value.used { color: #FFB74D; }
.summary-value.remaining { color: #81C784; }
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex-basis: 100%;
}
.progress-section .progress-bar {
  flex: 1;
  height: 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 6px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #81C784;
  border-radius: 6px;
  transition: width 0.3s;
}
.progress-fill.warning { background: #FFB74D; }
.progress-fill.danger { background: #F44336; }
.progress-text { font-weight: 600; min-width: 50px; }
.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.budget-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.budget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.category-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.budget-info { flex: 1; }
.budget-info h3 { font-size: 1rem; color: #1a1a2e; margin-bottom: 2px; }
.budget-period { font-size: 0.8rem; color: #999; }
.menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
}
.budget-amounts {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}
.amount-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.9rem;
}
.amount { font-weight: 600; color: #333; }
.amount.used { color: #FF9800; }
.amount.remaining { color: #4CAF50; }
.amount.remaining.negative { color: #F44336; }
.budget-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}
.budget-progress .progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.budget-progress .progress-fill {
  height: 100%;
  background: #4CAF50;
  border-radius: 4px;
}
.budget-progress .progress-fill.warning { background: #FFB74D; }
.budget-progress .progress-fill.danger { background: #F44336; }
.progress-percent { font-size: 0.85rem; font-weight: 600; color: #666; }
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 480px;
  max-width: 90vw;
}
.modal h2 { margin-bottom: 24px; color: #1a1a2e; }
.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}
.form-group input:focus { border-color: #4CAF50; }
.icon-picker, .color-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.icon-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}
.icon-btn.active { border-color: #4CAF50; background: #E8F5E9; }
.color-btn {
  width: 36px;
  height: 36px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.color-btn.active { border-color: #333; transform: scale(1.1); }
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
.btn-cancel {
  padding: 12px 24px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}
.btn-submit {
  padding: 12px 24px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>