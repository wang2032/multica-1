/**
 * 课程列表页面
 */
import { router } from '../router/index.js';
import { courses } from '../data/courses.js';

export function renderCourseList() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="course-list-page">
      <h1>课程列表</h1>
      <div class="course-grid">
        ${courses.map(course => `
          <div class="course-card" data-course-id="${course.id}">
            <div class="course-cover">
              <img src="${course.coverImage}" alt="${course.title}" onerror="this.src='/images/placeholder.jpg'">
            </div>
            <div class="course-info">
              <h3 class="course-title">${course.title}</h3>
              <p class="course-desc">${course.description}</p>
              <div class="course-meta">
                <span class="course-price">¥${course.price}</span>
                <span class="course-students">${course.totalStudents} 人学习</span>
              </div>
              <button class="btn-detail" data-id="${course.id}">查看详情</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // 绑定点击事件
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = e.target.dataset.id;
      router.navigate(`/course/${courseId}`);
    });
  });
}