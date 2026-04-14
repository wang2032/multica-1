const courses = [
    {
        id: 1,
        title: 'Python 基础入门',
        instructor: '张三',
        description: '从零开始学习 Python 编程，掌握基本语法和常用库的使用。',
        cover: 'https://via.placeholder.com/300x180/4A90E2/FFFFFF?text=Python'
    },
    {
        id: 2,
        title: 'Web 前端开发实战',
        instructor: '李四',
        description: '学习 HTML、CSS、JavaScript，完成真实的 Web 项目开发。',
        cover: 'https://via.placeholder.com/300x180/50C878/FFFFFF?text=Web'
    },
    {
        id: 3,
        title: '数据结构与算法',
        instructor: '王五',
        description: '深入理解常用数据结构和算法，提升编程能力和面试技巧。',
        cover: 'https://via.placeholder.com/300x180/FF6B6B/FFFFFF?text=Algorithm'
    },
    {
        id: 4,
        title: '机器学习入门',
        instructor: '赵六',
        description: '介绍机器学习基础概念，使用 Scikit-learn 进行实践。',
        cover: 'https://via.placeholder.com/300x180/9B59B6/FFFFFF?text=ML'
    },
    {
        id: 5,
        title: '数据库设计与优化',
        instructor: '钱七',
        description: '学习 MySQL 数据库设计、查询优化和性能调优。',
        cover: 'https://via.placeholder.com/300x180/F39C12/FFFFFF?text=Database'
    },
    {
        id: 6,
        title: 'Docker 容器化部署',
        instructor: '孙八',
        description: '掌握 Docker 容器技术，实现应用的快速部署和扩展。',
        cover: 'https://via.placeholder.com/300x180/1ABC9C/FFFFFF?text=Docker'
    }
];

function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = courses.map(course => `
        <article class="course-card">
            <img src="${course.cover}" alt="${course.title}" class="course-cover">
            <div class="course-content">
                <h2 class="course-title">${course.title}</h2>
                <p class="course-instructor">讲师：${course.instructor}</p>
                <p class="course-description">${course.description}</p>
            </div>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderCourses);