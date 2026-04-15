<template>
  <div class="transactions">
    <div class="page-header">
      <h1 class="page-title">交易记录</h1>
      <button class="btn-primary" @click="showAddModal = true">+ 添加交易</button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <select v-model="filterType" class="filter-select">
          <option value="all">全部类型</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
        <select v-model="filterCategory" class="filter-select">
          <option value="all">全部分类</option>
          <option value="salary">工资</option>
          <option value="freelance">兼职</option>
          <option value="housing">房租</option>
          <option value="food">餐饮</option>
          <option value="transport">交通</option>
          <option value="shopping">购物</option>
          <option value="entertainment">娱乐</option>
          <option value="utilities">水电费</option>
        </select>
      </div>
      <div class="search-box">
        <input type="text" v-model="searchKeyword" placeholder="搜索交易..." class="search-input" />
      </div>
    </div>

    <div class="transaction-table">
      <div class="table-header">
        <span class="col-type">类型</span>
        <span class="col-title">描述</span>
        <span class="col-category">分类</span>
        <span class="col-date">日期</span>
        <span class="col-amount">金额</span>
        <span class="col-action">操作</span>
      </div>
      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <p>暂无交易记录</p>
      </div>
      <div v-for="item in paginatedTransactions" :key="item.id" class="table-row">
        <span class="col-type">
          <span class="type-badge" :class="item.type">{{ item.type === 'income' ? '收入' : '支出' }}</span>
        </span>
        <span class="col-title">{{ item.title }}</span>
        <span class="col-category">
          <span class="category-tag">{{ getCategoryName(item.category) }}</span>
        </span>
        <span class="col-date">{{ item.date }}</span>
        <span class="col-amount" :class="item.type">
          {{ item.type === 'income' ? '+' : '-' }}¥{{ formatNumber(item.amount) }}
        </span>
        <span class="col-action">
          <button class="action-btn delete" @click="deleteTransaction(item.id)">删除</button>
        </span>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
    </div>

    <!-- 添加交易弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h2>添加交易</h2>
        <form @submit.prevent="addTransaction">
          <div class="form-group">
            <label>类型</label>
            <div class="type-toggle">
              <button type="button" :class="{ active: newTransaction.type === 'income' }" @click="newTransaction.type = 'income'">收入</button>
              <button type="button" :class="{ active: newTransaction.type === 'expense' }" @click="newTransaction.type = 'expense'">支出</button>
            </div>
          </div>
          <div class="form-group">
            <label>描述</label>
            <input type="text" v-model="newTransaction.title" required placeholder="请输入描述" />
          </div>
          <div class="form-group">
            <label>金额</label>
            <input type="number" v-model.number="newTransaction.amount" required placeholder="请输入金额" min="0" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="newTransaction.category" required>
              <option value="">请选择</option>
              <option v-if="newTransaction.type === 'income'" value="salary">工资</option>
              <option v-if="newTransaction.type === 'income'" value="freelance">兼职</option>
              <option v-if="newTransaction.type === 'income'" value="investment">投资收益</option>
              <option v-if="newTransaction.type === 'income'" value="bonus">奖金</option>
              <option v-if="newTransaction.type === 'expense'" value="housing">房租</option>
              <option v-if="newTransaction.type === 'expense'" value="food">餐饮</option>
              <option v-if="newTransaction.type === 'expense'" value="transport">交通</option>
              <option v-if="newTransaction.type === 'expense'" value="shopping">购物</option>
              <option v-if="newTransaction.type === 'expense'" value="entertainment">娱乐</option>
              <option v-if="newTransaction.type === 'expense'" value="utilities">水电费</option>
            </select>
          </div>
          <div class="form-group">
            <label>日期</label>
            <input type="date" v-model="newTransaction.date" required />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showAddModal = false">取消</button>
            <button type="submit" class="btn-submit">保存</button>
          </div>
        </form>
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
  { id: 8, type: 'income', title: '奖金', amount: 3000, date: '2026-04-11', category: 'bonus' },
  { id: 9, type: 'expense', title: '电影', amount: 120, date: '2026-04-12', category: 'entertainment' },
  { id: 10, type: 'expense', title: '超市', amount: 450, date: '2026-04-13', category: 'food' },
])

const filterType = ref('all')
const filterCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 10
const showAddModal = ref(false)

const newTransaction = ref({
  type: 'expense',
  title: '',
  amount: null,
  category: '',
  date: new Date().toISOString().split('T')[0]
})

const categoryNames = {
  salary: '工资',
  freelance: '兼职',
  investment: '投资收益',
  bonus: '奖金',
  housing: '房租',
  food: '餐饮',
  transport: '交通',
  shopping: '购物',
  entertainment: '娱乐',
  utilities: '水电费'
}

const getCategoryName = (cat) => categoryNames[cat] || cat

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    if (filterType.value !== 'all' && t.type !== filterType.value) return false
    if (filterCategory.value !== 'all' && t.category !== filterCategory.value) return false
    if (searchKeyword.value && !t.title.toLowerCase().includes(searchKeyword.value.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / pageSize))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTransactions.value.slice(start, start + pageSize)
})

const formatNumber = (num) => num.toLocaleString('zh-CN')

let nextId = 11

const addTransaction = () => {
  transactions.value.push({
    id: nextId++,
    ...newTransaction.value
  })
  showAddModal.value = false
  newTransaction.value = {
    type: 'expense',
    title: '',
    amount: null,
    category: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.transactions { padding: 20px; }
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
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
}
.filter-group { display: flex; gap: 12px; }
.filter-select, .search-input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.filter-select:focus, .search-input:focus { border-color: #4CAF50; }
.search-box { flex: 1; max-width: 300px; }
.search-input { width: 100%; }
.transaction-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px 120px 80px;
  padding: 16px 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
}
.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 120px 120px 80px;
  padding: 16px 20px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}
.table-row:hover { background: #fafafa; }
.empty-state {
  padding: 60px;
  text-align: center;
  color: #999;
}
.type-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}
.type-badge.income { background: #E8F5E9; color: #4CAF50; }
.type-badge.expense { background: #FFEBEE; color: #F44336; }
.category-tag {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}
.col-amount {
  font-weight: 600;
}
.col-amount.income { color: #4CAF50; }
.col-amount.expense { color: #F44336; }
.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}
.action-btn:hover { opacity: 0.8; }
.action-btn.delete { background: #FFEBEE; color: #F44336; }
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}
.page-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { border-color: #4CAF50; color: #4CAF50; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { color: #666; font-size: 0.9rem; }
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  width: 420px;
  max-width: 90vw;
}
.modal h2 {
  margin-bottom: 24px;
  color: #1a1a2e;
  font-size: 1.3rem;
}
.form-group { margin-bottom: 20px; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus, .form-group select:focus { border-color: #4CAF50; }
.type-toggle {
  display: flex;
  gap: 8px;
}
.type-toggle button {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.type-toggle button.active {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}
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
  font-weight: 500;
}
.btn-submit {
  padding: 12px 24px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
</style>