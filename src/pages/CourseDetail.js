/**
 * 课程详情页面
 * 展示课程完整介绍、章节信息和讲师信息
 */
import { router } from '../router/index.js';
import { getCourseById } from '../data/courses.js';

export function renderCourseDetail(courseId) {
  const app = document.getElementById('app');
  if (!app) return;

  const course = getCourseById(courseId);

  if (!course) {
    app.innerHTML = `
      <div class="course-detail-page">
        <div class="error-message">
          <h2>课程不存在</h2>
          <button class="btn-back" onclick="window.location.hash='/';">返回课程列表</button>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="course-detail-page">
      <button class="btn-back" data-route="/">← 返回课程列表</button>

      <div class="course-header">
        <div class="course-cover">
          <img src="${course.coverImage}" alt="${course.title}" onerror="this.src='/images/placeholder.jpg'">
        </div>
        <div class="course-header-info">
          <h1 class="course-title">${course.title}</h1>
          <div class="course-meta">
            <span class="course-price">¥${course.price}</span>
            <span class="course-students">${course.totalStudents} 人学习</span>
          </div>
        </div>
      </div>

      <div class="course-content">
        <section class="course-section">
          <h2>课程介绍</h2>
          <p class="course-full-desc">${course.fullDescription}</p>
        </section>

        <section class="course-section">
          <h2>课程章节</h2>
          <div class="chapter-list">
            ${course.chapters.map(chapter => `
              <div class="chapter-item">
                <span class="chapter-number">第${chapter.id}章</span>
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-duration">${chapter.duration}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="course-section">
          <h2>讲师介绍</h2>
          <div class="instructor-info">
            <div class="instructor-avatar">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" onerror="this.src='/images/default-avatar.jpg'">
            </div>
            <div class="instructor-details">
              <h3 class="instructor-name">${course.instructor.name}</h3>
              <p class="instructor-title">${course.instructor.title}</p>
              <p class="instructor-bio">${course.instructor.bio}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  // 绑定返回按钮事件
  document.querySelector('.btn-back')?.addEventListener('click', () => {
    router.navigate('/');
  });
}