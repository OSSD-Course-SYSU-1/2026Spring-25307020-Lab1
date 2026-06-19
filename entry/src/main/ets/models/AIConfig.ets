export class AIConfig {
  provider: string
  key: string
  model: string
  localUrl: string
  localModel: string
  customUrl: string

  constructor() {
    this.provider = 'deepseek'
    this.key = ''
    this.model = 'deepseek-chat'
    this.localUrl = 'http://localhost:11434'
    this.localModel = 'qwen2.5'
    this.customUrl = 'https://api.deepseek.com'
  }
}
