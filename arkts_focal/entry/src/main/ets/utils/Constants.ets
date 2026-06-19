export interface ColorDef { name: string, hex: string }
export interface ResourceDef { school: string, name: string, desc: string, url: string, cat: string, lang: string }
export interface AIProviderDef { name: string, models: string[] }

export interface ColorTheme {
  bg: string
  bg2: string
  surface: string
  border: string
  borderHi: string
  ink: string
  inkMid: string
  inkDim: string
  inkGhost: string
  klein: string
  kleinDim: string
  ice: string
  red: string
  green: string
  amber: string
}

export interface AIProvidersMap {
  anthropic: AIProviderDef
  openai: AIProviderDef
  gemini: AIProviderDef
  deepseek: AIProviderDef
  kimi: AIProviderDef
  qwen: AIProviderDef
  local: AIProviderDef
  custom: AIProviderDef
}

export class Constants {
  static readonly STORAGE_PREFIX: string = 'focal_'
  static readonly DEFAULT_COLORS: ColorDef[] = [
    { name: 'Ink', hex: '#0e0e0e' },
    { name: 'Ash', hex: '#2a2a2a' },
    { name: 'Slate', hex: '#555555' },
    { name: 'Fog', hex: '#999999' },
    { name: 'Silver', hex: '#c8c8c8' },
    { name: 'Klein', hex: '#0047ab' },
    { name: 'Steel', hex: '#2e6da4' },
    { name: 'Ice', hex: '#5ba3c4' },
  ]

  static readonly COLORS: ColorTheme = {
    bg: '#F8FAFC',
    bg2: '#EEF2F7',
    surface: 'rgba(255,255,255,0.5)',
    border: 'rgba(20,20,20,0.08)',
    borderHi: 'rgba(20,20,20,0.18)',
    ink: '#0e0e0e',
    inkMid: '#3a3a3a',
    inkDim: '#888',
    inkGhost: 'rgba(14,14,14,0.13)',
    klein: '#0047ab',
    kleinDim: 'rgba(0,71,171,0.12)',
    ice: '#5ba3c4',
    red: '#b03030',
    green: '#3a7a3a',
    amber: '#8a6a00',
  }

  static readonly DARK_COLORS: ColorTheme = {
    bg: '#0a0a0a',
    bg2: '#111',
    surface: 'rgba(20,20,20,0.7)',
    border: 'rgba(255,255,255,0.07)',
    borderHi: 'rgba(255,255,255,0.17)',
    ink: '#f0f0ee',
    inkMid: '#9a9a96',
    inkDim: '#505050',
    inkGhost: 'rgba(240,240,238,0.10)',
    klein: '#1055cc',
    kleinDim: 'rgba(16,85,204,0.18)',
    ice: '#5ba3c4',
    red: '#b03030',
    green: '#3a7a3a',
    amber: '#8a6a00',
  }

  static readonly BUILTIN_RESOURCES: ResourceDef[] = [
    { school: 'MIT OCW', name: '18.01 Single Variable Calculus', desc: 'MIT经典微积分课程', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', cat: 'math', lang: 'EN' },
    { school: 'MIT OCW', name: '18.06 Linear Algebra', desc: '线性代数圣经级课程', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', cat: 'math', lang: 'EN' },
    { school: '北京大学', name: '高等数学', desc: '北大高数公开课', url: 'https://www.icourse163.org/course/PKU-43002', cat: 'math', lang: '中文' },
    { school: 'Stanford', name: 'CS231n Deep Learning', desc: '斯坦福CV深度学习', url: 'http://cs231n.stanford.edu/', cat: 'cs', lang: 'EN' },
    { school: 'MIT OCW', name: '6.006 Algorithms', desc: '算法导论配套课程', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', cat: 'cs', lang: 'EN' },
    { school: 'Harvard', name: 'CS50 Intro to CS', desc: '哈佛CS入门神课', url: 'https://cs50.harvard.edu/x/', cat: 'cs', lang: 'EN/中文' },
    { school: 'MIT OCW', name: '8.01 Classical Mechanics', desc: 'MIT经典力学', url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/', cat: 'physics', lang: 'EN' },
    { school: 'Coursera', name: 'Writing in the Sciences', desc: '斯坦福科技写作课', url: 'https://www.coursera.org/learn/sciwrite', cat: 'english', lang: 'EN' },
    { school: 'MIT OCW', name: '14.01 Microeconomics', desc: 'MIT微观经济学', url: 'https://ocw.mit.edu/courses/14-01sc-principles-of-microeconomics-fall-2011/', cat: 'econ', lang: 'EN' },
    { school: 'Yale OYC', name: 'Financial Markets', desc: '耶鲁金融市场课', url: 'https://oyc.yale.edu/economics/econ-252', cat: 'econ', lang: 'EN' },
  ]

  static readonly AI_PROVIDERS: AIProvidersMap = {
    anthropic: { name: 'Claude', models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-5-20251001'] },
    openai: { name: 'ChatGPT', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
    gemini: { name: 'Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'] },
    deepseek: { name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-reasoner'] },
    kimi: { name: 'Kimi', models: ['moonshot-v1-8k', 'moonshot-v1-32k'] },
    qwen: { name: '通义千问', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'] },
    local: { name: '本地模型', models: ['qwen2.5', 'deepseek-r1', 'llama3.2', 'mistral'] },
    custom: { name: '自定义', models: [] },
  }
}
