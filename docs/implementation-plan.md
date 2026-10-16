# Implementation plan: The Rail

Status: draft for review. Do not build the UI until this plan and `docs/design-spec.md` are approved.

The site stays a Vite + React + TypeScript app. Version 1 adds no runtime dependency. Tailwind is not installed. React Router is not installed. Chapter changes are local state plus a URL hash.

## Stack decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Styling | CSS custom properties in `src/styles/tokens.css` and layout rules in `src/styles/rail.css` | The spec is a fixed spatial system. Utility classes are not needed for one timetable. |
| Routing | `history.replaceState` and `location.hash` | Five chapters on one page. A client router would add a library for a hash. |
| Content | Import the JSON files in `content/` | The knowledge base stays the source. Display strings that must differ from raw `details` live in the rail model. |
| Keyboard | One `onKeyDown` on the tab list | Five buttons do not need a focus registry, a context provider, or a menu library. |
| Remote assets | Google Fonts stylesheet in `index.html` | Barlow Condensed and Literata, weights specified in the design spec. |

`tsconfig.app.json` needs two compiler updates when implementation starts, because JSON lives outside `src` and `resolveJsonModule` is currently off:

- `"resolveJsonModule": true`
- `"include": ["src", "content"]`

`verbatimModuleSyntax` stays on. Type-only imports use `import type`.

## Content dependencies

| File | Used for | Ignored |
| --- | --- | --- |
| `content/profile.json` | Name, title, current status, career goals, the `now` chapter | `location`, `relocation`, `languages`, `audience` |
| `content/experience.json` | College, bachelor, Valiwo, Full Stack Open: organization, credential, role, start, end | `german-study`, `hacktoberfest-2026`, raw `details` sentences about missing proof |
| `content/skills.json` | Group labels, skill names, Tailwind `experienceNote` | The file-level note |
| `content/projects.json` | `projects` array, currently empty | The file-level note |

`publicDisplay` is still false on every record. The rail model is the version 1 allowlist. Shipping the page still needs the draft sentences in the design spec to be accepted. The implementation must not invent contact details, project names, or outcomes.

### Rail model

`src/content/railModel.ts` exports `chapters: Chapter[]` in this order:

1. `college-computer-engineering`
2. `university-computer-engineering`
3. `valiwo`
4. `full-stack-open`
5. `now`

Each chapter object:

```ts
type Chapter = {
  id: string
  railPrimary: string
  railSecondary: string
  eyebrow: string
  title: string
  meta: string
  paragraphs: string[]
  showSkills: boolean
}

type Project = {
  id: string
  chapterId: string
  name: string
  contribution: string
  stack: string[]
  repositoryUrl?: string
  demoUrl?: string
  problem?: string
  result?: string
  image?: { src: string; alt: string; width: number; height: number }
}
```

`showSkills` is true only for `now`.

Display paragraphs are the sentences in design-spec section 11, not the raw `details` fields. The model may read dates, names, and organizations from JSON so those facts stay in one place. It must not print the Valiwo sentence that begins "No site names" or the Full Stack Open sentence that begins "You said it starts".

Projects are parsed from `content/projects.json`. An item is kept only when `chapterId` matches a chapter id and `name` and `contribution` are non-empty strings. Version 1 parses to an empty list.

Contact is `null` until `profile.json` gains a public `href`. The folio component accepts `contact: { label: string; href: string } | null`.

## Components

| Component | File | Responsibility |
| --- | --- | --- |
| `App` | `src/App.tsx` | Holds `selectedId`. Reads the initial hash. Writes the hash on change. Renders folio, rail, and chapter inside `.shell`. |
| `Folio` | `src/components/Folio.tsx` | Renders the name, title, optional contact link, and "Open to work". No year logic. |
| `Rail` | `src/components/Rail.tsx` | `nav` and `tablist`. Handles arrow, Home, and End keys. Sets `aria-orientation` from a `(max-width: 699px)` media query. |
| `YearButton` | `src/components/YearButton.tsx` | One tab. Selected, hover, and focus styles. `tabIndex` 0 only when selected. |
| `Chapter` | `src/components/Chapter.tsx` | The tab panel: eyebrow, `h1`, meta, paragraphs. Renders skills and projects for the open chapter. |
| `SkillGroups` | `src/components/SkillGroups.tsx` | Renders the five groups. Appends `(low experience)` only when `experienceNote` is present. |
| `ProjectBlock` | `src/components/ProjectBlock.tsx` | One project inside a chapter, including the optional case-study fields and the optional image. Renders nothing when given an empty list. |

`App` is the only component that owns selection state. Children receive `selectedId` and `onSelect`.

### Suggested prop shapes

```ts
type FolioProps = {
  name: string
  title: string
  availability: string
  contact: { label: string; href: string } | null
}

type RailProps = {
  chapters: Chapter[]
  selectedId: string
  onSelect: (id: string) => void
}

type ChapterProps = {
  chapter: Chapter
  skills: SkillGroup[]
  projects: Project[]
}
```

## Files to add or replace

| Path | Action |
| --- | --- |
| `src/styles/tokens.css` | Add. Tokens from design-spec sections 2–4. |
| `src/styles/rail.css` | Add. Shell, folio, rail, chapter, projects, states, breakpoints, reduced motion. |
| `src/content/types.ts` | Add. `Chapter`, `Project`, `SkillGroup`. |
| `src/content/railModel.ts` | Add. Allowlist, display copy, project filter. |
| `src/components/Folio.tsx` | Add. |
| `src/components/Rail.tsx` | Add. |
| `src/components/YearButton.tsx` | Add. |
| `src/components/Chapter.tsx` | Add. |
| `src/components/SkillGroups.tsx` | Add. |
| `src/components/ProjectBlock.tsx` | Add. |
| `src/App.tsx` | Replace the current heading. |
| `src/main.tsx` | Import `tokens.css` and `rail.css` instead of the empty `index.css`. |
| `src/index.css` | Leave unused, or delete the import only. Do not put layout rules here. |
| `index.html` | Add the font links. Set `lang="en"` (already set). Set `<title>Oleksandr Dmytruk</title>`. |
| `tsconfig.app.json` | Enable `resolveJsonModule` and include `content`. |

Class names are single words or one hyphen: `.shell`, `.folio`, `.folio-name`, `.folio-title`, `.folio-availability`, `.rail`, `.year`, `.year-stamp`, `.year-primary`, `.year-secondary`, `.chapter`, `.chapter-eyebrow`, `.chapter-title`, `.chapter-meta`, `.chapter-body`, `.tools`, `.tool-group`, `.project`, `.project-name`, `.project-links`.

Selected year: `.year[aria-selected="true"]`.

## Implementation order

1. **Tokens and shell.** Add the CSS variables, the `100dvh` grid, the folio border, and the rail border with empty regions. Check the 320px / 72px desktop geometry before any copy.
2. **Types and rail model.** Build the five chapters from the content files and the display sentences in the design spec. Confirm excluded ids are absent.
3. **Folio.** Render the three strings at the specified sizes. Confirm there is no contact node.
4. **Rail, static selection.** Render five year buttons. Hard-code `now` as selected so the stamp and row fill can be checked with transitions disabled.
5. **Chapter.** Render the open chapter's type, spacing, and the long college name inside 640px.
6. **Selection.** Wire click, hash load, and `replaceState`.
7. **Keyboard.** Arrow, Home, and End behavior from design-spec section 8, including no wrap and `preventDefault`.
8. **Skills.** Mount `SkillGroups` under `now` only.
9. **Projects.** Mount `ProjectBlock` for the open chapter. With the current JSON it returns nothing. Keep the component so a later project does not require a layout change.
10. **Tablet and mobile.** Apply the 1099px and 699px rules. Move the stamp to the top edge only under 700px.
11. **Focus and reduced motion.** Inset focus ring. Zero the 200ms transitions under `prefers-reduced-motion`.

Do not add pages, a theme toggle, a project grid, or a loading spinner during this sequence.

## Acceptance checks

- At 1280px the rail is 320px, the folio is 72px, and the chapter text column is 640px from a 64px inset.
- At 768px the rail is 220px and still vertical.
- At 390px the rail is an 88px horizontal scroller and the name sits on its own line.
- `now` is open on a fresh load.
- `#valiwo` opens Valiwo on load.
- German study, Hacktoberfest, location, and relocation are absent from the DOM.
- The Valiwo body is the two public sentences, not the interview note.
- Skills appear only in the Searching chapter, and only Tailwind carries `(low experience)`.
- No project heading is present while `projects` is empty.
- With animations forced off, the selected year still shows the orange gutter and the tinted row.
- Tab reaches the selected year, arrows move between years, and focus does not wrap.
- The stamp color is not used on any word.

## Out of scope for version 1

- Choosing or changing the design direction.
- Setting `publicDisplay` to true. That is a content approval, done only when requested.
- Adding an email address, phone number, or city.
- Drawing a new favicon.
- Installing Tailwind, a router, an animation library, or a component kit.
