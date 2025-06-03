<template>
  <div class="word-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>📚 单词卡片</h1>
        <p>创建和学习单词卡片，提升您的语言学习效率</p>

        <!-- 操作按钮 -->
        <div class="header-actions">
          <button @click="showAddCategoryModal = true" class="btn btn-primary">
            <span class="icon">📁</span>
            添加分类
          </button>
          <button @click="showAddWordModal = true" class="btn btn-secondary">
            <span class="icon">📝</span>
            添加单词
          </button>
          <button @click="startStudyMode" class="btn btn-accent" :disabled="totalWords === 0">
            <span class="icon">🎯</span>
            开始学习
          </button>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalWords }}</div>
            <div class="stat-label">总单词数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-number">{{ masteredWords }}</div>
            <div class="stat-label">已掌握</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-content">
            <div class="stat-number">{{ learningWords }}</div>
            <div class="stat-label">学习中</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">{{ studyProgress }}%</div>
            <div class="stat-label">学习进度</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索单词或释义..."
            class="search-input"
          />
        </div>
        <div class="filter-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="['filter-tab', { active: selectedCategory === category.id }]"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="view-controls">
          <button
            @click="viewMode = 'grid'"
            :class="['view-btn', { active: viewMode === 'grid' }]"
            title="网格视图"
          >
            <span class="icon">⊞</span>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="['view-btn', { active: viewMode === 'list' }]"
            title="列表视图"
          >
            <span class="icon">☰</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 学习模式 -->
    <div v-if="isStudyMode" class="study-mode-overlay">
      <div class="study-card-container">
        <div class="study-header">
          <div class="study-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${(currentStudyIndex / studyWords.length) * 100}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ currentStudyIndex }} / {{ studyWords.length }}</span>
          </div>
          <button @click="exitStudyMode" class="close-study-btn">
            <span class="icon">✕</span>
          </button>
        </div>

        <div v-if="currentStudyWord" class="study-card" @click="flipCard">
          <div :class="['card-inner', { flipped: isCardFlipped }]">
            <div class="card-front">
              <div class="word-text">{{ currentStudyWord.word }}</div>
              <div class="card-hint">点击翻转查看释义</div>
            </div>
            <div class="card-back">
              <div class="meaning-text">{{ currentStudyWord.meaning }}</div>
              <div v-if="currentStudyWord.pronunciation" class="pronunciation">
                [{{ currentStudyWord.pronunciation }}]
              </div>
              <div v-if="currentStudyWord.example" class="example">
                <strong>例句：</strong>{{ currentStudyWord.example }}
              </div>
            </div>
          </div>
        </div>

        <div class="study-actions">
          <button @click="markAsHard" class="study-btn btn-hard">
            <span class="icon">😰</span>
            困难
          </button>
          <button @click="markAsGood" class="study-btn btn-good">
            <span class="icon">😊</span>
            一般
          </button>
          <button @click="markAsEasy" class="study-btn btn-easy">
            <span class="icon">😎</span>
            简单
          </button>
        </div>
      </div>
    </div>

    <!-- 单词列表展示区域 -->
    <div class="words-container">
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>暂无单词卡片</h3>
        <p>开始添加您的第一个单词吧！</p>
        <button @click="showAddWordModal = true" class="btn btn-primary">
          添加单词
        </button>
      </div>

      <div v-else class="categories-grid">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-section"
        >
          <div class="category-header">
            <h2>{{ category.name }}</h2>
            <div class="category-meta">
              <span class="word-count">{{ category.words.length }} 个单词</span>
              <div class="category-actions">
                <button @click="editCategory(category)" class="action-btn">
                  <span class="icon">✏️</span>
                </button>
                <button @click="deleteCategory(category.id)" class="action-btn delete">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
          </div>

          <div :class="['words-grid', `view-${viewMode}`]">
            <div
              v-for="word in category.words"
              :key="word.id"
              class="word-card"
              @click="previewWord(word)"
            >
              <div class="word-header">
                <div class="word-main">
                  <h3>{{ word.word }}</h3>
                  <div v-if="word.pronunciation" class="pronunciation">
                    [{{ word.pronunciation }}]
                  </div>
                </div>
                <div class="word-actions">
                  <button @click.stop="editWord(word)" class="action-btn">
                    <span class="icon">✏️</span>
                  </button>
                  <button @click.stop="deleteWord(word.id)" class="action-btn delete">
                    <span class="icon">🗑️</span>
                  </button>
                </div>
              </div>

              <div class="word-content">
                <p class="meaning">{{ word.meaning }}</p>
                <div v-if="word.example" class="example">
                  <strong>例句：</strong>{{ word.example }}
                </div>
              </div>

              <div class="word-meta">
                <div class="difficulty-badge" :class="word.difficulty">
                  {{ getDifficultyText(word.difficulty) }}
                </div>
                <div class="study-count">
                  学习 {{ word.studyCount || 0 }} 次
                </div>
                <div class="last-study">
                  {{ formatDate(word.lastStudied) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加分类模态框 -->
    <div v-if="showAddCategoryModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? '编辑分类' : '添加新分类' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="categoryName">分类名称</label>
            <input
              type="text"
              id="categoryName"
              v-model="newCategory.name"
              placeholder="请输入分类名称（如：托福词汇、雅思词汇）"
              maxlength="20"
            />
          </div>
          <div class="form-group">
            <label for="categoryDescription">分类描述</label>
            <textarea
              id="categoryDescription"
              v-model="newCategory.description"
              placeholder="请输入分类描述（可选）"
              rows="3"
              maxlength="100"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">取消</button>
          <button
            @click="editingCategory ? updateCategory() : addCategory()"
            class="btn btn-primary"
            :disabled="!newCategory.name.trim()"
          >
            {{ editingCategory ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 添加单词模态框 -->
    <div v-if="showAddWordModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingWord ? '编辑单词' : '添加新单词' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="wordText">单词</label>
            <input
              type="text"
              id="wordText"
              v-model="newWord.word"
              placeholder="请输入单词"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label for="wordPronunciation">音标（可选）</label>
            <input
              type="text"
              id="wordPronunciation"
              v-model="newWord.pronunciation"
              placeholder="请输入音标，如：/ˈhæpɪ/"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label for="wordMeaning">释义</label>
            <textarea
              id="wordMeaning"
              v-model="newWord.meaning"
              placeholder="请输入单词释义"
              rows="3"
              maxlength="200"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="wordExample">例句（可选）</label>
            <textarea
              id="wordExample"
              v-model="newWord.example"
              placeholder="请输入例句"
              rows="2"
              maxlength="300"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="wordDifficulty">难度等级</label>
            <select id="wordDifficulty" v-model="newWord.difficulty">
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
          <div class="form-group">
            <label for="wordCategory">所属分类</label>
            <select id="wordCategory" v-model="newWord.categoryId">
              <option value="">请选择分类</option>
              <option v-for="category in categories.filter(c => c.id !== 'all')" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">取消</button>
          <button
            @click="editingWord ? updateWord() : addWord()"
            class="btn btn-primary"
            :disabled="!isWordFormValid"
          >
            {{ editingWord ? '更新' : '添加' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 单词预览模态框 -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closeModals">
      <div class="modal preview-modal" @click.stop>
        <div class="modal-header">
          <h3>单词详情</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body" v-if="previewingWord">
          <div class="preview-word">
            <h2>{{ previewingWord.word }}</h2>
            <div v-if="previewingWord.pronunciation" class="preview-pronunciation">
              [{{ previewingWord.pronunciation }}]
            </div>
          </div>
          <div class="preview-meaning">
            <h4>释义：</h4>
            <p>{{ previewingWord.meaning }}</p>
          </div>
          <div v-if="previewingWord.example" class="preview-example">
            <h4>例句：</h4>
            <p>{{ previewingWord.example }}</p>
          </div>
          <div class="preview-meta">
            <div class="meta-item">
              <span class="meta-label">难度：</span>
              <span class="difficulty-badge" :class="previewingWord.difficulty">
                {{ getDifficultyText(previewingWord.difficulty) }}
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">学习次数：</span>
              <span>{{ previewingWord.studyCount || 0 }} 次</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">最后学习：</span>
              <span>{{ formatDate(previewingWord.lastStudied) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">关闭</button>
          <button @click="editWord(previewingWord)" class="btn btn-primary">编辑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

/**
 * 单词卡片学习系统组件
 * 提供完整的单词管理、分类管理和学习功能
 * 包含CRUD操作、搜索筛选、学习模式和进度跟踪
 */

// 响应式数据
const searchQuery = ref('') // 搜索关键词
const selectedCategory = ref('all') // 选中的分类ID
const viewMode = ref('grid') // 视图模式：grid 或 list
const showAddCategoryModal = ref(false) // 显示添加分类模态框
const showAddWordModal = ref(false) // 显示添加单词模态框
const showPreviewModal = ref(false) // 显示单词预览模态框

// 学习模式相关状态
const isStudyMode = ref(false) // 是否处于学习模式
const studyWords = ref([]) // 当前学习的单词列表
const currentStudyIndex = ref(0) // 当前学习的单词索引
const isCardFlipped = ref(false) // 卡片是否翻转

// 编辑状态
const editingCategory = ref(null) // 正在编辑的分类
const editingWord = ref(null) // 正在编辑的单词
const previewingWord = ref(null) // 正在预览的单词

// 分类数据
const categories = ref([
  { id: 'all', name: '全部' },
  {
    id: 'toefl',
    name: '托福词汇',
    description: '托福考试核心词汇',
    words: [
      {
        id: 1,
        word: 'abundant',
        pronunciation: '/əˈbʌndənt/',
        meaning: 'adj. 丰富的，充裕的',
        example: 'The region has abundant natural resources.',
        difficulty: 'medium',
        studyCount: 3,
        lastStudied: new Date('2024-01-15'),
        masteryLevel: 'learning'
      },
      {
        id: 2,
        word: 'accommodate',
        pronunciation: '/əˈkɒmədeɪt/',
        meaning: 'v. 容纳，适应，提供住宿',
        example: 'The hotel can accommodate 200 guests.',
        difficulty: 'hard',
        studyCount: 1,
        lastStudied: new Date('2024-01-10'),
        masteryLevel: 'new'
      },
      {
        id: 3,
        word: 'accurate',
        pronunciation: '/ˈækjərət/',
        meaning: 'adj. 准确的，精确的',
        example: 'Please provide accurate information.',
        difficulty: 'easy',
        studyCount: 5,
        lastStudied: new Date('2024-01-20'),
        masteryLevel: 'mastered'
      }
    ]
  },
  {
    id: 'ielts',
    name: '雅思词汇',
    description: '雅思考试高频词汇',
    words: [
      {
        id: 4,
        word: 'analyze',
        pronunciation: '/ˈænəlaɪz/',
        meaning: 'v. 分析，解析',
        example: 'Scientists analyze the data carefully.',
        difficulty: 'medium',
        studyCount: 2,
        lastStudied: new Date('2024-01-18'),
        masteryLevel: 'learning'
      },
      {
        id: 5,
        word: 'approach',
        pronunciation: '/əˈproʊtʃ/',
        meaning: 'n./v. 方法，途径；接近',
        example: 'We need a new approach to this problem.',
        difficulty: 'medium',
        studyCount: 4,
        lastStudied: new Date('2024-01-19'),
        masteryLevel: 'learning'
      }
    ]
  },
  {
    id: 'daily',
    name: '日常用语',
    description: '日常生活常用词汇',
    words: [
      {
        id: 6,
        word: 'appreciate',
        pronunciation: '/əˈpriːʃieɪt/',
        meaning: 'v. 欣赏，感激，理解',
        example: 'I appreciate your help.',
        difficulty: 'easy',
        studyCount: 6,
        lastStudied: new Date('2024-01-21'),
        masteryLevel: 'mastered'
      }
    ]
  }
])

// 表单数据
const newCategory = ref({
  name: '',
  description: ''
})

const newWord = ref({
  word: '',
  pronunciation: '',
  meaning: '',
  example: '',
  difficulty: 'medium',
  categoryId: ''
})

// 计算属性：总单词数
const totalWords = computed(() => {
  return categories.value
    .filter(cat => cat.id !== 'all')
    .reduce((total, cat) => total + cat.words.length, 0)
})

// 计算属性：已掌握单词数
const masteredWords = computed(() => {
  return categories.value
    .filter(cat => cat.id !== 'all')
    .reduce((total, cat) => {
      return total + cat.words.filter(word => word.masteryLevel === 'mastered').length
    }, 0)
})

// 计算属性：学习中单词数
const learningWords = computed(() => {
  return categories.value
    .filter(cat => cat.id !== 'all')
    .reduce((total, cat) => {
      return total + cat.words.filter(word => word.masteryLevel === 'learning').length
    }, 0)
})

// 计算属性：学习进度百分比
const studyProgress = computed(() => {
  if (totalWords.value === 0) return 0
  return Math.round((masteredWords.value / totalWords.value) * 100)
})

// 计算属性：当前学习的单词
const currentStudyWord = computed(() => {
  return studyWords.value[currentStudyIndex.value] || null
})

// 计算属性：过滤后的分类
const filteredCategories = computed(() => {
  let filtered = categories.value.filter(cat => cat.id !== 'all')

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(cat => cat.id === selectedCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.map(category => ({
      ...category,
      words: category.words.filter(word =>
        word.word.toLowerCase().includes(query) ||
        word.meaning.toLowerCase().includes(query) ||
        (word.example && word.example.toLowerCase().includes(query))
      )
    })).filter(category => category.words.length > 0)
  }

  return filtered
})

// 计算属性：单词表单是否有效
const isWordFormValid = computed(() => {
  return newWord.value.word.trim() &&
         newWord.value.meaning.trim() &&
         newWord.value.categoryId
})

/**
 * 获取难度等级的中文文本
 * @param {string} difficulty - 难度等级
 * @returns {string} 中文文本
 */
function getDifficultyText(difficulty) {
  const difficultyMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return difficultyMap[difficulty] || '未知'
}

/**
 * 格式化日期显示
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  if (!date) return '从未学习'

  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

/**
 * 开始学习模式
 * 收集所有单词并开始学习流程
 */
function startStudyMode() {
  // 收集所有单词
  const allWords = []
  categories.value
    .filter(cat => cat.id !== 'all')
    .forEach(category => {
      allWords.push(...category.words)
    })

  if (allWords.length === 0) {
    alert('暂无单词可学习，请先添加一些单词！')
    return
  }

  // 按学习优先级排序（新单词和困难单词优先）
  studyWords.value = allWords.sort((a, b) => {
    // 优先级：new > learning > mastered
    const priorityMap = { new: 3, learning: 2, mastered: 1 }
    const aPriority = priorityMap[a.masteryLevel] || 1
    const bPriority = priorityMap[b.masteryLevel] || 1

    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }

    // 相同掌握程度时，按学习次数升序排列
    return (a.studyCount || 0) - (b.studyCount || 0)
  })

  currentStudyIndex.value = 0
  isCardFlipped.value = false
  isStudyMode.value = true

  console.log('开始学习模式，共', studyWords.value.length, '个单词')
}

/**
 * 退出学习模式
 */
function exitStudyMode() {
  isStudyMode.value = false
  studyWords.value = []
  currentStudyIndex.value = 0
  isCardFlipped.value = false
}

/**
 * 翻转卡片
 */
function flipCard() {
  isCardFlipped.value = !isCardFlipped.value
}

/**
 * 标记单词为困难
 */
function markAsHard() {
  if (!currentStudyWord.value) return

  updateWordMastery(currentStudyWord.value, 'learning', 'hard')
  nextWord()
}

/**
 * 标记单词为一般
 */
function markAsGood() {
  if (!currentStudyWord.value) return

  updateWordMastery(currentStudyWord.value, 'learning', 'medium')
  nextWord()
}

/**
 * 标记单词为简单
 */
function markAsEasy() {
  if (!currentStudyWord.value) return

  const newMasteryLevel = currentStudyWord.value.studyCount >= 3 ? 'mastered' : 'learning'
  updateWordMastery(currentStudyWord.value, newMasteryLevel, 'easy')
  nextWord()
}

/**
 * 更新单词掌握程度
 * @param {Object} word - 单词对象
 * @param {string} masteryLevel - 掌握程度
 * @param {string} difficulty - 难度等级
 */
function updateWordMastery(word, masteryLevel, difficulty) {
  word.masteryLevel = masteryLevel
  word.difficulty = difficulty
  word.studyCount = (word.studyCount || 0) + 1
  word.lastStudied = new Date()

  console.log(`更新单词 ${word.word} 掌握程度为 ${masteryLevel}`)
}

/**
 * 下一个单词
 */
function nextWord() {
  isCardFlipped.value = false

  if (currentStudyIndex.value < studyWords.value.length - 1) {
    currentStudyIndex.value++
  } else {
    // 学习完成
    alert(`恭喜！您已完成本轮学习，共学习了 ${studyWords.value.length} 个单词！`)
    exitStudyMode()
  }
}

/**
 * 添加新分类
 */
function addCategory() {
  if (!newCategory.value.name.trim()) return

  const newCat = {
    id: Date.now().toString(),
    name: newCategory.value.name.trim(),
    description: newCategory.value.description.trim(),
    words: []
  }

  categories.value.push(newCat)

  // 重置表单
  resetCategoryForm()
  showAddCategoryModal.value = false

  console.log('添加分类成功:', newCat.name)
}

/**
 * 编辑分类
 * @param {Object} category - 要编辑的分类
 */
function editCategory(category) {
  editingCategory.value = category
  newCategory.value = {
    name: category.name,
    description: category.description || ''
  }
  showAddCategoryModal.value = true
}

/**
 * 更新分类
 */
function updateCategory() {
  if (!editingCategory.value || !newCategory.value.name.trim()) return

  editingCategory.value.name = newCategory.value.name.trim()
  editingCategory.value.description = newCategory.value.description.trim()

  // 重置表单
  resetCategoryForm()
  showAddCategoryModal.value = false
  editingCategory.value = null

  console.log('更新分类成功:', newCategory.value.name)
}

/**
 * 删除分类
 * @param {string} categoryId - 分类ID
 */
function deleteCategory(categoryId) {
  const category = categories.value.find(cat => cat.id === categoryId)
  if (!category) return

  const wordCount = category.words.length
  const confirmMessage = wordCount > 0
    ? `确定要删除分类"${category.name}"吗？这将同时删除该分类下的 ${wordCount} 个单词。`
    : `确定要删除分类"${category.name}"吗？`

  if (confirm(confirmMessage)) {
    const index = categories.value.findIndex(cat => cat.id === categoryId)
    if (index > -1) {
      const deletedCategory = categories.value.splice(index, 1)[0]
      console.log('删除分类成功:', deletedCategory.name)

      // 如果当前选中的分类被删除，切换到全部
      if (selectedCategory.value === categoryId) {
        selectedCategory.value = 'all'
      }
    }
  }
}

/**
 * 添加新单词
 */
function addWord() {
  if (!isWordFormValid.value) return

  const categoryIndex = categories.value.findIndex(cat => cat.id === newWord.value.categoryId)
  if (categoryIndex === -1) return

  const newWordData = {
    id: Date.now(),
    word: newWord.value.word.trim(),
    pronunciation: newWord.value.pronunciation.trim(),
    meaning: newWord.value.meaning.trim(),
    example: newWord.value.example.trim(),
    difficulty: newWord.value.difficulty,
    studyCount: 0,
    lastStudied: null,
    masteryLevel: 'new'
  }

  categories.value[categoryIndex].words.push(newWordData)

  // 重置表单
  resetWordForm()
  showAddWordModal.value = false

  console.log('添加单词成功:', newWordData.word)
}

/**
 * 编辑单词
 * @param {Object} word - 要编辑的单词
 */
function editWord(word) {
  editingWord.value = word
  newWord.value = {
    word: word.word,
    pronunciation: word.pronunciation || '',
    meaning: word.meaning,
    example: word.example || '',
    difficulty: word.difficulty,
    categoryId: findWordCategory(word.id)
  }
  showAddWordModal.value = true
  showPreviewModal.value = false
}

/**
 * 更新单词
 */
function updateWord() {
  if (!isWordFormValid.value || !editingWord.value) return

  // 找到单词所在的分类
  const oldCategoryId = findWordCategory(editingWord.value.id)
  const newCategoryId = newWord.value.categoryId

  // 更新单词数据
  editingWord.value.word = newWord.value.word.trim()
  editingWord.value.pronunciation = newWord.value.pronunciation.trim()
  editingWord.value.meaning = newWord.value.meaning.trim()
  editingWord.value.example = newWord.value.example.trim()
  editingWord.value.difficulty = newWord.value.difficulty

  // 如果分类发生变化，需要移动单词
  if (oldCategoryId !== newCategoryId) {
    // 从旧分类中删除
    const oldCategoryIndex = categories.value.findIndex(cat => cat.id === oldCategoryId)
    if (oldCategoryIndex > -1) {
      const wordIndex = categories.value[oldCategoryIndex].words.findIndex(w => w.id === editingWord.value.id)
      if (wordIndex > -1) {
        categories.value[oldCategoryIndex].words.splice(wordIndex, 1)
      }
    }

    // 添加到新分类
    const newCategoryIndex = categories.value.findIndex(cat => cat.id === newCategoryId)
    if (newCategoryIndex > -1) {
      categories.value[newCategoryIndex].words.push(editingWord.value)
    }
  }

  // 重置表单
  resetWordForm()
  showAddWordModal.value = false
  editingWord.value = null

  console.log('更新单词成功:', newWord.value.word)
}

/**
 * 删除单词
 * @param {number} wordId - 单词ID
 */
function deleteWord(wordId) {
  if (confirm('确定要删除这个单词吗？')) {
    for (const category of categories.value) {
      const wordIndex = category.words.findIndex(word => word.id === wordId)
      if (wordIndex > -1) {
        const deletedWord = category.words.splice(wordIndex, 1)[0]
        console.log('删除单词成功:', deletedWord.word)
        break
      }
    }
  }
}

/**
 * 预览单词
 * @param {Object} word - 要预览的单词
 */
function previewWord(word) {
  previewingWord.value = word
  showPreviewModal.value = true
}

/**
 * 查找单词所属的分类ID
 * @param {number} wordId - 单词ID
 * @returns {string|null} 分类ID
 */
function findWordCategory(wordId) {
  for (const category of categories.value) {
    if (category.words.some(word => word.id === wordId)) {
      return category.id
    }
  }
  return null
}

/**
 * 重置分类表单
 */
function resetCategoryForm() {
  newCategory.value = {
    name: '',
    description: ''
  }
}

/**
 * 重置单词表单
 */
function resetWordForm() {
  newWord.value = {
    word: '',
    pronunciation: '',
    meaning: '',
    example: '',
    difficulty: 'medium',
    categoryId: ''
  }
}

/**
 * 关闭所有模态框
 */
function closeModals() {
  showAddCategoryModal.value = false
  showAddWordModal.value = false
  showPreviewModal.value = false
  editingCategory.value = null
  editingWord.value = null
  previewingWord.value = null
  resetCategoryForm()
  resetWordForm()
}

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  console.log('单词卡片页面已加载')
})
</script>

<style scoped>
/* 单词卡片页面容器 */
.word-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: var(--color-bg-secondary);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-base);
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-base);
  color: white;
}

.page-header p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  color: white;
}

.header-actions {
  display: flex;
  gap: var(--spacing-base);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: var(--transition-base);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.btn-primary {
  background: white;
  color: var(--color-success);
}

.btn-primary:hover {
  background: var(--color-gray-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-success);
  transform: translateY(-2px);
}

.btn-accent {
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-warning-dark) 100%);
  color: white;
}

.btn-accent:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-warning-dark) 0%, var(--color-warning) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.icon {
  font-size: var(--font-size-lg);
}

/* 统计信息区域 */
.stats-section {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl) var(--spacing-base);
  border-bottom: 1px solid var(--color-border-light);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  border: 1px solid var(--color-border-light);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-base);
  display: block;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-success);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 搜索区域 */
.search-section {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl) var(--spacing-base);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: var(--spacing-base);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base) var(--spacing-sm) 3rem;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-base);
  background: var(--color-bg-primary);
  transition: var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
}

/* 筛选标签和视图控制 */
.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-xl);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-tab:hover {
  border-color: var(--color-success);
  color: var(--color-success);
}

.filter-tab.active {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.view-controls {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.view-btn {
  padding: var(--spacing-sm);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-base);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  border-color: var(--color-success);
  color: var(--color-success);
}

.view-btn.active {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

/* 学习模式覆盖层 */
.study-mode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-base);
}

.study-card-container {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.study-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

.study-progress {
  flex: 1;
  margin-right: var(--spacing-lg);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.close-study-btn {
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.close-study-btn:hover {
  background: var(--color-error-dark);
  transform: scale(1.1);
}

/* 学习卡片 */
.study-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  cursor: pointer;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 300px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}

.card-front {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.card-back {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);
  color: white;
  transform: rotateY(180deg);
}

.word-text {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-hint {
  font-size: var(--font-size-base);
  opacity: 0.8;
  font-style: italic;
}

.meaning-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-base);
  text-align: center;
}

.pronunciation {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-base);
  opacity: 0.9;
  font-family: var(--font-family-mono);
}

.example {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  text-align: center;
  opacity: 0.9;
}

/* 学习操作按钮 */
.study-actions {
  display: flex;
  gap: var(--spacing-base);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
}

.study-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-base);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-base);
  font-weight: var(--font-weight-medium);
}

.btn-hard {
  background: var(--color-error);
  color: white;
}

.btn-hard:hover {
  background: var(--color-error-dark);
  transform: translateY(-2px);
}

.btn-good {
  background: var(--color-warning);
  color: white;
}

.btn-good:hover {
  background: var(--color-warning-dark);
  transform: translateY(-2px);
}

.btn-easy {
  background: var(--color-success);
  color: white;
}

.btn-easy:hover {
  background: var(--color-success-dark);
  transform: translateY(-2px);
}

/* 单词容器 */
.words-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-base);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* 分类网格 */
.categories-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.category-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-border-light);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-base);
  border-bottom: 2px solid var(--color-border-light);
}

.category-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.word-count {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.category-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-base);
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.action-btn:hover {
  background: var(--color-gray-200);
  transform: translateY(-1px);
}

.action-btn.delete:hover {
  background: var(--color-error);
  color: white;
}

/* 单词网格 */
.words-grid {
  display: grid;
  gap: var(--spacing-lg);
}

.words-grid.view-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.words-grid.view-list {
  grid-template-columns: 1fr;
}

.word-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition-base);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.word-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-success);
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.word-main h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.word-main .pronunciation {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
}

.word-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.word-content {
  flex: 1;
}

.word-content .meaning {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-sm) 0;
}

.word-content .example {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-relaxed);
  font-style: italic;
}

.word-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--spacing-sm);
}

.difficulty-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.difficulty-badge.easy {
  background: var(--color-success);
  color: white;
}

.difficulty-badge.medium {
  background: var(--color-warning);
  color: white;
}

.difficulty-badge.hard {
  background: var(--color-error);
  color: white;
}

.study-count,
.last-study {
  font-size: var(--font-size-xs);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-base);
}

.modal {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.preview-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
}

.close-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
  background: var(--color-bg-primary);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  gap: var(--spacing-base);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

/* 预览模态框特殊样式 */
.preview-word {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.preview-word h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.preview-pronunciation {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
}

.preview-meaning,
.preview-example {
  margin-bottom: var(--spacing-lg);
}

.preview-meaning h4,
.preview-example h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.preview-meaning p,
.preview-example p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-base);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-xl) var(--spacing-base);
  }

  .page-header h1 {
    font-size: var(--font-size-3xl);
  }

  .header-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
    justify-content: center;
  }

  .search-container {
    gap: var(--spacing-base);
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-tab {
    width: 200px;
    text-align: center;
  }

  .words-grid.view-grid {
    grid-template-columns: 1fr;
  }

  .category-header {
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: flex-start;
  }

  .word-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .word-actions {
    align-self: flex-end;
  }

  .word-meta {
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: flex-start;
  }

  .modal {
    margin: var(--spacing-base);
  }

  .modal-footer {
    flex-direction: column;
  }

  .study-card-container {
    margin: var(--spacing-base);
  }

  .study-card {
    padding: var(--spacing-lg);
  }

  .card-inner {
    height: 250px;
  }

  .word-text {
    font-size: var(--font-size-3xl);
  }
}

@media (max-width: 480px) {
  .words-container {
    padding: var(--spacing-base);
  }

  .category-section {
    padding: var(--spacing-base);
  }

  .word-card {
    padding: var(--spacing-base);
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
