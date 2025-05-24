/// <reference types="vite/client" />

declare module '*.tsx' {
  import type { DefineComponent } from 'react'
  const component: DefineComponent<{}, {}, any>
  export default component
}
