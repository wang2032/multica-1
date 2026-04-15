import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Dashboard from '../views/finance/Dashboard.vue'
import Transactions from '../views/finance/Transactions.vue'
import Accounts from '../views/finance/Accounts.vue'
import Reports from '../views/finance/Reports.vue'
import Budget from '../views/finance/Budget.vue'
import Statistics from '../views/finance/Statistics.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/finance',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/finance/transactions',
    name: 'Transactions',
    component: Transactions
  },
  {
    path: '/finance/accounts',
    name: 'Accounts',
    component: Accounts
  },
  {
    path: '/finance/reports',
    name: 'Reports',
    component: Reports
  },
  {
    path: '/finance/budget',
    name: 'Budget',
    component: Budget
  },
  {
    path: '/finance/statistics',
    name: 'Statistics',
    component: Statistics
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router