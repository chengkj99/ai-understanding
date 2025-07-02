/**
 * AI 概念理解平台 - 主应用入口
 */

// 应用配置
const AppConfig = {
  concepts: [
    { key: 'neural-network', name: '神经网络', icon: '🧠' },
    { key: 'machine-learning', name: '机器学习', icon: '📊' },
    { key: 'deep-learning', name: '深度学习', icon: '🔍' },
    { key: 'nlp', name: '自然语言处理', icon: '💬' },
    { key: 'computer-vision', name: '计算机视觉', icon: '👁️' },
    { key: 'transformer', name: 'Transformer', icon: '⚡' },
  ]
};

class AIConceptApp {
  constructor() {
    this.currentConcept = 'neural-network';
    this.progressData = {};
    this.modules = new Map();
    
    this.bindEvents();
    this.start();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const concept = link.dataset.concept;
        this.navigateTo(concept);
      });
    });

    // 主题切换
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // 帮助按钮
    document.getElementById('help-btn').addEventListener('click', () => {
      this.showHelpModal();
    });

    // 模态框关闭
    document.querySelector('.modal-close').addEventListener('click', () => {
      this.hideHelpModal();
    });

    // 点击模态框背景关闭
    document.getElementById('help-modal').addEventListener('click', (e) => {
      if (e.target.id === 'help-modal') {
        this.hideHelpModal();
      }
    });

    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideHelpModal();
      }
    });
  }

  /**
   * 启动应用
   */
  async start() {
    try {
      // 显示加载指示器
      this.showLoadingIndicator();

      // 初始化主题
      this.initializeTheme();

      // 初始化进度
      this.initializeProgress();

      // 加载默认概念
      await this.loadConcept(this.currentConcept);

      // 隐藏加载指示器
      setTimeout(() => {
        this.hideLoadingIndicator();
      }, 1000);

    } catch (error) {
      console.error('应用启动失败:', error);
      this.showError('应用启动失败，请刷新页面重试');
    }
  }

  /**
   * 导航到指定概念
   */
  async navigateTo(concept) {
    try {
      // 更新导航状态
      this.updateNavigation(concept);

      // 加载概念内容
      await this.loadConcept(concept);

      // 更新进度
      this.updateProgress(concept);

      this.currentConcept = concept;

    } catch (error) {
      console.error(`加载概念失败: ${concept}`, error);
      this.showError(`加载 ${concept} 失败，请重试`);
    }
  }

  /**
   * 加载概念内容
   */
  async loadConcept(concept) {
    const container = document.getElementById('concept-container');
    
    // 显示加载状态
    container.innerHTML = this.getLoadingHTML();

    try {
      // 首先尝试从文件加载
      const success = await this.loadConceptFromFile(concept, container);
      
      if (!success) {
        // 如果文件加载失败，使用内置内容
        console.log(`未找到 ${concept} 的文件，使用内置内容`);
        container.innerHTML = this.getDefaultConceptHTML(concept);
        
        // 初始化内置概念的功能
        await this.initializeConcept(concept, container);
      }
      
    } catch (error) {
      console.error(`加载概念内容失败: ${concept}`, error);
      // 出错时回退到内置内容
      container.innerHTML = this.getDefaultConceptHTML(concept);
      await this.initializeConcept(concept, container);
    }
  }

  /**
   * 从文件加载概念内容
   */
  async loadConceptFromFile(concept, container) {
    try {
      const response = await fetch(`concepts/${concept}/index.html`);
      
      if (!response.ok) {
        return false;
      }
      
      const htmlContent = await response.text();
      
      // 检查内容是否有效
      if (!htmlContent.trim()) {
        return false;
      }
      
      // 设置内容
      container.innerHTML = htmlContent;
      
      // 执行内容中的脚本
      this.executeScripts(container);
      
      // 初始化概念特定功能
      await this.initializeConcept(concept, container);
      
      console.log(`成功从文件加载 ${concept} 内容`);
      return true;
      
    } catch (error) {
      console.warn(`从文件加载 ${concept} 失败:`, error);
      return false;
    }
  }

  /**
   * 执行容器中的脚本
   */
  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.textContent) {
        try {
          // 创建新的script元素并执行
          const newScript = document.createElement('script');
          newScript.textContent = script.textContent;
          document.head.appendChild(newScript);
          document.head.removeChild(newScript);
        } catch (error) {
          console.warn('执行脚本失败:', error);
        }
      }
    });
  }

  /**
   * 初始化概念特定功能
   */
  async initializeConcept(concept, container) {
    // 使用内置的初始化逻辑
    this.initializeBuiltinConcept(concept, container);
    
    // 添加通用的交互功能
    this.initializeCommonFeatures(container);
  }

  /**
   * 初始化通用功能
   */
  initializeCommonFeatures(container) {
    // 为所有按钮添加点击效果
    const buttons = container.querySelectorAll('button, .btn');
    buttons.forEach(button => {
      if (!button.hasAttribute('data-initialized')) {
        button.setAttribute('data-initialized', 'true');
        button.addEventListener('click', (e) => {
          // 添加点击动画效果
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
          }, 150);
        });
      }
    });

    // 为代码块添加复制功能
    const codeBlocks = container.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      if (!block.parentElement.querySelector('.copy-btn')) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = '复制代码';
        copyBtn.style.cssText = `
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.1);
          border: none;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
        `;
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(block.textContent).then(() => {
            copyBtn.innerHTML = '✅';
            setTimeout(() => {
              copyBtn.innerHTML = '📋';
            }, 2000);
          });
        });
      }
    });
  }

  /**
   * 内置概念初始化
   */
  initializeBuiltinConcept(concept, container) {
    switch (concept) {
      case 'neural-network':
        this.initializeNeuralNetwork(container);
        break;
      case 'machine-learning':
        this.initializeMachineLearning(container);
        break;
      case 'deep-learning':
        this.initializeDeepLearning(container);
        break;
      case 'nlp':
        this.initializeNLP(container);
        break;
      case 'computer-vision':
        this.initializeComputerVision(container);
        break;
      case 'transformer':
        this.initializeTransformer(container);
        break;
    }
  }

  /**
   * 更新导航状态
   */
  updateNavigation(concept) {
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.concept === concept);
    });

    // 更新概念导航
    this.updateConceptNavigation(concept);
  }

  /**
   * 更新概念导航
   */
  updateConceptNavigation(concept) {
    const navList = document.getElementById('concept-nav-list');
    
    navList.innerHTML = `
      <li><a href="#theory" class="concept-nav-link">理论基础</a></li>
      <li><a href="#visualization" class="concept-nav-link">可视化演示</a></li>
      <li><a href="#practice" class="concept-nav-link">实践练习</a></li>
      <li><a href="#summary" class="concept-nav-link">总结</a></li>
    `;

    // 绑定导航点击事件
    navList.querySelectorAll('.concept-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        this.scrollToSection(sectionId);
      });
    });
  }

  /**
   * 滚动到指定部分
   */
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // 更新导航状态
      document.querySelectorAll('.concept-nav-link').forEach(link => {
        link.classList.remove('active');
      });
      document.querySelector(`[href="#${sectionId}"]`)?.classList.add('active');
    }
  }

  /**
   * 主题管理
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem('ai-concept-theme') || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ai-concept-theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * 进度管理
   */
  initializeProgress() {
    const savedProgress = localStorage.getItem('ai-concept-progress');
    this.progressData = savedProgress ? JSON.parse(savedProgress) : {};
    this.renderProgress();
  }

  updateProgress(concept) {
    if (!this.progressData[concept]) {
      this.progressData[concept] = 0;
    }
    this.progressData[concept] = Math.min(this.progressData[concept] + 20, 100);
    
    localStorage.setItem('ai-concept-progress', JSON.stringify(this.progressData));
    this.renderProgress();
  }

  renderProgress() {
    const progressContainer = document.querySelector('.progress-tracker');
    if (!progressContainer) return;

    const progressHTML = AppConfig.concepts.map(concept => `
      <div class="progress-item">
        <span>${concept.name}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${this.progressData[concept.key] || 0}%"></div>
        </div>
      </div>
    `).join('');

    progressContainer.innerHTML = `
      <h3>学习进度</h3>
      ${progressHTML}
    `;
  }

  /**
   * 显示/隐藏方法
   */
  showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.classList.remove('hidden');
    }
  }

  hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }
  }

  showHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  hideHelpModal() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  /**
   * 错误处理
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: calc(4rem + 1rem);
        right: 1rem;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1500;
        max-width: 400px;
      ">
        <span style="margin-right: 0.5rem;">⚠️</span>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          float: right;
          cursor: pointer;
        ">&times;</button>
      </div>
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }

  /**
   * HTML模板
   */
  getLoadingHTML() {
    return `
      <div class="concept-loading" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        color: var(--text-muted);
      ">
        <div class="loading-spinner"></div>
        <p style="margin-top: 1rem;">正在加载概念内容...</p>
      </div>
    `;
  }

  getDefaultConceptHTML(concept) {
    const conceptConfig = AppConfig.concepts.find(c => c.key === concept);
    const name = conceptConfig ? conceptConfig.name : concept;
    const icon = conceptConfig ? conceptConfig.icon : '🤖';

    return `
      <div class="concept-page">
        <div class="concept-header">
          <h1>${icon} ${name}</h1>
          <p class="subtitle">深入理解${name}的核心概念与实际应用</p>
        </div>

        <div class="concept-content">
          <section id="theory" class="content-section">
            <h2 class="section-title">
              <span class="section-icon">📚</span>
              理论基础
            </h2>
            <div class="theory-content">
              ${this.getTheoryContent(concept)}
            </div>
          </section>

          <section id="visualization" class="content-section">
            <h2 class="section-title">
              <span class="section-icon">🎨</span>
              可视化演示
            </h2>
            <div class="visualization-container">
              <div class="visualization-header">
                <h3>${name}演示</h3>
                <p class="visualization-description">交互式可视化帮助理解概念</p>
              </div>
              <div id="${concept}-demo" class="demo-area">
                <p class="demo-placeholder">🚧 可视化演示正在开发中...</p>
              </div>
            </div>
          </section>

          <section id="practice" class="content-section">
            <h2 class="section-title">
              <span class="section-icon">🎯</span>
              实践练习
            </h2>
            <div class="practice-content">
              <p class="practice-placeholder">🎯 实践练习功能即将推出...</p>
            </div>
          </section>

          <section id="summary" class="content-section">
            <h2 class="section-title">
              <span class="section-icon">📝</span>
              总结
            </h2>
            <div class="summary-content">
              ${this.getSummaryContent(concept)}
            </div>
          </section>
        </div>
      </div>
    `;
  }

  getTheoryContent(concept) {
    const content = {
      'neural-network': `
        <h3>什么是神经网络？</h3>
        <p>神经网络是一种模仿人脑神经元工作方式的计算模型。它由多个相互连接的节点（神经元）组成，这些节点通过加权连接传递信息。</p>
        
        <div class="highlight-box">
          <h4>核心概念</h4>
          <ul>
            <li><strong>神经元（节点）</strong>：网络的基本处理单元</li>
            <li><strong>权重</strong>：连接之间的强度，决定信息传递的影响力</li>
            <li><strong>激活函数</strong>：决定神经元是否被激活的函数</li>
            <li><strong>层次结构</strong>：输入层、隐藏层、输出层</li>
          </ul>
        </div>

        <h3>神经网络的工作原理</h3>
        <p>1. <strong>前向传播</strong>：信息从输入层流向输出层</p>
        <p>2. <strong>激活计算</strong>：每个神经元计算输入的加权和，并通过激活函数处理</p>
        <p>3. <strong>输出生成</strong>：最终层产生网络的预测结果</p>
      `,
      'machine-learning': `
        <h3>什么是机器学习？</h3>
        <p>机器学习是人工智能的一个子领域，它使计算机能够通过经验自动改进性能，而无需显式编程。</p>
        
        <div class="highlight-box">
          <h4>机器学习类型</h4>
          <ul>
            <li><strong>监督学习</strong>：使用带标签的数据进行训练</li>
            <li><strong>无监督学习</strong>：从无标签数据中发现模式</li>
            <li><strong>强化学习</strong>：通过与环境交互学习最优策略</li>
          </ul>
        </div>

        <h3>核心概念</h3>
        <p><strong>训练数据</strong>：用于教导算法的数据集</p>
        <p><strong>特征</strong>：数据的可测量属性</p>
        <p><strong>模型</strong>：算法学习到的模式</p>
        <p><strong>预测</strong>：模型对新数据的推断</p>
      `,
      'deep-learning': `
        <h3>什么是深度学习？</h3>
        <p>深度学习是机器学习的一个子集，使用具有多个隐藏层的神经网络来学习数据的复杂模式。</p>
        
        <div class="highlight-box">
          <h4>深度学习的特点</h4>
          <ul>
            <li><strong>多层结构</strong>：通常包含3层以上的隐藏层</li>
            <li><strong>自动特征提取</strong>：无需手动设计特征</li>
            <li><strong>端到端学习</strong>：从原始数据直接学习到最终输出</li>
            <li><strong>表示学习</strong>：学习数据的层次化表示</li>
          </ul>
        </div>

        <h3>常见的深度学习架构</h3>
        <p><strong>卷积神经网络(CNN)</strong>：主要用于图像处理</p>
        <p><strong>循环神经网络(RNN)</strong>：适合序列数据处理</p>
        <p><strong>变换器(Transformer)</strong>：目前最先进的NLP架构</p>
      `,
      'nlp': `
        <h3>什么是自然语言处理？</h3>
        <p>自然语言处理(NLP)是人工智能的一个分支，专注于使计算机理解、解释和生成人类语言。</p>
        
        <div class="highlight-box">
          <h4>NLP的主要任务</h4>
          <ul>
            <li><strong>文本分类</strong>：将文本分配到预定义类别</li>
            <li><strong>情感分析</strong>：识别文本中的情感倾向</li>
            <li><strong>命名实体识别</strong>：识别文本中的人名、地名等</li>
            <li><strong>机器翻译</strong>：将文本从一种语言翻译为另一种</li>
          </ul>
        </div>

        <h3>NLP的关键技术</h3>
        <p><strong>分词</strong>：将文本分解为单词或字符</p>
        <p><strong>词向量</strong>：将词语表示为数值向量</p>
        <p><strong>语言模型</strong>：预测下一个词的概率分布</p>
        <p><strong>注意力机制</strong>：让模型关注重要的输入部分</p>
      `,
      'computer-vision': `
        <h3>什么是计算机视觉？</h3>
        <p>计算机视觉是人工智能的一个领域，旨在让计算机获得类似人类视觉的能力，能够识别和理解图像中的内容。</p>
        
        <div class="highlight-box">
          <h4>计算机视觉的主要任务</h4>
          <ul>
            <li><strong>图像分类</strong>：识别图像中的主要对象</li>
            <li><strong>目标检测</strong>：定位并识别图像中的多个对象</li>
            <li><strong>语义分割</strong>：对图像中的每个像素进行分类</li>
            <li><strong>人脸识别</strong>：识别和验证人脸身份</li>
          </ul>
        </div>

        <h3>核心技术</h3>
        <p><strong>图像预处理</strong>：增强图像质量，提取有用信息</p>
        <p><strong>特征提取</strong>：识别图像中的关键特征</p>
        <p><strong>卷积神经网络</strong>：专门用于图像处理的深度学习架构</p>
        <p><strong>迁移学习</strong>：利用预训练模型加速训练过程</p>
      `,
      'transformer': `
        <h3>什么是Transformer？</h3>
        <p>Transformer是一种基于注意力机制的神经网络架构，彻底改变了自然语言处理和AI领域。</p>
        
        <div class="highlight-box">
          <h4>🎯 核心创新</h4>
          <ul>
            <li><strong>自注意力机制</strong>：模型能关注输入序列的不同部分</li>
            <li><strong>并行计算</strong>：不依赖序列顺序，可以并行处理</li>
            <li><strong>位置编码</strong>：通过位置编码保留序列信息</li>
            <li><strong>多头注意力</strong>：从多个角度理解输入</li>
          </ul>
        </div>

        <h3>架构组成</h3>
        <p><strong>编码器-解码器结构</strong>：编码器理解输入，解码器生成输出</p>
        <p><strong>注意力层</strong>：Self-Attention和Cross-Attention机制</p>
        <p><strong>前馈网络</strong>：对每个位置独立的全连接层</p>
        <p><strong>残差连接</strong>：帮助训练深层网络，防止梯度消失</p>

        <h3>关键优势</h3>
        <ul>
          <li><strong>长距离依赖</strong>：能够捕捉序列中远距离的关系</li>
          <li><strong>训练效率</strong>：并行化训练大幅提升速度</li>
          <li><strong>可解释性</strong>：注意力权重提供模型决策洞察</li>
          <li><strong>可扩展性</strong>：易于扩展到大规模模型</li>
        </ul>
      `
    };

    return content[concept] || '<p>理论内容正在加载...</p>';
  }

  getSummaryContent(concept) {
    const content = {
      'neural-network': `
        <div class="highlight-box">
          <h4>关键要点</h4>
          <ul>
            <li>神经网络模仿大脑神经元的工作方式</li>
            <li>通过前向传播处理信息</li>
            <li>权重和偏置决定网络的行为</li>
            <li>激活函数引入非线性</li>
          </ul>
        </div>
        <p>神经网络是现代人工智能的基础，为深度学习和各种AI应用提供了核心架构。</p>
      `,
      'machine-learning': `
        <div class="highlight-box">
          <h4>关键要点</h4>
          <ul>
            <li>机器学习让计算机从数据中学习</li>
            <li>分为监督、无监督和强化学习</li>
            <li>模型训练是核心过程</li>
            <li>泛化能力是评估指标</li>
          </ul>
        </div>
        <p>机器学习正在改变我们与技术的交互方式，从推荐系统到自动驾驶都有应用。</p>
      `,
      'deep-learning': `
        <div class="highlight-box">
          <h4>关键要点</h4>
          <ul>
            <li>深度学习使用多层神经网络</li>
            <li>能够自动学习特征表示</li>
            <li>在图像、语音、NLP等领域表现卓越</li>
            <li>需要大量数据和计算资源</li>
          </ul>
        </div>
        <p>深度学习是当前AI发展的主要推动力，在许多任务上超越了传统方法。</p>
      `,
      'nlp': `
        <div class="highlight-box">
          <h4>关键要点</h4>
          <ul>
            <li>NLP让计算机理解人类语言</li>
            <li>涉及语言学、统计学和机器学习</li>
            <li>应用广泛：翻译、聊天机器人、搜索等</li>
            <li>Transformer架构带来了重大突破</li>
          </ul>
        </div>
        <p>NLP正在快速发展，大语言模型的出现为人机交互开启了新的可能性。</p>
      `,
      'computer-vision': `
        <div class="highlight-box">
          <h4>关键要点</h4>
          <ul>
            <li>计算机视觉让机器"看见"世界</li>
            <li>CNN是主要的技术架构</li>
            <li>应用范围广泛：医疗、安防、自动驾驶</li>
            <li>与其他AI技术结合创造更多可能</li>
          </ul>
        </div>
        <p>计算机视觉正在改变我们的生活方式，从手机拍照到工业自动化都有重要应用。</p>
      `,
      'transformer': `
        <div class="highlight-box">
          <h4>🔑 关键要点</h4>
          <ul>
            <li>Transformer革命性地改变了AI领域</li>
            <li>注意力机制是核心创新</li>
            <li>并行计算大幅提升训练效率</li>
            <li>是GPT、BERT等大模型的基础架构</li>
          </ul>
        </div>
        <p>Transformer不仅是现代NLP的基石，也正在扩展到计算机视觉、多模态等各个AI领域。</p>
        
        <h3>🌟 重要应用</h3>
        <ul>
          <li><strong>GPT系列</strong>：ChatGPT、GPT-4等大语言模型</li>
          <li><strong>BERT</strong>：双向编码器表示</li>
          <li><strong>Vision Transformer (ViT)</strong>：图像分类</li>
          <li><strong>T5</strong>：文本到文本的统一框架</li>
        </ul>
      `
    };

    return content[concept] || '<p>总结内容正在加载...</p>';
  }

  // 内置概念初始化方法
  initializeNeuralNetwork(container) {
    console.log('初始化神经网络模块');
    // 这里会添加神经网络特定的交互功能
  }

  initializeMachineLearning(container) {
    console.log('初始化机器学习模块');
    // 这里会添加机器学习特定的交互功能
  }

  initializeDeepLearning(container) {
    console.log('初始化深度学习模块');
    // 这里会添加深度学习特定的交互功能
  }

  initializeNLP(container) {
    console.log('初始化NLP模块');
    // 这里会添加NLP特定的交互功能
  }

  initializeComputerVision(container) {
    console.log('初始化计算机视觉模块');
    // 这里会添加计算机视觉特定的交互功能
  }

  initializeTransformer(container) {
    console.log('初始化Transformer模块');
    
    // 确保Transformer特定的JavaScript已经执行
    const transformerDemo = container.querySelector('#transformer-demo');
    if (transformerDemo) {
      console.log('Transformer演示组件已加载');
      
      // 如果有特定的初始化逻辑，在这里执行
      this.setupTransformerDemo(container);
    }
  }

  /**
   * 设置Transformer演示功能
   */
  setupTransformerDemo(container) {
    // 检查是否有注意力机制演示
    const attentionDemo = container.querySelector('#compute-attention');
    if (attentionDemo && !attentionDemo.hasAttribute('data-initialized')) {
      attentionDemo.setAttribute('data-initialized', 'true');
      attentionDemo.addEventListener('click', () => {
        console.log('计算注意力权重');
        this.computeAttentionWeights(container);
      });
    }

    // 检查是否有流程演示
    const pipelineDemo = container.querySelector('#inputText');
    if (pipelineDemo) {
      console.log('Transformer流程演示已准备就绪');
    }
  }

  /**
   * 计算注意力权重演示
   */
  computeAttentionWeights(container) {
    const attentionGrid = container.querySelector('#attention-grid');
    if (!attentionGrid) return;

    // 模拟生成注意力权重矩阵
    const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
    const weights = [];
    
    // 生成随机注意力权重
    for (let i = 0; i < tokens.length; i++) {
      weights[i] = [];
      for (let j = 0; j < tokens.length; j++) {
        weights[i][j] = Math.random();
      }
      // 归一化
      const sum = weights[i].reduce((a, b) => a + b, 0);
      weights[i] = weights[i].map(w => w / sum);
    }

    // 渲染注意力矩阵
    let matrixHTML = '<div class="attention-matrix-grid">';
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < tokens.length; j++) {
        const intensity = weights[i][j];
        const opacity = intensity.toFixed(2);
        matrixHTML += `
          <div class="attention-cell" 
               style="background: rgba(78, 140, 255, ${opacity}); opacity: ${opacity};"
               title="${tokens[i]} → ${tokens[j]}: ${(intensity * 100).toFixed(1)}%">
          </div>
        `;
      }
    }
    matrixHTML += '</div>';

    attentionGrid.innerHTML = matrixHTML;

    // 添加CSS样式
    if (!document.querySelector('#attention-matrix-styles')) {
      const style = document.createElement('style');
      style.id = 'attention-matrix-styles';
      style.textContent = `
        .attention-matrix-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 2px;
          max-width: 300px;
          margin: 1rem auto;
        }
        .attention-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .attention-cell:hover {
          transform: scale(1.1);
          border: 2px solid var(--accent-color);
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  window.aiApp = new AIConceptApp();
});