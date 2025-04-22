/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv extends Readonly<Recordable<ValueType>> {

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
