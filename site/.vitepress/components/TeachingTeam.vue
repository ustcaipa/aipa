<script setup>
import { courseData } from "../generated/course-content.mjs"
</script>

<template>
  <section id="teaching-team" class="syllabus-section">
    <h2>任课教师与助教</h2>

    <div class="team-section">
      <h3 class="team-section-title">任课教师</h3>
      <div class="team-grid">
        <article v-for="teacher in courseData.teachingTeam.instructors" :key="teacher.name" class="team-card">
          <div class="team-card-header">
            <div>
              <h4>{{ teacher.name }}</h4>
            </div>
            <p class="team-affiliation">{{ teacher.affiliation }}</p>
          </div>

          <p class="team-summary">{{ teacher.summary }}</p>

          <dl class="team-meta">
            <div v-if="teacher.researchAreas">
              <dt>研究方向</dt>
              <dd>{{ teacher.researchAreas }}</dd>
            </div>
            <div v-if="teacher.email">
              <dt>邮箱</dt>
              <dd>
                <a :href="`mailto:${teacher.email}`">{{ teacher.email }}</a>
              </dd>
            </div>
            <div v-if="teacher.profileUrl">
              <dt>主页</dt>
              <dd>
                <a :href="teacher.profileUrl" target="_blank" rel="noreferrer">查看资料</a>
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </div>

    <div class="team-section">
      <h3 class="team-section-title">助教</h3>
      <div class="assistant-grid">
        <article v-for="assistant in courseData.teachingTeam.assistants" :key="assistant.name" class="assistant-card">
          <h4>{{ assistant.name }}</h4>
          <a v-if="assistant.email" :href="`mailto:${assistant.email}`">{{ assistant.email }}</a>
        </article>
      </div>
    </div>
  </section>
</template>
