// Off-main-thread AI / hint computation
import { findSafeCell } from '@/domain'
self.onmessage = (e: MessageEvent) => {
  const result = findSafeCell(e.data.board)
  self.postMessage(result)
}
