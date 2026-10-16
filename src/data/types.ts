export type Chapter = {
  id: string
  railPrimary: string
  railSecondary: string
  eyebrow: string
  title: string
  meta: string
  paragraphs: string[]
  showSkills: boolean
}

export type ProjectImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type Project = {
  id: string
  chapterId: string
  name: string
  contribution: string
  stack: string[]
  repositoryUrl?: string
  demoUrl?: string
  problem?: string
  result?: string
  image?: ProjectImage
}

export type Skill = {
  id: string
  name: string
  experienceNote: string | null
}

export type SkillGroup = {
  id: string
  label: string
  skills: Skill[]
}

export type ContactLink = {
  label: string
  href: string
}
