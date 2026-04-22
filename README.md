# News Tracker

一个自动搜索和追踪网上最新资讯的前端+后端项目。

## 技术栈

- **前端**: React + Vite + TailwindCSS + TypeScript
- **后端**: Python FastAPI + SQLAlchemy + APScheduler
- **数据库**: SQLite
- **数据源**: NewsAPI (可选)

## 项目结构

```
news-tracker/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── App.tsx          # 主组件
│   │   ├── api.ts           # API 调用
│   │   └── types.ts         # TypeScript 类型
│   └── index.html
└── backend/                  # Python 后端
    ├── main.py              # FastAPI 入口 + 定时任务
    ├── models.py            # 数据库模型
    ├── database.py          # 数据库配置
    ├── scraper.py           # 新闻爬虫
    └── routers/             # API 路由
        ├── topics.py        # 话题管理 API
        └── news.py          # 资讯 API
```

## 快速开始

### 1. 启动后端

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn main:app --reload --port 8000
```

后端服务运行在: http://localhost:8000

### 2. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务运行在: http://localhost:5173

## 使用说明

### 添加话题

1. 点击左侧边栏的 **"+ Add"** 按钮
2. 输入话题名称（如：`AI News`）
3. 输入关键词，用逗号分隔（如：`artificial intelligence, machine learning`）
4. 点击 **"Create"** 创建

### 抓取资讯

1. 确保已添加至少一个话题
2. 点击右上角 **"Fetch News"** 按钮
3. 系统会根据话题关键词抓取相关资讯

### 筛选资讯

- **按话题筛选**: 点击左侧边栏的具体话题
- **搜索**: 在顶部搜索框输入关键词
- **启停话题**: 点击话题旁边的 On/Off 按钮

### 自动抓取

后端每 30 分钟自动抓取一次已启用话题的最新资讯。

## API 文档

启动后端后访问: http://localhost:8000/docs

### 话题管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/topics` | 获取所有话题 |
| POST | `/api/topics` | 创建话题 |
| PATCH | `/api/topics/{id}` | 更新话题 |
| DELETE | `/api/topics/{id}` | 删除话题 |

### 资讯

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/news` | 获取资讯列表 |
| POST | `/api/scrape` | 手动触发抓取 |

### 查询参数

`GET /api/news` 支持以下参数：
- `topic_id`: 按话题筛选
- `keyword`: 按关键词搜索
- `limit`: 返回数量（默认 50）
- `offset`: 分页偏移

## 配置 NewsAPI（可选）

默认使用模拟数据。如需真实新闻：

1. 注册 https://newsapi.org
2. 获取 API Key
3. 启动后端前设置环境变量：

```bash
export NEWSAPI_KEY=your_api_key_here
uvicorn main:app --reload --port 8000
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEWSAPI_KEY` | NewsAPI API Key | 无（使用模拟数据） |

## 开发

### 运行测试构建

```bash
cd frontend
npm run build
```

### 后端热重载

后端使用 `uvicorn --reload` 支持热重载。

## 许可证

MIT