import CustomMention from '@/components/editor/extensions/custom-mention'

export default class CustomEmoji extends CustomMention {
  get name () {
    return 'emoji'
  }

  get defaultOptions () {
    return {
      matcher: {
        char: ':',
        allowSpaces: false,
        startOfLine: false
      },
      mentionClass: 'emoji',
      suggestionClass: 'emoji-suggestion'
    }
  }

  get schema () {
    return {
      ...super.schema,
      toDOM: (node) => {
        return [
          'span',
          {
            class: this.options.mentionClass,
            'data-emoji-id': node.attrs.id
          },
          `${node.attrs.label}`
        ]
      },
      parseDOM: [
        {
          tag: 'span[data-emoji-id]',
          getAttrs: (dom) => {
            const id = dom.getAttribute('data-emoji-id')
            const label = dom.textContent.split(this.options.matcher.char).join('')
            return { id, label }
          }
        }
      ]
    }
  }
}
