import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: ['**/components/ui/**', '**/src/hooks/**'],
  rules: {
      "prettier/prettier": "error",
    },
})
