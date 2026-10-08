import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { courseSource } from "./course-source.mjs"

const rootDir = fileURLToPath(new URL("../", import.meta.url))
const generatedDir = path.join(rootDir, "site", ".vitepress", "generated")
const generatedDataFile = path.join(generatedDir, "course-content.mjs")
const materialsDir = path.join(rootDir, "course-materials")
const publicMaterialsDir = path.join(rootDir, "site", "public", "course-materials")
const materialsWeeks = courseSource.materialSections ?? Array.from({ length: 14 }, (_, index) => {
  const weekNumber = index + 2
  const slug = `week-${String(weekNumber).padStart(2, "0")}`

  return {
    weekNumber,
    label: `Week ${weekNumber}`,
    slug,
  }
})

function toPublicHref(parts) {
  return `/${parts.map((part) => encodeURIComponent(part)).join("/")}`
}

async function ensureMaterialsStructure() {
  await fs.mkdir(materialsDir, { recursive: true })

  for (const week of materialsWeeks) {
    for (const section of ["class-material", "homework"]) {
      const folder = path.join(materialsDir, week.slug, section)
      const keepFile = path.join(folder, ".gitkeep")

      await fs.mkdir(folder, { recursive: true })

      try {
        await fs.access(keepFile)
      } catch {
        await fs.writeFile(keepFile, "", "utf8")
      }
    }
  }
}

async function syncMaterials() {
  await fs.rm(publicMaterialsDir, { recursive: true, force: true })
  await fs.mkdir(publicMaterialsDir, { recursive: true })
  await fs.cp(materialsDir, publicMaterialsDir, { recursive: true, force: true })
}

async function listFiles(parts) {
  const folder = path.join(materialsDir, ...parts)
  const entries = await fs.readdir(folder, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
    .map((entry) => ({
      name: entry.name,
      href: toPublicHref(["course-materials", ...parts, entry.name]),
    }))
}

async function buildCourseData() {
  const materialsTable = []

  for (const week of materialsWeeks) {
    materialsTable.push({
      label: week.label,
      slug: week.slug,
      classMaterials: await listFiles([week.slug, "class-material"]),
      homework: await listFiles([week.slug, "homework"]),
    })
  }

  return {
    ...courseSource,
    materialsWeeks: materialsTable,
  }
}

await fs.mkdir(generatedDir, { recursive: true })
await ensureMaterialsStructure()
await syncMaterials()

const courseData = await buildCourseData()
const content = `export const courseData = ${JSON.stringify(courseData, null, 2)};\n`
await fs.writeFile(generatedDataFile, content, "utf8")
