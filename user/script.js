// 默认配置
const defaultConfig = {
    widgets: []
};

// 当前编辑的组件ID
let editingWidgetId = null;

// 获取配置
async function getConfig() {
    const response = await fetch("http://localhost:52773/api/SystemCheck/widgets", {});
            
    if (!response.ok) {
        console.log(response);
    }
    
    const config = await response.text();
    return JSON.parse(config);
}

// 保存配置
function saveConfig(config) {
    Currenconfig = config;

    const option = {method: "POST", mode: "no-cors", body: JSON.stringify(config)};
    fetch("http://localhost:52773/api/SystemCheckSYS/savewidgets", option);
    updateConfigPreview();
}

// 更新配置预览
function updateConfigPreview() {
    getConfig().then(result => {
        const config = result;
        document.getElementById('configPreview').textContent = JSON.stringify(config, null, 2);
    });
}

// 生成唯一ID
function generateId() {
    return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 添加展示项
function addWidget(widgetData) {
    getConfig().then(result => {
        const config = result;
        const newWidget = {
            id: generateId(),
            title: widgetData.title,
            type: widgetData.type,
            apiUrl: widgetData.apiUrl,
            apiMethod: widgetData.apiMethod,
            apiHeaders: widgetData.apiHeaders,
            apiBody: widgetData.apiBody,
            refreshInterval: widgetData.refreshInterval,
            enabled: widgetData.enabled,
            createdAt: new Date().toISOString()
        };
        
        config.widgets.push(newWidget);
        saveConfig(config);
        renderWidgetList();
        resetForm();
    });
}

// 更新展示项
function updateWidget(widgetId, widgetData) {
    getConfig().then(result => {
        const config = result;
        const widgetIndex = config.widgets.findIndex(widget => widget.id === widgetId);
        
        if (widgetIndex !== -1) {
            config.widgets[widgetIndex] = {
                ...config.widgets[widgetIndex],
                ...widgetData,
                id: widgetId // 确保ID不变
            };
            
            saveConfig(config);
            renderWidgetList();
            resetForm();
        }
    });
}

// 删除展示项
function deleteWidget(widgetId) {
    getConfig().then(result => {
        const config = result;
        config.widgets = config.widgets.filter(widget => widget.id !== widgetId);
        saveConfig(config);
        renderWidgetList();
    });
}

// 切换展示项状态
function toggleWidget(widgetId) {
    getConfig().then(result => {
        const config = result;
        const widget = config.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.enabled = !widget.enabled;
            saveConfig(config);
            renderWidgetList();
        }
    });
}

// 渲染展示项列表
function renderWidgetList() {
    getConfig().then(result => {
        const config = result;
        const widgetList = document.getElementById('widgetList');
        
        if (config.widgets.length === 0) {
            widgetList.innerHTML = '<div class="empty-state"><p>There are currently no configured display items available</p></div>';
            return;
        }
        
        widgetList.innerHTML = config.widgets.map(widget => `
            <div class="widget-item ${editingWidgetId === widget.id ? 'editing' : ''}" data-id="${widget.id}">
                <div class="widget-item-header">
                    <div class="widget-item-title">${widget.title}</div>
                    <div class="widget-actions">
                        <button class="toggle-widget ${widget.enabled ? 'secondary' : ''}" data-id="${widget.id}">
                            ${widget.enabled ? 'disable' : 'enable'}
                        </button>
                        <button class="edit-widget warning" data-id="${widget.id}">edit</button>
                        <button class="delete-widget danger" data-id="${widget.id}">delete</button>
                    </div>
                </div>
                <div>type: ${widget.type}</div>
                <div>apiurl: ${widget.apiUrl}</div>
                <div>method: ${widget.apiMethod}</div>
                <div>refresh interval: ${widget.refreshInterval === 0 ? 'Do not refresh automatically' : widget.refreshInterval + 'minute'}</div>
                <div>Status: <span style="color: ${widget.enabled ? '#27ae60' : '#e74c3c'}">${widget.enabled ? 'Enabled' : 'Disabled'}</span></div>
            </div>
        `).join('');
        
        // 添加事件监听器
        document.querySelectorAll('.delete-widget').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const widgetId = this.getAttribute('data-id');
                deleteWidget(widgetId);
            });
        });
        
        document.querySelectorAll('.toggle-widget').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const widgetId = this.getAttribute('data-id');
                toggleWidget(widgetId);
            });
        });
        
        document.querySelectorAll('.edit-widget').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const widgetId = this.getAttribute('data-id');
                editWidget(widgetId);
            });
        });
        
        // 点击整个widget项也可以编辑
        document.querySelectorAll('.widget-item').forEach(item => {
            item.addEventListener('click', function() {
                const widgetId = this.getAttribute('data-id');
                editWidget(widgetId);
            });
        });
    });
}

// 编辑展示项
function editWidget(widgetId) {
    getConfig().then(result => {
        const config = result;
        const widget = config.widgets.find(w => w.id === widgetId);
        
        if (widget) {
            // 设置编辑模式
            editingWidgetId = widgetId;
            
            // 填充表单
            document.getElementById('widgetId').value = widget.id;
            document.getElementById('widgetTitle').value = widget.title;
            document.getElementById('widgetType').value = widget.type;
            document.getElementById('apiUrl').value = widget.apiUrl;
            document.getElementById('apiMethod').value = widget.apiMethod;
            document.getElementById('apiHeaders').value = widget.apiHeaders || '';
            document.getElementById('apiBody').value = widget.apiBody || '';
            document.getElementById('refreshInterval').value = widget.refreshInterval;
            document.getElementById('widgetEnabled').checked = widget.enabled;
            
            // 更新UI为编辑模式
            document.getElementById('formTitle').textContent = 'edit item';
            document.getElementById('submitButton').textContent = 'update item';
            document.getElementById('cancelEdit').style.display = 'inline-block';
            document.getElementById('editModeIndicator').style.display = 'block';
            document.getElementById('editingWidgetTitle').textContent = widget.title;
            
            // 重新渲染列表以高亮正在编辑的项
            renderWidgetList();
            
            // 滚动到表单顶部
            document.getElementById('widgetForm').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// 重置表单
function resetForm() {
    editingWidgetId = null;
    document.getElementById('widgetForm').reset();
    document.getElementById('widgetId').value = '';
    document.getElementById('formTitle').textContent = 'Add new item';
    document.getElementById('submitButton').textContent = 'Add item';
    document.getElementById('cancelEdit').style.display = 'none';
    document.getElementById('editModeIndicator').style.display = 'none';
    document.getElementById('apiTestResult').style.display = 'none';
    
    // 重新渲染列表以取消高亮
    renderWidgetList();
}

// 渲染主页面
function renderDashboard() {
    getConfig().then(result => {
        const config = result;
        const dashboard = document.getElementById('dashboard');
        
        // 过滤出已启用的展示项
        const enabledWidgets = config.widgets.filter(widget => widget.enabled);
        
        if (enabledWidgets.length === 0) {
            dashboard.innerHTML = `
              <div class="empty-state">
<p>There are currently no configured display items available</p>
<p>Please go to the configuration page to add display items</p>
</div>
            `;
            return;
        }
        
        dashboard.innerHTML = enabledWidgets.map(widget => `
            <div class="widget" id="${widget.id}">
                <div class="widget-header">
                    <div class="widget-title">${widget.title}</div>
                    <div class="widget-type">${widget.type}</div>
                </div>
                <div class="widget-content">
                    <div class="loading">Loadding...</div>
                </div>
            </div>
        `).join('');
        
        // 为每个展示项加载数据
        enabledWidgets.forEach(widget => {
            loadWidgetData(widget);
            
            // 如果设置了刷新间隔，设置定时器
            if (widget.refreshInterval > 0) {
                setInterval(() => {
                    loadWidgetData(widget);
                }, widget.refreshInterval * 60 * 1000);
            }
        });
    });
}

// 加载展示项数据
async function loadWidgetData(widget) {
    const widgetElement = document.getElementById(widget.id);
    const contentElement = widgetElement.querySelector('.widget-content');
    
    try {
        // 准备请求参数
        const options = {
            method: widget.apiMethod,
            headers: widget.apiHeaders ? JSON.parse(widget.apiHeaders) : {}
        };
        
        // 如果是POST或PUT请求，添加请求体
        if (['POST', 'PUT'].includes(widget.apiMethod) && widget.apiBody) {
            options.body = widget.apiBody;
        }
        
        let data;
        
        // 直接请求
        const response = await fetch(widget.apiUrl, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status:${response.status}`);
        }
        
        data = await response.text();
        
        // 根据展示项类型渲染数据
        renderWidgetContent(contentElement, widget.type, data);
        
    } catch (error) {
        console.error(`Loading display item : ${widget.title}  data failed:`, error);
        contentElement.innerHTML = `
            <div class="error">
                <p>加载数据失败</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// 根据类型渲染展示项内容
function renderWidgetContent(element, type, data) {
    switch(type) {
        case 'data':
            // 如果是数组，取第一个元素展示
            if (Array.isArray(data) && data.length > 0) {
                const firstItem = data[0];
                element.innerHTML = `
                    <div class="success">Data loading successful</div>
                    <div style="margin-top: 10px;">
                        ${Object.keys(firstItem).map(key => `
                            <div class="data-item">
                                <span class="data-key">${key}:</span>
                                <span class="data-value">${firstItem[key]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                        Update time: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            } else if (typeof data === 'object') {
                element.innerHTML = `
                    <div class="success">Data loading successful</div>
                    <div style="margin-top: 10px;">
                        ${Object.keys(data).map(key => `
                            <div class="data-item">
                                <span class="data-key">${key}:</span>
                                <span class="data-value">${data[key]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                        Update time: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            } else {
                element.innerHTML = `
                    <div class="success">Data loading successful</div>
                    <div style="margin-top: 10px; text-align: center; font-size: 24px; font-weight: bold;word-wrap: break-word;
word-break: break-all;">
                        ${data}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                        Update time: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            }
            break;
            
        case 'list':
            // 展示列表数据
            if (Array.isArray(data)) {
                element.innerHTML = `
                    <div class="success"> (${data.length} record of successful data loading)</div>
                    <div style="margin-top: 10px; max-height: 200px; overflow-y: auto;">
                        ${data.slice(0, 10).map(item => `
                            <div class="data-item">
                                ${typeof item === 'object' ? 
                                    Object.keys(item).map(key => `
                                        <div><span class="data-key">${key}:</span> <span class="data-value">${item[key]}</span></div>
                                    `).join('') : 
                                    `<div>${item}</div>`
                                }
                            </div>
                        `).join('')}
                        ${data.length > 10 ? `<div style="text-align: center; color: #7f8c8d; margin-top: 10px;">... and ${data.length - 10} 条记录</div>` : ''}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                        Update time: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            } else {
                element.innerHTML = `
                    <div class="error">
                        <p>data in wrong format</p>
                        <p>Expected array format, but received: ${typeof data}</p>
                    </div>
                `;
            }
            break;
            
        case 'custom':
            // 自定义展示，直接显示原始数据
            element.innerHTML = `
                <div class="success">Data loading successful</div>
                <div style="margin-top: 10px; max-height: 200px; overflow-y: auto;">
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                    Update time: ${new Date().toLocaleTimeString()}
                </div>
            `;
            break;
            
        default:
            element.innerHTML = `
                <div class="error">
                    <p>Unknown display item type: ${type}</p>
                </div>
            `;
    }
}

// 测试API
async function testApi() {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiMethod = document.getElementById('apiMethod').value;
    const apiHeaders = document.getElementById('apiHeaders').value;
    const apiBody = document.getElementById('apiBody').value;
    
    if (!apiUrl) {
        alert('Please enter the API interface address');
        return;
    }
    
    const resultElement = document.getElementById('apiTestResult');
    resultElement.style.display = 'block';
    resultElement.innerHTML = '<div class="loading">测试中...</div>';
    
    try {
        // 准备请求参数
        const options = {
            method: apiMethod,
            headers: apiHeaders ? JSON.parse(apiHeaders) : {}
        };
        
        // 如果是POST或PUT请求，添加请求体
        if (['POST', 'PUT'].includes(apiMethod) && apiBody) {
            options.body = apiBody;
        }
        
        let data;
        
        // 直接请求
        const response = await fetch(apiUrl, options);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        data = await response.text();
        
        resultElement.className = 'api-result api-success';
        resultElement.innerHTML = `
            <div style="color: #27ae60; font-weight: bold;">API测试成功!</div>
            <div style="margin-top: 10px;">Response:</div>
            <pre style="margin-top: 5px;">${JSON.stringify(data, null, 2)}</pre>
        `;
        
    } catch (error) {
        console.error('API测试失败:', error);
        resultElement.className = 'api-result api-error';
        resultElement.innerHTML = `
            <div style="color: #e74c3c; font-weight: bold;">API测试失败!</div>
            <div style="margin-top: 10px;">Err: ${error.message}</div>
        `;
    }
}

// 页面切换
document.getElementById('showDashboard').addEventListener('click', function() {
    document.getElementById('dashboardPage').style.display = 'block';
    document.getElementById('configPage').style.display = 'none';
    renderDashboard();
});

document.getElementById('showConfig').addEventListener('click', function() {
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('configPage').style.display = 'block';
    renderWidgetList();
    updateConfigPreview();
});

// 表单提交
document.getElementById('widgetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const widgetData = {
        title: document.getElementById('widgetTitle').value,
        type: document.getElementById('widgetType').value,
        apiUrl: document.getElementById('apiUrl').value,
        apiMethod: document.getElementById('apiMethod').value,
        apiHeaders: document.getElementById('apiHeaders').value,
        apiBody: document.getElementById('apiBody').value,
        refreshInterval: parseInt(document.getElementById('refreshInterval').value),
        enabled: document.getElementById('widgetEnabled').checked,
    };
    
    const widgetId = document.getElementById('widgetId').value;
    
    if (widgetId) {
        // 更新现有展示项
        updateWidget(widgetId, widgetData);
    } else {
        // 添加新展示项
        addWidget(widgetData);
    }
});

// 取消编辑
document.getElementById('cancelEdit').addEventListener('click', resetForm);

// API测试按钮
document.getElementById('testApi').addEventListener('click', testApi);

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 默认显示主页面
    document.getElementById('showDashboard').click();
});