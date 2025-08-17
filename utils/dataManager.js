// 数据管理工具
class DataManager {
  // 语法知识点数据
  static grammarData = [
    {
      id: 1,
      title: '一般现在时',
      category: 'tense',
      difficulty: 2,
      duration: 15,
      icon: '⏰',
      description: '表示经常性、习惯性的动作或状态',
      concept: '一般现在时表示经常性、习惯性的动作或状态，以及客观事实和真理。',
      rules: [
        '第三人称单数主语后，动词要加s或es',
        '表示经常性、习惯性的动作',
        '表示客观事实和真理',
        '表示按计划、安排将要发生的动作'
      ],
      examples: [
        {
          type: '肯定句',
          sentence: 'I go to school every day.',
          translation: '我每天去上学。',
          explanation: '表示经常性的动作'
        },
        {
          type: '否定句',
          sentence: 'He doesn\'t like coffee.',
          translation: '他不喜欢咖啡。',
          explanation: '第三人称单数否定句用doesn\'t'
        },
        {
          type: '疑问句',
          sentence: 'Do you speak English?',
          translation: '你会说英语吗？',
          explanation: '一般疑问句用Do/Does开头'
        }
      ],
      notes: [
        '注意第三人称单数动词变化规则',
        '时间状语常用every day, usually, often等',
        '否定句和疑问句的助动词使用'
      ]
    },
    {
      id: 2,
      title: '一般过去时',
      category: 'tense',
      difficulty: 2,
      duration: 15,
      icon: '📅',
      description: '表示过去某个时间发生的动作或状态',
      concept: '一般过去时表示过去某个时间发生的动作或状态，以及过去经常性的动作。',
      rules: [
        '动词用过去式形式',
        '表示过去某个时间发生的动作',
        '表示过去经常性的动作',
        '在时间状语从句中表示过去将来'
      ],
      examples: [
        {
          type: '肯定句',
          sentence: 'I went to the cinema yesterday.',
          translation: '我昨天去看电影了。',
          explanation: '表示过去发生的动作'
        },
        {
          type: '否定句',
          sentence: 'She didn\'t finish her homework.',
          translation: '她没有完成作业。',
          explanation: '否定句用didn\'t + 动词原形'
        },
        {
          type: '疑问句',
          sentence: 'Did you see the movie?',
          translation: '你看过这部电影吗？',
          explanation: '疑问句用Did开头'
        }
      ],
      notes: [
        '注意不规则动词的过去式变化',
        '时间状语常用yesterday, last week等',
        '否定句和疑问句的助动词使用'
      ]
    },
    {
      id: 3,
      title: '现在进行时',
      category: 'tense',
      difficulty: 3,
      duration: 20,
      icon: '🔄',
      description: '表示现在正在进行的动作',
      concept: '现在进行时表示现在正在进行的动作，以及按计划将要发生的动作。',
      rules: [
        'be动词 + 动词ing形式',
        '表示现在正在进行的动作',
        '表示按计划将要发生的动作',
        '表示暂时性的动作'
      ],
      examples: [
        {
          type: '肯定句',
          sentence: 'I am studying English now.',
          translation: '我现在正在学习英语。',
          explanation: '表示现在正在进行的动作'
        },
        {
          type: '否定句',
          sentence: 'He is not watching TV.',
          translation: '他没有在看电视。',
          explanation: '否定句在be动词后加not'
        },
        {
          type: '疑问句',
          sentence: 'Are you listening to music?',
          translation: '你在听音乐吗？',
          explanation: '疑问句将be动词提前'
        }
      ],
      notes: [
        '注意动词ing形式的变化规则',
        '时间状语常用now, at the moment等',
        '某些动词通常不用进行时'
      ]
    }
  ]

  // 练习题目数据
  static practiceData = [
    {
      id: 1,
      type: 'single',
      category: 'tense',
      difficulty: 2,
      question: 'He _____ to school every day.',
      options: ['go', 'goes', 'going', 'went'],
      correctAnswer: 1,
      explanation: '第三人称单数用goes',
      lessonId: 1
    },
    {
      id: 2,
      type: 'single',
      category: 'tense',
      difficulty: 2,
      question: 'I _____ my homework when the phone rang.',
      options: ['am doing', 'was doing', 'do', 'did'],
      correctAnswer: 1,
      explanation: '过去进行时表示过去某个时间正在进行的动作',
      lessonId: 3
    },
    {
      id: 3,
      type: 'fill',
      category: 'voice',
      difficulty: 3,
      question: 'The book _____ (write) by Shakespeare.',
      correctAnswer: 'was written',
      explanation: '被动语态，过去时',
      lessonId: null
    },
    {
      id: 4,
      type: 'correction',
      category: 'tense',
      difficulty: 3,
      question: '找出并改正句子中的错误：',
      sentence: 'I have been to Paris last year.',
      correctAnswer: 'I went to Paris last year.',
      explanation: 'last year表示过去时间，不能用现在完成时',
      lessonId: null
    }
  ]

  // 获取所有语法知识点
  static getAllGrammar() {
    return this.grammarData
  }

  // 根据分类获取语法知识点
  static getGrammarByCategory(category) {
    if (category === 'all') {
      return this.grammarData
    }
    return this.grammarData.filter(item => item.category === category)
  }

  // 根据ID获取语法知识点
  static getGrammarById(id) {
    return this.grammarData.find(item => item.id === id)
  }

  // 搜索语法知识点
  static searchGrammar(keyword) {
    const lowerKeyword = keyword.toLowerCase()
    return this.grammarData.filter(item => 
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.description.toLowerCase().includes(lowerKeyword) ||
      item.concept.toLowerCase().includes(lowerKeyword)
    )
  }

  // 获取所有练习题目
  static getAllPractice() {
    return this.practiceData
  }

  // 根据类型获取练习题目
  static getPracticeByType(type) {
    if (type === 'mixed') {
      return this.practiceData
    }
    return this.practiceData.filter(item => item.type === type)
  }

  // 根据分类获取练习题目
  static getPracticeByCategory(category) {
    return this.practiceData.filter(item => item.category === category)
  }

  // 根据难度获取练习题目
  static getPracticeByDifficulty(difficulty) {
    return this.practiceData.filter(item => item.difficulty <= difficulty)
  }

  // 根据课程ID获取相关练习
  static getPracticeByLesson(lessonId) {
    return this.practiceData.filter(item => item.lessonId === lessonId)
  }

  // 获取随机练习题目
  static getRandomPractice(count = 10, options = {}) {
    let filtered = this.practiceData

    // 根据类型筛选
    if (options.type && options.type !== 'mixed') {
      filtered = filtered.filter(item => item.type === options.type)
    }

    // 根据分类筛选
    if (options.category) {
      filtered = filtered.filter(item => item.category === options.category)
    }

    // 根据难度筛选
    if (options.difficulty) {
      filtered = filtered.filter(item => item.difficulty <= options.difficulty)
    }

    // 根据课程筛选
    if (options.lessonId) {
      filtered = filtered.filter(item => item.lessonId === options.lessonId)
    }

    // 随机排序并返回指定数量
    const shuffled = filtered.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // 获取分类列表
  static getCategories() {
    const categories = [
      { id: 'all', name: '全部', icon: '📚' },
      { id: 'tense', name: '时态', icon: '⏰' },
      { id: 'voice', name: '语态', icon: '🎯' },
      { id: 'clause', name: '从句', icon: '🔗' },
      { id: 'preposition', name: '介词', icon: '📍' },
      { id: 'conjunction', name: '连词', icon: '➕' },
      { id: 'article', name: '冠词', icon: '📝' },
      { id: 'pronoun', name: '代词', icon: '👤' }
    ]
    return categories
  }

  // 获取题型列表
  static getQuestionTypes() {
    const types = [
      { id: 'single', name: '单选题', icon: '🔘', description: '从四个选项中选择正确答案' },
      { id: 'fill', name: '填空题', icon: '📝', description: '根据语境填写正确的单词或短语' },
      { id: 'correction', name: '改错题', icon: '✏️', description: '找出并改正句子中的语法错误' }
    ]
    return types
  }

  // 获取难度等级
  static getDifficultyLevels() {
    return [
      { level: 1, name: '初级', description: '基础语法知识' },
      { level: 2, name: '初级+', description: '基础语法应用' },
      { level: 3, name: '中级', description: '进阶语法知识' },
      { level: 4, name: '中级+', description: '进阶语法应用' },
      { level: 5, name: '高级', description: '高级语法知识' }
    ]
  }
}

export default DataManager
