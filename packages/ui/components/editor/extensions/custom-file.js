import { Node, Plugin } from 'tiptap'
import { nodeInputRule } from 'tiptap-commands'

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export default class File extends Node {
  constructor (name, parent, uploadFunc = null) {
    super(name, parent)
    this.uploadFunc = uploadFunc
  }

  get name () {
    return 'file'
  }

  get schema () {
    return {
      inline: true,
      attrs: {
        href: {},
        filename: {},
        target: {
          default: '_black'
        },
        'data-upload': {
          default: true
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: dom => ({
            href: dom.getAttribute('href'),
            filename: dom.getAttribute('filename'),
            'data-upload': true
          })
        }
      ],
      toDOM: node => ['a', node.attrs, node.attrs.filename]
    }
  }

  commands ({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  inputRules ({ type }) {
    return [
      nodeInputRule(IMAGE_INPUT_REGEX, type, (match) => {
        const [, alt, href, title] = match
        return {
          href,
          alt,
          title
        }
      })
    ]
  }

  get plugins () {
    const upload = this.uploadFunc
    return [
      new Plugin({
        props: {
          handlePaste (view, event, slice) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items
            for (const item of items) {
              if (item.kind === 'file') {
                event.preventDefault()
                const { schema } = view.state

                const file = item.getAsFile()

                if (file && upload) {
                  upload(file).then((item) => {
                    const node = schema.nodes.file.create({
                      href: item.src,
                      filename: item.filename
                    })
                    const transaction = view.state.tr.replaceSelectionWith(node)
                    view.dispatch(transaction)
                  })
                }
              }
            }
            return false
          },
          handleDOMEvents: {
            drop (view, event) {
              const hasFiles = event.dataTransfer &&
                                event.dataTransfer.files &&
                                event.dataTransfer.files.length

              if (!hasFiles) {
                return
              }
              const files = Array
                .from(event.dataTransfer.files)
                // .filter(file => file.type && !file.type.includes('image'))

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

              files.forEach(async (file) => {
                if (upload) {
                  const item = await upload(file)
                  const node = schema.nodes.file.create({
                    href: item.src,
                    filename: item.filename
                  })
                  const transaction = view.state.tr.insert(coordinates ? coordinates.pos : 0, node)
                  view.dispatch(transaction)
                }
              })
            }
          }
        }
      })
    ]
  }
}
