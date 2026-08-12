/**
 * 课程数据模型
 */

export const courses = [
  {
    id: 'course-1',
    title: 'React 实战课程',
    description: '从零开始学习 React，掌握现代前端开发技能',
    fullDescription: '本课程将带你从零开始掌握 React 开发技能。你将学习到 React 的核心概念、组件化开发、状态管理、Hooks 使用等重要知识点。通过多个实战项目，你将能够独立开发完整的 React 应用。',
    coverImage: '/images/react-course.jpg',
    instructor: {
      id: 'instructor-1',
      name: '张老师',
      title: '资深前端工程师',
      avatar: '/images/avatar-zhang.jpg',
      bio: '拥有10年前端开发经验，曾在多家知名互联网公司担任前端架构师。'
    },
    chapters: [
      { id: 1, title: 'React 基础入门', duration: '2小时' },
      { id: 2, title: '组件化开发实践', duration: '3小时' },
      { id: 3, title: 'State 与 Props', duration: '2.5小时' },
      { id: 4, title: 'Hooks 深入理解', duration: '4小时' },
      { id: 5, title: '实战项目开发', duration: '6小时' }
    ],
    price: 299,
    totalStudents: 1234
  },
  {
    id: 'course-2',
    title: 'Node.js 后端开发',
    description: '使用 Node.js 构建高性能后端服务',
    fullDescription: '本课程涵盖 Node.js 的核心概念、Express 框架使用、数据库集成、API 设计等内容。帮助你掌握后端开发技能，构建现代化的后端服务。',
    coverImage: '/images/nodejs-course.jpg',
    instructor: {
      id: 'instructor-2',
      name: '李老师',
      title: '后端技术专家',
      avatar: '/images/avatar-li.jpg',
      bio: '8年后端开发经验，专注于高并发系统架构设计。'
    },
    chapters: [
      { id: 1, title: 'Node.js 基础', duration: '2小时' },
      { id: 2, title: 'Express 框架', duration: '3小时' },
      { id: 3, title: '数据库集成', duration: '3小时' },
      { id: 4, title: 'API 设计与 REST', duration: '2小时' }
    ],
    price: 399,
    totalStudents: 856
  }
];

export function getCourseById(id) {
  return courses.find(course => course.id === id);
}