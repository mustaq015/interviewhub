// Data - will be loaded from localStorage
let companies = [];

const defaultCompanies = [
    {
        id: 1,
        name: 'Google',
        icon: '🔍',
        gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
        rounds: 5,
        updated: '15 days ago',
        notes: [
            {
                id: 1,
                topic: 'Interview Process',
                content: 'Google typically has 4-5 rounds including phone screen, technical interviews, and team matching.'
            }
        ],
        questions: [
            {
                id: 1,
                title: 'Describe how a hash table works?',
                tags: ['Data Structures', 'Algorithms', 'JavaScript', 'Python'],
                round: 'Technical (Alg/DS)',
                answer: `A hash table works by converting a key into an index using a hash function. Here's how it operates:

1. **Hash Function**: Takes a key and converts it to an array index
2. **Collision Handling**: Deals with multiple keys mapping to the same index
3. **Operations**: O(1) average time complexity for insert, delete, and lookup operations`,
                code: `class HashTable {
  constructor() {
    this.table = new Array(127);
    this.size = 0;
  }
  
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.table.length;
  }
  
  set(key, value) {
    const index = this._hash(key);
    this.table[index] = [key, value];
    this.size++;
  }
  
  get(key) {
    const index = this._hash(key);
    return this.table[index];
  }
}`
            }
        ]
    },
    { id: 2, name: 'Stripe', icon: '💳', gradient: 'linear-gradient(135deg, #635BFF 0%, #4F46E5 100%)', rounds: 5, updated: '17 days ago', notes: [], questions: [] },
    { id: 3, name: 'Microsoft', icon: '🪟', gradient: 'linear-gradient(135deg, #00A4EF 0%, #0078D4 100%)', rounds: 5, updated: '17 days ago', notes: [], questions: [] },
    { id: 4, name: 'Netflix', icon: '🎬', gradient: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)', rounds: 5, updated: '17 days ago', notes: [], questions: [] },
    { id: 5, name: 'Startup', icon: '🚀', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', rounds: 2, updated: '23 mins ago', notes: [], questions: [] },
    { id: 6, name: 'Startups', icon: '🌟', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', rounds: 3, updated: '17 days ago', notes: [], questions: [] },
    { id: 7, name: 'Mimidin', icon: '🎯', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', rounds: 2, updated: '17 hours ago', notes: [], questions: [] },
    { id: 8, name: 'Framework', icon: '⚡', gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', rounds: 5, updated: '15 minutes ago', notes: [], questions: [] },
    { id: 9, name: 'Virat', icon: '🏏', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', rounds: 3, updated: '4 days ago', notes: [], questions: [] }
];

const roundTypes = [
    { name: 'Initial Screen', color: '#3B82F6' },
    { name: 'Technical (Alg/DS)', color: '#8B5CF6' },
    { name: 'Behavioral', color: '#10B981' },
    { name: 'Systems Design', color: '#F59E0B' }
];

const allTags = ['Data Structures', 'Algorithms', 'JavaScript', 'Python', 'System Design', 'Behavioral'];
let selectedTags = [];
let currentCompany = null;
let currentRound = null;
let currentQuestionTags = [];
let editingNoteId = null;

// Color gradients for new companies
const companyGradients = [
    'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
    'linear-gradient(135deg, #635BFF 0%, #4F46E5 100%)',
    'linear-gradient(135deg, #00A4EF 0%, #0078D4 100%)',
    'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
];

// localStorage functions
function _ghCoreSaveToLocalStorage() {
    localStorage.setItem('interviewhub_companies', JSON.stringify(companies));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('interviewhub_companies');
    if (stored) {
        companies = JSON.parse(stored);
    } else {
        companies = defaultCompanies;
        saveToLocalStorage();
    }
}

function updateCompanyTimestamp(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        company.updated = 'Just now';
        saveToLocalStorage();
    }
}

// Initialize
function init() {
    loadFromLocalStorage();
    renderCompanies();
    setupSearch();
    setupTagInput();
}

// Render Companies Grid
function renderCompanies() {
    const grid = document.getElementById('companiesGrid');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    grid.innerHTML = companies.map((company, index) => {
        let interviewBadge = '';
        if (company.interviewDate) {
            const interviewDate = new Date(company.interviewDate);
            const daysUntil = Math.ceil((interviewDate - today) / (1000 * 60 * 60 * 24));
            let urgencyColor = '#10B981'; // Green
            let urgencyIcon = '🟢';
            if (daysUntil < 0) {
                urgencyColor = '#94a3b8'; // Gray (past)
                urgencyIcon = '⚪';
            } else if (daysUntil <= 7) {
                urgencyColor = '#ef4444'; // Red
                urgencyIcon = '🔴';
            } else if (daysUntil <= 14) {
                urgencyColor = '#F59E0B'; // Yellow
                urgencyIcon = '🟡';
            }
            interviewBadge = `
                <div style="margin-top: 0.5rem; padding: 0.5rem; background: ${urgencyColor}15; border-radius: 6px; border-left: 3px solid ${urgencyColor};">
                    <div style="font-size: 0.75rem; font-weight: 600; color: ${urgencyColor};">
                        ${urgencyIcon} ${daysUntil < 0 ? 'Past' : daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                    </div>
                    <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.125rem;">
                        ${interviewDate.toLocaleDateString()}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="company-card" style="animation-delay: ${index * 50}ms" onclick="showCompanyDetail(${company.id})">
                <div class="company-header">
                    <div class="company-info">
                        <div class="company-icon" style="background: ${company.gradient}">
                            ${company.icon}
                        </div>
                        <div class="company-meta">
                            <div class="company-name">${company.name}</div>
                            <div class="rounds-count">${company.rounds} Rounds</div>
                            <div class="last-updated">Last Updated ${company.updated}</div>
                        </div>
                    </div>
                    <div style="position:relative;" onclick="event.stopPropagation()">
                        <button class="more-btn" onclick="toggleCompanyMenu(${company.id}, event)" id="cmBtn${company.id}">⋮</button>
                        <div id="cm${company.id}" style="display:none;position:absolute;right:0;top:100%;background:white;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.12);min-width:140px;z-index:500;overflow:hidden;">
                            <button onclick="editCompanyFromCard(${company.id})" style="width:100%;text-align:left;padding:0.625rem 1rem;border:none;background:none;cursor:pointer;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;color:#475569;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='none'">✏️ Edit</button>
                            <button onclick="deleteCompany(${company.id})" style="width:100%;text-align:left;padding:0.625rem 1rem;border:none;background:none;cursor:pointer;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;color:#ef4444;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='none'">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
                ${interviewBadge}
            </div>
        `;
    }).join('');
}

// Show Company Detail
function showCompanyDetail(companyId) {
    currentCompany = companies.find(c => c.id === companyId);
    if (!currentCompany) return;

    // Initialize notes array if it doesn't exist (for backward compatibility)
    if (!currentCompany.notes) {
        currentCompany.notes = [];
    }

    document.getElementById('companiesView').style.display = 'none';
    document.getElementById('companyDetail').classList.add('active');

    // Update header
    document.getElementById('detailIcon').style.background = currentCompany.gradient;
    document.getElementById('detailIcon').textContent = currentCompany.icon;
    document.getElementById('detailName').textContent = currentCompany.name;
    document.getElementById('detailRounds').textContent = `${currentCompany.rounds} Rounds`;
    document.getElementById('detailUpdated').textContent = `Updated ${currentCompany.updated}`;

    // Render notes
    renderNotes();

    // Render rounds
    renderRounds();

    // Render tags
    renderTags();

    // Set initial round
    currentRound = roundTypes[1].name; // Technical (Alg/DS)
    renderQuestions();

    // Start FAB scroll watcher
    fabStartWatcher();
}

// Show Companies View
function showCompaniesView() {
    document.getElementById('companiesView').style.display = 'block';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'none';
    document.getElementById('resourcesView').style.display = 'none';
    document.getElementById('notebooksView').style.display = 'none';
    currentCompany = null;
    currentRound = null;
    editingNoteId = null;
    fabHide();
}

// ── Floating Add Question Button ──────────────────────────────
let fabWatcherActive = false;
function fabStartWatcher() {
    fabWatcherActive = true;
    window.addEventListener('scroll', fabScrollHandler);
    setTimeout(fabScrollHandler, 200); // check after render
}
function fabHide() {
    fabWatcherActive = false;
    window.removeEventListener('scroll', fabScrollHandler);
    const fab = document.getElementById('fabAddQuestion');
    if (fab) fab.style.display = 'none';
}
function fabScrollHandler() {
    if (!fabWatcherActive) return;
    const qHeader = document.querySelector('.questions-header');
    const fab = document.getElementById('fabAddQuestion');
    if (!qHeader || !fab) return;
    const rect = qHeader.getBoundingClientRect();
    // Show FAB when the Add Question button header scrolls out of view
    if (rect.bottom < 0) {
        fab.style.display = 'flex';
    } else {
        fab.style.display = 'none';
    }
}

// Notes Functions
function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    
    if (!currentCompany.notes || currentCompany.notes.length === 0) {
        notesGrid.innerHTML = `
            <div class="notes-empty-state">
                <div class="notes-empty-state-icon">📝</div>
                <h3>No notes yet</h3>
                <p>Create your first note topic to get started</p>
            </div>
        `;
        return;
    }

    notesGrid.innerHTML = currentCompany.notes.map(note => {
        const isEditing = editingNoteId === note.id;
        return `
            <div class="note-card ${isEditing ? 'editing' : ''}" id="note-${note.id}">
                <div class="note-card-header">
                    <div class="note-topic">${note.topic}</div>
                    <div class="note-actions">
                        ${!isEditing ? `
                            <button class="note-btn" onclick="startEditNote(${note.id})" title="Edit">✏️</button>
                            <button class="note-btn" onclick="deleteNote(${note.id})" title="Delete">🗑️</button>
                        ` : ''}
                    </div>
                </div>
                ${!isEditing ? `
                    <div class="note-content ${!note.content || !note.content.trim() ? 'empty' : ''}"
                         onclick="startEditNote(${note.id})">
                        ${note.content && note.content.trim() ? escapeHtml(note.content) : 'Click to add notes...'}
                    </div>
                ` : `
                    <textarea class="note-textarea" id="noteTextarea-${note.id}">${note.content || ''}</textarea>
                    <div class="note-save-actions">
                        <button class="btn-small btn-small-primary" onclick="saveNoteEdit(${note.id})">Save</button>
                        <button class="btn-small btn-small-secondary" onclick="cancelNoteEdit()">Cancel</button>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function openAddNoteModal() {
    if (!currentCompany) return;
    openModal('addNoteModal');
}

function submitNote(event) {
    event.preventDefault();
    
    const topic = document.getElementById('noteTopic').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    const newId = currentCompany.notes.length > 0 
        ? Math.max(...currentCompany.notes.map(n => n.id)) + 1 
        : 1;
    
    const newNote = {
        id: newId,
        topic: topic,
        content: content
    };
    
    currentCompany.notes.push(newNote);
    updateCompanyTimestamp(currentCompany.id);
    
    renderNotes();
    closeModal('addNoteModal');
}

function startEditNote(noteId) {
    editingNoteId = noteId;
    renderNotes();
    
    // Focus the textarea
    setTimeout(() => {
        const textarea = document.getElementById(`noteTextarea-${noteId}`);
        if (textarea) {
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }, 0);
}

function saveNoteEdit(noteId) {
    const textarea = document.getElementById(`noteTextarea-${noteId}`);
    const note = currentCompany.notes.find(n => n.id === noteId);
    
    if (note && textarea) {
        note.content = textarea.value;
        updateCompanyTimestamp(currentCompany.id);
    }
    
    editingNoteId = null;
    renderNotes();
}

function cancelNoteEdit() {
    editingNoteId = null;
    renderNotes();
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        currentCompany.notes = currentCompany.notes.filter(n => n.id !== noteId);
        updateCompanyTimestamp(currentCompany.id);
        renderNotes();
    }
}

// Render Rounds
function renderRounds() {
    const roundsList = document.getElementById('roundsList');
    roundsList.innerHTML = roundTypes.map((round, index) => `
        <div class="round-card ${index === 1 ? 'active' : ''}" 
             style="background: linear-gradient(135deg, ${round.color}15 0%, ${round.color}25 100%); color: ${round.color}"
             onclick="selectRound('${round.name}', this)">
            <div class="round-number">Round ${index + 1}:</div>
            <div class="round-name">${round.name}</div>
        </div>
    `).join('');
}

// Select Round
function selectRound(roundName, element) {
    document.querySelectorAll('.round-card').forEach(card => {
        card.classList.remove('active');
    });
    element.classList.add('active');
    currentRound = roundName;
    document.getElementById('currentRoundTitle').textContent = roundName;
    document.getElementById('questionRound').value = roundName;
    // Update FAB label
    const fab = document.getElementById('fabAddQuestion');
    if (fab) fab.innerHTML = `<span>➕</span> Add Question`;
    renderQuestions();
}

// Render Tags
function renderTags() {
    const tagsFilter = document.getElementById('tagsFilter');
    tagsFilter.innerHTML = allTags.map(tag => `
        <div class="tag ${selectedTags.includes(tag) ? 'active' : ''}" onclick="toggleTag('${tag}')">
            ${tag}
        </div>
    `).join('');
}

// Toggle Tag
function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
    } else {
        selectedTags.push(tag);
    }
    renderTags();
    renderQuestions();
}

// Render Questions
function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    
    if (!currentCompany || !currentCompany.questions || currentCompany.questions.length === 0) {
        questionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No questions added yet</h3>
                <p>Start by adding your first interview question</p>
            </div>
            <button onclick="addQuestion()" style="width:100%;margin-top:0.75rem;padding:0.875rem;border:2px dashed #cbd5e1;border-radius:12px;background:transparent;color:#64748b;font-size:0.875rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:all 0.2s;"
                onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#eff6ff';"
                onmouseout="this.style.borderColor='#cbd5e1';this.style.color='#64748b';this.style.background='transparent';">
                ➕ Add Question
            </button>
        `;
        return;
    }

    let filteredQuestions = currentCompany.questions.filter(q => q.round === currentRound);
    
    if (selectedTags.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
            selectedTags.some(tag => q.tags.includes(tag))
        );
    }

    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No questions match your filters</h3>
                <p>Try adjusting your tag selections</p>
            </div>
        `;
        return;
    }

    questionsList.innerHTML = filteredQuestions.map((question, idx) => `
        <div class="question-card" id="qcard-${question.id}">
            <!-- Header row: number badge + title + actions -->
            <div class="qcard-header" onclick="toggleQuestion(${question.id})">
                <div class="qcard-num">${idx + 1}</div>
                <div class="qcard-title">${typeof marked !== 'undefined' ? marked.parse(question.title || '').replace(/^<p>([\s\S]*)<\/p>\n?$/, '$1') : escapeHtml(question.title)}</div>
                <div class="qcard-actions" onclick="event.stopPropagation()">
                    <button onclick="editQuestion(${question.id})"
                        style="border:none;background:#eff6ff;color:#3B82F6;padding:0.3rem 0.65rem;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;transition:all 0.2s;white-space:nowrap;"
                        onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">✏️ Edit</button>
                    <button onclick="deleteQuestion(${question.id})"
                        style="border:none;background:#fef2f2;color:#ef4444;padding:0.3rem 0.65rem;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;transition:all 0.2s;white-space:nowrap;"
                        onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">🗑️</button>
                </div>
            </div>
            <!-- Tags + meta row -->
            ${(question.tags.length > 0 || question.round) ? `
            <div class="qcard-meta" onclick="toggleQuestion(${question.id})">
                ${question.tags.map(tag => `<span class="question-tag">${escapeHtml(tag)}</span>`).join('')}
                <span class="qcard-round">📋 ${escapeHtml(question.round)}</span>
            </div>` : ''}
            <!-- Expandable answer -->
            <div class="question-answer" id="answer-${question.id}">
                <div class="answer-section">
                    <h4>Answer</h4>
                    <div class="answer-md">${typeof marked !== 'undefined' ? marked.parse(question.answer || '') : (question.answer||'').split('\n').join('<br>')}</div>
                </div>
                ${question.code ? `
                    <div class="answer-section">
                        <h4>Code Example</h4>
                        <div class="code-block"><code>${escapeHtml(question.code)}</code></div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('') + `
        <button onclick="addQuestion()" style="width:100%;margin-top:0.75rem;padding:0.875rem;border:2px dashed #cbd5e1;border-radius:12px;background:transparent;color:#64748b;font-size:0.875rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:all 0.2s;"
            onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#eff6ff';"
            onmouseout="this.style.borderColor='#cbd5e1';this.style.color='#64748b';this.style.background='transparent';">
            ➕ Add Question
        </button>`;
}

// Toggle Question Answer
function toggleQuestion(questionId) {
    const answerEl = document.getElementById(`answer-${questionId}`);
    if (answerEl.classList.contains('expanded')) {
        answerEl.classList.remove('expanded');
    } else {
        // Close all other answers
        document.querySelectorAll('.question-answer').forEach(el => {
            el.classList.remove('expanded');
        });
        answerEl.classList.add('expanded');
    }
}

// Comprehensive Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        clearBtn.style.display = query ? 'flex' : 'none';
        
        searchTimeout = setTimeout(() => {
            if (query === '') {
                document.getElementById('companiesView').style.display = 'block';
                document.getElementById('companyDetail').classList.remove('active');
                document.getElementById('notesView').style.display = 'none';
                document.getElementById('resourcesView').style.display = 'none';
                document.getElementById('notebooksView').style.display = 'none';
                renderCompanies();
                return;
            }
            performGlobalSearch(query);
        }, 300);
    });
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    searchInput.value = '';
    clearBtn.style.display = 'none';
    document.getElementById('companiesView').style.display = 'block';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'none';
    document.getElementById('resourcesView').style.display = 'none';
    document.getElementById('notebooksView').style.display = 'none';
    renderCompanies();
    searchInput.focus();
}

function performGlobalSearch(query) {
    const lowerQuery = query.toLowerCase();
    const queryTerms = lowerQuery.split(' ').filter(t => t.length > 0);
    const results = {
        companies: [],
        questions: [],
        tags: new Set(),
        notes: [],
        resources: []
    };

    // Helper function to calculate relevance score (Google-like)
    function calculateRelevance(text, field = 'normal') {
        if (!text) return 0;
        
        const lowerText = text.toLowerCase();
        let score = 0;
        
        // Exact match bonus
        if (lowerText === lowerQuery) {
            score += 100;
        }
        
        // Contains full query bonus
        if (lowerText.includes(lowerQuery)) {
            score += 50;
        }
        
        // Word-by-word matching with fuzzy logic
        queryTerms.forEach(term => {
            // Exact word match
            const words = lowerText.split(/\s+/);
            if (words.includes(term)) {
                score += 20;
            }
            
            // Partial word match (fuzzy)
            else if (words.some(word => word.includes(term) || term.includes(word))) {
                score += 10;
            }
            
            // Contains term anywhere
            else if (lowerText.includes(term)) {
                score += 5;
            }
            
            // Fuzzy match - check if term is similar
            else {
                words.forEach(word => {
                    const similarity = calculateSimilarity(term, word);
                    if (similarity > 0.7) {
                        score += 8 * similarity;
                    }
                });
            }
        });
        
        // Field importance multiplier
        const fieldWeights = {
            'title': 2.0,
            'name': 1.8,
            'tag': 1.5,
            'normal': 1.0
        };
        
        return score * (fieldWeights[field] || 1.0);
    }
    
    // Levenshtein distance for fuzzy matching
    function calculateSimilarity(str1, str2) {
        if (str1.length < 3 || str2.length < 3) return 0;
        
        const matrix = [];
        const n = str1.length;
        const m = str2.length;
        
        for (let i = 0; i <= n; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= m; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        const maxLen = Math.max(n, m);
        return 1 - (matrix[n][m] / maxLen);
    }

    // Search through companies with scoring
    companies.forEach(company => {
        let companyMatch = {
            company: company,
            matchedQuestions: [],
            matchedInName: false,
            matchedInNotes: false,
            relevanceScore: 0
        };

        // Check company name
        const nameScore = calculateRelevance(company.name, 'name');
        if (nameScore > 0) {
            companyMatch.matchedInName = true;
            companyMatch.relevanceScore += nameScore;
        }

        // Check company notes (array of note objects)
        const notesText = Array.isArray(company.notes) 
            ? company.notes.map(n => (n.topic || '') + ' ' + (n.content || '')).join(' ')
            : (company.notes || '');
        const notesScore = calculateRelevance(notesText, 'normal');
        if (notesScore > 0) {
            companyMatch.matchedInNotes = true;
            companyMatch.relevanceScore += notesScore * 0.5; // Notes less important
        }

        // Search through questions
        if (company.questions) {
            company.questions.forEach(question => {
                let questionScore = 0;

                // Check title (high priority)
                questionScore += calculateRelevance(question.title, 'title');

                // Check tags (medium priority)
                if (question.tags) {
                    question.tags.forEach(tag => {
                        const tagScore = calculateRelevance(tag, 'tag');
                        if (tagScore > 0) {
                            questionScore += tagScore;
                            results.tags.add(tag);
                        }
                    });
                }

                // Check answer
                questionScore += calculateRelevance(question.answer, 'normal') * 0.8;

                // Check code
                questionScore += calculateRelevance(question.code, 'normal') * 0.6;

                if (questionScore > 0) {
                    companyMatch.matchedQuestions.push({
                        ...question,
                        relevanceScore: questionScore
                    });
                    companyMatch.relevanceScore += questionScore;
                }
            });
        }

        // If any match found, add to results
        if (companyMatch.matchedInName || companyMatch.matchedInNotes || companyMatch.matchedQuestions.length > 0) {
            results.companies.push(companyMatch);
        }
    });

    // Sort companies by relevance score (Google-like)
    results.companies.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Search through global notes
    loadGlobalNotes();
    globalNotes.categories.forEach(category => {
        const content = globalNotes.content[category.id] || '';
        const noteScore = calculateRelevance(content, 'normal');
        
        if (noteScore > 0) {
            results.notes.push({
                category: category,
                content: content,
                relevanceScore: noteScore
            });
        }
    });

    // Sort notes by relevance
    results.notes.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Search through resources
    loadResources();
    resources.forEach(resource => {
        let resourceScore = 0;
        
        // Check title (high priority)
        resourceScore += calculateRelevance(resource.title, 'title');
        
        // Check category (medium priority)
        resourceScore += calculateRelevance(resource.category, 'tag');
        
        // Check URL for keyword matches
        resourceScore += calculateRelevance(resource.url, 'normal') * 0.3;
        
        // Boost important resources
        if (resource.important) {
            resourceScore *= 1.2;
        }
        
        if (resourceScore > 0) {
            results.resources.push({
                ...resource,
                relevanceScore: resourceScore
            });
        }
    });
    
    // Sort resources by relevance
    results.resources.sort((a, b) => b.relevanceScore - a.relevanceScore);

    displaySearchResults(query, results);
}

function displaySearchResults(query, results) {
    // Ensure correct view state for search results
    document.getElementById('companiesView').style.display = 'block';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'none';
    document.getElementById('resourcesView').style.display = 'none';
    document.getElementById('notebooksView').style.display = 'none';

    const grid = document.getElementById('companiesGrid');
    
    const totalResults = results.companies.length + results.notes.length + results.resources.length;
    
    if (totalResults === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or check your spelling</p>
            </div>
        `;
        return;
    }

    let html = '';

    // Show search header
    html += `
        <div style="grid-column: 1 / -1; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: white; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem;">
                        Search Results for "<span style="color: #3B82F6;">${escapeHtml(query)}</span>"
                    </h3>
                    <p style="font-size: 0.875rem; color: #64748b;">
                        Found ${results.companies.length} companies, ${results.companies.reduce((sum, c) => sum + c.matchedQuestions.length, 0)} questions
                        ${results.notes.length > 0 ? `, ${results.notes.length} note categories` : ''}
                        ${results.resources.length > 0 ? `, ${results.resources.length} resources` : ''}
                        ${results.tags.size > 0 ? `, ${results.tags.size} matching tags` : ''}
                    </p>
                </div>
                <button class="btn-secondary" onclick="clearSearch()">
                    <span>✕</span> Clear Search
                </button>
            </div>
        </div>
    `;

    // Display matching companies
    results.companies.forEach((match, index) => {
        const company = match.company;
        const matchReasons = [];
        
        if (match.matchedInName) matchReasons.push('Company name');
        if (match.matchedInNotes) matchReasons.push('Company notes');
        if (match.matchedQuestions.length > 0) matchReasons.push(`${match.matchedQuestions.length} question(s)`);

        html += `
            <div class="company-card" style="animation-delay: ${index * 50}ms" onclick="showCompanyDetail(${company.id})">
                <div class="company-header">
                    <div class="company-info">
                        <div class="company-icon" style="background: ${company.gradient}">
                            ${company.icon}
                        </div>
                        <div class="company-meta">
                            <div class="company-name">${highlightText(company.name, query)}</div>
                            <div class="rounds-count">${company.rounds} Rounds</div>
                            <div class="last-updated">Matches: ${matchReasons.join(', ')}</div>
                        </div>
                    </div>
                    <button class="more-btn" onclick="event.stopPropagation(); deleteCompany(${company.id})">⋮</button>
                </div>
                ${match.matchedQuestions.length > 0 ? `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                        <div style="font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.5rem;">MATCHING QUESTIONS:</div>
                        ${match.matchedQuestions.slice(0, 3).map(q => `
                            <div style="font-size: 0.875rem; color: #475569; margin-bottom: 0.25rem;">
                                • ${highlightText(q.title, query)}
                            </div>
                        `).join('')}
                        ${match.matchedQuestions.length > 3 ? `
                            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;">
                                +${match.matchedQuestions.length - 3} more questions
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    });

    // Display matching notes
    if (results.notes.length > 0) {
        html += `
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
                <h3 style="font-size: 0.875rem; font-weight: 700; color: #64748b; margin-bottom: 1rem;">MATCHING NOTES</h3>
            </div>
        `;
        
        results.notes.forEach(note => {
            const preview = getContextPreview(note.content, query, 150);
            html += `
                <div class="company-card" onclick="showNotesView(); selectNoteCategory(${note.category.id})">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; border-radius: 10px; background: ${note.category.color}20; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                            📔
                        </div>
                        <div>
                            <div style="font-weight: 700; color: #0f172a;">${note.category.name}</div>
                            <div style="font-size: 0.75rem; color: #64748b;">Global Notes</div>
                        </div>
                    </div>
                    <div style="font-size: 0.875rem; color: #475569; line-height: 1.5;">
                        ${highlightText(preview, query)}
                    </div>
                </div>
            `;
        });
    }

    // Display matching resources
    if (results.resources.length > 0) {
        html += `
            <div style="grid-column: 1 / -1; margin-top: 1rem;">
                <h3 style="font-size: 0.875rem; font-weight: 700; color: #64748b; margin-bottom: 1rem;">MATCHING RESOURCES</h3>
            </div>
        `;
        
        results.resources.slice(0, 10).forEach((resource, index) => {
            html += `
                <div class="company-card" style="animation-delay: ${index * 50}ms;" onclick="window.open('${resource.url}', '_blank')">
                    <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: ${getCategoryColor(resource.category)}20; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                📚
                            </div>
                            <div>
                                <div style="font-weight: 700; color: #0f172a;">${highlightText(resource.title, query)}</div>
                                <div style="font-size: 0.75rem; color: #64748b;">
                                    <span style="background: ${getCategoryColor(resource.category)}; color: white; padding: 0.125rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">${resource.category}</span>
                                    ${resource.url.startsWith('http') ? 'External Link' : 'Document'}
                                </div>
                            </div>
                        </div>
                        ${resource.important ? '<span style="font-size: 1.25rem;">⭐</span>' : ''}
                    </div>
                </div>
            `;
        });
        
        if (results.resources.length > 10) {
            html += `
                <div style="grid-column: 1 / -1; text-align: center; margin-top: 1rem;">
                    <button class="btn-secondary" onclick="showResourcesView()">
                        View all ${results.resources.length} resources →
                    </button>
                </div>
            `;
        }
    }

    grid.innerHTML = html;
}

function highlightText(text, query) {
    if (!text) return '';
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark style="background: #FEF08A; padding: 0 0.125rem; border-radius: 2px; font-weight: 600;">$1</mark>');
}

function getContextPreview(text, query, maxLength) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text.substring(0, maxLength) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 100);
    
    let preview = text.substring(start, end);
    if (start > 0) preview = '...' + preview;
    if (end < text.length) preview = preview + '...';
    
    return preview;
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    // Reset forms
    if (modalId === 'addCompanyModal') {
        document.getElementById('addCompanyForm').reset();
    } else if (modalId === 'addQuestionModal') {
        document.getElementById('addQuestionForm').reset();
        currentQuestionTags = [];
        renderQuestionTags();
    } else if (modalId === 'addNoteModal') {
        document.getElementById('addNoteForm').reset();
    } else if (modalId === 'addCategoryModal') {
        document.getElementById('addCategoryForm').reset();
    } else if (modalId === 'editCategoryModal') {
        document.getElementById('editCategoryForm').reset();
    } else if (modalId === 'editCompanyModal') {
        document.getElementById('editCompanyForm').reset();
    } else if (modalId === 'addResourceModal') {
        document.getElementById('addResourceForm').reset();
    } else if (modalId === 'editResourceModal') {
        document.getElementById('editResourceForm').reset();
    } else if (modalId === 'addTopicModal') {
        document.getElementById('addTopicForm').reset();
    }
}

// Tag Input Setup
function setupTagInput() {
    const tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = tagInput.value.trim();
            if (value && !currentQuestionTags.includes(value)) {
                currentQuestionTags.push(value);
                renderQuestionTags();
                tagInput.value = '';
            }
        }
    });
}

function renderQuestionTags() {
    const container = document.getElementById('tagInputContainer');
    const tagInput = document.getElementById('tagInput');
    
    // Remove all tag items
    container.querySelectorAll('.tag-input-item').forEach(item => item.remove());
    
    // Add tag items
    currentQuestionTags.forEach((tag, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag-input-item';
        tagEl.innerHTML = `
            ${tag}
            <button type="button" onclick="removeQuestionTag(${index})">×</button>
        `;
        container.insertBefore(tagEl, tagInput);
    });
}

function removeQuestionTag(index) {
    currentQuestionTags.splice(index, 1);
    renderQuestionTags();
}

// Add Company
function addCompany() {
    openModal('addCompanyModal');
}

function submitCompany(event) {
    event.preventDefault();
    
    const name = document.getElementById('companyName').value.trim();
    const icon = document.getElementById('companyIcon').value.trim();
    const rounds = parseInt(document.getElementById('companyRounds').value);
    const interviewDate = document.getElementById('companyInterviewDate').value || null;
    
    const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    const gradient = companyGradients[newId % companyGradients.length];
    
    const newCompany = {
        id: newId,
        name: name,
        icon: icon,
        gradient: gradient,
        rounds: rounds,
        interviewDate: interviewDate,
        updated: 'Just now',
        notes: [],
        questions: []
    };
    
    companies.push(newCompany);
    saveToLocalStorage();
    renderCompanies();
    closeModal('addCompanyModal');
}

// Edit Company
function editCurrentCompany() {
    if (!currentCompany) return;
    
    // Pre-fill the form
    document.getElementById('editCompanyId').value = currentCompany.id;
    document.getElementById('editCompanyName').value = currentCompany.name;
    document.getElementById('editCompanyIcon').value = currentCompany.icon;
    document.getElementById('editCompanyRounds').value = currentCompany.rounds;
    document.getElementById('editCompanyInterviewDate').value = currentCompany.interviewDate || '';
    
    openModal('editCompanyModal');
}

function submitEditCompany(event) {
    event.preventDefault();
    
    const companyId = parseInt(document.getElementById('editCompanyId').value);
    const name = document.getElementById('editCompanyName').value.trim();
    const icon = document.getElementById('editCompanyIcon').value.trim();
    const rounds = parseInt(document.getElementById('editCompanyRounds').value);
    const interviewDate = document.getElementById('editCompanyInterviewDate').value || null;
    
    // Find and update company
    const company = companies.find(c => c.id === companyId);
    if (company) {
        company.name = name;
        company.icon = icon;
        company.rounds = rounds;
        company.interviewDate = interviewDate;
        updateCompanyTimestamp(companyId);
        
        // Update current company if it's the one being viewed
        if (currentCompany && currentCompany.id === companyId) {
            currentCompany.name = name;
            currentCompany.icon = icon;
            currentCompany.rounds = rounds;
            currentCompany.interviewDate = interviewDate;
            
            // Update detail view
            document.getElementById('detailIcon').textContent = icon;
            document.getElementById('detailName').textContent = name;
            document.getElementById('detailRounds').textContent = `${rounds} Rounds`;
        }
        
        renderCompanies();
        closeModal('editCompanyModal');
    }
}

// Add Question
function addQuestion() {
    if (!currentCompany) return;

    // Clear all fields
    document.getElementById('addQuestionForm').reset();
    document.getElementById('questionTitle').value = '';
    document.getElementById('questionAnswer').value = '';
    document.getElementById('questionCode').value = '';

    // Set the round dropdown to current round
    document.getElementById('questionRound').value = currentRound;

    // Clear tags
    currentQuestionTags = [];
    renderQuestionTags();

    openModal('addQuestionModal');
}

function submitQuestion(event) {
    event.preventDefault();
    
    const title = document.getElementById('questionTitle').value.trim();
    const round = document.getElementById('questionRound').value;
    const answer = document.getElementById('questionAnswer').value.trim();
    const code = document.getElementById('questionCode').value.trim();

    if (!title) { alert('Please enter a question title.'); return; }
    
    const newId = currentCompany.questions.length > 0 
        ? Math.max(...currentCompany.questions.map(q => q.id)) + 1 
        : 1;
    
    const newQuestion = {
        id: newId,
        title: title,
        round: round,
        tags: [...currentQuestionTags],
        answer: answer,
        code: code
    };
    
    currentCompany.questions.push(newQuestion);
    updateCompanyTimestamp(currentCompany.id);
    saveToLocalStorage();
    
    // Reset form
    document.getElementById('addQuestionForm').reset();
    currentQuestionTags = [];
    renderQuestionTags();

    renderQuestions();
    closeModal('addQuestionModal');
}

function editQuestion(questionId) {
    if (!currentCompany) return;
    const question = currentCompany.questions.find(q => q.id === questionId);
    if (!question) return;

    // Pre-fill form
    document.getElementById('editQuestionId').value = question.id;
    document.getElementById('editQuestionTitle').value = question.title;
    document.getElementById('editQuestionRound').value = question.round;
    document.getElementById('editQuestionAnswer').value = question.answer;
    document.getElementById('editQuestionCode').value = question.code || '';

    // Load tags into edit tag container
    currentEditQuestionTags = [...question.tags];
    renderEditQuestionTags();

    openModal('editQuestionModal');
}

function submitEditQuestion(event) {
    event.preventDefault();
    if (!currentCompany) return;

    const id = parseInt(document.getElementById('editQuestionId').value);
    const question = currentCompany.questions.find(q => q.id === id);
    if (!question) return;

    question.title  = document.getElementById('editQuestionTitle').value.trim();
    question.round  = document.getElementById('editQuestionRound').value;
    question.answer = document.getElementById('editQuestionAnswer').value.trim();
    question.code   = document.getElementById('editQuestionCode').value.trim();
    question.tags   = [...currentEditQuestionTags];

    updateCompanyTimestamp(currentCompany.id);
    renderQuestions();
    closeModal('editQuestionModal');

    // Re-expand if it was open
    setTimeout(() => {
        const el = document.getElementById('answer-' + id);
        if (el) el.classList.add('expanded');
    }, 50);
}

function deleteQuestion(questionId) {
    if (!currentCompany) return;
    const question = currentCompany.questions.find(q => q.id === questionId);
    if (!question) return;
    if (!confirm(`Delete question?\n\n"${question.title}"\n\nThis cannot be undone.`)) return;
    currentCompany.questions = currentCompany.questions.filter(q => q.id !== questionId);
    updateCompanyTimestamp(currentCompany.id);
    renderQuestions();
}

// Tag management for edit modal
let currentEditQuestionTags = [];

function renderEditQuestionTags() {
    const container = document.getElementById('editTagInputContainer');
    if (!container) return;
    // Remove existing tag spans
    container.querySelectorAll('.question-tag-pill').forEach(el => el.remove());
    const input = document.getElementById('editTagInput');
    currentEditQuestionTags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'question-tag-pill';
        span.style.cssText = 'display:inline-flex;align-items:center;gap:0.25rem;background:#eff6ff;color:#3B82F6;padding:0.2rem 0.6rem;border-radius:12px;font-size:0.78rem;font-weight:600;margin:0.15rem;';
        span.innerHTML = `${escapeHtml(tag)} <span onclick="removeEditTag('${escapeHtml(tag)}')" style="cursor:pointer;font-size:1rem;line-height:1;color:#94a3b8;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">×</span>`;
        container.insertBefore(span, input);
    });
}

function removeEditTag(tag) {
    currentEditQuestionTags = currentEditQuestionTags.filter(t => t !== tag);
    renderEditQuestionTags();
}

// Wire up edit tag input Enter key
document.addEventListener('DOMContentLoaded', () => {
    const editTagInput = document.getElementById('editTagInput');
    if (editTagInput) {
        editTagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = editTagInput.value.trim();
                if (val && !currentEditQuestionTags.includes(val)) {
                    currentEditQuestionTags.push(val);
                    renderEditQuestionTags();
                }
                editTagInput.value = '';
            }
        });
    }
});

// Delete Company
function deleteCompany(companyId) {
    if (confirm('Are you sure you want to delete this company? All questions will be lost.')) {
        companies = companies.filter(c => c.id !== companyId);
        saveToLocalStorage();
        renderCompanies();
    }
}

// Global Notes Functionality
let globalNotes = {
    categories: [
        { id: 1, name: 'General Notes', color: '#3B82F6' },
        { id: 2, name: 'Common Patterns', color: '#10B981' },
        { id: 3, name: 'Resources', color: '#F59E0B' }
    ],
    content: {}, // Deprecated - keeping for backward compatibility
    topics: {} // New structure: { categoryId: [{ id, title, content, created }] }
};
let currentCategory = null;
let currentTopic = null;

// Resources Functionality
let resources = [];
let currentResourceCategory = 'ALL';
let showImportantOnly = false;

const defaultResources = [
    // SELF Category
    { id: 1, title: 'Self Introduction', url: 'Self Introduction.pdf', category: 'SELF', important: false },
    { id: 2, title: 'Project Architecture', url: 'Project architecture.pdf', category: 'SELF', important: false },
    { id: 3, title: 'Bug Life Cycle', url: 'bug life cycle.pdf', category: 'SELF', important: false },
    { id: 4, title: 'SCD Type 2', url: 'SCD2 Type.pdf', category: 'SELF', important: false },
    { id: 5, title: 'Resume', url: 'project/NIKHIL CV.pdf', category: 'SELF', important: false },
    
    // DWH Category
    { id: 6, title: 'Data Warehouse', url: 'Data Warehouse.pdf', category: 'DWH', important: false },
    { id: 7, title: 'Normalization', url: 'Normalization.pdf', category: 'DWH', important: false },
    { id: 8, title: 'Dimension & Fact Table', url: 'Dimension Table and Fact table.pdf', category: 'DWH', important: false },
    { id: 9, title: 'Schema', url: 'Schema.pdf', category: 'DWH', important: false },
    { id: 10, title: 'Challenges in DWH', url: 'ETL/Challenges in DWH.pdf', category: 'DWH', important: false },
    
    // SQL Category
    { id: 11, title: 'SQL DDL', url: 'SQL DDL.pdf', category: 'SQL', important: false },
    { id: 12, title: 'DML', url: 'DML.pdf', category: 'SQL', important: false },
    { id: 13, title: 'NULL Functions', url: 'NULL FUNCTIONS.pdf', category: 'SQL', important: true },
    { id: 14, title: 'Execution & Compilation & Logical Operators', url: 'excution & compilation &logical Operators.pdf', category: 'SQL', important: false },
    { id: 15, title: 'SET Operators', url: 'SET OPERATORS.pdf', category: 'SQL', important: true },
    { id: 16, title: 'Aggregate Functions', url: 'AGGREGATE FUNCTIONS.pdf', category: 'SQL', important: true },
    { id: 17, title: 'Analytical Functions/Windows Functions', url: 'Analytical Function or Windows Functions.pdf', category: 'SQL', important: true },
    { id: 18, title: 'Joins', url: 'Join.pdf', category: 'SQL', important: true },
    { id: 19, title: 'Constraints & Like Operators', url: 'Constraints & like operators.pdf', category: 'SQL', important: true },
    { id: 20, title: 'Sub Query', url: 'ETL/Sub Query.pdf', category: 'SQL', important: true },
    
    // ETL Category
    { id: 21, title: 'ETL Intro', url: 'ETL Intro.pdf', category: 'ETL', important: false },
    { id: 22, title: 'Informatica Workflow and Monitor', url: 'ETL/workflow & monitor.pdf', category: 'ETL', important: true },
    { id: 23, title: 'Data Completeness Test', url: 'ETL/Data completeness test.pdf', category: 'ETL', important: true },
    { id: 24, title: 'STM Document', url: 'ETL/STM document.pdf', category: 'ETL', important: false },
    { id: 25, title: 'Rules for Testcase', url: 'ETL/rules to create testcase.pdf', category: 'ETL', important: true },
    { id: 26, title: 'Data Transformation Test', url: 'ETL/Data transformation Test.pdf', category: 'ETL', important: true },
    { id: 27, title: 'Test Scenario for Initial and Incremental Load', url: 'ETL/test scenario for initial and incremental.pdf', category: 'ETL', important: false },
    { id: 28, title: 'Checking Duplicate in Target Table', url: 'ETL/checking duplicate in target table.pdf', category: 'ETL', important: false },
    { id: 29, title: 'Source & Record Count', url: 'ETL/source and record count.pdf', category: 'ETL', important: false },
    
    // TRANSFORMATION Category
    { id: 30, title: 'Aggregate Transformation', url: 'ETL/aggregator tansformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 31, title: 'Filter Transformation', url: 'ETL/filter Transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 32, title: 'Expression Transformation', url: 'ETL/expression transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 33, title: 'Router Transformation', url: 'ETL/Router Transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 34, title: 'Active & Passive Transformation', url: 'ETL/active and passive transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 35, title: 'Sorter Transformation', url: 'ETL/sorter transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 36, title: 'Joiner Transformation', url: 'ETL/joiner transformation.pdf', category: 'TRANSFORMATION', important: true },
    { id: 37, title: 'Lookup Transformation', url: 'ETL/lookup transformation.pdf', category: 'TRANSFORMATION', important: true },
    
    // DIFFERENCES & VIEWS
    { id: 38, title: 'All Differences', url: 'all differences.pdf', category: 'OTHER', important: true },
    { id: 39, title: 'Index', url: 'ETL/Index.pdf', category: 'OTHER', important: false },
    { id: 40, title: 'Views', url: 'ETL/view.pdf', category: 'OTHER', important: false },
    { id: 41, title: 'TOAD', url: 'ETL/Toad.pdf', category: 'OTHER', important: false },
    
    // MANUAL Testing
    { id: 42, title: 'Agile', url: 'manual/Agile.pdf', category: 'MANUAL', important: false },
    { id: 43, title: 'Agile Sir Notes', url: 'manual/Agile1.pdf', category: 'MANUAL', important: false },
    { id: 44, title: 'Types of Documents', url: 'manual/types of documents.pdf', category: 'MANUAL', important: false },
    { id: 45, title: 'Levels of Testing', url: 'manual/levels of testing.pdf', category: 'MANUAL', important: false },
    { id: 46, title: 'STLC', url: 'manual/STLC.pdf', category: 'MANUAL', important: false },
    { id: 47, title: 'Test Methodology & Traceability Matrix', url: 'manual/test methodology.pdf', category: 'MANUAL', important: true },
    { id: 48, title: 'Priority & Severity', url: 'manual/priority and severity.png', category: 'MANUAL', important: false },
    { id: 49, title: 'STLC Test Plan', url: 'manual/STLC Test Plan.png', category: 'MANUAL', important: false },
    { id: 50, title: 'Test Case Template', url: 'manual/test case template.png', category: 'MANUAL', important: true },
    { id: 51, title: 'RTM Document', url: 'manual/RTM.png', category: 'MANUAL', important: false },
    
    // QUERY & PROJECT
    { id: 52, title: 'SQL Query Practice', url: 'QUERY/query.pdf', category: 'OTHER', important: false },
    { id: 53, title: 'ETL Project', url: 'project/ETL project.pdf', category: 'ETL', important: true },
    
    // EXTERNAL LINKS
    { id: 54, title: 'HP ALM Dashboard', url: 'https://www.guru99.com/hp-alm-dashboard.html', category: 'MANUAL', important: false },
    { id: 55, title: 'JIRA Tutorial', url: 'https://www.guru99.com/jira-interview-questions.html', category: 'MANUAL', important: false },
    { id: 56, title: 'ETL Challenges Faced', url: 'https://www.tutorialspoint.com/etl_testing/etl_testing_challenges.htm#', category: 'ETL', important: false },
    { id: 57, title: 'Types of Bugs in ETL', url: 'https://www.pavantestingtools.com/2014/08/types-of-etl-bugs.html', category: 'ETL', important: false },
    { id: 58, title: 'JIRA Board', url: 'manual/JIRA BOARD.webp', category: 'MANUAL', important: false }
];

function loadResources() {
    const stored = localStorage.getItem('interviewhub_resources');
    if (stored) {
        resources = JSON.parse(stored);
    } else {
        resources = [...defaultResources];
        saveResources();
    }
}

function _ghCoreSaveResources() {
    localStorage.setItem('interviewhub_resources', JSON.stringify(resources));
}

function showResourcesView() {
    document.getElementById('companiesView').style.display = 'none';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'none';
    document.getElementById('resourcesView').style.display = 'block';
    document.getElementById('notebooksView').style.display = 'none';
    
    loadResources();
    renderResourceCategories();
    renderResources();
}

function renderResourceCategories() {
    const categoriesList = document.getElementById('resourceCategoriesList');
    const categories = ['ALL', 'SELF', 'DWH', 'SQL', 'ETL', 'TRANSFORMATION', 'MANUAL', 'OTHER'];
    const categoryColors = {
        'ALL': '#6366F1',
        'SELF': '#3B82F6',
        'DWH': '#8B5CF6',
        'SQL': '#10B981',
        'ETL': '#F59E0B',
        'TRANSFORMATION': '#EC4899',
        'MANUAL': '#14B8A6',
        'OTHER': '#64748b'
    };
    
    categoriesList.innerHTML = categories.map(cat => {
        const color = categoryColors[cat];
        const count = cat === 'ALL' ? resources.length : resources.filter(r => r.category === cat).length;
        return `
            <div class="round-card ${currentResourceCategory === cat ? 'active' : ''}" 
                 style="background: linear-gradient(135deg, ${color}15 0%, ${color}25 100%); color: ${color}"
                 onclick="selectResourceCategory('${cat}')">
                <div class="round-name">${cat}</div>
                <div class="round-number" style="font-size: 0.75rem; opacity: 0.8;">${count} items</div>
            </div>
        `;
    }).join('');
}

function selectResourceCategory(category) {
    currentResourceCategory = category;
    showImportantOnly = false;
    renderResourceCategories();
    renderResources();
    document.getElementById('currentResourceCategoryTitle').textContent = 
        category === 'ALL' ? 'All Resources' : `${category} Resources`;
}

function filterImportantResources(btn) {
    showImportantOnly = !showImportantOnly;
    renderResources();
    if (showImportantOnly) {
        btn.style.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
        btn.style.color = 'white';
        btn.style.border = 'none';
    } else {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.border = '';
    }
}

function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    
    let filteredResources = resources;
    
    // Filter by category
    if (currentResourceCategory !== 'ALL') {
        filteredResources = filteredResources.filter(r => r.category === currentResourceCategory);
    }
    
    // Filter by importance
    if (showImportantOnly) {
        filteredResources = filteredResources.filter(r => r.important);
    }
    
    if (filteredResources.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📚</div>
                <h3>No resources found</h3>
                <p>Add your first resource using the button above</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredResources.map(resource => `
        <div class="question-card" style="cursor: default; position: relative;">
            ${resource.important ? '<span style="position: absolute; top: 1rem; right: 1rem; font-size: 1.25rem;">⭐</span>' : ''}
            <div style="display: flex; align-items: start; gap: 0.75rem; margin-bottom: 0.75rem;">
                <input type="checkbox" ${resource.read ? 'checked' : ''} 
                       onchange="toggleResourceRead(${resource.id})" 
                       style="margin-top: 0.25rem; width: 18px; height: 18px; cursor: pointer;" 
                       title="Mark as read">
                <div class="question-title" style="flex: 1; padding-right: ${resource.important ? '2rem' : '0'}; ${resource.read ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
                    ${escapeHtml(resource.title)}
                </div>
            </div>
            <div class="question-meta" style="margin-top: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap:wrap;">
                    <span style="background: ${getCategoryColor(resource.category)}; color: white; padding: 0.25rem 0.625rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">
                        ${resource.category}
                    </span>
                    ${resource.read ? '<span style="font-size: 0.75rem; color: #10B981;">✓ Read</span>' : ''}
                    ${(resource.url || resource.notes) ? `
                    <button onclick="openResourcePopup(${resource.id})"
                        style="border:1px solid #e2e8f0;background:white;color:#3B82F6;padding:0.2rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;transition:all 0.2s;display:flex;align-items:center;gap:0.3rem;"
                        onmouseover="this.style.background='#eff6ff';this.style.borderColor='#3B82F6'" onmouseout="this.style.background='white';this.style.borderColor='#e2e8f0'">
                        ${resource.url && resource.notes ? '🔗📝' : resource.url ? '🔗' : '📝'} View
                    </button>` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="event.stopPropagation(); editResource(${resource.id})" style="border: none; background: transparent; cursor: pointer; color: #94a3b8; padding: 0.25rem;" 
                            onmouseover="this.style.color='#3B82F6'" onmouseout="this.style.color='#94a3b8'" title="Edit">✏️</button>
                    <button onclick="event.stopPropagation(); deleteResource(${resource.id})" style="border: none; background: transparent; cursor: pointer; color: #94a3b8; padding: 0.25rem;" 
                            onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryColor(category) {
    const colors = {
        'SELF': '#3B82F6',
        'DWH': '#8B5CF6',
        'SQL': '#10B981',
        'ETL': '#F59E0B',
        'TRANSFORMATION': '#EC4899',
        'MANUAL': '#14B8A6',
        'OTHER': '#64748b'
    };
    return colors[category] || '#64748b';
}

function addResource() {
    openModal('addResourceModal');
}

function deleteResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        resources = resources.filter(r => r.id !== resourceId);
        saveResources();
        renderResourceCategories();
        renderResources();
    }
}

// ── Resource URL Browse & Preview ─────────────────────────────
let _resourceFileData = {}; // store base64 data keyed by inputId

function browseResourceFile(inputId, previewId) {
    const pickerId = inputId === 'resourceUrl' ? 'resourceFilePicker' : 'editResourceFilePicker';
    // Store which input to target
    document.getElementById(pickerId)._targetInput = inputId;
    document.getElementById(pickerId)._targetPreview = previewId;
    document.getElementById(pickerId).click();
}

function handleResourceFilePick(event, inputId, previewId) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { alert('File too large. Max 20MB.'); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        _resourceFileData[inputId] = { name: file.name, dataUrl: e.target.result, type: file.type, size: file.size };
        // Put a pseudo-url placeholder in the input so form validation passes
        document.getElementById(inputId).value = 'local:' + file.name;
        showResourceUrlPreview(inputId, previewId, file.name, file.type, e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function previewResourceUrl(inputId, previewId) {
    const val = document.getElementById(inputId).value.trim();
    const preview = document.getElementById(previewId);
    // If they cleared the field, also clear stored file data
    if (!val) { preview.style.display = 'none'; delete _resourceFileData[inputId]; return; }
    // Don't show preview for local: (already handled by handleResourceFilePick)
    if (val.startsWith('local:')) return;
    // Show a small URL chip preview
    const icon = getUrlIcon(val);
    preview.style.display = 'block';
    preview.innerHTML = `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.75rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:0.8rem;">
        <span>${icon}</span>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#166534;">${escapeHtml(val)}</span>
        <a href="${escapeHtml(val)}" target="_blank" style="color:#16a34a;font-weight:600;white-space:nowrap;text-decoration:none;">↗ Open</a>
    </div>`;
}

function showResourceUrlPreview(inputId, previewId, name, type, dataUrl) {
    const preview = document.getElementById(previewId);
    preview.style.display = 'block';
    const size = _resourceFileData[inputId]?.size;
    const sizeStr = size ? (' · ' + (size < 1048576 ? (size/1024).toFixed(1)+' KB' : (size/1048576).toFixed(1)+' MB')) : '';
    const icon = type.startsWith('image/') ? '🖼️' : type === 'application/pdf' ? '📕' : name.match(/\.(mp4|webm|mov)$/) ? '🎬' : name.match(/\.(mp3|wav|ogg)$/) ? '🎵' : name.match(/\.(py|js|sql|sh|java|cpp)$/) ? '💻' : name.match(/\.(csv|xlsx?)$/) ? '📊' : '📄';
    let thumbHtml = '';
    if (type.startsWith('image/')) thumbHtml = `<img src="${dataUrl}" style="height:36px;width:36px;object-fit:cover;border-radius:4px;border:1px solid #bbf7d0;">`;
    preview.innerHTML = `<div style="display:flex;align-items:center;gap:0.625rem;padding:0.5rem 0.75rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:0.8rem;">
        ${thumbHtml || `<span style="font-size:1.25rem;">${icon}</span>`}
        <div style="flex:1;min-width:0;">
            <div style="font-weight:600;color:#166534;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(name)}</div>
            <div style="color:#4ade80;font-size:0.72rem;">Local file${sizeStr}</div>
        </div>
        <button type="button" onclick="clearResourceFile('${inputId}','${previewId}')" style="border:none;background:transparent;cursor:pointer;color:#94a3b8;font-size:1.1rem;line-height:1;" title="Clear">×</button>
    </div>`;
}

function clearResourceFile(inputId, previewId) {
    document.getElementById(inputId).value = '';
    document.getElementById(previewId).style.display = 'none';
    delete _resourceFileData[inputId];
}

function getUrlIcon(url) {
    if (!url) return '🔗';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return '▶️';
    if (url.includes('github.com')) return '🐱';
    if (url.includes('docs.google.com/document')) return '📑';
    if (url.includes('docs.google.com/spreadsheet')) return '📊';
    if (url.includes('docs.google.com/presentation')) return '🗂️';
    if (url.includes('medium.com') || url.includes('dev.to') || url.includes('hashnode')) return '📰';
    if (url.includes('stackoverflow.com')) return '📚';
    if (url.includes('linkedin.com')) return '💼';
    if (url.includes('.pdf')) return '📕';
    return '🔗';
}

function submitResource(event) {
    event.preventDefault();
    const urlInput = document.getElementById('resourceUrl');
    const fileData = _resourceFileData['resourceUrl'];
    if (fileData) urlInput.value = fileData.dataUrl;
    const title = document.getElementById('resourceTitle').value.trim();
    const category = document.getElementById('resourceCategory').value;
    const url = urlInput.value.trim();
    const important = document.getElementById('resourceImportant').checked;
    const notes = document.getElementById('resourceNotes').value.trim();
    if (!title || !url) return;
    const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    resources.push({ id: newId, title, category, url, important, notes, added: new Date().toLocaleDateString() });
    saveResources();
    renderResources();
    renderResourceCategories();
    closeModal('addResourceModal');
    document.getElementById('resourceNotes').value = '';
    delete _resourceFileData['resourceUrl'];
    clearResourceFile('resourceUrl', 'resourceUrlPreview');
}

function submitEditResource(event) {
    event.preventDefault();
    const urlInput = document.getElementById('editResourceUrl');
    const fileData = _resourceFileData['editResourceUrl'];
    if (fileData) urlInput.value = fileData.dataUrl;
    const id = parseInt(document.getElementById('editResourceId').value);
    const title = document.getElementById('editResourceTitle').value.trim();
    const category = document.getElementById('editResourceCategory').value;
    const url = urlInput.value.trim();
    const important = document.getElementById('editResourceImportant').checked;
    const notes = document.getElementById('editResourceNotes').value.trim();
    if (!title || !url) return;
    const resource = resources.find(r => r.id === id);
    if (resource) { resource.title = title; resource.category = category; resource.url = url; resource.important = important; resource.notes = notes; }
    saveResources();
    renderResources();
    renderResourceCategories();
    closeModal('editResourceModal');
    delete _resourceFileData['editResourceUrl'];
    clearResourceFile('editResourceUrl', 'editResourceUrlPreview');
}

function editResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    document.getElementById('editResourceId').value = resource.id;
    document.getElementById('editResourceTitle').value = resource.title;
    document.getElementById('editResourceCategory').value = resource.category;
    document.getElementById('editResourceUrl').value = resource.url;
    document.getElementById('editResourceImportant').checked = resource.important;
    document.getElementById('editResourceNotes').value = resource.notes || '';
    openModal('editResourceModal');
    setTimeout(() => {
        const url = document.getElementById('editResourceUrl').value;
        if (url && !url.startsWith('data:')) previewResourceUrl('editResourceUrl', 'editResourceUrlPreview');
        else document.getElementById('editResourceUrlPreview').style.display = 'none';
    }, 50);
}

function loadGlobalNotes() {
    const stored = localStorage.getItem('interviewhub_global_notes');
    if (stored) {
        globalNotes = JSON.parse(stored);
        // Initialize topics if it doesn't exist (backward compatibility)
        if (!globalNotes.topics) {
            globalNotes.topics = {};
            globalNotes.categories.forEach(cat => {
                globalNotes.topics[cat.id] = [];
            });
        }
    } else {
        // Initialize with default templates and empty topics
        globalNotes.categories.forEach(cat => {
            globalNotes.content[cat.id] = getDefaultTemplate(cat.name);
            globalNotes.topics[cat.id] = [];
        });
        saveGlobalNotes();
    }
}

function getDefaultTemplate(categoryName) {
    const templates = {
        'General Notes': `Write your notes here...

Tips:
• Use this for general interview prep notes
• Jot down common patterns and approaches
• Save useful resources and links
• Track your progress and insights`,
        
        'Common Patterns': `Common Interview Patterns

Data Structures:
• Arrays & Strings
• Hash Tables
• Trees & Graphs
• Linked Lists

Algorithms:
• Two Pointers
• Sliding Window
• Binary Search
• DFS/BFS

Tips:
• Identify pattern first
• Start with brute force
• Optimize step by step`,
        
        'Resources': `Useful Resources & Links

Websites:
• LeetCode
• HackerRank
• System Design Primer

Books:
• Cracking the Coding Interview
• System Design Interview

Notes:
• Add your favorite resources here
• Track courses and tutorials`
    };
    
    return templates[categoryName] || `${categoryName}

Write your notes here...

Tips:
• Use this for ${categoryName.toLowerCase()} notes
• Organize your thoughts
• Track your learning`;
}

function _ghCoreSaveGlobalNotes() {
    localStorage.setItem('interviewhub_global_notes', JSON.stringify(globalNotes));
}

function showNotesView() {
    document.getElementById('companiesView').style.display = 'none';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'block';
    document.getElementById('resourcesView').style.display = 'none';
    document.getElementById('notebooksView').style.display = 'none';
    
    loadGlobalNotes();
    renderNoteCategories();
    
    // Select first category
    if (globalNotes.categories.length > 0) {
        selectNoteCategory(globalNotes.categories[0].id);
    }
}

function renderNoteCategories() {
    const categoriesList = document.getElementById('noteCategoriesList');
    const categoryColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#14B8A6'];
    
    categoriesList.innerHTML = globalNotes.categories.map((category, index) => {
        const color = category.color || categoryColors[index % categoryColors.length];
        const isDefault = category.id <= 3; // Default categories (General Notes, Common Patterns, Resources)
        return `
            <div class="round-card ${currentCategory && currentCategory.id === category.id ? 'active' : ''}" 
                 style="background: linear-gradient(135deg, ${color}15 0%, ${color}25 100%); color: ${color}; position: relative;"
                 onclick="selectNoteCategory(${category.id})">
                <div class="round-name">${category.name}</div>
                ${!isDefault ? `
                    <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.25rem;">
                        <button onclick="event.stopPropagation(); editNoteCategory(${category.id})" 
                                style="background: white; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; opacity: 0.8;"
                                onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'"
                                title="Edit category">
                            ✏️
                        </button>
                        <button onclick="event.stopPropagation(); deleteNoteCategory(${category.id})" 
                                style="background: white; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; opacity: 0.8;"
                                onmouseover="this.style.opacity='1'; this.style.background='#fee2e2'" onmouseout="this.style.opacity='0.8'; this.style.background='white'"
                                title="Delete category">
                            🗑️
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function selectNoteCategory(categoryId) {
    currentCategory = globalNotes.categories.find(c => c.id === categoryId);
    if (!currentCategory) return;
    currentTopic = null;
    document.getElementById('noTopicSelected').style.display = 'flex';
    document.getElementById('editorContainer').style.display = 'none';
    document.getElementById('saveTopicBtn').style.display = 'none';
    document.getElementById('deleteTopicBtn').style.display = 'none';
    document.getElementById('previewMdBtn').style.display = 'none';
    document.getElementById('exportMdBtn').style.display = 'none';
    document.getElementById('importMdBtn').style.display = 'none';
    document.getElementById('attachBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
    document.getElementById('formatBtn').style.display = 'none';
    document.getElementById('markdownToolbar').style.display = 'none';
    document.getElementById('attachmentsPanel').style.display = 'none';
    document.getElementById('fileViewer').style.display = 'none';
    document.getElementById('currentTopicTitle').textContent = 'Select a topic';
    renderNoteCategories();
    renderTopicsIndex();
}

function saveCurrentNote(btn) {
    if (!currentCategory) return;
    
    const content = document.getElementById('globalNotesTextarea').value;
    globalNotes.content[currentCategory.id] = content;
    saveGlobalNotes();
    
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>✓</span> Saved!';
    btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    setTimeout(() => { btn.innerHTML = originalHTML; btn.style.background = ''; }, 2000);
}

function clearCurrentNote() {
    if (!currentCategory) return;
    
    if (confirm('Are you sure you want to clear all notes in this category?')) {
        document.getElementById('globalNotesTextarea').value = '';
        globalNotes.content[currentCategory.id] = '';
        saveGlobalNotes();
    }
}

function addNoteCategory() {
    openModal('addCategoryModal');
}

function submitNoteCategory(event) {
    event.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const categoryColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#14B8A6'];
    
    const newId = globalNotes.categories.length > 0 
        ? Math.max(...globalNotes.categories.map(c => c.id)) + 1 
        : 1;
    
    const newCategory = {
        id: newId,
        name: name,
        color: categoryColors[newId % categoryColors.length]
    };
    
    globalNotes.categories.push(newCategory);
    globalNotes.content[newId] = getDefaultTemplate(name);
    globalNotes.topics[newId] = []; // Initialize topics array for new category
    saveGlobalNotes();
    
    renderNoteCategories();
    selectNoteCategory(newId);
    closeModal('addCategoryModal');
}

function editNoteCategory(categoryId) {
    const category = globalNotes.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Pre-fill the form
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.name;
    
    openModal('editCategoryModal');
}

function submitEditNoteCategory(event) {
    event.preventDefault();
    
    const categoryId = parseInt(document.getElementById('editCategoryId').value);
    const name = document.getElementById('editCategoryName').value.trim();
    
    const category = globalNotes.categories.find(c => c.id === categoryId);
    if (category) {
        category.name = name;
        saveGlobalNotes();
        
        // Update current category if it's the one being edited
        if (currentCategory && currentCategory.id === categoryId) {
            currentCategory.name = name;
        }
        
        renderNoteCategories();
        closeModal('editCategoryModal');
    }
}

function deleteNoteCategory(categoryId) {
    const category = globalNotes.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Prevent deleting default categories
    if (categoryId <= 3) {
        alert('Cannot delete default categories');
        return;
    }
    
    const topicsCount = (globalNotes.topics[categoryId] || []).length;
    const confirmMsg = topicsCount > 0 
        ? `Are you sure you want to delete "${category.name}"?\n\nThis will also delete ${topicsCount} topic(s).`
        : `Are you sure you want to delete "${category.name}"?`;
    
    if (!confirm(confirmMsg)) return;
    
    // Remove category
    const index = globalNotes.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        globalNotes.categories.splice(index, 1);
    }
    
    // Remove associated data
    delete globalNotes.content[categoryId];
    delete globalNotes.topics[categoryId];
    
    saveGlobalNotes();
    
    // Clear selection if deleted category was selected
    if (currentCategory && currentCategory.id === categoryId) {
        currentCategory = null;
        currentTopic = null;
        document.getElementById('noTopicSelected').style.display = 'flex';
        document.getElementById('globalNotesTextarea').style.display = 'none';
        document.getElementById('saveTopicBtn').style.display = 'none';
        document.getElementById('deleteTopicBtn').style.display = 'none';
        document.getElementById('currentTopicTitle').textContent = 'Select a topic';
        renderTopicsIndex();
    }
    
    renderNoteCategories();
    
    // Select first category if available
    if (globalNotes.categories.length > 0 && !currentCategory) {
        selectNoteCategory(globalNotes.categories[0].id);
    }
}

// Topic Management Functions
function renderTopicsIndex() {
    const indexList = document.getElementById('topicsIndexList');
    
    if (!currentCategory) {
        indexList.innerHTML = '<div style="padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.875rem;">Select a category first</div>';
        return;
    }
    
    const topics = globalNotes.topics[currentCategory.id] || [];
    
    if (topics.length === 0) {
        indexList.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.875rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                <p>No topics yet</p>
                <p style="font-size: 0.75rem; margin-top: 0.25rem;">Click ➕ to add your first topic</p>
            </div>
        `;
        return;
    }
    
    indexList.innerHTML = topics.map((topic, index) => `
        <div onclick="selectTopic(${topic.id})" 
             class="topic-index-item ${currentTopic && currentTopic.id === topic.id ? 'active' : ''}"
             style="padding: 0.875rem 1rem; border-bottom: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; ${currentTopic && currentTopic.id === topic.id ? 'background: #eff6ff; border-left: 3px solid #3B82F6;' : 'border-left: 3px solid transparent;'}"
             onmouseover="if(!this.classList.contains('active')) this.style.background='#f8fafc'"
             onmouseout="if(!this.classList.contains('active')) this.style.background=''">
            <div style="display: flex; align-items: start; justify-content: space-between;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.875rem; color: #0f172a; margin-bottom: 0.25rem;">${index + 1}. ${topic.title}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${formatDate(topic.created)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function addNoteTopic() {
    if (!currentCategory) {
        alert('Please select a category first');
        return;
    }
    openModal('addTopicModal');
}

function submitNoteTopic(event) {
    event.preventDefault();
    
    if (!currentCategory) return;
    
    const title = document.getElementById('topicTitle').value.trim();
    
    // Initialize topics array if it doesn't exist
    if (!globalNotes.topics[currentCategory.id]) {
        globalNotes.topics[currentCategory.id] = [];
    }
    
    const topics = globalNotes.topics[currentCategory.id];
    const newId = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1;
    
    const newTopic = {
        id: newId,
        title: title,
        content: getTopicTemplate(title),
        created: new Date().toISOString()
    };
    
    topics.push(newTopic);
    saveGlobalNotes();
    
    renderTopicsIndex();
    selectTopic(newId);
    closeModal('addTopicModal');
}

function selectTopic(topicId) {
    if (!currentCategory) return;
    
    const topics = globalNotes.topics[currentCategory.id] || [];
    currentTopic = topics.find(t => t.id === topicId);
    
    if (!currentTopic) return;
    
    // Show editor and buttons
    document.getElementById('noTopicSelected').style.display = 'none';
    document.getElementById('editorContainer').style.display = 'block';
    document.getElementById('globalNotesTextarea').style.display = 'block';
    document.getElementById('markdownPreview').style.display = 'none';
    document.getElementById('saveTopicBtn').style.display = 'flex';
    document.getElementById('deleteTopicBtn').style.display = 'flex';
    document.getElementById('previewMdBtn').style.display = 'flex';
    document.getElementById('exportMdBtn').style.display = 'flex';
    document.getElementById('importMdBtn').style.display = 'flex';
    document.getElementById('fullscreenBtn').style.display = 'flex';
    document.getElementById('formatBtn').style.display = 'flex';
    // toolbar stays hidden until user clicks Format button
    document.getElementById('previewBtnText').textContent = 'Preview';
    
    // Update title and content
    document.getElementById('currentTopicTitle').textContent = currentTopic.title;
    document.getElementById('globalNotesTextarea').value = currentTopic.content;
    document.getElementById('attachBtn').style.display = 'flex';
    document.getElementById('fileViewer').style.display = 'none';
    
    // Load attachments for this topic
    renderAttachmentsList();
    
    // Update index highlighting
    renderTopicsIndex();
}

// Markdown Functions
function insertMarkdown(before, after, placeholder) {
    const textarea = document.getElementById('globalNotesTextarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = before + textToInsert + after;
    
    textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    // Set cursor position
    if (selectedText) {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + newText.length;
    } else {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + textToInsert.length;
    }
    
    textarea.focus();
}

function openResourcePopup(resourceId) {
    const r = resources.find(res => res.id === resourceId);
    if (!r) return;

    document.getElementById('resourceNoteModalTitle').textContent = r.title;
    document.getElementById('resourceNoteModalCategory').textContent = r.category + (r.important ? '  ⭐' : '') + (r.read ? '  ✓ Read' : '');

    // URL bar
    const urlWrap = document.getElementById('resourceNoteModalUrl');
    const linkEl  = document.getElementById('resourceNoteModalLink');
    const openBtn = document.getElementById('resourceNoteModalOpenLink');
    if (r.url && !r.url.startsWith('data:')) {
        linkEl.textContent = r.url;
        linkEl.href = r.url;
        openBtn.href = r.url;
        urlWrap.style.display = 'flex';
        openBtn.style.display = 'flex';
    } else {
        urlWrap.style.display = 'none';
        openBtn.style.display = 'none';
    }

    // Notes — render as markdown
    const notesWrap  = document.getElementById('resourceNoteModalNotesWrap');
    const notesEl    = document.getElementById('resourceNoteModalNotes');
    const emptyState = document.getElementById('resourceNoteModalEmpty');
    if (r.notes && r.notes.trim()) {
        notesEl.innerHTML = typeof marked !== 'undefined' ? marked.parse(r.notes) : r.notes.replace(/\n/g, '<br>');
        notesWrap.style.display = 'block';
        emptyState.style.display = 'none';
    } else {
        notesWrap.style.display = 'none';
        emptyState.style.display = 'flex';
    }

    // Show fullscreen modal
    const modal = document.getElementById('resourceNotesModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeResourceModal() {
    document.getElementById('resourceNotesModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Close resource modal on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('resourceNotesModal').style.display === 'flex') {
        closeResourceModal();
    }
});

// ── Q&A Formatting Helpers ────────────────────────────────────
function qaInsert(id, before, after, placeholder) {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || placeholder;
    ta.value = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
    ta.selectionStart = start + before.length;
    ta.selectionEnd   = start + before.length + selected.length;
    if (ta.tagName === 'TEXTAREA') autoResizeQA(ta);
}

function qaInsertLine(id, prefix) {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
    ta.value = ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart);
    ta.selectionStart = ta.selectionEnd = lineStart + prefix.length + (start - lineStart);
    autoResizeQA(ta);
}

function qaInsertBlock(id) {
    const ta = document.getElementById(id);
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || 'code here';
    const block = '\n```\n' + selected + '\n```\n';
    const newVal = ta.value.substring(0, start) + block + ta.value.substring(end);
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeSetter.call(ta, newVal);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.selectionStart = start + 5;
    ta.selectionEnd   = start + 5 + selected.length;
    autoResizeQA(ta);
}

function autoResizeQA(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(120, ta.scrollHeight) + 'px';
}















































































// Keyboard shortcuts for ALL Q&A textareas including title
document.addEventListener('keydown', function(e) {
    const ta = e.target;
    if (!ta.tagName || ta.tagName !== 'TEXTAREA') return;
    const isQA = ['questionAnswer','editQuestionAnswer','questionCode','editQuestionCode','questionTitle','editQuestionTitle'].includes(ta.id);
    if (!isQA) return;

    // Tab → indent 4 spaces, Shift+Tab → dedent
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = ta.selectionStart, end = ta.selectionEnd;
        if (e.shiftKey) {
            const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
            const line = ta.value.substring(lineStart, end);
            const dedented = line.replace(/^    /, '');
            const removed = line.length - dedented.length;
            ta.value = ta.value.substring(0, lineStart) + dedented + ta.value.substring(end);
            ta.selectionStart = Math.max(lineStart, start - removed);
            ta.selectionEnd = end - removed;
        } else {
            ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
            ta.selectionStart = ta.selectionEnd = start + 4;
        }
        autoResizeQA(ta);
        return;
    }
    // Ctrl+B → **bold**
    if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        qaInsert(ta.id, '**', '**', 'bold text');
        return;
    }
    // Ctrl+I → *italic*
    if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        qaInsert(ta.id, '*', '*', 'italic text');
        return;
    }
    // Ctrl+K → `code`
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        qaInsert(ta.id, '`', '`', 'code');
        return;
    }
    // Ctrl+Enter → new bullet line
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const start = ta.selectionStart;
        ta.value = ta.value.substring(0, start) + '\n- ' + ta.value.substring(start);
        ta.selectionStart = ta.selectionEnd = start + 3;
        autoResizeQA(ta);
        return;
    }
    // Enter on a bullet line → continue bullet
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        const start = ta.selectionStart;
        const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = ta.value.substring(lineStart, start);
        const bulletMatch = currentLine.match(/^(\s*[-*]\s)/);
        if (bulletMatch) {
            e.preventDefault();
            const prefix = bulletMatch[1];
            ta.value = ta.value.substring(0, start) + '\n' + prefix + ta.value.substring(start);
            ta.selectionStart = ta.selectionEnd = start + 1 + prefix.length;
            autoResizeQA(ta);
        }
    }
});

function toggleMarkdownToolbar() {
    const toolbar = document.getElementById('markdownToolbar');
    const btn = document.getElementById('formatBtn');
    const isVisible = toolbar.style.display === 'flex';
    toolbar.style.display = isVisible ? 'none' : 'flex';
    if (btn) {
        btn.style.background = isVisible ? '' : '#1e293b';
        btn.style.color = isVisible ? '' : 'white';
        btn.style.borderColor = isVisible ? '' : '#3B82F6';
    }
}

function toggleNotesFullscreen() {
    const panel = document.getElementById('notesEditorPanel');
    const btn = document.getElementById('fullscreenBtn');
    const btnIcon = document.getElementById('fullscreenBtnIcon');
    const btnText = document.getElementById('fullscreenBtnText');
    const isFullscreen = panel.classList.contains('notes-fullscreen');

    if (!isFullscreen) {
        panel.classList.add('notes-fullscreen');
        btn.classList.add('active');
        btnIcon.textContent = '⊡';
        btnText.textContent = 'Exit';
        document.body.style.overflow = 'hidden';
        const topicTitle = document.getElementById('currentTopicTitle');
        if (topicTitle) document.getElementById('notesFullscreenTitle').textContent = topicTitle.textContent || 'Notes';
        const textarea = document.getElementById('globalNotesTextarea');
        if (textarea && textarea.style.display !== 'none') setTimeout(() => textarea.focus(), 100);
    } else {
        panel.classList.remove('notes-fullscreen');
        btn.classList.remove('active');
        btnIcon.textContent = '⛶';
        btnText.textContent = 'Fullscreen';
        document.body.style.overflow = '';
    }
}

// Exit fullscreen on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const panel = document.getElementById('notesEditorPanel');
        if (panel && panel.classList.contains('notes-fullscreen')) toggleNotesFullscreen();
    }
});

function toggleMarkdownPreview() {
    const textarea = document.getElementById('globalNotesTextarea');
    const preview = document.getElementById('markdownPreview');
    const btnText = document.getElementById('previewBtnText');
    
    if (preview.style.display === 'none') {
        // Show preview
        const markdown = textarea.value;
        preview.innerHTML = marked.parse(markdown);
        textarea.style.display = 'none';
        preview.style.display = 'block';
        btnText.textContent = 'Edit';
        document.getElementById('markdownToolbar').style.display = 'none';
    } else {
        // Show editor
        textarea.style.display = 'block';
        preview.style.display = 'none';
        btnText.textContent = 'Preview';
        // toolbar stays hidden - user opens it via Format button
    }
}

function exportMarkdownFile() {
    if (!currentTopic) return;
    
    const content = document.getElementById('globalNotesTextarea').value;
    const filename = currentTopic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported "${currentTopic.title}.md"`);
}

function importMarkdownFile() {
    document.getElementById('importMarkdownInput').click();
}

function handleImportMarkdown(event) {
    const file = event.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = function(e) {
        let content = e.target.result;
        // For code files, wrap in code fence
        const codeExts = ['js','ts','py','sql','sh','bash','java','cpp','c','go','rb','php','r','jsx','tsx','m'];
        if (codeExts.includes(ext)) {
            content = '```' + ext + '\n' + content + '\n```';
        } else if (ext === 'html' || ext === 'htm') {
            // Strip tags for readability, show as code
            content = '```html\n' + content + '\n```';
        }
        document.getElementById('globalNotesTextarea').value = content;
        alert(`✅ Imported "${file.name}"\n\nDon't forget to click Save!`);
    };
    reader.readAsText(file);
    event.target.value = '';
}

function saveCurrentTopic(btn) {
    if (!currentTopic || !currentCategory) return;
    
    const content = document.getElementById('globalNotesTextarea').value;
    currentTopic.content = content;
    currentTopic.updated = new Date().toISOString();
    saveGlobalNotes();
    
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>✓</span> Saved!';
    btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    setTimeout(() => { btn.innerHTML = originalHTML; btn.style.background = ''; }, 2000);
    
    renderTopicsIndex();
}

function deleteCurrentTopic() {
    if (!currentTopic || !currentCategory) return;
    
    if (!confirm(`Are you sure you want to delete the topic "${currentTopic.title}"?`)) {
        return;
    }
    
    const topics = globalNotes.topics[currentCategory.id];
    const index = topics.findIndex(t => t.id === currentTopic.id);
    
    if (index !== -1) {
        topics.splice(index, 1);
        saveGlobalNotes();
        
        // Clear selection
        currentTopic = null;
        document.getElementById('noTopicSelected').style.display = 'flex';
        document.getElementById('editorContainer').style.display = 'none';
        document.getElementById('globalNotesTextarea').style.display = 'none';
        document.getElementById('markdownPreview').style.display = 'none';
        document.getElementById('saveTopicBtn').style.display = 'none';
        document.getElementById('deleteTopicBtn').style.display = 'none';
        document.getElementById('previewMdBtn').style.display = 'none';
        document.getElementById('exportMdBtn').style.display = 'none';
        document.getElementById('importMdBtn').style.display = 'none';
        document.getElementById('attachBtn').style.display = 'none';
        document.getElementById('markdownToolbar').style.display = 'none';
        document.getElementById('attachmentsPanel').style.display = 'none';
        document.getElementById('fileViewer').style.display = 'none';
        document.getElementById('currentTopicTitle').textContent = 'Select a topic';
        
        renderTopicsIndex();
    }
}

function getTopicTemplate(topicTitle) {
    return `${topicTitle}

Date: ${new Date().toLocaleDateString()}

Notes:
• 


Key Points:
• 


Examples:
• 


Resources:
• 


---
Last updated: ${new Date().toLocaleString()}`;
}

function formatDate(dateString) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

// Helper Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Settings Menu Toggle
function toggleSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    if (menu.style.display === 'block') injectToolsIntoMenu();
}

// Close settings menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('settingsMenu');
    const btn = document.getElementById('settingsMenuBtn');
    if (menu && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// Export/Import Functions
function exportData() {
    const data = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        companies: companies,
        resources: resources,
        globalNotes: globalNotes,
        notebooks: JSON.parse(localStorage.getItem('interviewhub_notebooks') || '[]'),
        checklist: JSON.parse(localStorage.getItem('interviewhub_cl') || '[]'),
        flashcards: JSON.parse(localStorage.getItem('interviewhub_fc') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interviewhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toggleSettingsMenu();
    alert('✅ Backup exported successfully!');
}

function importData() {
    document.getElementById('importFileInput').click();
    toggleSettingsMenu();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Validate data
            if (!imported.companies || !imported.resources || !imported.globalNotes) {
                throw new Error('Invalid backup file format');
            }
            
            // Ask user for merge or replace
            const merge = confirm('Do you want to MERGE with existing data?\n\nOK = Merge (add to existing)\nCancel = Replace (delete existing)');
            
            if (merge) {
                // Merge data
                const maxCompanyId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) : 0;
                imported.companies.forEach((c, i) => {
                    c.id = maxCompanyId + i + 1;
                    companies.push(c);
                });
                
                const maxResourceId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) : 0;
                imported.resources.forEach((r, i) => {
                    r.id = maxResourceId + i + 1;
                    resources.push(r);
                });
                
                // Merge notes
                imported.globalNotes.categories.forEach(cat => {
                    if (!globalNotes.categories.find(c => c.name === cat.name)) {
                        globalNotes.categories.push(cat);
                        if (imported.globalNotes.topics[cat.id]) {
                            globalNotes.topics[cat.id] = imported.globalNotes.topics[cat.id];
                        }
                    }
                });
            } else {
                // Replace data
                companies = imported.companies;
                resources = imported.resources;
                globalNotes = imported.globalNotes;
            }
            
            // Save to localStorage
            saveToLocalStorage();
            saveResources();
            saveGlobalNotes();
            
            // Restore new sections if present in backup
            if (imported.notebooks) localStorage.setItem('interviewhub_notebooks', JSON.stringify(imported.notebooks));
            if (imported.checklist) localStorage.setItem('interviewhub_cl', JSON.stringify(imported.checklist));
            if (imported.flashcards) localStorage.setItem('interviewhub_fc', JSON.stringify(imported.flashcards));
            
            // Refresh UI
            renderCompanies();
            renderResources();
            renderResourceCategories();
            
            alert(`✅ Import successful!\n\nImported:\n- ${imported.companies.length} companies\n- ${imported.resources.length} resources\n- ${imported.globalNotes.categories.length} note categories`);
            
            // Reload page to ensure everything is fresh
            location.reload();
        } catch (error) {
            alert('❌ Import failed: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Progress Dashboard
function showProgressDashboard() {
    toggleSettingsMenu();
    
    const totalCompanies = companies.length;
    const companiesWithDates = companies.filter(c => c.interviewDate).length;
    
    const totalQuestions = companies.reduce((sum, c) => sum + (c.questions?.length || 0), 0);
    
    const totalResources = resources.length;
    const readResources = resources.filter(r => r.read).length;
    const importantResources = resources.filter(r => r.important).length;
    const readImportantResources = resources.filter(r => r.read && r.important).length;
    
    const totalTopics = Object.values(globalNotes.topics || {}).reduce((sum, topics) => sum + topics.length, 0);
    
    const readPercentage = totalResources > 0 ? Math.round((readResources / totalResources) * 100) : 0;
    const importantReadPercentage = importantResources > 0 ? Math.round((readImportantResources / importantResources) * 100) : 0;
    
    // Find upcoming interviews
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingInterviews = companies
        .filter(c => c.interviewDate && new Date(c.interviewDate) >= today)
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
        .slice(0, 5);
    
    const dashboardHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; padding: 1.5rem; border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: 700;">${totalCompanies}</div>
                <div style="opacity: 0.9; margin-top: 0.25rem;">Companies</div>
            </div>
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 1.5rem; border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: 700;">${totalQuestions}</div>
                <div style="opacity: 0.9; margin-top: 0.25rem;">Questions</div>
            </div>
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 1.5rem; border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: 700;">${totalTopics}</div>
                <div style="opacity: 0.9; margin-top: 0.25rem;">Topics</div>
            </div>
        </div>

        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a;">📚 Resources Progress</h3>
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; color: #64748b;">All Resources</span>
                    <span style="font-size: 0.875rem; font-weight: 600; color: #0f172a;">${readResources}/${totalResources} (${readPercentage}%)</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #10B981, #059669); height: 100%; width: ${readPercentage}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; color: #64748b;">⭐ Important Resources</span>
                    <span style="font-size: 0.875rem; font-weight: 600; color: #0f172a;">${readImportantResources}/${importantResources} (${importantReadPercentage}%)</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #F59E0B, #D97706); height: 100%; width: ${importantReadPercentage}%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>

        ${upcomingInterviews.length > 0 ? `
            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px;">
                <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a;">📅 Upcoming Interviews</h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${upcomingInterviews.map(company => {
                        const interviewDate = new Date(company.interviewDate);
                        const daysUntil = Math.ceil((interviewDate - today) / (1000 * 60 * 60 * 24));
                        const urgency = daysUntil <= 7 ? '🔴' : daysUntil <= 14 ? '🟡' : '🟢';
                        return `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <span style="font-size: 1.5rem;">${company.icon}</span>
                                    <span style="font-weight: 600; color: #0f172a;">${company.name}</span>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 0.875rem; font-weight: 600; color: #0f172a;">${urgency} ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</div>
                                    <div style="font-size: 0.75rem; color: #64748b;">${interviewDate.toLocaleDateString()}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        ` : `
            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; text-align: center; color: #64748b;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📅</div>
                <div>No upcoming interviews scheduled</div>
                <div style="font-size: 0.875rem; margin-top: 0.25rem;">Add interview dates to companies to see them here</div>
            </div>
        `}
    `;
    
    document.getElementById('progressDashboardContent').innerHTML = dashboardHTML;
    openModal('progressDashboardModal');
}

// Toggle Resource Read Status
function toggleResourceRead(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
        resource.read = !resource.read;
        saveResources();
        renderResources();
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    document.getElementById('darkModeIcon').textContent = isDark ? '☀️' : '🌙';
    document.getElementById('darkModeText').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    toggleSettingsMenu();
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (document.getElementById('darkModeIcon')) {
        document.getElementById('darkModeIcon').textContent = '☀️';
        document.getElementById('darkModeText').textContent = 'Light Mode';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Initialize on load
init();

// ============================================================
// COMPANY CARD DROPDOWN MENU
// ============================================================
let _openCompanyMenu = null;

function toggleCompanyMenu(id, event) {
    event.stopPropagation();
    const menuId = 'cm' + id;
    // If same menu is open, close it
    if (_openCompanyMenu === menuId) {
        document.getElementById(menuId).style.display = 'none';
        _openCompanyMenu = null;
        return;
    }
    // Close any previously open menu
    if (_openCompanyMenu) {
        const prev = document.getElementById(_openCompanyMenu);
        if (prev) prev.style.display = 'none';
    }
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.style.display = 'block';
        _openCompanyMenu = menuId;
    }
}

// Close company menu when clicking elsewhere (uses separate listener, won't fire on same click)
document.addEventListener('click', function(e) {
    if (_openCompanyMenu && !e.target.closest('[id^="cm"]')) {
        const m = document.getElementById(_openCompanyMenu);
        if (m) m.style.display = 'none';
        _openCompanyMenu = null;
    }
});

function editCompanyFromCard(companyId) {
    if (_openCompanyMenu) {
        const m = document.getElementById(_openCompanyMenu);
        if (m) m.style.display = 'none';
        _openCompanyMenu = null;
    }
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    document.getElementById('editCompanyId').value = company.id;
    document.getElementById('editCompanyName').value = company.name;
    document.getElementById('editCompanyIcon').value = company.icon;
    document.getElementById('editCompanyRounds').value = company.rounds;
    document.getElementById('editCompanyInterviewDate').value = company.interviewDate || '';
    openModal('editCompanyModal');
}

// ============================================================
// ADD ROUND (dynamic)
// ============================================================
function addRound() {
    const roundName = prompt('Enter round name (e.g., "HR Screen", "Coding Challenge"):');
    if (!roundName || !roundName.trim()) return;
    const name = roundName.trim();
    if (roundTypes.find(r => r.name === name)) { alert('A round with that name already exists.'); return; }
    const colors = ['#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'];
    roundTypes.push({ name, color: colors[roundTypes.length % colors.length] });
    // also add option to the question round select
    const sel = document.getElementById('questionRound');
    if (sel && ![...sel.options].some(o => o.value === name)) {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name;
        sel.appendChild(opt);
    }
    renderRounds();
}

// ============================================================
// NOTEBOOKS (dynamic, localStorage-backed)
// ============================================================
const defaultNotebooks = [
    { id:1,  title:'Python Basics',  url:'https://colab.research.google.com/drive/1_UAr3eLjGwA2_zAFOplCnJrr84qL_MoM', tag:'Python',  icon:'🐍' },
    { id:2,  title:'Pandas',          url:'notebooks/pandas.ipynb',         tag:'Python',  icon:'🐼' },
    { id:3,  title:'NumPy',           url:'notebooks/numpy.ipynb',          tag:'Python',  icon:'🔢' },
    { id:4,  title:'PySpark',         url:'notebooks/pyspark.ipynb',        tag:'PySpark', icon:'⚡' },
    { id:5,  title:'SQL Practice',    url:'notebooks/sql.ipynb',            tag:'SQL',     icon:'🗄️' },
    { id:6,  title:'ETL Pipeline',    url:'notebooks/etl_pipeline.ipynb',   tag:'ETL',     icon:'🔄' },
    { id:7,  title:'AWS Glue',        url:'notebooks/aws_glue.ipynb',       tag:'AWS',     icon:'☁️' },
    { id:8,  title:'Airflow',         url:'notebooks/airflow.ipynb',        tag:'ETL',     icon:'💨' },
    { id:9,  title:'Data Modeling',   url:'notebooks/data_modeling.ipynb',  tag:'DWH',     icon:'📐' },
    { id:10, title:'System Design',   url:'notebooks/system_design.ipynb',  tag:'Design',  icon:'🏗️' }
];
let notebooks = [];

const nbTagColors = { Python:'#3B82F6', SQL:'#10B981', ETL:'#F59E0B', PySpark:'#8B5CF6', AWS:'#EC4899', DWH:'#6366F1', Design:'#14B8A6', Other:'#64748b' };
function getNbColor(tag) { return nbTagColors[tag] || '#64748b'; }

function loadNotebooks() {
    const s = localStorage.getItem('interviewhub_notebooks');
    notebooks = s ? JSON.parse(s) : [...defaultNotebooks];
}
function _ghCoreSaveNotebooks() { localStorage.setItem('interviewhub_notebooks', JSON.stringify(notebooks)); }

function showNotebooksView() {
    document.getElementById('companiesView').style.display = 'none';
    document.getElementById('companyDetail').classList.remove('active');
    document.getElementById('notesView').style.display = 'none';
    document.getElementById('resourcesView').style.display = 'none';
    document.getElementById('notebooksView').style.display = 'block';
    loadNotebooks();
    renderNotebooks(notebooks);
    const inp = document.getElementById('notebookSearch');
    if (inp) inp.value = '';
}

function renderNotebooks(list) {
    const grid = document.getElementById('notebooksGrid');
    if (!list || list.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
            <div class="empty-state-icon">📓</div>
            <h3>No notebooks yet</h3>
            <p>Click "Add Notebook" to get started</p></div>`;
        return;
    }
    grid.innerHTML = list.map(nb => {
        const color = getNbColor(nb.tag);
        const safeUrl = escapeHtml(nb.url || '');
        return `
        <div class="note-card" style="display:flex;flex-direction:column;gap:0.75rem;position:relative;">
            <div style="position:absolute;top:0.75rem;right:0.75rem;display:flex;gap:0.375rem;">
                <button onclick="openEditNotebookModal(${nb.id})" title="Edit"
                    style="border:none;background:transparent;cursor:pointer;font-size:1rem;color:#94a3b8;padding:0.2rem;"
                    onmouseover="this.style.color='#3B82F6'" onmouseout="this.style.color='#94a3b8'">✏️</button>
                <button onclick="deleteNotebook(${nb.id})" title="Delete"
                    style="border:none;background:transparent;cursor:pointer;font-size:1rem;color:#94a3b8;padding:0.2rem;"
                    onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">🗑️</button>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;padding-right:3.5rem;">
                <div style="width:44px;height:44px;border-radius:10px;background:${color}20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">${escapeHtml(nb.icon||'📓')}</div>
                <div>
                    <div class="note-topic" style="margin-bottom:0.25rem;">${escapeHtml(nb.title)}</div>
                    <span style="background:${color};color:white;padding:0.125rem 0.5rem;border-radius:4px;font-size:0.7rem;font-weight:700;">${escapeHtml(nb.tag||'Other')}</span>
                </div>
            </div>
            <div style="font-size:0.72rem;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 0.25rem;" title="${safeUrl}">
                🔗 ${safeUrl}
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:auto;">
                <button class="btn-primary" style="flex:1;justify-content:center;font-size:0.825rem;"
                    onclick="window.open('${safeUrl}','_blank')">
                    🚀 Open
                </button>
                <button class="btn-secondary" style="padding:0.5rem 0.75rem;font-size:0.825rem;"
                    onclick="copyNbUrl('${safeUrl}',this)" title="Copy URL">📋</button>
            </div>
        </div>`;
    }).join('');
}

function copyNbUrl(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
    });
}

function filterNotebooks(q) {
    const lq = q.toLowerCase();
    renderNotebooks(notebooks.filter(nb =>
        nb.title.toLowerCase().includes(lq) || (nb.tag||'').toLowerCase().includes(lq)
    ));
}

function openAddNotebookModal() {
    document.getElementById('nbTitle').value = '';
    document.getElementById('nbUrl').value = '';
    document.getElementById('nbTag').value = '';
    document.getElementById('nbIcon').value = '📓';
    openModal('addNotebookModal');
}

function submitAddNotebook() {
    const title = document.getElementById('nbTitle').value.trim();
    const url   = document.getElementById('nbUrl').value.trim();
    const tag   = document.getElementById('nbTag').value.trim() || 'Other';
    const icon  = document.getElementById('nbIcon').value.trim() || '📓';
    if (!title || !url) { alert('Title and URL are required.'); return; }
    const newId = notebooks.length > 0 ? Math.max(...notebooks.map(n=>n.id))+1 : 1;
    notebooks.push({ id:newId, title, url, tag, icon });
    saveNotebooks();
    renderNotebooks(notebooks);
    closeModal('addNotebookModal');
}

function openEditNotebookModal(id) {
    const nb = notebooks.find(n=>n.id===id);
    if (!nb) return;
    document.getElementById('editNbId').value = nb.id;
    document.getElementById('editNbTitle').value = nb.title;
    document.getElementById('editNbUrl').value = nb.url;
    document.getElementById('editNbTag').value = nb.tag || '';
    document.getElementById('editNbIcon').value = nb.icon || '📓';
    openModal('editNotebookModal');
}

function submitEditNotebook() {
    const id    = parseInt(document.getElementById('editNbId').value);
    const title = document.getElementById('editNbTitle').value.trim();
    const url   = document.getElementById('editNbUrl').value.trim();
    const tag   = document.getElementById('editNbTag').value.trim() || 'Other';
    const icon  = document.getElementById('editNbIcon').value.trim() || '📓';
    if (!title || !url) { alert('Title and URL are required.'); return; }
    const nb = notebooks.find(n=>n.id===id);
    if (nb) { nb.title=title; nb.url=url; nb.tag=tag; nb.icon=icon; }
    saveNotebooks();
    renderNotebooks(notebooks);
    closeModal('editNotebookModal');
}

function deleteNotebook(id) {
    if (!confirm('Delete this notebook?')) return;
    notebooks = notebooks.filter(n=>n.id!==id);
    saveNotebooks();
    renderNotebooks(notebooks);
}

function openNotebookViewer(file) {
    const frame = document.getElementById("notebookFrame");
    const viewer = document.getElementById("notebookViewer");
    frame.src = "https://nbviewer.org/url/" + window.location.origin + "/notebooks/" + file;
    viewer.style.display = "flex";
}
function closeNotebookViewer() {
    document.getElementById("notebookViewer").style.display = "none";
}

// ============================================================
// STUDY TIMER (Pomodoro) — accessible from ⋮ menu
// ============================================================
let timerInterval = null, timerSeconds = 25*60, timerRunning = false, timerMode = 'work';

function openTimer() {
    if (!document.getElementById('studyTimerModal')) {
        const m = document.createElement('div');
        m.className = 'modal'; m.id = 'studyTimerModal';
        m.innerHTML = `<div class="modal-content" style="max-width:360px;text-align:center;">
            <div class="modal-header"><h2>⏱️ Study Timer</h2>
                <button class="close-btn" onclick="pauseTimer();closeModal('studyTimerModal')">×</button></div>
            <div style="display:flex;gap:0.5rem;justify-content:center;margin-bottom:1.25rem;flex-wrap:wrap;">
                <button onclick="setTimerMode('work')" id="tmWork" class="btn-primary" style="font-size:0.8rem;">🧠 Focus 25m</button>
                <button onclick="setTimerMode('break')" id="tmBreak" class="btn-secondary" style="font-size:0.8rem;">☕ Break 5m</button>
                <button onclick="setTimerMode('long')" id="tmLong" class="btn-secondary" style="font-size:0.8rem;">🛋️ Long 15m</button>
            </div>
            <div id="timerDisplay" style="font-size:4.5rem;font-weight:800;font-family:'Space Mono',monospace;color:#3B82F6;margin:1rem 0;letter-spacing:0.05em;">25:00</div>
            <div style="display:flex;gap:0.75rem;justify-content:center;">
                <button class="btn-primary" id="timerStartBtn" onclick="startTimer()" style="min-width:110px;">▶ Start</button>
                <button class="btn-secondary" onclick="resetTimer()">↺ Reset</button>
            </div>
            <div style="margin-top:1rem;font-size:0.85rem;color:#64748b;">🍅 Sessions today: <strong id="timerSessions">0</strong></div>
        </div>`;
        document.body.appendChild(m);
        // restore session count
        document.getElementById('timerSessions').textContent = localStorage.getItem('timerSessionsToday')||'0';
    }
    openModal('studyTimerModal');
    updateTimerDisplay();
}
function setTimerMode(mode) {
    pauseTimer(); timerMode = mode;
    timerSeconds = mode==='work' ? 25*60 : mode==='break' ? 5*60 : 15*60;
    ['work','break','long'].forEach(m => {
        const el = document.getElementById('tm'+m.charAt(0).toUpperCase()+m.slice(1));
        if (el) el.className = m===mode ? 'btn-primary' : 'btn-secondary';
    });
    updateTimerDisplay();
}
function startTimer() {
    if (timerRunning) { pauseTimer(); return; }
    timerRunning = true;
    document.getElementById('timerStartBtn').textContent = '⏸ Pause';
    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) {
            clearInterval(timerInterval); timerRunning = false;
            document.getElementById('timerStartBtn').textContent = '▶ Start';
            if (timerMode === 'work') {
                const n = parseInt(localStorage.getItem('timerSessionsToday')||'0') + 1;
                localStorage.setItem('timerSessionsToday', n);
                document.getElementById('timerSessions').textContent = n;
            }
            alert(timerMode==='work' ? '✅ Focus session done! Take a break.' : '✅ Break over! Time to focus.');
            setTimerMode(timerMode==='work' ? 'break' : 'work');
            return;
        }
        updateTimerDisplay();
    }, 1000);
}
function pauseTimer() { clearInterval(timerInterval); timerRunning = false; const b=document.getElementById('timerStartBtn'); if(b) b.textContent='▶ Start'; }
function resetTimer() { pauseTimer(); setTimerMode(timerMode); }
function updateTimerDisplay() {
    const el = document.getElementById('timerDisplay'); if(!el) return;
    const m = Math.floor(timerSeconds/60).toString().padStart(2,'0');
    const s = (timerSeconds%60).toString().padStart(2,'0');
    el.textContent = `${m}:${s}`;
    const total = timerMode==='work'?25*60:timerMode==='break'?5*60:15*60;
    const pct = timerSeconds/total;
    el.style.color = pct>0.5?'#3B82F6':pct>0.25?'#F59E0B':'#ef4444';
}

// ============================================================
// INTERVIEW CHECKLIST — accessible from ⋮ menu
// ============================================================
const defaultChecklist = [
    {id:1,text:'Research the company, products and recent news',done:false,cat:'Prep'},
    {id:2,text:'Review JD and map your experience to requirements',done:false,cat:'Prep'},
    {id:3,text:'Prepare STAR stories for behavioral questions',done:false,cat:'Prep'},
    {id:4,text:'Prepare 2-min self introduction',done:false,cat:'Prep'},
    {id:5,text:'Prepare questions to ask the interviewer',done:false,cat:'Prep'},
    {id:6,text:'Revise SQL: joins, window functions, aggregates, subqueries',done:false,cat:'Technical'},
    {id:7,text:'Revise ETL concepts, transformations, and tools',done:false,cat:'Technical'},
    {id:8,text:'Practice Data Warehouse / DWH concepts and schema types',done:false,cat:'Technical'},
    {id:9,text:'Review your project architecture and challenges faced',done:false,cat:'Technical'},
    {id:10,text:'Practice explaining SCD Type 2',done:false,cat:'Technical'},
    {id:11,text:'Test your camera, mic, internet connection',done:false,cat:'Logistics'},
    {id:12,text:'Get a good night\'s sleep before interview',done:false,cat:'Logistics'},
    {id:13,text:'Keep resume and portfolio link ready',done:false,cat:'Logistics'},
];
let checklist = [], clFilter = 'All';

function loadChecklist() { const s=localStorage.getItem('interviewhub_cl'); checklist=s?JSON.parse(s):[...defaultChecklist.map(i=>({...i}))]; }
function _ghCoreSaveChecklist() { localStorage.setItem('interviewhub_cl', JSON.stringify(checklist)); }

function openChecklist() {
    loadChecklist();
    if (!document.getElementById('checklistModal')) {
        const m = document.createElement('div');
        m.className='modal'; m.id='checklistModal';
        m.innerHTML=`<div class="modal-content" style="max-width:600px;">
            <div class="modal-header"><h2>✅ Interview Checklist</h2>
                <button class="close-btn" onclick="closeModal('checklistModal')">×</button></div>
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;align-items:center;">
                <button class="btn-secondary" onclick="clSetFilter('All')" id="clf_All" style="font-size:0.75rem;padding:0.375rem 0.75rem;">All</button>
                <button class="btn-secondary" onclick="clSetFilter('Prep')" id="clf_Prep" style="font-size:0.75rem;padding:0.375rem 0.75rem;">📚 Prep</button>
                <button class="btn-secondary" onclick="clSetFilter('Technical')" id="clf_Technical" style="font-size:0.75rem;padding:0.375rem 0.75rem;">💻 Technical</button>
                <button class="btn-secondary" onclick="clSetFilter('Logistics')" id="clf_Logistics" style="font-size:0.75rem;padding:0.375rem 0.75rem;">📋 Logistics</button>
                <button class="btn-secondary" onclick="clReset()" style="font-size:0.75rem;padding:0.375rem 0.75rem;margin-left:auto;color:#ef4444;">↺ Reset</button>
            </div>
            <div id="clProgress" style="margin-bottom:1rem;"></div>
            <div id="clItems" style="display:flex;flex-direction:column;gap:0.5rem;max-height:55vh;overflow-y:auto;padding-right:0.25rem;"></div>
            <div style="margin-top:1rem;display:flex;gap:0.5rem;">
                <input type="text" id="clNewItem" placeholder="Add custom item…"
                       style="flex:1;padding:0.625rem;border:1px solid #e2e8f0;border-radius:8px;font-size:0.875rem;"
                       onkeydown="if(event.key==='Enter')clAddItem()">
                <button class="btn-primary" onclick="clAddItem()">➕</button>
            </div>
        </div>`;
        document.body.appendChild(m);
    }
    clRenderAll();
    openModal('checklistModal');
}
function clSetFilter(f) { clFilter=f; clRenderAll(); }
function clRenderAll() {
    const done=checklist.filter(i=>i.done).length, total=checklist.length;
    const pct=total>0?Math.round(done/total*100):0;
    const pb=document.getElementById('clProgress');
    if(pb) pb.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:0.875rem;margin-bottom:0.5rem;"><span style="color:#475569;">Progress</span><span style="font-weight:700;">${done}/${total} (${pct}%)</span></div><div style="background:#e2e8f0;height:8px;border-radius:4px;overflow:hidden;"><div style="background:linear-gradient(90deg,#10B981,#059669);height:100%;width:${pct}%;transition:width 0.4s;"></div></div>`;
    ['All','Prep','Technical','Logistics'].forEach(f=>{
        const el=document.getElementById('clf_'+f);
        if(el) el.className=f===clFilter?'btn-primary':'btn-secondary';
    });
    const items=clFilter==='All'?checklist:checklist.filter(i=>i.cat===clFilter);
    const ct=document.getElementById('clItems');
    if(!ct) return;
    ct.innerHTML=items.map(item=>`
        <div style="display:flex;align-items:center;gap:0.75rem;padding:0.625rem 0.875rem;background:${item.done?'#f0fdf4':'#f8fafc'};border-radius:8px;border:1px solid ${item.done?'#bbf7d0':'#e2e8f0'};transition:all 0.2s;">
            <input type="checkbox" ${item.done?'checked':''} onchange="clToggle(${item.id})" style="width:18px;height:18px;cursor:pointer;accent-color:#10B981;flex-shrink:0;">
            <span style="flex:1;font-size:0.875rem;${item.done?'text-decoration:line-through;color:#94a3b8;':'color:#1e293b;'}">${escapeHtml(item.text)}</span>
            <span style="font-size:0.7rem;padding:0.125rem 0.5rem;border-radius:4px;background:#e2e8f0;color:#64748b;white-space:nowrap;">${item.cat}</span>
            <button onclick="clRemove(${item.id})" style="border:none;background:transparent;cursor:pointer;color:#cbd5e1;font-size:1.1rem;line-height:1;flex-shrink:0;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#cbd5e1'">×</button>
        </div>`).join('');
}
function clToggle(id){ const i=checklist.find(x=>x.id===id); if(i){i.done=!i.done;saveChecklist();clRenderAll();} }
function clRemove(id){ checklist=checklist.filter(x=>x.id!==id); saveChecklist(); clRenderAll(); }
function clReset(){ if(!confirm('Reset all items?')) return; checklist.forEach(i=>i.done=false); saveChecklist(); clRenderAll(); }
function clAddItem(){
    const inp=document.getElementById('clNewItem'), text=inp.value.trim();
    if(!text) return;
    const newId=checklist.length>0?Math.max(...checklist.map(i=>i.id))+1:1;
    checklist.push({id:newId,text,done:false,cat:clFilter==='All'?'Prep':clFilter});
    inp.value=''; saveChecklist(); clRenderAll();
}

// ============================================================
// FLASHCARDS — accessible from ⋮ menu
// ============================================================
const defaultFlashcards = [
    {id:1,q:'What is SCD Type 2?',a:'Tracks historical changes by inserting new rows with effective/expiry dates and a current_flag, preserving full history of dimension changes.'},
    {id:2,q:'RANK() vs DENSE_RANK()?',a:'RANK() leaves gaps after ties (1,2,2,4). DENSE_RANK() does not leave gaps (1,2,2,3). ROW_NUMBER() is always unique.'},
    {id:3,q:'What is a Fact table?',a:'Stores quantitative measures/metrics (e.g. sales amount, quantity). References dimension tables via foreign keys. Can be additive, semi-additive, or non-additive.'},
    {id:4,q:'Star Schema vs Snowflake Schema?',a:'Star: one fact + denormalized dimension tables — fast queries, simple joins. Snowflake: normalized dimensions — saves storage, more complex joins.'},
    {id:5,q:'What is ETL?',a:'Extract (pull data from sources), Transform (clean, validate, aggregate, apply business rules), Load (write into data warehouse). ELT loads first, then transforms inside the warehouse.'},
    {id:6,q:'What is a Surrogate Key?',a:'An artificial primary key (usually auto-incremented integer) assigned independently of business/natural keys. Used in DWH to handle SCD and source-system changes.'},
    {id:7,q:'UNION vs UNION ALL?',a:'UNION removes duplicates and sorts the result (slower). UNION ALL keeps all rows including duplicates (faster). Always prefer UNION ALL when duplicates are not a concern.'},
    {id:8,q:'What is a Window Function?',a:'Performs calculation across a related set of rows without collapsing them. Syntax: FUNCTION() OVER (PARTITION BY col ORDER BY col ROWS/RANGE ...). Examples: ROW_NUMBER, RANK, SUM, LAG, LEAD.'},
    {id:9,q:'Active vs Passive Transformation (Informatica)?',a:'Active: changes number of rows (Filter, Aggregator, Router, Joiner, Sorter, Normalizer). Passive: does not change row count (Expression, Lookup, Sequence Generator, Update Strategy).'},
    {id:10,q:'What is Normalization?',a:'Organizing DB to reduce redundancy. 1NF: atomic values, no repeating groups. 2NF: no partial dependency. 3NF: no transitive dependency. BCNF: every determinant is a candidate key.'},
    {id:11,q:'What are the types of Slowly Changing Dimensions?',a:'SCD0: no change. SCD1: overwrite old value. SCD2: add new row with date range. SCD3: add new column for old value. SCD4: use mini-dimension. SCD6: hybrid of 1+2+3.'},
    {id:12,q:'What is Data Completeness Testing in ETL?',a:'Verifying that all expected records from source arrived in target. Includes record count checks, null checks, duplicate checks, and boundary value validation.'},
];
let flashcards=[], fcIdx=0, fcFlipped=false;

function loadFlashcards() { const s=localStorage.getItem('interviewhub_fc'); flashcards=s?JSON.parse(s):[...defaultFlashcards.map(f=>({...f}))]; }
function _ghCoreSaveFlashcards() { localStorage.setItem('interviewhub_fc', JSON.stringify(flashcards)); }

function openFlashcards() {
    loadFlashcards();
    if (flashcards.length===0) { alert('No flashcards. Add some!'); return; }
    fcIdx=0; fcFlipped=false; fcFilter='all';
    if (!document.getElementById('flashcardModal')) {
        const m=document.createElement('div');
        m.id='flashcardModal';
        m.style.cssText='display:none;position:fixed;inset:0;z-index:1000;background:#0f172a;flex-direction:column;';
        m.innerHTML=`
        <!-- Top bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.5rem;background:#1e293b;border-bottom:2px solid #334155;flex-shrink:0;gap:0.5rem;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:0.875rem;">
                <span style="font-size:1.4rem;">🃏</span>
                <div>
                    <div style="font-size:0.95rem;font-weight:800;color:white;">Flashcards</div>
                    <div id="fcCount" style="font-size:0.72rem;color:#94a3b8;margin-top:0.1rem;"></div>
                </div>
            </div>
            <!-- Filter pills -->
            <div style="display:flex;gap:0.375rem;align-items:center;">
                <button onclick="fcSetFilter('all')" id="fcFilterAll" style="border:1px solid #3B82F6;background:#1e3a5f;color:#60a5fa;padding:0.3rem 0.75rem;border-radius:20px;cursor:pointer;font-size:0.75rem;font-weight:700;">All</button>
                <button onclick="fcSetFilter('unknown')" id="fcFilterUnknown" style="border:1px solid #475569;background:transparent;color:#94a3b8;padding:0.3rem 0.75rem;border-radius:20px;cursor:pointer;font-size:0.75rem;font-weight:700;">⚡ Review</button>
                <button onclick="fcSetFilter('known')" id="fcFilterKnown" style="border:1px solid #475569;background:transparent;color:#94a3b8;padding:0.3rem 0.75rem;border-radius:20px;cursor:pointer;font-size:0.75rem;font-weight:700;">✅ Known</button>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <button onclick="fcShuffle()" title="Shuffle" style="border:1px solid #475569;background:#334155;color:#e2e8f0;padding:0.375rem 0.75rem;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">🔀 Shuffle</button>
                <button onclick="fcShowEdit()" title="Edit card" style="border:1px solid #475569;background:#334155;color:#e2e8f0;padding:0.375rem 0.75rem;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">✏️ Edit</button>
                <button onclick="fcShowAdd()" title="Add card" style="border:1px solid #475569;background:#334155;color:#e2e8f0;padding:0.375rem 0.75rem;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">➕ Add</button>
                <button onclick="fcDeleteCurrent()" title="Delete card" style="border:1px solid #475569;background:#334155;color:#e2e8f0;padding:0.375rem 0.75rem;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600;">🗑️</button>
                <button onclick="closeFlashcards()" style="border:none;background:#334155;color:#94a3b8;width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;" title="Close (Esc)">×</button>
            </div>
        </div>

        <!-- Edit / Add panel (hidden by default) -->
        <div id="fcEditPanel" style="display:none;background:#162032;border-bottom:2px solid #334155;padding:1rem 1.5rem;flex-shrink:0;">
            <div style="max-width:700px;margin:0 auto;">
                <div style="font-size:0.8rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.75rem;" id="fcEditPanelTitle">Edit Card</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;margin-bottom:0.875rem;">
                    <div>
                        <label style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:0.35rem;">❓ Question</label>
                        <textarea id="fcEditQ" rows="3" style="width:100%;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:0.625rem;color:#e2e8f0;font-size:0.875rem;resize:vertical;font-family:inherit;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#334155'" placeholder="Type the question..."></textarea>
                    </div>
                    <div>
                        <label style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:0.35rem;">💡 Answer</label>
                        <textarea id="fcEditA" rows="3" style="width:100%;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:0.625rem;color:#e2e8f0;font-size:0.875rem;resize:vertical;font-family:inherit;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#10B981'" onblur="this.style.borderColor='#334155'" placeholder="Type the answer..."></textarea>
                    </div>
                </div>
                <div style="display:flex;gap:0.75rem;align-items:center;">
                    <div style="flex:1;">
                        <label style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;display:block;margin-bottom:0.35rem;">🏷️ Tag (optional)</label>
                        <input id="fcEditTag" type="text" placeholder="e.g. Python, SQL, System Design" style="width:100%;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:0.5rem 0.75rem;color:#e2e8f0;font-size:0.85rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#8B5CF6'" onblur="this.style.borderColor='#334155'">
                    </div>
                    <div style="display:flex;gap:0.5rem;align-items:flex-end;padding-bottom:0.05rem;">
                        <button onclick="fcSaveEdit()" style="border:none;background:#3B82F6;color:white;padding:0.55rem 1.25rem;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:700;">💾 Save</button>
                        <button onclick="fcHideEdit()" style="border:1px solid #334155;background:transparent;color:#94a3b8;padding:0.55rem 1rem;border-radius:8px;cursor:pointer;font-size:0.85rem;">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card area -->
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem 2rem;gap:1.5rem;overflow:auto;">
            <!-- Progress bar -->
            <div style="width:100%;max-width:700px;display:flex;align-items:center;gap:0.75rem;">
                <div style="flex:1;height:5px;background:#1e293b;border-radius:3px;overflow:hidden;border:1px solid #1e293b;">
                    <div id="fcProgress" style="height:100%;background:linear-gradient(90deg,#3B82F6,#8B5CF6);border-radius:3px;transition:width 0.4s;"></div>
                </div>
                <div id="fcKnownBadge" style="font-size:0.72rem;font-weight:700;color:#10B981;white-space:nowrap;"></div>
            </div>

            <!-- The card -->
            <div id="fcCard" onclick="fcFlip()"
                 style="width:100%;max-width:700px;min-height:280px;border-radius:20px;padding:2.5rem 3rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transition:background 0.35s,border-color 0.35s,box-shadow 0.35s;position:relative;background:linear-gradient(135deg,#1e3a5f,#1e293b);border:2px solid #3B82F6;box-shadow:0 0 50px rgba(59,130,246,0.12);">
                <div id="fcSide" style="position:absolute;top:1rem;left:1.25rem;font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#3B82F6;"></div>
                <div id="fcCardTag" style="position:absolute;top:1rem;right:1.25rem;font-size:0.68rem;font-weight:700;color:#475569;background:#0f172a;padding:0.2rem 0.5rem;border-radius:5px;display:none;"></div>
                <div id="fcText" style="font-size:1.3rem;font-weight:700;color:#f1f5f9;line-height:1.75;max-width:540px;white-space:pre-wrap;"></div>
                <div style="position:absolute;bottom:1rem;font-size:0.72rem;color:#334155;">Space or click to flip</div>
            </div>

            <!-- Self-assessment buttons (shown after flip) -->
            <div id="fcAssess" style="display:none;gap:1rem;justify-content:center;">
                <button onclick="fcMarkKnown(false)" style="border:2px solid #ef4444;background:transparent;color:#ef4444;padding:0.625rem 1.75rem;border-radius:10px;cursor:pointer;font-size:0.9rem;font-weight:700;transition:all 0.2s;" onmouseover="this.style.background='#ef4444';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='#ef4444'">⚡ Still Learning</button>
                <button onclick="fcMarkKnown(true)" style="border:2px solid #10B981;background:transparent;color:#10B981;padding:0.625rem 1.75rem;border-radius:10px;cursor:pointer;font-size:0.9rem;font-weight:700;transition:all 0.2s;" onmouseover="this.style.background='#10B981';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='#10B981'">✅ Got It!</button>
            </div>

            <!-- Nav -->
            <div style="display:flex;align-items:center;gap:1rem;">
                <button onclick="fcNav(-1)" style="border:2px solid #334155;background:#1e293b;color:#e2e8f0;padding:0.625rem 1.75rem;border-radius:10px;cursor:pointer;font-size:0.95rem;font-weight:700;transition:all 0.2s;" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6'" onmouseout="this.style.borderColor='#334155';this.style.color='#e2e8f0'">← Prev</button>
                <div id="fcDots" style="display:flex;gap:0.35rem;align-items:center;max-width:280px;flex-wrap:wrap;justify-content:center;"></div>
                <button onclick="fcNav(1)" style="border:2px solid #334155;background:#1e293b;color:#e2e8f0;padding:0.625rem 1.75rem;border-radius:10px;cursor:pointer;font-size:0.95rem;font-weight:700;transition:all 0.2s;" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6'" onmouseout="this.style.borderColor='#334155';this.style.color='#e2e8f0'">Next →</button>
            </div>

            <div style="font-size:0.72rem;color:#2d3f55;display:flex;gap:1.25rem;">
                <span>← → navigate</span><span>Space = flip</span><span>K = known · U = learning</span><span>E = edit</span><span>Esc = close</span>
            </div>
        </div>`;
        document.body.appendChild(m);
        document.addEventListener('keydown', fcKeyHandler);
    }
    fcBuildFilteredList();
    fcRender();
    document.getElementById('flashcardModal').style.display='flex';
    document.body.style.overflow='hidden';
}

function closeFlashcards() {
    const m=document.getElementById('flashcardModal');
    if (m) m.style.display='none';
    document.body.style.overflow='';
}

function fcKeyHandler(e) {
    const m=document.getElementById('flashcardModal');
    if (!m || m.style.display!=='flex') return;
    if (document.getElementById('fcEditPanel').style.display!=='none') return; // editing
    if (e.key==='Escape') { closeFlashcards(); }
    else if (e.key==='ArrowLeft') { fcNav(-1); }
    else if (e.key==='ArrowRight') { fcNav(1); }
    else if (e.key===' ') { e.preventDefault(); fcFlip(); }
    else if (e.key==='e'||e.key==='E') { fcShowEdit(); }
    else if (e.key==='k'||e.key==='K') { fcMarkKnown(true); }
    else if (e.key==='u'||e.key==='U') { fcMarkKnown(false); }
}

function fcDeleteCurrent() { fcDelete(); }

let fcFilter='all', fcFiltered=[];

function fcBuildFilteredList() {
    if (fcFilter==='known') fcFiltered=flashcards.filter(f=>f.known);
    else if (fcFilter==='unknown') fcFiltered=flashcards.filter(f=>!f.known);
    else fcFiltered=[...flashcards];
    if (fcFiltered.length===0) fcFiltered=[...flashcards]; // fallback
    fcIdx=0;
}

function fcSetFilter(f) {
    fcFilter=f;
    ['fcFilterAll','fcFilterKnown','fcFilterUnknown'].forEach(id=>{
        const el=document.getElementById(id);
        if (!el) return;
        el.style.border='1px solid #475569';
        el.style.background='transparent';
        el.style.color='#94a3b8';
    });
    const activeId=f==='all'?'fcFilterAll':f==='known'?'fcFilterKnown':'fcFilterUnknown';
    const activeEl=document.getElementById(activeId);
    if (activeEl) { activeEl.style.border='1px solid #3B82F6'; activeEl.style.background='#1e3a5f'; activeEl.style.color='#60a5fa'; }
    fcBuildFilteredList(); fcFlipped=false; fcRender();
}

function fcRender() {
    if (!fcFiltered.length) fcBuildFilteredList();
    if (!fcFiltered.length) { closeFlashcards(); return; }
    fcIdx=Math.max(0,Math.min(fcIdx,fcFiltered.length-1));
    const card=fcFiltered[fcIdx];
    const knownCount=flashcards.filter(f=>f.known).length;

    document.getElementById('fcCount').textContent=`Card ${fcIdx+1} of ${fcFiltered.length}${fcFilter!=='all'?' (filtered)':''}`;
    document.getElementById('fcKnownBadge').textContent=`✅ ${knownCount}/${flashcards.length} known`;
    document.getElementById('fcSide').textContent=fcFlipped?'💡 Answer':'❓ Question';
    document.getElementById('fcText').textContent=fcFlipped?card.a:card.q;

    // Tag badge
    const tagEl=document.getElementById('fcCardTag');
    if (card.tag) { tagEl.textContent=card.tag; tagEl.style.display='block'; }
    else { tagEl.style.display='none'; }

    // Card known status indicator
    const el=document.getElementById('fcCard');
    if (fcFlipped) {
        el.style.background='linear-gradient(135deg,#064e3b,#1e293b)';
        el.style.borderColor='#10B981';
        el.style.boxShadow='0 0 50px rgba(16,185,129,0.12)';
        document.getElementById('fcSide').style.color='#10B981';
    } else {
        const isKnown=card.known;
        el.style.background=isKnown?'linear-gradient(135deg,#052e16,#1e293b)':'linear-gradient(135deg,#1e3a5f,#1e293b)';
        el.style.borderColor=isKnown?'#059669':'#3B82F6';
        el.style.boxShadow=isKnown?'0 0 50px rgba(16,185,129,0.08)':'0 0 50px rgba(59,130,246,0.12)';
        document.getElementById('fcSide').style.color=isKnown?'#10B981':'#3B82F6';
    }

    // Self-assess buttons — show after flip
    const assess=document.getElementById('fcAssess');
    if (assess) assess.style.display=fcFlipped?'flex':'none';

    // Progress bar
    const prog=document.getElementById('fcProgress');
    if (prog) prog.style.width=`${((fcIdx+1)/fcFiltered.length)*100}%`;

    // Dots
    const dots=document.getElementById('fcDots');
    if (dots) {
        const total=fcFiltered.length, show=Math.min(total,15);
        let html='';
        for(let i=0;i<show;i++){
            const active=i===fcIdx;
            const isK=fcFiltered[i].known;
            const color=active?'#3B82F6':isK?'#10B981':'#334155';
            html+=`<div onclick="fcIdx=${i};fcFlipped=false;fcRender();" style="width:${active?'18px':'7px'};height:7px;border-radius:4px;background:${color};transition:all 0.3s;cursor:pointer;" title="Card ${i+1}"></div>`;
        }
        if(total>15) html+=`<span style="font-size:0.68rem;color:#475569;margin-left:2px;">+${total-15}</span>`;
        dots.innerHTML=html;
    }
}

function fcFlip() {
    fcFlipped=!fcFlipped; fcRender();
}

function fcNav(d) {
    if (!fcFiltered.length) return;
    fcFlipped=false;
    fcIdx=(fcIdx+d+fcFiltered.length)%fcFiltered.length;
    fcRender();
}

function fcShuffle() {
    for(let i=fcFiltered.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fcFiltered[i],fcFiltered[j]]=[fcFiltered[j],fcFiltered[i]];}
    fcIdx=0; fcFlipped=false; fcRender();
}

function fcDelete() {
    if (!fcFiltered.length) return;
    if (!confirm('Delete this card?')) return;
    const card=fcFiltered[fcIdx];
    const gi=flashcards.findIndex(f=>f.id===card.id);
    if (gi>-1) flashcards.splice(gi,1);
    saveFlashcards();
    fcBuildFilteredList();
    fcIdx=Math.min(fcIdx,fcFiltered.length-1);
    fcFlipped=false; fcRender();
}

function fcMarkKnown(known) {
    if (!fcFiltered.length) return;
    const card=fcFiltered[fcIdx];
    const gi=flashcards.findIndex(f=>f.id===card.id);
    if (gi>-1) flashcards[gi].known=known;
    saveFlashcards();
    // Auto-advance
    setTimeout(()=>{ fcNav(1); },300);
}

function fcShowEdit() {
    if (!fcFiltered.length) return;
    const card=fcFiltered[fcIdx];
    document.getElementById('fcEditQ').value=card.q||'';
    document.getElementById('fcEditA').value=card.a||'';
    document.getElementById('fcEditTag').value=card.tag||'';
    document.getElementById('fcEditPanelTitle').textContent='✏️ Edit Card';
    document.getElementById('fcEditPanel').dataset.mode='edit';
    document.getElementById('fcEditPanel').style.display='block';
    document.getElementById('fcEditQ').focus();
}

function fcShowAdd() {
    document.getElementById('fcEditQ').value='';
    document.getElementById('fcEditA').value='';
    document.getElementById('fcEditTag').value='';
    document.getElementById('fcEditPanelTitle').textContent='➕ New Card';
    document.getElementById('fcEditPanel').dataset.mode='add';
    document.getElementById('fcEditPanel').style.display='block';
    document.getElementById('fcEditQ').focus();
}

function fcHideEdit() {
    document.getElementById('fcEditPanel').style.display='none';
}

function fcSaveEdit() {
    const q=document.getElementById('fcEditQ').value.trim();
    const a=document.getElementById('fcEditA').value.trim();
    const tag=document.getElementById('fcEditTag').value.trim();
    if (!q||!a) { alert('Question and Answer are required.'); return; }
    const mode=document.getElementById('fcEditPanel').dataset.mode;
    if (mode==='edit') {
        const card=fcFiltered[fcIdx];
        const gi=flashcards.findIndex(f=>f.id===card.id);
        if (gi>-1) { flashcards[gi].q=q; flashcards[gi].a=a; flashcards[gi].tag=tag; }
    } else {
        const id=flashcards.length>0?Math.max(...flashcards.map(f=>f.id))+1:1;
        flashcards.push({id,q,a,tag,known:false});
        fcBuildFilteredList();
        fcIdx=fcFiltered.length-1;
    }
    saveFlashcards();
    fcBuildFilteredList();
    fcHideEdit(); fcFlipped=false; fcRender();
}

function fcAddPrompt() { fcShowAdd(); }

// ============================================================
// GOOGLE INTEGRATION — OAuth 2.0 + Drive + Calendar + Gmail + Sheets
// ============================================================

const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

let gTokenClient = null;
let gAccessToken = null;
let gUserProfile = null;
let gDriveFolderId = localStorage.getItem('gDriveFolderId') || null;
let gSheetId = localStorage.getItem('gSheetId') || null;

// ── Helpers ──────────────────────────────────────────────────
function gClientId() { return localStorage.getItem('googleClientId') || ''; }

function gLog(msg, type = 'info') {
    const log = document.getElementById('googleActivityLog');
    if (!log) return;
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const now = new Date().toLocaleTimeString();
    const existing = log.innerHTML.includes('No activity') ? '' : log.innerHTML;
    log.innerHTML = `<div style="padding:0.25rem 0;border-bottom:1px solid #f1f5f9;display:flex;gap:0.5rem;">
        <span style="color:#94a3b8;white-space:nowrap;">${now}</span>
        <span>${icons[type] || 'ℹ️'} ${msg}</span>
    </div>` + existing;
}

async function gFetch(url, opts = {}) {
    if (!gAccessToken) throw new Error('Not signed in');
    const res = await fetch(url, {
        ...opts,
        headers: {
            'Authorization': 'Bearer ' + gAccessToken,
            'Content-Type': 'application/json',
            ...(opts.headers || {})
        }
    });
    if (res.status === 401) { gAccessToken = null; updateGoogleUI(); throw new Error('Token expired — please sign in again'); }
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'API error ' + res.status); }
    return res.status === 204 ? {} : res.json();
}

// ── Setup & Auth ─────────────────────────────────────────────
function saveGoogleClientId() {
    const id = document.getElementById('googleClientIdInput').value.trim();
    if (!id || !id.includes('.apps.googleusercontent.com')) {
        alert('❌ That doesn\'t look like a valid Client ID. It should end with .apps.googleusercontent.com'); return;
    }
    localStorage.setItem('googleClientId', id);
    initGoogleAuth();
    alert('✅ Client ID saved! Click "Sign in with Google" below to connect.');
}

function initGoogleAuth() {
    if (!gClientId()) return;
    if (typeof google === 'undefined') { setTimeout(initGoogleAuth, 500); return; }
    try {
        gTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: gClientId(),
            scope: GOOGLE_SCOPES,
            callback: handleGoogleToken,
        });
        // Check if we have a stored token
        const stored = localStorage.getItem('gAccessToken');
        const expiry = localStorage.getItem('gTokenExpiry');
        if (stored && expiry && Date.now() < parseInt(expiry)) {
            gAccessToken = stored;
            fetchGoogleProfile();
        } else {
            document.getElementById('googleSignedOut').style.display = 'block';
        }
    } catch(e) { console.warn('Google auth init:', e.message); }
}

function handleGoogleToken(response) {
    if (response.error) { gLog('Auth error: ' + response.error, 'error'); return; }
    gAccessToken = response.access_token;
    const expiry = Date.now() + (response.expires_in || 3600) * 1000;
    localStorage.setItem('gAccessToken', gAccessToken);
    localStorage.setItem('gTokenExpiry', expiry);
    fetchGoogleProfile();
    gLog('Signed in to Google', 'success');
}

async function fetchGoogleProfile() {
    try {
        const profile = await gFetch('https://www.googleapis.com/oauth2/v2/userinfo');
        gUserProfile = profile;
        updateGoogleUI(true);
        document.getElementById('googleMenuLabel').textContent = '✅ Google Connected';
    } catch(e) {
        document.getElementById('googleSignedOut').style.display = 'block';
        document.getElementById('googleSignedIn').style.display = 'none';
    }
}

function updateGoogleUI(signedIn = false) {
    document.getElementById('googleSignedOut').style.display = signedIn ? 'none' : 'block';
    document.getElementById('googleSignedIn').style.display = signedIn ? 'block' : 'none';
    if (signedIn && gUserProfile) {
        document.getElementById('googleUserName').textContent = gUserProfile.name || '';
        document.getElementById('googleUserEmail').textContent = gUserProfile.email || '';
        if (gUserProfile.picture) {
            const av = document.getElementById('googleUserAvatar');
            av.src = gUserProfile.picture; av.style.display = 'block';
        }
        // Show Client ID section collapsed if already configured
        document.getElementById('googleSetupNotice').style.display = 'none';
    }
}

function googleSignIn() {
    if (!gClientId()) { alert('Please enter your Google Client ID first.'); return; }
    if (!gTokenClient) { initGoogleAuth(); setTimeout(googleSignIn, 600); return; }
    gTokenClient.requestAccessToken({ prompt: '' });
}

function googleSignOut() {
    if (gAccessToken) google.accounts.oauth2.revoke(gAccessToken);
    gAccessToken = null; gUserProfile = null;
    localStorage.removeItem('gAccessToken'); localStorage.removeItem('gTokenExpiry');
    updateGoogleUI(false);
    document.getElementById('googleMenuLabel').textContent = 'Connect Google';
    gLog('Signed out', 'info');
}

function showGooglePanel() {
    // Pre-fill Client ID if saved
    const saved = gClientId();
    if (saved) document.getElementById('googleClientIdInput').value = saved;
    if (gAccessToken && gUserProfile) updateGoogleUI(true);
    else if (gClientId()) {
        document.getElementById('googleSetupNotice').style.display = 'none';
        document.getElementById('googleSignedOut').style.display = 'block';
    }
    openModal('googlePanelModal');
}

// ── Google Drive ─────────────────────────────────────────────
async function driveEnsureFolder() {
    if (gDriveFolderId) return gDriveFolderId;
    // Search for existing folder
    const search = await gFetch(
        `https://www.googleapis.com/drive/v3/files?q=name='InterviewHub' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`
    );
    if (search.files && search.files.length > 0) {
        gDriveFolderId = search.files[0].id;
    } else {
        const folder = await gFetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            body: JSON.stringify({ name: 'InterviewHub', mimeType: 'application/vnd.google-apps.folder' })
        });
        gDriveFolderId = folder.id;
    }
    localStorage.setItem('gDriveFolderId', gDriveFolderId);
    return gDriveFolderId;
}

async function driveBackup() {
    gLog('Starting Drive backup…');
    try {
        const folderId = await driveEnsureFolder();
        const data = {
            version: '2.0', exportDate: new Date().toISOString(),
            companies, resources, globalNotes,
            notebooks: JSON.parse(localStorage.getItem('interviewhub_notebooks') || '[]'),
            checklist: JSON.parse(localStorage.getItem('interviewhub_cl') || '[]'),
            flashcards: JSON.parse(localStorage.getItem('interviewhub_fc') || '[]')
        };
        const filename = `InterviewHub-Backup-${new Date().toISOString().split('T')[0]}.json`;
        const content = JSON.stringify(data, null, 2);
        // Multipart upload
        const boundary = 'foo_bar_baz';
        const meta = JSON.stringify({ name: filename, parents: [folderId] });
        const body = `--${boundary}\r\nContent-Type: application/json\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + gAccessToken,
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body
        });
        if (!res.ok) throw new Error('Upload failed: ' + res.status);
        const file = await res.json();
        gLog(`Backup saved: ${filename}`, 'success');
        alert(`✅ Backup saved to Google Drive!\nFile: ${filename}\nFolder: InterviewHub`);
    } catch(e) { gLog('Backup failed: ' + e.message, 'error'); alert('❌ Backup failed: ' + e.message); }
}

async function driveRestore() {
    gLog('Fetching backups from Drive…');
    try {
        const folderId = await driveEnsureFolder();
        const files = await gFetch(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'InterviewHub-Backup' and trashed=false&orderBy=createdTime desc&fields=files(id,name,createdTime)&pageSize=10`
        );
        if (!files.files || files.files.length === 0) { alert('No backups found in Drive.'); return; }
        const list = files.files.map((f, i) => `${i + 1}. ${f.name}`).join('\n');
        const choice = prompt(`Choose backup to restore (enter number):\n\n${list}`);
        const idx = parseInt(choice) - 1;
        if (isNaN(idx) || idx < 0 || idx >= files.files.length) return;
        const fileId = files.files[idx].id;
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: { 'Authorization': 'Bearer ' + gAccessToken }
        });
        const imported = await res.json();
        if (!imported.companies) throw new Error('Invalid backup file');
        if (!confirm(`Restore from ${files.files[idx].name}?\n\nThis will REPLACE your current data.`)) return;
        companies = imported.companies; resources = imported.resources; globalNotes = imported.globalNotes;
        saveToLocalStorage(); saveResources(); saveGlobalNotes();
        if (imported.notebooks) localStorage.setItem('interviewhub_notebooks', JSON.stringify(imported.notebooks));
        if (imported.checklist) localStorage.setItem('interviewhub_cl', JSON.stringify(imported.checklist));
        if (imported.flashcards) localStorage.setItem('interviewhub_fc', JSON.stringify(imported.flashcards));
        renderCompanies();
        gLog(`Restored from ${files.files[idx].name}`, 'success');
        alert('✅ Data restored successfully!');
    } catch(e) { gLog('Restore failed: ' + e.message, 'error'); alert('❌ Restore failed: ' + e.message); }
}

async function driveOpenFolder() {
    try {
        const folderId = await driveEnsureFolder();
        window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
        gLog('Opened Drive folder', 'success');
    } catch(e) { gLog('Error: ' + e.message, 'error'); alert('❌ ' + e.message); }
}

// ── Google Calendar ──────────────────────────────────────────
function calendarAddInterview() {
    // Populate company dropdown
    const sel = document.getElementById('calEventCompany');
    sel.innerHTML = '<option value="">Select company…</option>' +
        companies.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('');
    // Pre-fill date with nearest interview date from companies
    const nextInterview = companies
        .filter(c => c.interviewDate)
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
        .find(c => new Date(c.interviewDate) >= new Date());
    if (nextInterview) {
        document.getElementById('calEventTitle').value = `Interview – ${nextInterview.name}`;
        document.getElementById('calEventDate').value = nextInterview.interviewDate + 'T10:00';
        sel.value = nextInterview.name;
    }
    openModal('calendarEventModal');
}

async function submitCalendarEvent() {
    const title = document.getElementById('calEventTitle').value.trim();
    const dateStr = document.getElementById('calEventDate').value;
    const duration = parseInt(document.getElementById('calEventDuration').value);
    const link = document.getElementById('calEventLink').value.trim();
    const notes = document.getElementById('calEventNotes').value.trim();
    if (!title || !dateStr) { alert('Title and date are required.'); return; }
    const start = new Date(dateStr);
    const end = new Date(start.getTime() + duration * 60000);
    const event = {
        summary: title,
        description: (notes ? notes + '\n\n' : '') + (link ? `Meeting link: ${link}` : '') + '\n\nCreated by InterviewHub',
        start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        ...(link ? { conferenceData: undefined, location: link } : {}),
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }, { method: 'email', minutes: 1440 }] }
    };
    try {
        const created = await gFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST', body: JSON.stringify(event)
        });
        closeModal('calendarEventModal');
        gLog(`Calendar event created: ${title}`, 'success');
        alert(`✅ Event added to Google Calendar!\n"${title}"\n${start.toLocaleString()}`);
    } catch(e) { gLog('Calendar error: ' + e.message, 'error'); alert('❌ Failed: ' + e.message); }
}

async function calendarViewUpcoming() {
    gLog('Fetching upcoming events…');
    try {
        const now = new Date().toISOString();
        const events = await gFetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&q=interview&maxResults=10&orderBy=startTime&singleEvents=true`
        );
        if (!events.items || events.items.length === 0) { alert('No upcoming interview events found in your calendar.'); return; }
        const list = events.items.map(e => {
            const dt = e.start.dateTime ? new Date(e.start.dateTime).toLocaleString() : e.start.date;
            return `• ${e.summary}\n  ${dt}`;
        }).join('\n\n');
        alert(`📅 Upcoming Interview Events:\n\n${list}`);
        gLog(`Found ${events.items.length} upcoming events`, 'success');
    } catch(e) { gLog('Calendar error: ' + e.message, 'error'); alert('❌ ' + e.message); }
}

async function calendarSyncAll() {
    const withDates = companies.filter(c => c.interviewDate);
    if (withDates.length === 0) { alert('No companies have interview dates set. Add interview dates to companies first.'); return; }
    if (!confirm(`Sync ${withDates.length} interview(s) to Google Calendar?`)) return;
    gLog(`Syncing ${withDates.length} interviews…`);
    let synced = 0;
    for (const company of withDates) {
        try {
            const start = new Date(company.interviewDate + 'T10:00:00');
            const end = new Date(start.getTime() + 60 * 60000);
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            await gFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                body: JSON.stringify({
                    summary: `Interview – ${company.name}`,
                    description: `InterviewHub: ${company.rounds} rounds tracked.\n\nCreated by InterviewHub`,
                    start: { dateTime: start.toISOString(), timeZone: tz },
                    end: { dateTime: end.toISOString(), timeZone: tz },
                    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }, { method: 'email', minutes: 1440 }] }
                })
            });
            synced++;
        } catch(e) { gLog(`Failed to sync ${company.name}: ${e.message}`, 'error'); }
    }
    gLog(`Synced ${synced}/${withDates.length} interviews to Calendar`, 'success');
    alert(`✅ Synced ${synced} interview(s) to Google Calendar!`);
}

// ── Gmail ────────────────────────────────────────────────────
function gmailDraftFollowUp() {
    document.getElementById('gmailDraftTitle').textContent = '📝 Follow-up Email';
    const company = companies[0];
    document.getElementById('gmailTo').value = '';
    document.getElementById('gmailSubject').value = company ? `Following up – ${company.name} Interview` : 'Following up on my interview';
    document.getElementById('gmailBody').value =
`Hi [Recruiter Name],

I hope you're doing well. I wanted to follow up on my interview for the [Position] role at ${company ? company.name : '[Company]'} that took place on [Date].

I remain very excited about this opportunity and would love to hear any updates on the hiring process.

Please let me know if you need any additional information from my side.

Thank you for your time and consideration.

Best regards,
[Your Name]`;
    openModal('gmailDraftModal');
}

function gmailDraftThankYou() {
    document.getElementById('gmailDraftTitle').textContent = '🙏 Thank You Email';
    const company = companies[0];
    document.getElementById('gmailTo').value = '';
    document.getElementById('gmailSubject').value = company ? `Thank you – ${company.name} Interview` : 'Thank you for the interview';
    document.getElementById('gmailBody').value =
`Hi [Interviewer Name],

Thank you so much for taking the time to speak with me today about the [Position] role at ${company ? company.name : '[Company]'}.

I really enjoyed our conversation, especially [mention a specific topic discussed]. It gave me a clearer picture of the team and the exciting work you're doing.

I'm very enthusiastic about the opportunity and believe my experience in [relevant skill] would be a strong fit for the team.

Please don't hesitate to reach out if you need any further information.

Looking forward to hearing from you.

Best regards,
[Your Name]`;
    openModal('gmailDraftModal');
}

async function gmailFindInterviewEmails() {
    gLog('Searching Gmail for interview emails…');
    try {
        const res = await gFetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(interview OR "interview invitation" OR "job offer" OR "next steps")&maxResults=10`
        );
        if (!res.messages || res.messages.length === 0) { alert('No interview-related emails found.'); return; }
        // Fetch first 5 subjects
        const subjects = [];
        for (const msg of res.messages.slice(0, 5)) {
            const detail = await gFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`);
            const subj = detail.payload?.headers?.find(h => h.name === 'Subject')?.value || '(no subject)';
            const from = detail.payload?.headers?.find(h => h.name === 'From')?.value || '';
            subjects.push(`• ${subj}\n  From: ${from}`);
        }
        alert(`📧 Recent Interview Emails (${res.messages.length} found):\n\n${subjects.join('\n\n')}\n\nOpening Gmail…`);
        window.open('https://mail.google.com/mail/u/0/#search/interview', '_blank');
        gLog(`Found ${res.messages.length} interview emails`, 'success');
    } catch(e) { gLog('Gmail error: ' + e.message, 'error'); alert('❌ ' + e.message); }
}

async function gmailSendDraft() {
    const to = document.getElementById('gmailTo').value.trim();
    const subject = document.getElementById('gmailSubject').value.trim();
    const body = document.getElementById('gmailBody').value;
    if (!subject || !body) { alert('Subject and body are required.'); return; }
    const email = [`To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset=utf-8', '', body].join('\r\n');
    const encoded = btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    try {
        await gFetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
            method: 'POST',
            body: JSON.stringify({ message: { raw: encoded } })
        });
        closeModal('gmailDraftModal');
        gLog(`Draft saved: "${subject}"`, 'success');
        alert('✅ Draft saved to Gmail! Open Gmail to review and send.');
        window.open('https://mail.google.com/mail/u/0/#drafts', '_blank');
    } catch(e) { gLog('Gmail error: ' + e.message, 'error'); alert('❌ Failed: ' + e.message); }
}

function gmailCopyDraft() {
    const subject = document.getElementById('gmailSubject').value;
    const body = document.getElementById('gmailBody').value;
    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text).then(() => alert('✅ Email copied to clipboard!'));
}

// ── Google Sheets ────────────────────────────────────────────
async function sheetsEnsureTracker() {
    if (gSheetId) {
        // Verify it still exists
        try { await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${gSheetId}?fields=spreadsheetId`); return gSheetId; } catch(e) { gSheetId = null; }
    }
    // Create new sheet
    gLog('Creating Application Tracker sheet…');
    const sheet = await gFetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        body: JSON.stringify({
            properties: { title: 'InterviewHub — Application Tracker' },
            sheets: [{ properties: { title: 'Applications' } }]
        })
    });
    gSheetId = sheet.spreadsheetId;
    localStorage.setItem('gSheetId', gSheetId);
    // Write headers
    await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${gSheetId}/values/Applications!A1:J1?valueInputOption=RAW`, {
        method: 'PUT',
        body: JSON.stringify({ values: [['Company', 'Rounds', 'Interview Date', 'Status', 'Tags', 'Last Updated', 'Notes', 'Drive Link', 'Created']] })
    });
    gLog('Tracker sheet created', 'success');
    return gSheetId;
}

async function sheetsExportTracker() {
    gLog('Exporting to Google Sheets…');
    try {
        const sheetId = await sheetsEnsureTracker();
        const rows = companies.map(c => [
            c.name || '',
            c.rounds || 0,
            c.interviewDate || '',
            c.status || 'In Progress',
            (c.tags || []).join(', '),
            c.updated || '',
            (c.notes || []).map(n => n.topic).join(', '),
            '',
            new Date().toLocaleDateString()
        ]);
        // Clear old data and write new
        await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!A2:J?valueInputOption=RAW`, {
            method: 'PUT',
            body: JSON.stringify({ values: rows.length > 0 ? rows : [[]] })
        });
        // Format header row
        await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
            method: 'POST',
            body: JSON.stringify({ requests: [{
                repeatCell: {
                    range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
                    cell: { userEnteredFormat: { backgroundColor: { red: 0.23, green: 0.51, blue: 0.96 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } } } },
                    fields: 'userEnteredFormat(backgroundColor,textFormat)'
                }
            }] })
        });
        gLog(`Exported ${rows.length} companies to Sheets`, 'success');
        alert(`✅ ${rows.length} companies exported to Google Sheets!\nOpening your tracker…`);
        window.open(`https://docs.google.com/spreadsheets/d/${sheetId}`, '_blank');
    } catch(e) { gLog('Sheets error: ' + e.message, 'error'); alert('❌ Failed: ' + e.message); }
}

async function sheetsOpenTracker() {
    try {
        const sheetId = await sheetsEnsureTracker();
        window.open(`https://docs.google.com/spreadsheets/d/${sheetId}`, '_blank');
        gLog('Opened tracker sheet', 'success');
    } catch(e) { gLog('Error: ' + e.message, 'error'); alert('❌ ' + e.message); }
}

async function sheetsUpdateStatus() {
    gLog('Updating statuses in Sheets…');
    try {
        const sheetId = await sheetsEnsureTracker();
        const rows = await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!A2:A`);
        const sheetCompanies = (rows.values || []).map(r => r[0]);
        const updates = [];
        sheetCompanies.forEach((name, i) => {
            const company = companies.find(c => c.name === name);
            if (company) updates.push({ range: `Applications!D${i + 2}`, values: [[company.status || 'In Progress']] });
        });
        if (updates.length > 0) {
            await gFetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, {
                method: 'POST',
                body: JSON.stringify({ valueInputOption: 'RAW', data: updates })
            });
        }
        gLog(`Updated ${updates.length} statuses`, 'success');
        alert(`✅ Updated ${updates.length} application statuses!`);
    } catch(e) { gLog('Sheets error: ' + e.message, 'error'); alert('❌ ' + e.message); }
}

// Init Google auth when page loads (if Client ID was previously saved)
setTimeout(initGoogleAuth, 1000);

// ============================================================
// GITHUB SYNC — save/load data.json to/from GitHub repo
// ============================================================

const GH_TOKEN_KEY  = 'gh_sync_token';
const GH_USER_KEY   = 'gh_sync_user';
const GH_REPO_KEY   = 'gh_sync_repo';
const GH_SHA_KEY    = 'gh_sync_sha';   // SHA of last data.json commit
let   ghAutoSaveTimer = null;

// ── Helpers ──────────────────────────────────────────────────
function ghToken()    { return localStorage.getItem(GH_TOKEN_KEY) || ''; }
function ghUser()     { return localStorage.getItem(GH_USER_KEY)  || 'mustaq015'; }
function ghRepo()     { return localStorage.getItem(GH_REPO_KEY)  || 'interviewhub'; }
function ghIsConnected() { return !!ghToken(); }

function ghLog(msg, type='info') {
    const log = document.getElementById('ghSyncLog');
    if (!log) return;
    const icons = { info:'ℹ️', success:'✅', error:'❌', loading:'🔄' };
    const time = new Date().toLocaleTimeString();
    log.innerHTML = `<div>${icons[type]||'ℹ️'} <span style="color:#94a3b8">${time}</span> ${msg}</div>` + log.innerHTML;
}

function ghSetIndicator(state) {
    const icon = document.getElementById('ghSyncIcon');
    const text = document.getElementById('ghSyncText');
    const el   = document.getElementById('ghSyncIndicator');
    if (!icon || !text || !el) return;
    const states = {
        connected:  { icon:'🟢', text:'Synced',   color:'#f0fdf4', border:'#bbf7d0' },
        syncing:    { icon:'🔄', text:'Saving…',  color:'#eff6ff', border:'#bfdbfe' },
        error:      { icon:'🔴', text:'Sync Error',color:'#fef2f2', border:'#fecaca' },
        disconnected:{ icon:'☁️', text:'Sync',    color:'white',   border:'#e2e8f0' }
    };
    const s = states[state] || states.disconnected;
    icon.textContent = s.icon;
    text.textContent = s.text;
    el.style.background = s.color;
    el.style.borderColor = s.border;
}

// ── Collect all app data ──────────────────────────────────────
function ghCollectData() {
    return {
        version: '2.0',
        lastUpdated: new Date().toISOString(),
        companies,
        resources,
        globalNotes,
        notebooks: JSON.parse(localStorage.getItem('interviewhub_notebooks') || '[]'),
        checklist: JSON.parse(localStorage.getItem('interviewhub_cl') || '[]'),
        flashcards: JSON.parse(localStorage.getItem('interviewhub_fc') || '[]')
    };
}

// ── Push data → GitHub ────────────────────────────────────────
async function ghPush(silent = false) {
    if (!ghIsConnected()) { showGithubSetup(); return; }
    ghSetIndicator('syncing');
    if (!silent) ghLog('Saving to GitHub…', 'loading');
    try {
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(ghCollectData(), null, 2))));
        const sha = localStorage.getItem(GH_SHA_KEY) || await ghGetSha();

        const body = {
            message: `InterviewHub sync — ${new Date().toLocaleString()}`,
            content,
            ...(sha ? { sha } : {})
        };

        const res = await fetch(
            `https://api.github.com/repos/${ghUser()}/${ghRepo()}/contents/data.json`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${ghToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Push failed');

        // Save new SHA for next update
        localStorage.setItem(GH_SHA_KEY, json.content.sha);
        ghSetIndicator('connected');
        if (!silent) ghLog('Saved to GitHub ✓', 'success');
    } catch(e) {
        ghSetIndicator('error');
        ghLog('Save failed: ' + e.message, 'error');
        if (!silent) alert('❌ GitHub sync failed: ' + e.message);
    }
}

// ── Pull data ← GitHub ────────────────────────────────────────
async function ghPull() {
    if (!ghIsConnected()) { showGithubSetup(); return; }
    ghLog('Loading from GitHub…', 'loading');
    try {
        // Use raw URL with cache-bust to avoid CORS and stale cache
        const rawUrl = `https://raw.githubusercontent.com/${ghUser()}/${ghRepo()}/main/data.json?t=${Date.now()}`;
        const res = await fetch(rawUrl);
        if (!res.ok) throw new Error('data.json not found (status ' + res.status + ')');

        const data = await res.json();

        // Get SHA separately for future pushes (needs API)
        fetch(`https://api.github.com/repos/${ghUser()}/${ghRepo()}/contents/data.json`,
            { headers: { 'Authorization': `token ${ghToken()}` } })
            .then(r => r.json()).then(j => { if (j.sha) localStorage.setItem(GH_SHA_KEY, j.sha); })
            .catch(() => {});

        // Restore all data
        if (data.companies)   { companies   = data.companies;   _ghCoreSaveToLocalStorage(); }
        if (data.resources)   { resources   = data.resources;   _ghCoreSaveResources(); }
        if (data.globalNotes) { globalNotes = data.globalNotes; _ghCoreSaveGlobalNotes(); }
        if (data.notebooks)   localStorage.setItem('interviewhub_notebooks', JSON.stringify(data.notebooks));
        if (data.checklist)   localStorage.setItem('interviewhub_cl',        JSON.stringify(data.checklist));
        if (data.flashcards)  localStorage.setItem('interviewhub_fc',        JSON.stringify(data.flashcards));

        renderCompanies();
        ghSetIndicator('connected');
        ghLog(`Loaded ✓ — ${data.companies?.length || 0} companies, updated ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'unknown'}`, 'success');
        const sub = document.getElementById('ghConnectedSub');
        if (sub) sub.textContent = `Last sync: ${new Date(data.lastUpdated || Date.now()).toLocaleString()}`;
    } catch(e) {
        ghSetIndicator('error');
        ghLog('Load failed: ' + e.message, 'error');
        alert('❌ Could not load from GitHub: ' + e.message);
    }
}

// ── Get current SHA of data.json ──────────────────────────────
async function ghGetSha() {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${ghUser()}/${ghRepo()}/contents/data.json`,
            { headers: { 'Authorization': `token ${ghToken()}` } }
        );
        if (!res.ok) return null;
        const json = await res.json();
        localStorage.setItem(GH_SHA_KEY, json.sha);
        return json.sha;
    } catch(e) { return null; }
}

// ── Auto-save: trigger 3s after any data change ───────────────
function ghScheduleAutoSave() {
    if (!ghIsConnected()) return;
    clearTimeout(ghAutoSaveTimer);
    ghAutoSaveTimer = setTimeout(() => ghPush(true), 3000);
}

// ── Connect ───────────────────────────────────────────────────
async function ghConnect() {
    const token    = document.getElementById('ghTokenInput').value.trim();
    const username = document.getElementById('ghUsernameInput').value.trim();
    const repo     = document.getElementById('ghRepoInput').value.trim();

    if (!token || !username || !repo) { alert('Please fill in all fields.'); return; }
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        alert('❌ Token should start with ghp_ or github_pat_'); return;
    }

    // Verify token by calling API
    ghLog('Verifying token…', 'loading');
    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}`,
            { headers: { 'Authorization': `token ${token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Repo not found');

        // Save credentials
        localStorage.setItem(GH_TOKEN_KEY, token);
        localStorage.setItem(GH_USER_KEY, username);
        localStorage.setItem(GH_REPO_KEY, repo);
        localStorage.removeItem(GH_SHA_KEY);

        ghShowConnectedPanel(username, repo);
        ghSetIndicator('connected');
        ghLog(`Connected to ${username}/${repo}`, 'success');

        // Pull latest data immediately
        await ghPull();

    } catch(e) {
        ghLog('Connection failed: ' + e.message, 'error');
        alert('❌ Could not connect: ' + e.message + '\n\nCheck your token and repo name.');
    }
}

function ghShowConnectedPanel(user, repo) {
    document.getElementById('ghSetupForm').style.display = 'none';
    document.getElementById('ghConnectedPanel').style.display = 'block';
    document.getElementById('ghConnectedLabel').textContent = `${user}/${repo}`;
    const sha = localStorage.getItem(GH_SHA_KEY);
    document.getElementById('ghConnectedSub').textContent = sha
        ? 'Data synced with GitHub' : 'Click "Load from GitHub" to sync';
}

function ghDisconnect() {
    if (!confirm('Disconnect GitHub sync?\n\nYour local data will not be deleted.')) return;
    localStorage.removeItem(GH_TOKEN_KEY);
    localStorage.removeItem(GH_USER_KEY);
    localStorage.removeItem(GH_REPO_KEY);
    localStorage.removeItem(GH_SHA_KEY);
    document.getElementById('ghSetupForm').style.display = 'block';
    document.getElementById('ghConnectedPanel').style.display = 'none';
    document.getElementById('ghTokenInput').value = '';
    ghSetIndicator('disconnected');
    ghLog('Disconnected', 'info');
}

// ── Show setup modal ──────────────────────────────────────────
function showGithubSetup() {
    if (ghIsConnected()) {
        ghShowConnectedPanel(ghUser(), ghRepo());
    } else {
        document.getElementById('ghSetupForm').style.display = 'block';
        document.getElementById('ghConnectedPanel').style.display = 'none';
        // Pre-fill defaults
        document.getElementById('ghUsernameInput').value = ghUser();
        document.getElementById('ghRepoInput').value = ghRepo();
    }
    openModal('githubSyncModal');
}

// ── Hook into all save functions (auto-sync to GitHub) ────────
function saveToLocalStorage() { _ghCoreSaveToLocalStorage(); ghScheduleAutoSave(); }
function saveResources()      { _ghCoreSaveResources();      ghScheduleAutoSave(); }
function saveGlobalNotes()    { _ghCoreSaveGlobalNotes();    ghScheduleAutoSave(); }
function saveNotebooks()      { _ghCoreSaveNotebooks();      ghScheduleAutoSave(); }
function saveChecklist()      { _ghCoreSaveChecklist();      ghScheduleAutoSave(); }
function saveFlashcards()     { _ghCoreSaveFlashcards();     ghScheduleAutoSave(); }

// ── Sticky FAB + compact header on scroll ────────────────────
(function initScrollBehavior() {
    const mainEl = document.querySelector('.main-content') || document.documentElement;

    function onScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const fab = document.getElementById('fabAddQuestion');
        const detail = document.getElementById('companyDetail');
        const isDetailActive = detail && detail.classList.contains('active');

        // Show FAB only when on company detail and scrolled past 300px
        if (fab) {
            if (isDetailActive && scrollY > 300) {
                fab.style.display = 'flex';
            } else {
                fab.style.display = 'none';
            }
        }

        // Compact detail-header icon when scrolled
        const icon = document.getElementById('detailIcon');
        const nameEl = document.getElementById('detailName');
        if (icon && nameEl) {
            if (scrollY > 80) {
                icon.style.width = '40px';
                icon.style.height = '40px';
                icon.style.fontSize = '20px';
                nameEl.style.fontSize = '1.25rem';
            } else {
                icon.style.width = '';
                icon.style.height = '';
                icon.style.fontSize = '';
                nameEl.style.fontSize = '';
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

setTimeout(async () => {
    if (ghIsConnected()) {
        ghSetIndicator('connected');
        try {
            const rawUrl = `https://raw.githubusercontent.com/${ghUser()}/${ghRepo()}/main/data.json?t=${Date.now()}`;
            const res = await fetch(rawUrl);
            if (!res.ok) return; // silent fail on startup
            const data = await res.json();
            if (data.companies)   { companies   = data.companies;   _ghCoreSaveToLocalStorage(); }
            if (data.resources)   { resources   = data.resources;   _ghCoreSaveResources(); }
            if (data.globalNotes) { globalNotes = data.globalNotes; _ghCoreSaveGlobalNotes(); }
            if (data.notebooks)   localStorage.setItem('interviewhub_notebooks', JSON.stringify(data.notebooks));
            if (data.checklist)   localStorage.setItem('interviewhub_cl',        JSON.stringify(data.checklist));
            if (data.flashcards)  localStorage.setItem('interviewhub_fc',        JSON.stringify(data.flashcards));
            renderCompanies();
            ghSetIndicator('connected');
            ghLog(`Auto-loaded ✓ — ${data.companies?.length || 0} companies`, 'success');
        } catch(e) {
            ghSetIndicator('connected'); // stay green, just couldn't auto-load
        }
    }
}, 1500);




// ============================================================
// NOTES ATTACHMENTS — multi-format file viewer & URL embedding
// ============================================================

function getAttachKey() {
    if (!currentCategory || !currentTopic) return null;
    return `attach_${currentCategory.id}_${currentTopic.id}`;
}
function loadAttachments() {
    const key = getAttachKey();
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem('interviewhub_' + key) || '[]'); } catch(e) { return []; }
}
function saveAttachments(list) {
    const key = getAttachKey();
    if (!key) return;
    localStorage.setItem('interviewhub_' + key, JSON.stringify(list));
}

let _currentFileData = null;

function openAttachPanel() {
    document.getElementById('attachmentsPanel').style.display = 'block';
    renderAttachmentsList();
}
function closeAttachPanel() {
    document.getElementById('attachmentsPanel').style.display = 'none';
}

function triggerFileAttach(type) {
    if (type === 'image') document.getElementById('attachImageInput').click();
    else if (type === 'pdf') document.getElementById('attachPdfInput').click();
    else document.getElementById('attachFileInput').click();
}

function handleAttachFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File too large. Max 10MB per attachment.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        const attachments = loadAttachments();
        attachments.push({
            id: Date.now(), name: file.name, type: file.type || 'application/octet-stream',
            size: file.size, dataUrl: e.target.result, source: 'upload',
            added: new Date().toISOString()
        });
        saveAttachments(attachments);
        renderAttachmentsList();
        openAttachPanel();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function showUrlAttachInput() {
    const row = document.getElementById('urlAttachRow');
    row.style.display = row.style.display === 'none' ? 'flex' : 'none';
    if (row.style.display === 'flex') document.getElementById('urlAttachInput').focus();
}
function showGoogleDocAttach() {
    document.getElementById('urlAttachInput').placeholder = 'Paste Google Doc / Sheets / Slides share link…';
    document.getElementById('urlAttachLabel').value = 'Google Doc';
    document.getElementById('urlAttachRow').style.display = 'flex';
    document.getElementById('urlAttachInput').focus();
}
function attachUrl() {
    const url = document.getElementById('urlAttachInput').value.trim();
    const label = document.getElementById('urlAttachLabel').value.trim() || url;
    if (!url) { alert('Please enter a URL.'); return; }
    const attachments = loadAttachments();
    attachments.push({ id: Date.now(), name: label, type: 'url', url, source: 'url', added: new Date().toISOString() });
    saveAttachments(attachments);
    document.getElementById('urlAttachInput').value = '';
    document.getElementById('urlAttachLabel').value = '';
    document.getElementById('urlAttachRow').style.display = 'none';
    renderAttachmentsList();
}

function renderAttachmentsList() {
    const list = loadAttachments();
    const el = document.getElementById('attachmentsList');
    if (!el) return;
    if (list.length === 0) {
        el.innerHTML = `<div style="color:#94a3b8;font-size:0.8rem;font-style:italic;padding:0.25rem 0;">No attachments yet. Upload files or add URLs above.</div>`;
        return;
    }
    el.innerHTML = list.map(att => {
        const icon = getAttachIcon(att);
        const sizeStr = att.size ? formatBytes(att.size) : '';
        const dateStr = att.added ? new Date(att.added).toLocaleDateString() : '';
        return `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
            <span style="font-size:1.25rem;flex-shrink:0;">${icon}</span>
            <div style="flex:1;min-width:0;">
                <div style="font-size:0.85rem;font-weight:600;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(att.name)}</div>
                <div style="font-size:0.72rem;color:#94a3b8;">${sizeStr}${sizeStr&&dateStr?' · ':''}${dateStr}</div>
            </div>
            <div style="display:flex;gap:0.375rem;flex-shrink:0;">
                <button onclick="viewAttachment(${att.id})" style="border:none;background:#eff6ff;color:#3B82F6;padding:0.3rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">👁 View</button>
                <button onclick="removeAttachment(${att.id})" style="border:none;background:#fef2f2;color:#ef4444;padding:0.3rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.75rem;">🗑</button>
            </div>
        </div>`;
    }).join('');
}

function getAttachIcon(att) {
    if (att.type === 'url') {
        const u = att.url || '';
        if (u.includes('docs.google.com/document')) return '📑';
        if (u.includes('docs.google.com/spreadsheet')) return '📊';
        if (u.includes('docs.google.com/presentation')) return '📊';
        if (u.includes('youtube.com') || u.includes('youtu.be')) return '▶️';
        if (u.includes('github.com')) return '🐱';
        return '🔗';
    }
    const t = att.type || '', n = (att.name || '').toLowerCase();
    if (t.startsWith('image/')) return '🖼️';
    if (t === 'application/pdf' || n.endsWith('.pdf')) return '📕';
    if (n.match(/\.(docx?|rtf|odt)$/)) return '📄';
    if (n.match(/\.(xlsx?|csv|ods)$/)) return '📊';
    if (n.match(/\.(pptx?|odp)$/)) return '🗂️';
    if (n.match(/\.(mp4|webm|mov|avi)$/)) return '🎬';
    if (n.match(/\.(mp3|wav|ogg|m4a)$/)) return '🎵';
    if (n.match(/\.(py|js|ts|sql|sh|java|cpp|go|rb|jsx|tsx)$/)) return '💻';
    if (n.match(/\.(md|txt|rst|org)$/)) return '📝';
    if (n.match(/\.(html?|xml)$/)) return '🌐';
    if (n.match(/\.(zip|tar|gz|7z|rar)$/)) return '🗜️';
    return '📎';
}

function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
    return (b/1048576).toFixed(1) + ' MB';
}

function removeAttachment(id) {
    if (!confirm('Remove this attachment?')) return;
    saveAttachments(loadAttachments().filter(a => a.id !== id));
    renderAttachmentsList();
}

function viewAttachment(id) {
    const att = loadAttachments().find(a => a.id === id);
    if (!att) return;
    const viewer = document.getElementById('fileViewer');
    const content = document.getElementById('fileViewerContent');
    document.getElementById('fileViewerTitle').textContent = att.name;
    const dlBtn = document.getElementById('fileViewerDownload');
    viewer.style.display = 'block';
    _currentFileData = att;
    viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (att.type === 'url') {
        dlBtn.style.display = 'none';
        const url = att.url || '';
        let embedSrc = url;
        let canEmbed = true;
        if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
            const vid = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
            embedSrc = vid ? `https://www.youtube.com/embed/${vid}` : url;
        } else if (url.includes('docs.google.com')) {
            embedSrc = url.replace(/\/edit.*$/, '/preview').replace(/\/pub.*$/, '/preview');
            if (!embedSrc.includes('/preview')) embedSrc += (url.includes('?') ? '&' : '?') + 'embedded=true';
        } else { canEmbed = false; }
        content.innerHTML = `<div style="display:flex;flex-direction:column;">
            <div style="padding:0.75rem 1rem;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;gap:0.75rem;align-items:center;">
                <span style="font-size:0.8rem;color:#64748b;flex:1;word-break:break-all;">${escapeHtml(url)}</span>
                <a href="${escapeHtml(url)}" target="_blank" class="btn-secondary" style="font-size:0.75rem;text-decoration:none;white-space:nowrap;">↗ Open</a>
            </div>
            ${canEmbed
                ? `<iframe src="${escapeHtml(embedSrc)}" style="width:100%;height:60vh;border:none;" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe>`
                : `<div style="padding:3rem;text-align:center;"><div style="font-size:3rem;margin-bottom:1rem;">🔗</div><a href="${escapeHtml(url)}" target="_blank" class="btn-primary" style="text-decoration:none;">Open Link ↗</a></div>`
            }
        </div>`;
        return;
    }

    dlBtn.style.display = 'flex';
    const t = att.type || '', n = (att.name || '').toLowerCase(), ext = n.split('.').pop() || '';

    if (t.startsWith('image/')) {
        content.innerHTML = `<div style="padding:1rem;text-align:center;background:#0f172a;min-height:300px;display:flex;align-items:center;justify-content:center;"><img src="${att.dataUrl}" style="max-width:100%;max-height:65vh;border-radius:6px;" alt="${escapeHtml(att.name)}"></div>`;
    } else if (t === 'application/pdf' || n.endsWith('.pdf')) {
        content.innerHTML = `<iframe src="${att.dataUrl}#toolbar=1" style="width:100%;height:65vh;border:none;"></iframe>`;
    } else if (n.match(/\.(mp4|webm|mov|ogv)$/)) {
        content.innerHTML = `<div style="background:#000;padding:0.5rem;"><video controls style="width:100%;max-height:65vh;" src="${att.dataUrl}"></video></div>`;
    } else if (n.match(/\.(mp3|wav|ogg|m4a|flac)$/)) {
        content.innerHTML = `<div style="padding:3rem;text-align:center;"><div style="font-size:4rem;margin-bottom:1.5rem;">🎵</div><div style="font-weight:600;margin-bottom:1rem;color:#1e293b;">${escapeHtml(att.name)}</div><audio controls style="width:100%;" src="${att.dataUrl}"></audio></div>`;
    } else if (t.startsWith('text/') || n.match(/\.(md|markdown|txt|rst|org|html?|xml|csv|tsv|json|yaml|yml|toml|js|ts|py|sql|sh|bash|java|cpp|c|go|rb|php|jsx|tsx|r|m|tex)$/)) {
        const b64 = att.dataUrl.split(',')[1] || '';
        let text = '';
        try { text = decodeURIComponent(escape(atob(b64))); } catch(e) { try { text = atob(b64); } catch(e2) { text = '(Could not decode file)'; } }
        if (ext === 'md' || ext === 'markdown') {
            content.innerHTML = `<div style="padding:1.5rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.8;color:#0f172a;max-height:65vh;overflow-y:auto;">${marked.parse(text)}</div>`;
        } else if (ext === 'csv' || ext === 'tsv') {
            const sep = ext === 'tsv' ? '\t' : ',';
            const rows = text.trim().split('\n').map(r => r.split(sep).map(c => c.replace(/^"|"$/g, '').trim()));
            const header = rows[0] || [];
            content.innerHTML = `<div style="overflow:auto;max-height:65vh;"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                <thead><tr>${header.map(h=>`<th style="background:#1e293b;color:white;padding:0.6rem 0.875rem;text-align:left;border:1px solid #334155;white-space:nowrap;">${escapeHtml(h)}</th>`).join('')}</tr></thead>
                <tbody>${rows.slice(1).map((row,i)=>`<tr style="background:${i%2===0?'white':'#f8fafc'};">${row.map(c=>`<td style="padding:0.5rem 0.875rem;border:1px solid #e2e8f0;color:#475569;">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table></div>`;
        } else if (ext === 'html' || ext === 'htm') {
            content.innerHTML = `<iframe srcdoc="${escapeHtml(text)}" style="width:100%;height:65vh;border:none;" sandbox="allow-scripts"></iframe>`;
        } else {
            let highlighted = escapeHtml(text);
            if (ext === 'json') {
                try {
                    const fmt = JSON.stringify(JSON.parse(text), null, 2);
                    highlighted = escapeHtml(fmt)
                        .replace(/"([^"]+)"(\s*:)/g,'<span style="color:#7dd3fc;">"$1"</span>$2')
                        .replace(/:\s*"([^"]*)"/g,': <span style="color:#86efac;">"$1"</span>')
                        .replace(/:\s*(\d+\.?\d*)/g,': <span style="color:#fca5a5;">$1</span>')
                        .replace(/:\s*(true|false|null)/g,': <span style="color:#c4b5fd;">$1</span>');
                } catch(e) {}
            }
            content.innerHTML = `<div style="position:relative;">
                <button onclick="navigator.clipboard.writeText(document.querySelector('#fileViewerContent code').innerText).then(()=>alert('✅ Copied!'))" style="position:absolute;top:0.75rem;right:0.75rem;border:none;background:#334155;color:#e2e8f0;padding:0.3rem 0.75rem;border-radius:6px;cursor:pointer;font-size:0.75rem;z-index:10;">📋 Copy</button>
                <pre style="margin:0;padding:1.5rem;max-height:65vh;overflow:auto;font-size:0.83rem;line-height:1.7;font-family:'Courier New',monospace;background:#0f172a;color:#e2e8f0;"><code>${highlighted}</code></pre>
            </div>`;
        }
    } else {
        content.innerHTML = `<div style="padding:3rem;text-align:center;"><div style="font-size:3rem;margin-bottom:1rem;">${getAttachIcon(att)}</div>
            <div style="font-weight:600;margin-bottom:0.5rem;color:#1e293b;">${escapeHtml(att.name)}</div>
            <div style="color:#64748b;font-size:0.875rem;margin-bottom:1.5rem;">${formatBytes(att.size||0)}</div>
            <button onclick="downloadCurrentFile()" class="btn-primary"><span>⬇️</span> Download File</button></div>`;
    }
}

function downloadCurrentFile() {
    if (!_currentFileData || !_currentFileData.dataUrl) return;
    const a = document.createElement('a');
    a.href = _currentFileData.dataUrl;
    a.download = _currentFileData.name;
    a.click();
}
function closeFileViewer() {
    document.getElementById('fileViewer').style.display = 'none';
    _currentFileData = null;
}

function injectToolsIntoMenu() {
    const menu = document.getElementById('settingsMenu');
    if (!menu || menu.dataset.toolsAdded) return;
    menu.dataset.toolsAdded = '1';
    const inner = menu.querySelector('div');
    if (!inner) return;
    const bStyle = 'width:100%;text-align:left;padding:0.75rem 1rem;border:none;background:none;cursor:pointer;display:flex;align-items:center;gap:0.75rem;transition:all 0.2s;';
    const hov = `onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='none'"`;
    inner.insertAdjacentHTML('beforeend', `
        <div style="height:1px;background:#e2e8f0;margin:0.25rem 0;"></div>
        <button onclick="openTimer();toggleSettingsMenu()" style="${bStyle}" ${hov}><span>⏱️</span><span>Study Timer</span></button>
        <button onclick="openChecklist();toggleSettingsMenu()" style="${bStyle}" ${hov}><span>✅</span><span>Interview Checklist</span></button>
        <button onclick="openFlashcards();toggleSettingsMenu()" style="${bStyle}" ${hov}><span>🃏</span><span>Flashcards</span></button>
    `);
}
