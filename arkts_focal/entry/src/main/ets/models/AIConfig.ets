export class AIConfig {
  provider: string
  key: string
  model: string
  localUrl: string
  localModel: string
  customUrl: string

  constructor() {
    this.provider = 'anthropic'
    this.key = ''
    this.model = 'claude-sonnet-4-20250514'
    this.localUrl = 'http://localhost:11434'
    this.localModel = 'qwen2.5'
    this.customUrl = ''
  }
}
