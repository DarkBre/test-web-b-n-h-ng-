import type { FormEvent } from 'react'
import type { ChatMessage } from '../types'

type ChatbotAIProps = {
  chatOpen: boolean
  chatInput: string
  messages: ChatMessage[]
  onToggle: () => void
  onClose: () => void
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
}

export function ChatbotAI({
  chatOpen,
  chatInput,
  messages,
  onToggle,
  onClose,
  onInputChange,
  onSubmit,
}: ChatbotAIProps) {
  return (
    <>
      <button className="chat-fab" onClick={onToggle}>
        AI
      </button>
      {chatOpen ? (
        <section className="chat-widget">
          <div className="chat-header">
            <div>
              <strong>AI Shopping Assistant</strong>
              <span>Gợi ý theo nhu cầu và ngân sách</span>
            </div>
            <button onClick={onClose}>×</button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                {message.text}
              </article>
            ))}
          </div>
          <form className="chat-form" onSubmit={onSubmit}>
            <input
              value={chatInput}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder="Ví dụ: tôi cần loa nhỏ dưới 5 triệu"
            />
            <button type="submit">Gợi ý</button>
          </form>
        </section>
      ) : null}
    </>
  )
}
