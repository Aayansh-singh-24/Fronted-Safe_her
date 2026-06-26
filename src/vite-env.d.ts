/// <reference types="vite/client" />
<<<<<<< HEAD
declare module '*.css' {
  const content: string;
  export default content;
=======

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
>>>>>>> 69a8fce8edde7a5e1097e3a5ea2a2a7dc2612be2
}
