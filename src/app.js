/**
 * 应用入口文件
 * 初始化路由配置
 */
import { router } from './router/index.js';
import { renderCourseList } from './pages/CourseList.js';
import { renderCourseDetail } from './pages/CourseDetail.js';

// 注册路由
router.register('/', renderCourseList);
router.register('/course/:id', () => {
  // 从 URL 中提取课程 ID
  const path = window.location.hash.slice(1);
  const match = path.match(/^\/course\/(.+)$/);
  if (match) {
    renderCourseDetail(match[1]);
  }
});

console.log('课程应用已初始化');