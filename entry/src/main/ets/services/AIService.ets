import http from '@ohos.net.http'
import { AIConfig } from '../models/AIConfig'

interface ChatMessage {
  role: string
  content: string
}

interface ChatRequestBody {
  model: string
  messages: ChatMessage[]
  stream: boolean
}

interface ChatChoice {
  message: ChatMessage
}

interface ChatResponse {
  choices: ChatChoice[]
}

interface StreamChoice {
  delta?: ChatMessage
}

interface StreamData {
  choices: StreamChoice[]
}

export class AIService {
  private static config: AIConfig | null = null

  static setConfig(config: AIConfig): void {
    AIService.config = config
  }

  static getConfig(): AIConfig {
    if (!AIService.config) {
      AIService.config = new AIConfig()
    }
    return AIService.config
  }

  static async chat(messages: ChatMessage[]): Promise<string> {
    const config = AIService.getConfig()
    
    if (!config.key) {
      throw new Error('请先配置API密钥')
    }

    const httpRequest = http.createHttp()
    
    try {
      const url = config.customUrl || 'https://api.deepseek.com'
      const endpoint = `${url}/v1/chat/completions`
      
      const requestBody: ChatRequestBody = {
        model: config.model,
        messages: messages,
        stream: false
      }

      const response = await httpRequest.request(endpoint, {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.key}`
        },
        extraData: JSON.stringify(requestBody),
        connectTimeout: 60000,
        readTimeout: 60000
      })

      if (response.responseCode === 200) {
        const result: ChatResponse = JSON.parse(response.result as string) as ChatResponse
        if (result.choices && result.choices.length > 0) {
          return result.choices[0].message.content
        } else {
          throw new Error('API返回数据格式错误')
        }
      } else {
        throw new Error(`API请求失败: ${response.responseCode}`)
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(`AI服务错误: ${error}`)
    } finally {
      httpRequest.destroy()
    }
  }

  static async chatStream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const config = AIService.getConfig()
    
    if (!config.key) {
      onError(new Error('请先配置API密钥'))
      return
    }

    const httpRequest = http.createHttp()
    
    try {
      const url = config.customUrl || 'https://api.deepseek.com'
      const endpoint = `${url}/v1/chat/completions`
      
      const requestBody: ChatRequestBody = {
        model: config.model,
        messages: messages,
        stream: true
      }

      const response = await httpRequest.request(endpoint, {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.key}`
        },
        extraData: JSON.stringify(requestBody),
        connectTimeout: 60000,
        readTimeout: 60000
      })

      if (response.responseCode === 200) {
        const result: string = response.result as string
        const lines: string[] = result.split('\n')
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              onComplete()
              return
            }
            try {
              const parsed: StreamData = JSON.parse(data) as StreamData
              if (parsed.choices && parsed.choices[0].delta?.content) {
                onChunk(parsed.choices[0].delta.content)
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
        onComplete()
      } else {
        onError(new Error(`API请求失败: ${response.responseCode}`))
      }
    } catch (error) {
      onError(new Error(`AI服务错误: ${error}`))
    } finally {
      httpRequest.destroy()
    }
  }
}
