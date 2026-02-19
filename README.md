# 🎨 Saeculum Form Builder

> **Build powerful, dynamic forms with an intuitive visual editor**

A modern, feature-rich form builder application built with Angular 21, featuring drag-and-drop support, nested sections, undo/redo functionality, and persistent storage.

![Angular](https://img.shields.io/badge/Angular-21.1.4-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Ant Design](https://img.shields.io/badge/Ant_Design-21-0170FE?style=flat-square&logo=antdesign)

---

## ✨ Features

### 🚀 Core Functionality
- **📄 Multi-Page Forms** — Create unlimited pages within a single form
- **❓ Dynamic Questions** — Add questions of various types (text, checkbox, etc.)
- **📦 Nested Sections** — Organize questions into collapsible sections with unlimited nesting depth
- **🎯 Type Support** — Multiple question types for flexible form design
  - Short Text Answers
  - Checkboxes
  - *(Extensible for more types)*

### 🔄 Advanced Features
- **🖱️ Smart Drag & Drop**
  - Drag questions from parent to nested sections
  - Move items cross-page seamlessly
  - Move items from inner sections back to parent
  - Intelligent drop-list connectivity across the entire form
  
- **↩️ Undo/Redo** — Full undo/redo stack for all operations with visual feedback
- **💾 Persistent Storage** — Auto-save to IndexedDB (IDB) with debounced saves
- **🎨 Rich UI** — Built with Ant Design components and Tailwind CSS
- **⌨️ Keyboard Support** — Full keyboard navigation and shortcuts
- **🔒 Unsaved Changes Guard** — Route guards warn users before leaving with unsaved changes

---

## 🏗️ Project Structure

```
saeculum-form-builder/
├── src/
│   ├── app/
│   │   ├── core/                          # Core business logic
│   │   │   ├── enums/
│   │   │   │   └── question-type.ts      # Question/element type definitions
│   │   │   ├── models/
│   │   │   │   ├── form.interface.ts     # IForm (root form container)
│   │   │   │   ├── page.interface.ts     # IPage (multi-page support)
│   │   │   │   ├── question.interface.ts # IQuestion type definition
│   │   │   │   └── section.interface.ts  # IElement (recursive container)
│   │   │   └── services/
│   │   │       ├── form-state.service.ts     # 🔧 State management (RxJS)
│   │   │       ├── storage.service.ts        # 💾 IDB persistence
│   │   │       └── undo-redo.service.ts      # ↩️ Undo/redo stack
│   │   │
│   │   ├── features/
│   │   │   ├── builder/                   # Form builder UI
│   │   │   │   ├── components/
│   │   │   │   │   ├── page-container/   # Page layout & drop zones
│   │   │   │   │   ├── section-node/     # Nested section container
│   │   │   │   │   ├── question-node/    # Individual question editor
│   │   │   │   │   ├── header/           # Toolbar & controls
│   │   │   │   └── builder.component.ts
│   │   │
│   │   ├── shared/                        # Shared utilities
│   │   │   ├── icon.module.ts            # Icon library
│   │   │   ├── components/               # Reusable components
│   │   │   └── directives/
│   │   │       └── auto-focus.directive.ts  # Auto-focus on label edit
│   │   │
│   │   ├── app.config.ts                 # Root providers
│   │   ├── app.routes.ts                 # Route definitions
│   │   └── app.component.ts              # Root component
│   │
│   ├── index.html                        # Entry HTML
│   ├── main.ts                           # Bootstrap
│   ├── styles.scss                       # Global styles
│   └── theme.less                        # Ant Design theme customization
│
├── angular.json                          # Angular CLI config
├── tsconfig.json                         # TypeScript config
├── tailwind.config.js                    # Tailwind CSS config
├── package.json                          # Dependencies
└── pnpm-lock.yaml                        # Lock file
```

### 📊 Data Model

```typescript
// Root form container
interface IForm {
  id: string;
  pages: IPage[];
}

// Page with root-level elements
interface IPage {
  id: string;
  title: string;
  elements: IElement[];
}

// Recursive element (question or section)
interface IElement {
  id: string;
  type: FormElementType;              // QUESTION | SECTION
  label: string;
  questionType?: QuestionType;        // SHORT_TEXT | CHECKBOX
  children?: IElement[];              // For sections
  isExpanded?: boolean;               // Collapse/expand state
  parentId?: string | null;           // Reference to parent
  value?: string | boolean;           // For preview/answers
  required?: boolean;
}
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** 18+ (LTS recommended)
- **pnpm** 8+ (or npm/yarn)
- **Angular CLI** 21+

### ⬇️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd saeculum-form-builder

# Install dependencies
pnpm install
# or
npm install
```

### 🏃 Development Server

```bash
# Start dev server
pnpm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app automatically reloads on file changes.

### 🔨 Build for Production

```bash
# Build optimized bundle
pnpm build
```

Output goes to `dist/saeculum-form-builder/`

---

## 🎮 Usage Guide

### 🎯 Creating a Form

1. **➕ Add a Page**
   - Click "Page" in the bottom action bar
   - Edit page title by clicking the edit icon

2. **➕ Add Elements**
   - Use header buttons or right-click context menu
   - Choose "Question" or "Section"
   - Questions appear immediately; edit the label inline

3. **🎨 Edit Question Types**
   - Click the dropdown in the "Types of responses" column
   - Select from available question types
   - Type resets value to safe default

4. **📦 Organize with Sections**
   - Add sections to group related questions
   - Expand/collapse to show/hide children
   - Sections support unlimited nesting

### 🖱️ Drag & Drop Features

- **📍 Reorder items** — Drag within the same container
- **📤 Move out** — Drag a question from a section to the parent page
- **📥 Move in** — Drag a question from the page into a nested section
- **🔀 Cross-page transfer** — Move items between different pages
- **🔗 Smart connectivity** — All drop zones are automatically connected

**💡 Drag Disabled:** Expanded sections can't be dragged (collapse first to move)

### ↩️ Undo/Redo

- Use **Ctrl+Z** (or **Cmd+Z** on Mac) to undo
- Use **Ctrl+Shift+Z** to redo
- Full operation history maintained

### 💾 Storage

- **Auto-save** to IndexedDB every 500ms (debounced)
- **No explicit save button** — changes persist automatically
- **Offline support** — forms work without internet connection
- **Clear storage** via browser DevTools → Application → IndexedDB

---

## 🛠️ Technologies & Libraries

### 🎯 Frontend Framework
- **Angular 21.1.4** — Latest stable with improved performance
- **TypeScript 5.9** — Type-safe development

### 🎨 UI & Styling
- **Tailwind CSS 3.4** — Utility-first CSS framework
- **Ant Design (ng-zorro) 21.1** — Enterprise component library
- **Ant Design Icons 21.0** — Professional icon set

### 🔄 State & Reactivity
- **RxJS 7.8** — Reactive programming with Observables
- **BehaviorSubject** — Centralized state management
- **Operators** — debounceTime, distinctUntilChanged, map, etc.

### 🖱️ Drag & Drop
- **Angular CDK 21** — Official drag-drop library
- **Dynamic connection** — Automatically connects all drop zones
- **Cross-container support** — Move items across nested structures

### 💾 Storage
- **IDB (IndexedDB)** — Persistent client-side database
- **UUID 13** — Unique ID generation

---

## ⚙️ Available Commands

```bash
# Development
pnpm start              # Start dev server
pnpm watch             # Build in watch mode

# Production
pnpm build             # Production build
pnpm build --prod      # With optimization

# Testing
pnpm test              # Run unit tests
pnpm test --watch      # Watch mode

# Code Quality
ng lint                # Run linter (if configured)
ng generate            # Scaffold components, services, etc.
```

---

## 🎯 Key Services

### 📊 FormStateService
Central state management for the entire form.

**Key Methods:**
- `addPage()` — Create new page
- `addElement(parentId, type, pageId)` — Add question or section
- `moveItem(prevContainerId, currContainerId, ...)` — Drag & drop
- `deleteElement(id)` — Remove element
- `updateElementLabel(id, label)` — Edit label
- `updateElementType(id, type)` — Change question type
- `toggleSection(id)` — Collapse/expand
- `triggerUndo()` / `triggerRedo()` — Undo/redo

**Observables:**
- `form$` — Reactive form state
- `focusedElementId$` — Track focused elements
- `dropListIds$` — Track all connectable drop zones

### 💾 StorageService
Handles IndexedDB persistence.

**Methods:**
- `saveForm(form)` — Save to IDB
- `loadForm()` — Load from IDB

### ↩️ UndoRedoService
Generic undo/redo stack manager.

**Methods:**
- `record(state)` — Push to history
- `undo(currentState)` — Revert to previous
- `redo(currentState)` — Go forward

---

## 🏗️ Component Architecture

### 📄 Page-Level Components
- **BuilderComponent** — Root, manages pages
- **PageContainerComponent** — Single page layout with drop zone
- **HeaderComponent** — Toolbar with actions

### 📦 Element Components
- **SectionNodeComponent** — Recursive container for questions & sections
- **QuestionNodeComponent** — Single question editor
- **CanvasComponent** — Main editing canvas

### 🎨 UI Components
- **AddQuestionPlaceholder** — Empty state
- Ant Design buttons, selects, popovers, tooltips

---

## 🎓 Development Tips

### 🔍 Debugging Drag & Drop
Browser console logs are available:
- `[PageContainer] drop prevId=... currId=...`
- `[SectionNode] list entered...`
- `[FormState] moveItem fast-path...`

Enable in components and monitor drag operations.

### 🎨 Styling
- **Tailwind** for layout (responsive, spacing, colors)
- **SCSS** in component styles for complex styling
- **Ant Design theme** controlled via `theme.less`

### 📱 Responsive Design
- Breakpoints defined in Tailwind config
- Mobile-friendly drag & drop
- Adaptive spacing for different screen sizes

### ♿ Accessibility
- Keyboard support (Enter to submit, Escape to cancel)
- ARIA labels in buttons and tooltips
- Focus management with auto-focus directive

---

## 🐛 Known Limitations & TODO

### ✅ Current Features
- ✔️ Multi-page forms
- ✔️ Nested sections (unlimited depth)
- ✔️ Drag & drop (questions & sections)
- ✔️ Undo/redo
- ✔️ Auto-save to IndexedDB

### 🚀 Planned Features
- 📋 Form validation rules
- 🎨 Custom styling per element
- 📤 Export forms (JSON, PDF)
- 🔗 Form submissions & responses
- 👥 Collaborative editing
- 🔐 Access control & permissions

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support & Contact

- 💬 **Issues** — Report bugs or request features via GitHub Issues
- 📧 **Email** — Contact development team
- 💡 **Discussions** — Share ideas and ask questions

---

## 🙏 Acknowledgments

- **Angular Team** — Modern framework and CLI tools
- **Ant Design** — Enterprise-grade UI components
- **Community** — Inspiration from amazing form builders

---

## 📊 Project Stats

- **Framework:** Angular 21
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS + SCSS + Ant Design
- **Storage:** IndexedDB
- **Build Tool:** Angular CLI + Vite (dev)

---

<div align="center">

**Made with ❤️ by the Saeculum Team**

[⬆ back to top](#-saeculum-form-builder)

</div>

