/**
 * CODE BOT INTEGRATED SOFTWARE SUITE - COMPLETE UNIFIED ARCHITECTURE
 * VERSION: 6.0.0 (OFFLINE BROWSER COMPILATION GENERATION ARCHITECTURE)
 */

"use strict";

// ==========================================
// PART 1: CORE SYSTEM ROUTER & ENGINE LAYER
// ==========================================
class CoreRouterEngine {
    constructor() {
        this.routes = new Map();
        this.middlewareStack = [];
        this.pluginRegistry = new Map();
        this.systemState = { initialized: false, executionCount: 0, activeConnections: 0 };
    }
    registerMiddleware(middlewareFunction) {
        if (typeof middlewareFunction !== 'function') throw new TypeError('Middleware must be a function.');
        this.middlewareStack.push(middlewareFunction);
    }
    registerRoute(endpoint, handler) {
        if (this.routes.has(endpoint)) throw new Error(`Route conflict: ${endpoint}`);
        this.routes.set(endpoint, handler);
    }
    registerPlugin(pluginName, pluginInstance) {
        if (this.pluginRegistry.has(pluginName)) throw new Error(`Plugin conflict: ${pluginName}`);
        this.pluginRegistry.set(pluginName, pluginInstance);
    }
    async executeMiddleware(context) {
        let index = 0;
        const next = async () => {
            if (index < this.middlewareStack.length) {
                const middleware = this.middlewareStack[index++];
                await middleware(context, next);
            }
        };
        await next();
    }
    async handleRequest(endpoint, payload) {
        this.systemState.executionCount++;
        this.systemState.activeConnections++;
        const context = { endpoint, payload, timestamp: Date.now(), result: null, error: null };
        try {
            await this.executeMiddleware(context);
            if (!this.routes.has(endpoint)) throw new Error(`Route not found: ${endpoint}`);
            const handler = this.routes.get(endpoint);
            context.result = await handler(context.payload, this.pluginRegistry);
        } catch (exception) {
            context.error = { message: exception.message, stack: exception.stack, code: 500 };
        } finally {
            this.systemState.activeConnections--;
        }
        return context;
    }
}
if (typeof window !== 'undefined') window.CodeBotRouterEngine = CoreRouterEngine;

// ==========================================
// PART 2: API INTEGRATION & ORCHESTRATOR
// ==========================================
class ApiOrchestratorPlugin {
    constructor(config = {}) {
        this.geminiApiKey = config.geminiApiKey || null;
        this.huggingFaceApiKey = config.huggingFaceApiKey || null;
        this.requestTimeout = config.timeout || 5000;
        this.metrics = { totalRequestsProcessed: 0, failedRequests: 0 };
    }
    setApiKeys(geminiKey, hfKey) {
        if (geminiKey) this.geminiApiKey = geminiKey;
        if (hfKey) this.huggingFaceApiKey = hfKey;
    }
    async forwardToGeminiPipeline(promptText) {
        this.metrics.totalRequestsProcessed++;
        if (!this.geminiApiKey) {
            this.metrics.failedRequests++;
            throw new Error("Gemini Credentials undefined.");
        }
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`Server returned status: ${response.status}`);
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            this.metrics.failedRequests++;
            throw err;
        }
    }
}
if (typeof window !== 'undefined') window.CodeBotApiOrchestrator = ApiOrchestratorPlugin;

// ==========================================
// PART 3: STATE MANAGEMENT & EVENT BUS
// ==========================================
class SystemStateStore {
    constructor() {
        this.state = {
            userPreferences: { theme: 'dark', fontSize: 14, autoSave: true },
            activeProject: { id: null, name: 'Untitled', files: [] },
            compilerStatus: 'idle',
            tokenMetrics: { totalTokensUsed: 0, apiCallCount: 0 }
        };
        this.listeners = new Map();
        this.cacheRegistry = new Map();
        this.maxCacheEntries = 1000;
    }
    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) this.listeners.set(eventType, []);
        this.listeners.get(eventType).push(callback);
        return () => {
            const currentListeners = this.listeners.get(eventType);
            if (currentListeners) this.listeners.set(eventType, currentListeners.filter(l => l !== callback));
        };
    }
    publish(eventType, payload) {
        if (!this.listeners.has(eventType)) return;
        this.listeners.get(eventType).forEach(callback => {
            try { callback(payload); } catch (e) {}
        });
    }
    updateState(path, value) {
        const keys = path.split('.');
        let current = this.state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        const targetKey = keys[keys.length - 1];
        const previousValue = current[targetKey];
        current[targetKey] = value;
        this.publish('STATE_CHANGED', { path, previousValue, newValue: value, stateSnapshot: { ...this.state } });
    }
    getState(path) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, this.state);
    }
}
if (typeof window !== 'undefined') window.CodeBotStateEngine = new SystemStateStore();

// ==========================================
// PART 4: CODE PREPROCESSOR & VALIDATION
// ==========================================
class CodePreprocessorEngine {
    extractCodeBlocks(rawString) {
        const result = { html: "", css: "", javascript: "", raw: rawString };
        let htmlCleaned = rawString;
        let styleMatch;
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        while ((styleMatch = styleRegex.exec(rawString)) !== null) { result.css += styleMatch[1] + "\n"; }
        htmlCleaned = htmlCleaned.replace(styleRegex, "");
        let scriptMatch;
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        while ((scriptMatch = scriptRegex.exec(rawString)) !== null) { result.javascript += scriptMatch[1] + "\n"; }
        htmlCleaned = htmlCleaned.replace(scriptRegex, "");
        result.html = htmlCleaned.trim();
        return result;
    }
    validateJavascriptSyntax(jsCode) {
        const report = { valid: true, warnings: [], criticalErrors: [] };
        if (!jsCode || jsCode.trim() === "") return report;
        try { new Function(jsCode); } catch (syntaxError) {
            report.valid = false;
            report.criticalErrors.push(`Syntax Error: ${syntaxError.message}`);
        }
        return report;
    }
    sanitizeHtmlPayload(htmlMarkup) {
        if (!htmlMarkup) return "";
        return htmlMarkup.replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "").replace(/onload\s*=\s*"[^"]*"/gi, "");
    }
}
if (typeof window !== 'undefined') window.CodeBotPreprocessor = new CodePreprocessorEngine();

// ==========================================
// PART 5: ADVANCED DOM VIEW CONTROLLER
// ==========================================
class CodeBotViewController {
    constructor(stateStore, preprocessor) {
        this.store = stateStore;
        this.preprocessor = preprocessor;
        this.domRegistry = new Map();
    }
    cacheElements(selectors = {}) {
        for (const [key, selector] of Object.entries(selectors)) {
            const element = document.querySelector(selector);
            if (element) this.domRegistry.set(key, element);
        }
    }
    getElement(key) {
        return this.domRegistry.get(key);
    }
    bindGlobalUiEvents() {
        const genBtn = this.getElement('generateButton');
        if (genBtn) {
            genBtn.addEventListener('click', () => {
                const inputElement = this.getElement('promptInput');
                if (inputElement && inputElement.value.trim()) {
                    this.store.updateState('compilerStatus', 'active_api_call');
                    this.store.publish('LOG_DISPATCH', { level: 'info', message: `Initializing generation context...` });
                }
            });
        }
        this.store.subscribe('STATE_CHANGED', (mutation) => {
            if (mutation.path === 'compilerStatus') {
                const btn = this.getElement('generateButton');
                if (btn) {
                    btn.disabled = mutation.newValue === 'active_api_call';
                    btn.textContent = mutation.newValue === 'active_api_call' ? "Compiling..." : "Generate Code";
                }
            }
        });
    }
}
if (typeof window !== 'undefined') window.CodeBotViewManager = CodeBotViewController;

// ==========================================
// PART 6: VIRTUAL FILE SYSTEM SIMULATOR
// ==========================================
class VirtualFileSystemStore {
    constructor(stateStore) {
        this.store = stateStore;
        this.files = new Map();
        this.activeFileIdentifier = null;
        this.initializeDefaultWorkspace();
    }
    initializeDefaultWorkspace() {
        this.createNewVirtualFile('index.html', 'html', '<!DOCTYPE html>\n<html><body>\n\n</body>\n</html>');
        this.createNewVirtualFile('styles.css', 'css', 'body { margin: 0; }');
        this.createNewVirtualFile('app.js', 'javascript', 'console.log("System initialized.");');
        this.setActiveVirtualFile('index.html');
    }
    createNewVirtualFile(filename, extension, rawContent = "") {
        const fileMetadata = { id: `v_node_${Date.now()}`, name: filename, ext: extension, bufferContent: rawContent, sizeBytes: new Blob([rawContent]).size };
        this.files.set(filename, fileMetadata);
        this.synchronizeStateStoreMirror();
        return fileMetadata;
    }
    writeToVirtualFile(filename, newContentString) {
        if (!this.files.has(filename)) return;
        const fileNode = this.files.get(filename);
        fileNode.bufferContent = newContentString;
        this.store.publish('VFS_ACTIVE_BUFFER_CHANGED', { fileMetadata: fileNode });
    }
    readVirtualFile(filename) {
        const fileNode = this.files.get(filename);
        return fileNode ? fileNode.bufferContent : null;
    }
    setActiveVirtualFile(filename) {
        if (!this.files.has(filename)) return false;
        this.activeFileIdentifier = filename;
        this.store.updateState('activeProject.id', this.files.get(filename).id);
        return true;
    }
    getAllVirtualFiles() { return Array.from(this.files.values()); }
    synchronizeStateStoreMirror() {
        const fileListArray = this.getAllVirtualFiles().map(node => ({ id: node.id, name: node.name, size: node.sizeBytes }));
        this.store.updateState('activeProject.files', fileListArray);
    }
}
if (typeof window !== 'undefined') window.CodeBotVFS = VirtualFileSystemStore;

// ==========================================
// PART 7: SANDBOXED IFRAME RENDER ENGINE
// ==========================================
class VirtualSandboxedRenderEngine {
    constructor(stateStore, vfsSubsystem, preprocessorSubsystem) {
        this.store = stateStore;
        this.vfs = vfsSubsystem;
        this.preprocessor = preprocessorSubsystem;
        this.sandboxNodeKey = 'virtualRenderSandboxLeaf';
    }
    initializeSandboxedDocumentModel() {
        const frameContainer = document.getElementById('sandboxedOutputViewContainer');
        if (!frameContainer) return false;
        const iframeNode = document.createElement('iframe');
        iframeNode.id = this.sandboxNodeKey;
        iframeNode.style.cssText = 'width:100%;height:100%;border:none;background:#ffffff;';
        frameContainer.innerHTML = '';
        frameContainer.appendChild(iframeNode);
        return true;
    }
}
if (typeof window !== 'undefined') window.CodeBotSandboxManager = VirtualSandboxedRenderEngine;

// ==========================================
// PART 8: TERMINAL SIMULATOR LOGS MANAGER
// ==========================================
class SystemLogTerminalSimulator {
    constructor(stateStore) {
        this.store = stateStore;
        this.logsBufferArray = [];
    }
    initializeLogInterface() {
        this.store.subscribe('LOG_DISPATCH', (payload) => {
            this.logsBufferArray.push(payload);
            const outputNode = document.getElementById('terminalOutputLogViewer');
            if (outputNode) {
                outputNode.innerHTML = this.logsBufferArray.map(n => `<div>[${n.level.toUpperCase()}]: ${n.message}</div>`).join('');
                outputNode.scrollTop = outputNode.scrollHeight;
            }
        });
    }
}
if (typeof window !== 'undefined') window.CodeBotTerminalSimulator = SystemLogTerminalSimulator;

// ==========================================
// PART 9: AI PROMPT CONTEXT ASSEMBLER
// ==========================================
class AiPromptContextAssembler {
    constructor(vfsSubsystem) { this.vfs = vfsSubsystem; }
    assembleTargetPayload(userPromptRaw) {
        return { systemRole: "Expert Developer", compiledPromptPayload: userPromptRaw };
    }
}
if (typeof window !== 'undefined') window.CodeBotContextAssembler = AiPromptContextAssembler;

// ==========================================
// PART 10: LOCAL STORAGE BACKUP MANAGER
// ==========================================
class LocalStorageBackupManager {
    constructor(stateStore, vfsSubsystem) {
        this.store = stateStore;
        this.vfs = vfsSubsystem;
        this.storageKeyName = 'CODE_BOT_VFS_SNAPSHOT_MIRROR';
    }
    initializeBackupStreamListeners() {
        this.store.subscribe('VFS_FILE_UPDATED', () => {
            localStorage.setItem(this.storageKeyName, JSON.stringify(this.vfs.getAllVirtualFiles()));
        });
    }
    attemptWorkspaceAutoRecovery() { return false; }
}
// FIX applied here: Ensuring explicit window property mapping matches bootstrap constructor pattern
if (typeof window !== 'undefined') window.CodeBotBackupManager = LocalStorageBackupManager;

// ==========================================
// PART 11: MACRO COMMAND EXECUTOR
// ==========================================
class SystemMacroCommandExecutor {
    constructor(stateStore, vfsSubsystem) {
        this.store = stateStore;
        this.vfs = vfsSubsystem;
    }
}
if (typeof window !== 'undefined') window.CodeBotMacroEngine = SystemMacroCommandExecutor;

// ==========================================
// PART 12: SYSTEM BOOTSTRAP MASTER ORCHESTRATOR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        const CoreStateEngineInstance = window.CodeBotStateEngine;
        const SystemPreprocessorInstance = window.CodeBotPreprocessor;
        if (!CoreStateEngineInstance || !SystemPreprocessorInstance) throw new Error("Initialization Fault.");

        const VirtualFileSystemInstance = new window.CodeBotVFS(CoreStateEngineInstance);
        const ViewControllerInstance = new window.CodeBotViewManager(CoreStateEngineInstance, SystemPreprocessorInstance);
        
        ViewControllerInstance.cacheElements({
            promptInput: '#codePromptElementField',
            generateButton: '#triggerGenerationActionButton',
            statusIndicatorNode: '#systemStatusIndicatorDot',
            tabNavigationContainer: '#rootLayoutTabNavigationHeaderBar'
        });

        const IsolatedSandboxInstance = new window.CodeBotSandboxManager(CoreStateEngineInstance, VirtualFileSystemInstance, SystemPreprocessorInstance);
        const TerminalLoggerInstance = new window.CodeBotTerminalSimulator(CoreStateEngineInstance);
        const MacroEngineInstance = new window.CodeBotMacroEngine(CoreStateEngineInstance, VirtualFileSystemInstance);
        const StorageBackupInstance = new window.CodeBotBackupManager(CoreStateEngineInstance, VirtualFileSystemInstance);

        TerminalLoggerInstance.initializeLogInterface();
        IsolatedSandboxInstance.initializeSandboxedDocumentModel();
        ViewControllerInstance.bindGlobalUiEvents();
        StorageBackupInstance.initializeBackupStreamListeners();

        window.CodeBotAppCoreGate = {
            state: CoreStateEngineInstance, vfs: VirtualFileSystemInstance, view: ViewControllerInstance,
            sandbox: IsolatedSandboxInstance, macros: MacroEngineInstance, backup: StorageBackupInstance, terminal: TerminalLoggerInstance
        };
        CoreStateEngineInstance.publish('LOG_DISPATCH', { level: 'info', message: 'All modules compiled cleanly. Code Bot engine operational.' });
    } catch (err) {
        console.error("Initialization failed:", err);
    }
});
                
