<template>
  <div class="accounts">
    <div class="page-header">
      <h1 class="page-title">账户管理</h1>
      <button class="btn-primary" @click="showAddModal = true">+ 添加账户</button>
    </div>

    <div class="accounts-grid">
      <div v-for="account in accounts" :key="account.id" class="account-card">
        <div class="account-header">
          <div class="account-icon" :style="{ background: account.color }">
            {{ account.icon }}
          </div>
          <div class="account-info">
            <h3>{{ account.name }}</h3>
            <span class="account-type">{{ getAccountTypeName(account.type) }}</span>
          </div>
          <button class="edit-btn" @click="editAccount(account)">✎</button>
        </div>
        <div class="account-balance">
          <span class="balance-label">余额</span>
          <span class="balance-value">¥{{ formatNumber(account.balance) }}</span>
        </div>
        <div class="account-meta">
          <span>账单日: 每月{{ account.billingDay }}日</span>
          <span class="status" :class="account.status">{{ account.status === 'active' ? '正常' : '已冻结' }}</span>
        </div>
      </div>
    </div>

    <!-- 添加/编辑账户弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingAccount ? '编辑账户' : '添加账户' }}</h2>
        <form @submit.prevent="saveAccount">
          <div class="form-group">
            <label>账户名称</label>
            <input type="text" v-model="formData.name" required placeholder="例如：招商银行信用卡" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>账户类型</label>
              <select v-model="formData.type" required>
                <option value="bank">银行卡</option>
                <option value="credit">信用卡</option>
                <option value="cash">现金</option>
                <option value="digital">数字钱包</option>
              </select>
            </div>
            <div class="form-group">
              <label>余额</label>
              <input type="number" v-model.number="formData.balance" required placeholder="0.00" step="0.01" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>账单日</label>
              <input type="number" v-model.number="formData.billingDay" min="1" max="28" required />
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="formData.status">
                <option value="active">正常</option>
                <option value="frozen">已冻结</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>图标颜色</label>
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
import { ref } from 'vue'

const accounts = ref([
  { id: 1, name: '工商银行储蓄卡', type: 'bank', balance: 25680.50, billingDay: 5, status: 'active', color: '#1976D2' },
  { id: 2, name: '招商银行信用卡', type: 'credit', balance: -3580.00, billingDay: 15, status: 'active', color: '#D32F2F' },
  { id: 3, name: '支付宝', type: 'digital', balance: 8950.30, billingDay: 1, status: 'active', color: '#1890FF' },
  { id: 4, name: '微信钱包', type: 'digital', balance: 2340.80, billingDay: 1, status: 'active', color: '#07C160' },
  { id: 5, name: '现金', type: 'cash', balance: 1500.00, billingDay: 1, status: 'active', color: '#FF9800' },
])

const showAddModal = ref(false)
const editingAccount = ref(null)
const colors = ['#1976D2', '#D32F2F', '#388E3C', '#7B1FA2', '#F57C00', '#455A64', '#1890FF', '#07C160']

const formData = ref({
  name: '',
  type: 'bank',
  balance: 0,
  billingDay: 1,
  status: 'active',
  color: '#1976D2'
})

const accountTypeNames = {
  bank: '银行卡',
  credit: '信用卡',
  cash: '现金',
  digital: '数字钱包'
}

const getAccountTypeName = (type) => accountTypeNames[type]

const formatNumber = (num) => Math.abs(num).toLocaleString('zh-CN', { minimumFractionDigits: 2 })

const editAccount = (account) => {
  editingAccount.value = account
  formData.value = { ...account }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingAccount.value = null
  formData.value = {
    name: '',
    type: 'bank',
    balance: 0,
    billingDay: 1,
    status: 'active',
    color: '#1976D2'
  }
}

const saveAccount = () => {
  if (editingAccount.value) {
    Object.assign(editingAccount.value, formData.value)
  } else {
    accounts.value.push({
      id: Date.now(),
      ...formData.value
    })
  }
  closeModal()
}
</script>

<style scoped>
.accounts { padding: 20px; }
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
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
.account-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.account-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.account-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.account-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.account-info h3 {
  font-size: 1rem;
  color: #1a1a2e;
  margin-bottom: 2px;
}
.account-type {
  font-size: 0.8rem;
  color: #999;
}
.edit-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}
.edit-btn:hover { background: #e0e0e0; }
.account-balance {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.balance-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 4px;
}
.balance-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: white;
}
.account-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
}
.status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
.status.active { background: #E8F5E9; color: #4CAF50; }
.status.frozen { background: #FFEBEE; color: #F44336; }
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
  width: 480px;
  max-width: 90vw;
}
.modal h2 { margin-bottom: 24px; color: #1a1a2e; font-size: 1.3rem; }
.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
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
.color-picker { display: flex; gap: 8px; flex-wrap: wrap; }
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