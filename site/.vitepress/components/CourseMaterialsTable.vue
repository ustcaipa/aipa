<script setup>
import { withBase } from "vitepress"
import { courseData } from "../generated/course-content.mjs"
</script>

<template>
  <section id="course-materials" class="syllabus-section">
    <h2>课程资料</h2>
    <div class="homework-notice" aria-labelledby="homework-title">
      <h3 id="homework-title">{{ courseData.homeworkNotice.title }}</h3>
      <p><strong>提交截止日期：</strong>{{ courseData.homeworkNotice.deadline }}</p>
      <p><strong>提交要求：</strong>{{ courseData.homeworkNotice.submission }}</p>
      <template v-for="week in courseData.materialsWeeks" :key="week.slug">
        <p v-for="item in week.homework.filter((file) => file.name === courseData.homeworkNotice.fileName)" :key="item.href">
          <a :href="withBase(item.href)" download>下载作业说明：{{ item.name }}</a>
        </p>
      </template>
    </div>
    <table class="course-materials-table">
      <thead>
        <tr>
          <th>章节 / 作业</th>
          <th>课件</th>
          <th>作业</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in courseData.materialsWeeks" :key="week.slug">
          <td class="week-cell">{{ week.label }}</td>
          <td>
            <ul v-if="week.classMaterials.length" class="file-list">
              <li v-for="item in week.classMaterials" :key="item.href">
                <a :href="withBase(item.href)" class="file-link" download>{{ item.name }}</a>
              </li>
            </ul>
            <span v-else class="placeholder-text">待上传</span>
          </td>
          <td>
            <ul v-if="week.homework.length" class="file-list">
              <li v-for="item in week.homework" :key="item.href">
                <a :href="withBase(item.href)" class="file-link" download>{{ item.name }}</a>
              </li>
            </ul>
            <span v-else class="placeholder-text">未发布</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
