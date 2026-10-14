import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import AuthorLine from './AuthorLine.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-top': () => h(AuthorLine),
    })
  },
}
