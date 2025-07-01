// 全局变量
let currentSection = 'neural-network';
let trainingData = [];
let regressionLine = null;
let isTraining = false;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeNeuralNetwork();
    initializeMachineLearning();
    initializeDeepLearning();
    initializeNLP();
    initializeComputerVision();
});

// 导航功能初始化
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.demo-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // 添加active类到当前选择的按钮和对应的section
            this.classList.add('active');
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
            
            currentSection = targetSection;
            
            // 如果切换到机器学习部分，重新绘制canvas
            if (targetSection === 'machine-learning') {
                drawRegressionCanvas();
            }
        });
    });
}

// 神经网络演示功能
function initializeNeuralNetwork() {
    const forwardPassBtn = document.getElementById('forward-pass');
    const resetNetworkBtn = document.getElementById('reset-network');
    
    forwardPassBtn.addEventListener('click', simulateForwardPass);
    resetNetworkBtn.addEventListener('click', resetNetwork);
}

function simulateForwardPass() {
    const neurons = document.querySelectorAll('.neuron');
    
    // 重置所有神经元
    neurons.forEach(neuron => {
        neuron.classList.remove('active');
    });
    
    // 按层激活神经元，模拟前向传播
    setTimeout(() => {
        // 激活输入层
        const inputNeurons = document.querySelectorAll('.input-layer .neuron');
        inputNeurons.forEach(neuron => neuron.classList.add('active'));
    }, 300);
    
    setTimeout(() => {
        // 激活隐藏层
        const hiddenNeurons = document.querySelectorAll('.hidden-layer .neuron');
        hiddenNeurons.forEach(neuron => neuron.classList.add('active'));
        
        // 更新隐藏层的值（模拟计算）
        hiddenNeurons.forEach(neuron => {
            const newValue = (Math.random() * 0.8 + 0.1).toFixed(1);
            neuron.querySelector('.neuron-value').textContent = newValue;
            neuron.setAttribute('data-value', newValue);
        });
    }, 800);
    
    setTimeout(() => {
        // 激活输出层
        const outputNeurons = document.querySelectorAll('.output-layer .neuron');
        outputNeurons.forEach(neuron => neuron.classList.add('active'));
        
        // 更新输出层的值
        outputNeurons.forEach(neuron => {
            const newValue = (Math.random() * 0.7 + 0.2).toFixed(1);
            neuron.querySelector('.neuron-value').textContent = newValue;
            neuron.setAttribute('data-value', newValue);
        });
    }, 1300);
}

function resetNetwork() {
    const neurons = document.querySelectorAll('.neuron');
    neurons.forEach(neuron => {
        neuron.classList.remove('active');
        // 重置为初始值
        const initialValues = ['0.8', '0.3', '0.6', '0.7', '0.4', '0.9'];
        const randomIndex = Math.floor(Math.random() * initialValues.length);
        const value = initialValues[randomIndex];
        neuron.querySelector('.neuron-value').textContent = value;
        neuron.setAttribute('data-value', value);
    });
}

// 机器学习演示功能
function initializeMachineLearning() {
    const canvas = document.getElementById('regression-canvas');
    const addPointBtn = document.getElementById('add-point');
    const trainModelBtn = document.getElementById('train-model');
    const clearPointsBtn = document.getElementById('clear-points');
    
    if (canvas) {
        canvas.addEventListener('click', addDataPoint);
        addPointBtn.addEventListener('click', () => addRandomDataPoint());
        trainModelBtn.addEventListener('click', trainLinearRegression);
        clearPointsBtn.addEventListener('click', clearTrainingData);
        
        drawRegressionCanvas();
    }
}

function drawRegressionCanvas() {
    const canvas = document.getElementById('regression-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // 绘制网格
    for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * canvas.width;
        const y = (i / 10) * canvas.height;
        
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = '#3498db';
    trainingData.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // 绘制回归线
    if (regressionLine) {
        ctx.beginPath();
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.moveTo(0, regressionLine.intercept);
        ctx.lineTo(canvas.width, regressionLine.slope * canvas.width + regressionLine.intercept);
        ctx.stroke();
    }
}

function addDataPoint(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    trainingData.push({ x, y });
    drawRegressionCanvas();
}

function addRandomDataPoint() {
    const canvas = document.getElementById('regression-canvas');
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    
    trainingData.push({ x, y });
    drawRegressionCanvas();
}

function trainLinearRegression() {
    if (trainingData.length < 2) {
        alert('至少需要2个数据点来训练模型！');
        return;
    }
    
    if (isTraining) return;
    isTraining = true;
    
    const progressElement = document.getElementById('training-progress');
    const errorElement = document.getElementById('error-rate');
    
    // 模拟训练过程
    let progress = 0;
    const trainingInterval = setInterval(() => {
        progress += 10;
        progressElement.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(trainingInterval);
            
            // 计算简单线性回归
            const n = trainingData.length;
            const sumX = trainingData.reduce((sum, point) => sum + point.x, 0);
            const sumY = trainingData.reduce((sum, point) => sum + point.y, 0);
            const sumXY = trainingData.reduce((sum, point) => sum + point.x * point.y, 0);
            const sumXX = trainingData.reduce((sum, point) => sum + point.x * point.x, 0);
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            regressionLine = { slope, intercept };
            
            // 计算误差
            const error = calculateMeanSquaredError();
            errorElement.textContent = error.toFixed(3);
            
            drawRegressionCanvas();
            isTraining = false;
        }
    }, 200);
}

function calculateMeanSquaredError() {
    if (!regressionLine || trainingData.length === 0) return 0;
    
    const errors = trainingData.map(point => {
        const predicted = regressionLine.slope * point.x + regressionLine.intercept;
        return Math.pow(point.y - predicted, 2);
    });
    
    return errors.reduce((sum, error) => sum + error, 0) / trainingData.length;
}

function clearTrainingData() {
    trainingData = [];
    regressionLine = null;
    document.getElementById('training-progress').textContent = '0%';
    document.getElementById('error-rate').textContent = 'N/A';
    drawRegressionCanvas();
}

// 深度学习演示功能
function initializeDeepLearning() {
    const simulateCNNBtn = document.getElementById('simulate-cnn');
    simulateCNNBtn.addEventListener('click', simulateCNNProcessing);
    
    // 生成像素网格
    generatePixelGrid();
}

function generatePixelGrid() {
    const pixelGrid = document.querySelector('.pixel-grid');
    if (!pixelGrid) return;
    
    pixelGrid.innerHTML = '';
    for (let i = 0; i < 64; i++) {
        const pixel = document.createElement('div');
        pixel.style.width = '15px';
        pixel.style.height = '15px';
        pixel.style.background = Math.random() > 0.7 ? '#333' : '#fff';
        pixel.style.borderRadius = '2px';
        pixelGrid.appendChild(pixel);
    }
}

function simulateCNNProcessing() {
    const layers = document.querySelectorAll('.cnn-layer');
    
    // 重置所有层的高亮
    layers.forEach(layer => layer.classList.remove('highlight'));
    
    // 按顺序高亮每一层
    layers.forEach((layer, index) => {
        setTimeout(() => {
            layer.classList.add('highlight');
            
            // 为每层添加处理动画
            if (index === 0) {
                // 输入层：重新生成像素
                generatePixelGrid();
            } else if (index === 1) {
                // 卷积层：滤波器闪烁
                const filters = layer.querySelectorAll('.filter');
                filters.forEach((filter, filterIndex) => {
                    setTimeout(() => {
                        filter.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            filter.style.animation = '';
                        }, 500);
                    }, filterIndex * 200);
                });
            } else if (index === 2) {
                // 池化层：特征图闪烁
                const featureMaps = layer.querySelectorAll('.feature-map');
                featureMaps.forEach((map, mapIndex) => {
                    setTimeout(() => {
                        map.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            map.style.animation = '';
                        }, 500);
                    }, mapIndex * 300);
                });
            } else if (index === 3) {
                // 输出层：显示分类结果
                const classification = layer.querySelector('.classification');
                classification.textContent = '识别结果: 猫 (85%)';
                classification.style.animation = 'highlight 1s ease-in-out';
                setTimeout(() => {
                    classification.style.animation = '';
                }, 1000);
            }
            
            // 1秒后移除高亮
            setTimeout(() => {
                layer.classList.remove('highlight');
            }, 1000);
        }, index * 1500);
    });
}

// NLP演示功能
function initializeNLP() {
    const analyzeBtn = document.getElementById('analyze-sentiment');
    analyzeBtn.addEventListener('click', analyzeSentiment);
}

function analyzeSentiment() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim();
    
    if (!text) {
        alert('请输入一些文本进行分析！');
        return;
    }
    
    // 简单的情感分析算法（基于关键词）
    const positiveWords = ['好', '棒', '优秀', '喜欢', '开心', '快乐', '有趣', '美好', '成功', '满意'];
    const negativeWords = ['坏', '差', '讨厌', '悲伤', '失望', '糟糕', '困难', '问题', '错误', '失败'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    let keywords = [];
    
    // 分词（简单按字符分割）
    const words = text.split(/[\s，。！？、]+/).filter(word => word.length > 0);
    
    words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) {
            positiveScore++;
            keywords.push({ word, sentiment: 'positive' });
        } else if (negativeWords.some(nw => word.includes(nw))) {
            negativeScore++;
            keywords.push({ word, sentiment: 'negative' });
        } else if (word.length > 1) {
            keywords.push({ word, sentiment: 'neutral' });
        }
    });
    
    // 计算百分比
    const totalScore = Math.max(positiveScore + negativeScore, 1);
    const positivePercent = Math.round((positiveScore / totalScore) * 100);
    const negativePercent = 100 - positivePercent;
    
    // 更新UI
    updateSentimentResult(positivePercent, negativePercent);
    updateKeywords(keywords);
}

function updateSentimentResult(positive, negative) {
    const positiveBar = document.querySelector('.positive-bar');
    const negativeBar = document.querySelector('.negative-bar');
    
    positiveBar.style.width = positive + '%';
    negativeBar.style.width = negative + '%';
    
    positiveBar.querySelector('span').textContent = `积极 ${positive}%`;
    negativeBar.querySelector('span').textContent = `消极 ${negative}%`;
}

function updateKeywords(keywords) {
    const keywordsContainer = document.querySelector('.keywords');
    keywordsContainer.innerHTML = '';
    
    // 取前10个关键词
    keywords.slice(0, 10).forEach(item => {
        const keywordSpan = document.createElement('span');
        keywordSpan.className = `keyword ${item.sentiment}`;
        keywordSpan.textContent = item.word;
        keywordsContainer.appendChild(keywordSpan);
    });
}

// 计算机视觉演示功能
function initializeComputerVision() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const previewImage = document.getElementById('preview-image');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
    imageInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.background = '#ecf0f1';
}

function handleFileDrop(event) {
    event.preventDefault();
    event.currentTarget.style.background = 'white';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请选择一个图像文件！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('preview-image');
        const uploadArea = document.getElementById('upload-area');
        
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        uploadArea.style.display = 'none';
        
        // 模拟图像识别
        setTimeout(() => {
            simulateImageRecognition();
        }, 1000);
    };
    
    reader.readAsDataURL(file);
}

function simulateImageRecognition() {
    // 模拟识别结果
    const predictions = [
        { label: '猫', confidence: Math.random() * 30 + 60 },
        { label: '狗', confidence: Math.random() * 20 + 5 },
        { label: '鸟', confidence: Math.random() * 15 + 2 },
        { label: '其他', confidence: Math.random() * 10 + 1 }
    ];
    
    // 确保总和接近100%
    const total = predictions.reduce((sum, pred) => sum + pred.confidence, 0);
    predictions.forEach(pred => {
        pred.confidence = (pred.confidence / total * 100);
    });
    
    // 按置信度排序
    predictions.sort((a, b) => b.confidence - a.confidence);
    
    // 更新UI
    updatePredictions(predictions);
}

function updatePredictions(predictions) {
    const predictionElements = document.querySelectorAll('.prediction');
    
    predictionElements.forEach((element, index) => {
        if (index < predictions.length) {
            const label = element.querySelector('.label');
            const confidence = element.querySelector('.confidence');
            
            label.textContent = predictions[index].label;
            confidence.textContent = Math.round(predictions[index].confidence) + '%';
            confidence.style.width = predictions[index].confidence + '%';
            
            // 添加动画效果
            setTimeout(() => {
                confidence.style.transition = 'width 1s ease-out';
            }, index * 200);
        }
    });
}

// 工具函数
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// 响应式处理
window.addEventListener('resize', function() {
    if (currentSection === 'machine-learning') {
        drawRegressionCanvas();
    }
});

// 添加一些交互提示
document.addEventListener('DOMContentLoaded', function() {
    // 为所有按钮添加点击反馈
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 为神经元添加交互提示
    const neurons = document.querySelectorAll('.neuron');
    neurons.forEach(neuron => {
        neuron.addEventListener('mouseenter', function() {
            const value = this.getAttribute('data-value');
            this.title = `神经元值: ${value}`;
        });
    });
}); 