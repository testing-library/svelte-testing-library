import { createContext } from 'svelte'

export interface Message {
  id: string
  text: string
}

export interface MessagesContext {
  current: Message[]
}

export const [getMessagesContext, setMessagesContext] =
  createContext<MessagesContext>()
