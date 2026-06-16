import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:8000/api/webhook'

const templateOptions = [
  { id: 'simple', title: 'Simple', description: 'Clean and minimal README', icon: 'file' },
  { id: 'opensource', title: 'Open Source', description: 'Ideal for open source projects', icon: 'network' },
  { id: 'professional', title: 'Professional', description: 'Detailed and professional style', icon: 'briefcase' },
]

const fallbackEvents = [
  {
    id: 'demo-1',
    repo_name: 'tamil8481/GitSmartDocs',
    commit_message: 'Update documentation',
    template: 'professional',
    suggestions: [
      'Add Installation section to help users install your project.',
      'Add Usage section to explain how to use your project.',
      'Add Contributing section to guide others on how to contribute.',
    ],
    pushed_at: '2026-06-06T23:26:38',
    generated_readme: `# GitSmartDocs

Update documentation

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project provides a comprehensive solution for automated documentation generation. GitSmartDocs automatically generates professional README files for your repositories on every push.

## Features

- Automated document generation from codebase
- Smart content suggestions powered by AI
- Integration with popular development tools
- Customizable templates for different project types
- Real-time GitHub integration

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## API Reference

### Generate

\`\`\`javascript
docs.generate(options)
\`\`\`

## Contributing

Contributions welcome! Please submit pull requests.

## License

MIT License`,
  },
  {
    id: 'demo-2',
    repo_name: 'tamil8481/GitSmartDocs',
    commit_message: 'Add installation section',
    template: 'simple',
    suggestions: [],
    pushed_at: '2026-06-06T23:26:33',
    generated_readme: `# GitSmartDocs

Add installation section

## Quick Start

Get started with this project quickly and easily.

### Installation

\`\`\`bash
npm install
\`\`\`

### Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT`,
  },
  {
    id: 'demo-3',
    repo_name: 'tamil8481/GitSmartDocs',
    commit_message: 'Improve usage guide',
    template: 'simple',
    suggestions: [],
    pushed_at: '2026-06-06T23:26:27',
    generated_readme: `# GitSmartDocs

Improve usage guide

## Quick Start

Get started with this project quickly and easily.

### Installation

\`\`\`bash
npm install
\`\`\`

### Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT`,
  },
  {
    id: 'demo-4',
    repo_name: 'tamil8481/GitSmartDocs',
    commit_message: 'Update contributing section',
    template: 'simple',
    suggestions: [],
    pushed_at: '2026-06-06T23:26:21',
    generated_readme: `# GitSmartDocs

Update contributing section

## Quick Start

Get started with this project quickly and easily.

### Installation

\`\`\`bash
npm install
\`\`\`

### Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT`,
  },
  {
    id: 'demo-5',
    repo_name: 'tamil8481/GitSmartDocs',
    commit_message: 'Initial commit',
    template: 'simple',
    suggestions: [],
    pushed_at: '2026-06-06T23:26:14',
    generated_readme: `# GitSmartDocs

Initial commit

## Quick Start

Get started with this project quickly and easily.

### Installation

\`\`\`bash
npm install
\`\`\`

### Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT`,
  },
]

const stats = [
  { icon: 'bolt', title: '100%', text: 'Automated Documentation', tone: 'purple' },
  { icon: 'file', title: 'README', text: 'Updated on Every Push', tone: 'green' },
  { icon: 'refresh', title: 'Real-Time', text: 'GitHub Integration', tone: 'blue' },
  { icon: 'bot', title: 'AI-Assisted', text: 'Content Generation', tone: 'orange' },
]

const features = [
  {
    icon: 'file',
    title: 'Automated Document Generation',
    text: 'Automatically generate comprehensive documentation from your codebase.',
    tone: 'purple',
  },
  {
    icon: 'bulb',
    title: 'Smart Content Suggestions',
    text: 'AI-powered suggestions to improve and enrich your documentation.',
    tone: 'green',
  },
  {
    icon: 'puzzle',
    title: 'Integration with Dev Tools',
    text: 'Seamless integration with popular development tools and GitHub workflows.',
    tone: 'blue',
  },
  {
    icon: 'grid',
    title: 'Customizable Templates',
    text: 'Use customizable templates to match your project needs and maintain consistency.',
    tone: 'orange',
  },
]

const howItWorks = [
  ['1', 'Choose Template', 'Select a template that best fits your project.'],
  ['2', 'Push Code', 'Push your changes to GitHub repository.'],
  ['3', 'Auto Generate', 'GitSmartDocs generates README automatically.'],
  ['4', 'Review & Improve', 'Review smart suggestions and improve documentation.'],
]

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

function getRepoParts(repoName = 'tamil8481/GitSmartDocs') {
  const [owner, name] = repoName.split('/')
  return { owner: owner || 'tamil8481', name: name || repoName || 'GitSmartDocs' }
}

function getSuggestionTitle(suggestion) {
  const section = suggestion.match(/Add (?:a |an |the )?'?([A-Za-z -]+?)'? section/i)?.[1]
  return section ? section.trim() : 'Suggestion'
}

function Icon({ name }) {
  const icons = {
    accept: <path d="M20 6 9 17l-5-5" />,
    bolt: <path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z" />,
    bot: (
      <>
        <rect x="5" y="8" width="14" height="10" rx="3" />
        <path d="M12 8V5" />
        <path d="M9 5h6" />
        <path d="M8 13h.01" />
        <path d="M16 13h.01" />
        <path d="M3 13h2" />
        <path d="M19 13h2" />
      </>
    ),
    briefcase: (
      <>
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M9 7V5h6v2" />
        <path d="M4 12h16" />
      </>
    ),
    bulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8 14a6 6 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5c0-1-.5-2-1.5-3Z" />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),
    github: (
      <path d="M12 2a10 10 0 0 0-3 19c.5.1.7-.2.7-.5v-2c-3 .7-3.6-1.3-3.6-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 2.1 3 1.5.1-.8.4-1.3.7-1.6-2.4-.3-4.9-1.2-4.9-5.3 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1A10 10 0 0 1 12 5c.9 0 1.8.1 2.7.4 2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.1-2.5 5-4.9 5.3.4.3.8 1 .8 2v3c0 .3.2.6.8.5A10 10 0 0 0 12 2Z" />
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),
    network: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="7" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="m8.5 8 3 7" />
        <path d="m15.5 9-3 6" />
        <path d="M9 6h6" />
      </>
    ),
    puzzle: (
      <path d="M14 4a2 2 0 1 0-4 0v2H6a2 2 0 0 0-2 2v4h2a2 2 0 1 1 0 4H4v4a2 2 0 0 0 2 2h4v-2a2 2 0 1 1 4 0v2h4a2 2 0 0 0 2-2v-4h-2a2 2 0 1 1 0-4h2V8a2 2 0 0 0-2-2h-4V4Z" />
    ),
    refresh: (
      <>
        <path d="M20 12a8 8 0 0 1-13.7 5.7" />
        <path d="M4 12A8 8 0 0 1 17.7 6.3" />
        <path d="M17 2v5h5" />
        <path d="M7 22v-5H2" />
      </>
    ),
    rocket: (
      <>
        <path d="M4.5 16.5c-1 1-1.5 3-1.5 4.5 1.5 0 3.5-.5 4.5-1.5" />
        <path d="M9 15 4 10l4-2 6-6 4 4-6 6-3 3Z" />
        <path d="m14 4 6 6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 5h-4l-.4 3a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1l.4 3h4l.4-3a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z" />
      </>
    ),
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function App({ username, onLogout }) {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(fallbackEvents[0])
  const [template, setTemplate] = useState('professional')
  const [ignoredSuggestions, setIgnoredSuggestions] = useState([])
  const [showReadme, setShowReadme] = useState(false)
  const [readmeContent, setReadmeContent] = useState('')
  const [currentPage, setCurrentPage] = useState('home')
  
  // Settings state
  const [settings, setSettings] = useState({
    defaultTemplate: 'professional',
    autoGenerate: true,
    smartSuggestions: true,
    suggestionMode: 'manual',
    notifySuccess: true,
    notifyFailure: true,
    username: 'tamil8481',
    email: 'user@example.com',
    organization: 'GitSmartDocs',
  })

  const REPO = 'tamil8481/GitSmartDocs'

  useEffect(() => {
    fetch(`${API_BASE}/history/`)
      .then((response) => response.json())
      .then((data) => {
        const nextEvents = Array.isArray(data) && data.length > 0 ? data : fallbackEvents
        setEvents(nextEvents)
        setSelected(nextEvents[0])
        setTemplate(nextEvents[0]?.template || 'professional')
      })
      .catch(() => {
        setEvents(fallbackEvents)
        setSelected(fallbackEvents[0])
      })

    // Load saved template from backend
    fetch(`${API_BASE}/template/get/?repo=${REPO}`)
      .then(r => r.json())
      .then(data => setTemplate(data.template))
      .catch(() => {})
  }, [])

  const historyEvents = events.length > 0 ? events : fallbackEvents
  const repo = getRepoParts(selected.repo_name)
  const visibleSuggestions = useMemo(
    () => (selected.suggestions || fallbackEvents[0].suggestions).filter((item) => !ignoredSuggestions.includes(item)),
    [selected, ignoredSuggestions],
  )

  const selectEvent = (event) => {
    setSelected(event)
    setTemplate(event.template || 'professional')
    setIgnoredSuggestions([])
  }

  const viewReadme = (event) => {
    // Use the actual generated README from the backend
    if (event.generated_readme) {
      setReadmeContent(event.generated_readme)
    } else {
      // Fallback: generate template-based content if no generated_readme exists
      const readmeTemplates = {
        simple: `# ${event.repo_name.split('/')[1]}

${event.commit_message}

## Quick Start

Get started with this project quickly and easily.

### Installation

\`\`\`bash
npm install
\`\`\`

### Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT`,
        opensource: `# ${event.repo_name.split('/')[1]}

${event.commit_message}

## Features

- Easy to use and integrate
- Well documented with examples
- Community driven and maintained
- Open source and free to use

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
import { GitSmartDocs } from '@gitsmartdocs/core';

const docs = new GitSmartDocs();
docs.generate();
\`\`\`

## Contributing

We welcome contributions! Please read our contributing guidelines.

## License

MIT License - see LICENSE file for details`,
        professional: `# ${event.repo_name.split('/')[1]}

${event.commit_message}

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project provides a comprehensive solution for automated documentation generation.

## Features

- Automated document generation from codebase
- Smart content suggestions powered by AI
- Integration with popular development tools
- Customizable templates for different project types
- Real-time GitHub integration

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## API Reference

### Generate

\`\`\`javascript
docs.generate(options)
\`\`\`

## Contributing

Contributions welcome! Please submit pull requests.

## License

MIT License`,
      }
      const content = readmeTemplates[event.template || 'simple'] || readmeTemplates.simple
      setReadmeContent(content)
    }
    setShowReadme(true)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span />
          </div>
          <div>
            <h1>
              GitSmart <strong>Docs</strong>
            </h1>
            <p>Auto-generated README on every push</p>
          </div>
        </div>

        <nav className="side-nav">
          <button 
            className={currentPage === 'home' ? 'active' : ''} 
            type="button"
            onClick={() => setCurrentPage('home')}
          >
            <Icon name="home" />
            Home
          </button>
          <button 
            className={currentPage === 'templates' ? 'active' : ''}
            type="button"
            onClick={() => setCurrentPage('templates')}
          >
            <Icon name="file" />
            Templates
          </button>
          <button 
            className={currentPage === 'history' ? 'active' : ''}
            type="button"
            onClick={() => setCurrentPage('history')}
          >
            <Icon name="clock" />
            Push History
          </button>
          <button 
            className={currentPage === 'settings' ? 'active' : ''}
            type="button"
            onClick={() => setCurrentPage('settings')}
          >
            <Icon name="settings" />
            Settings
          </button>
        </nav>
      </aside>

      <main className="workspace">
        <nav className="topbar">
          <div className="breadcrumbs">
            <button className="home-button" type="button" aria-label="Home" onClick={() => setCurrentPage('home')}>
              <Icon name="home" />
            </button>
            <Icon name="chevron" />
            {currentPage === 'home' && (
              <>
                <strong>{repo.owner}</strong>
                <Icon name="chevron" />
                <em>{repo.name}</em>
              </>
            )}
            {currentPage === 'templates' && <strong>Templates</strong>}
            {currentPage === 'history' && <strong>Push History</strong>}
            {currentPage === 'settings' && <strong>Settings</strong>}
          </div>
          <div className="toolbar">
            <span className="username-badge">👤 {username}</span>
            <button type="button" onClick={() => {
              if (selected.repo_name) {
                window.open(`https://github.com/${selected.repo_name}`, '_blank');
              }
            }}>
              <Icon name="github" />
              GitHub
            </button>
            <button type="button" className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>

        {currentPage === 'home' && (
          <div className="page-grid">
            <section className="hero-card">
              <div className="sparkle one">+</div>
              <div className="sparkle two">+</div>
              <div className="hero-mark">
                <span />
              </div>
              <div className="hero-copy">
                <h2>
                  Welcome to <strong>GitSmartDocs!</strong> <Icon name="rocket" />
                </h2>
                <p>Automatically generate professional README files for your repositories.</p>
                <p>Save time, maintain consistency, and focus on building great software.</p>
              </div>
              <div className="stats-strip">
                {stats.map((item) => (
                  <div className="stat-card" key={item.title}>
                    <span className={`round-icon ${item.tone}`}>
                      <Icon name={item.icon} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="main-column">
              <section className="content-section">
                <div className="section-title">
                  <span className="tiny-icon purple">
                    <Icon name="bolt" />
                  </span>
                  <h3>Features</h3>
                </div>
                <div className="features-grid">
                  {features.map((feature) => (
                    <article className="feature-card" key={feature.title}>
                      <span className={`round-icon ${feature.tone}`}>
                        <Icon name={feature.icon} />
                      </span>
                      <strong>{feature.title}</strong>
                      <p>{feature.text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="content-section how-section">
                <div className="section-title">
                  <span className="tiny-icon purple">
                    <Icon name="rocket" />
                  </span>
                  <h3>How It Works</h3>
                </div>
                <div className="steps">
                  {howItWorks.map(([number, title, text]) => (
                    <article className="step-card" key={number}>
                      <span>{number}</span>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="info-banner">
                <Icon name="clock" />
                Your selected template will be applied on the next push to the repository.
              </div>

              <footer>© 2026 GitSmartDocs. All rights reserved.</footer>
            </section>

            <aside className="right-rail">
              <section className="suggestion-panel">
                <div className="panel-heading">
                  <div>
                    <span className="tiny-icon amber">
                      <Icon name="bulb" />
                    </span>
                    <h3>Smart Suggestions</h3>
                  </div>
                  <strong>{visibleSuggestions.length}</strong>
                </div>
                <p>We found some missing sections in your README.</p>
                <div className="suggestion-list">
                  {visibleSuggestions.map((suggestion) => (
                    <article className="suggestion-card" key={suggestion}>
                      <span className="drag-mark">
                        <Icon name="list" />
                      </span>
                      <div>
                        <strong>Add {getSuggestionTitle(suggestion)}</strong>
                        <small>{suggestion}</small>
                      </div>
                      <div className="suggestion-actions">
                        <button type="button" onClick={() => setIgnoredSuggestions((current) => [...current, suggestion])}>
                          Accept
                        </button>
                        <button type="button" onClick={() => setIgnoredSuggestions((current) => [...current, suggestion])}>
                          Ignore
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="status-panel">
                <div className="status-heading">
                  <span className="status-dot">
                    <Icon name="accept" />
                  </span>
                  <strong>Webhook Status</strong>
                  <em>Active</em>
                </div>
                <p>GitHub webhook is connected and listening for push events.</p>
                <button type="button">View Webhook Logs →</button>
              </section>
            </aside>
          </div>
        )}

        {currentPage === 'templates' && (
          <div className="page-templates">
            <div className="template-main-content">
              <h2>Available Templates</h2>
              <p>Choose a template that best fits your project and documentation style.</p>
              <div className="templates-showcase">
                {templateOptions.map((option) => (
                  <div className="template-showcase-card" key={option.id}>
                    <span className={`option-icon ${option.id}`}>
                      <Icon name={option.icon} />
                    </span>
                    <strong>{option.title}</strong>
                    <p>{option.description}</p>
                    <button 
                      className={`select-template-btn ${template === option.id ? 'selected' : ''}`}
                      onClick={() => {
                        setTemplate(option.id)
                        // Save template to backend
                        fetch(`${API_BASE}/template/`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ repo_full_name: REPO, template: option.id })
                        }).catch(() => {})
                      }}
                      type="button"
                    >
                      {template === option.id ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
              <footer>© 2026 GitSmartDocs. All rights reserved.</footer>
            </div>
          </div>
        )}

        {currentPage === 'history' && (
          <div className="page-history">
            <div className="history-main-content">
              <h2>Push History</h2>
              <p>View all push events and their generated READMEs.</p>
              <div className="full-history-list">
                {historyEvents.map((event) => (
                  <div
                    className={`full-history-card ${selected.id === event.id ? 'active' : ''}`}
                    key={event.id}
                    onClick={() => selectEvent(event)}
                  >
                    <div className="history-card-content">
                      <strong>{event.commit_message || 'Update documentation'}</strong>
                      <div className="history-meta">
                        <span className="template-tag">{event.template || 'Simple'}</span>
                        <span className="date-tag">{formatDate(event.pushed_at)}</span>
                      </div>
                      <p className="repo-name">{event.repo_name}</p>
                    </div>
                    <button 
                      className="view-readme-btn" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        viewReadme(event)
                      }}
                    >
                      View README
                    </button>
                  </div>
                ))}
              </div>
              <footer>© 2026 GitSmartDocs. All rights reserved.</footer>
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="page-settings">
            <div className="settings-main-content">
              <h2>Settings</h2>
              <div className="settings-grid">
                {/* Default README Template */}
                <section className="settings-card">
                  <div className="settings-header">
                    <h3>Default README Template</h3>
                    <p>Choose the default template for future repositories</p>
                  </div>
                  <div className="settings-content">
                    <select 
                      value={settings.defaultTemplate}
                      onChange={(e) => setSettings({...settings, defaultTemplate: e.target.value})}
                      className="settings-select"
                    >
                      <option value="simple">Simple</option>
                      <option value="opensource">Open Source</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                </section>

                {/* Auto-Generate Toggle */}
                <section className="settings-card">
                  <div className="settings-header">
                    <h3>Auto-Generate Toggle</h3>
                    <p>Enable or disable automatic README generation on every push</p>
                  </div>
                  <div className="settings-content">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.autoGenerate}
                        onChange={(e) => setSettings({...settings, autoGenerate: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-label">{settings.autoGenerate ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>
                </section>

                {/* Smart Suggestions Toggle */}
                <section className="settings-card">
                  <div className="settings-header">
                    <h3>Smart Suggestions Toggle</h3>
                    <p>Turn AI-powered content suggestions on or off</p>
                  </div>
                  <div className="settings-content">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.smartSuggestions}
                        onChange={(e) => setSettings({...settings, smartSuggestions: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-label">{settings.smartSuggestions ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>
                </section>

                {/* Suggestion Acceptance Mode */}
                <section className="settings-card">
                  <div className="settings-header">
                    <h3>Suggestion Acceptance Mode</h3>
                    <p>Choose automatic or manual approval for suggestions</p>
                  </div>
                  <div className="settings-content">
                    <div className="mode-toggle">
                      <button 
                        className={`mode-btn ${settings.suggestionMode === 'manual' ? 'active' : ''}`}
                        onClick={() => setSettings({...settings, suggestionMode: 'manual'})}
                      >
                        👤 Manual Approval
                      </button>
                      <button 
                        className={`mode-btn ${settings.suggestionMode === 'auto' ? 'active' : ''}`}
                        onClick={() => setSettings({...settings, suggestionMode: 'auto'})}
                      >
                        🤖 Auto Apply
                      </button>
                    </div>
                  </div>
                </section>

                {/* Notification Preferences */}
                <section className="settings-card">
                  <div className="settings-header">
                    <h3>Notification Preferences</h3>
                    <p>Receive alerts when README generation succeeds or fails</p>
                  </div>
                  <div className="settings-content">
                    <div className="notification-prefs">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notifySuccess}
                          onChange={(e) => setSettings({...settings, notifySuccess: e.target.checked})}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Success Notifications</span>
                      </label>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.notifyFailure}
                          onChange={(e) => setSettings({...settings, notifyFailure: e.target.checked})}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Failure Alerts</span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Profile Information */}
                <section className="settings-card large">
                  <div className="settings-header">
                    <h3>Profile Information</h3>
                    <p>Update your personal details</p>
                  </div>
                  <div className="settings-content">
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        value={settings.username}
                        onChange={(e) => setSettings({...settings, username: e.target.value})}
                        className="settings-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="settings-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Organization</label>
                      <input 
                        type="text" 
                        value={settings.organization}
                        onChange={(e) => setSettings({...settings, organization: e.target.value})}
                        className="settings-input"
                      />
                    </div>
                  </div>
                </section>

                {/* Webhook Logs */}
                <section className="settings-card large">
                  <div className="settings-header">
                    <h3>Webhook Logs</h3>
                    <p>View recent webhook events for debugging</p>
                  </div>
                  <div className="settings-content">
                    <div className="webhook-logs">
                      <div className="log-entry success">
                        <span className="log-status">✓</span>
                        <div className="log-info">
                          <strong>Webhook Received</strong>
                          <small>Repository: tamil8481/GitSmartDocs</small>
                          <time>Today at 11:30 AM</time>
                        </div>
                      </div>
                      <div className="log-entry success">
                        <span className="log-status">✓</span>
                        <div className="log-info">
                          <strong>README Generated</strong>
                          <small>Template: Professional</small>
                          <time>Today at 11:29 AM</time>
                        </div>
                      </div>
                      <div className="log-entry success">
                        <span className="log-status">✓</span>
                        <div className="log-info">
                          <strong>GitHub Sync</strong>
                          <small>README pushed to main branch</small>
                          <time>Today at 11:28 AM</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* GitHub Repository Settings */}
                <section className="settings-card large">
                  <div className="settings-header">
                    <h3>GitHub Repository Settings</h3>
                    <p>Manage connected repositories and webhook status</p>
                  </div>
                  <div className="settings-content">
                    <div className="repo-list">
                      <div className="repo-item">
                        <div className="repo-info">
                          <strong>tamil8481/GitSmartDocs</strong>
                          <small>🟢 Webhook Active</small>
                        </div>
                        <button className="remove-btn">Disconnect</button>
                      </div>
                    </div>
                    <button className="add-repo-btn">+ Add Repository</button>
                  </div>
                </section>
              </div>

              <div className="settings-actions">
                <button className="save-settings-btn">Save All Settings</button>
                <button className="reset-settings-btn">Reset to Defaults</button>
              </div>

              <footer>© 2026 GitSmartDocs. All rights reserved.</footer>
            </div>
          </div>
        )}
      </main>

      {showReadme && (
        <div className="readme-modal-overlay" onClick={() => setShowReadme(false)}>
          <div className="readme-modal" onClick={(e) => e.stopPropagation()}>
            <div className="readme-modal-header">
              <h2>Generated README</h2>
              <button 
                type="button" 
                className="close-button"
                onClick={() => setShowReadme(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="readme-modal-content">
              <pre>{readmeContent}</pre>
            </div>
            <div className="readme-modal-footer">
              <button type="button" onClick={() => setShowReadme(false)}>
                Close
              </button>
              <button 
                type="button" 
                className="primary"
                onClick={() => {
                  navigator.clipboard.writeText(readmeContent)
                  alert('README copied to clipboard!')
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
