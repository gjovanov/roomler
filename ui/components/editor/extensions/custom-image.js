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

export default class Image extends Node {
  constructor (name, parent, uploadFunc = null) {
    super(name, parent)
    this.uploadFunc = uploadFunc
  }

  get name () {
    return 'image'
  }

  get schema () {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null
        },
        title: {
          default: null
        },
        'data-upload': {
          default: true
        },
        style: {
          default: 'max-width: 100%'
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            style: dom.getAttribute('style'),
            'data-upload': true
          })
        }
      ],
      toDOM: node => ['img', node.attrs]
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
        const [, alt, src, title] = match
        return {
          src,
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
            if (items.length === 1) {
              for (const item of items) {
                if (item.kind === 'file' && item.type && item.type.startsWith('image')) {
                  event.preventDefault()
                  const {
                    schema
                  } = view.state

                  const image = item.getAsFile()

                  if (image && upload) {
                    upload(image).then((item) => {
                      const node = schema.nodes.image.create({
                        src: item.src,
                        alt: item.filename,
                        title: item.filename
                      })
                      const transaction = view.state.tr.replaceSelectionWith(node)
                      view.dispatch(transaction)
                    })
                  }
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
              const images = Array
                .from(event.dataTransfer.files)
                .filter(file => file.type && file.type.includes('image'))

              if (!(images.length === 1 && event.dataTransfer.files.length === 1)) {
                return
              }

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

              images.forEach(async (image) => {
                if (upload) {
                  const item = await upload(image)
                  const node = schema.nodes.image.create({
                    src: item.src,
                    alt: item.filename,
                    title: item.filename
                  })
                  const transaction = view.state.tr.insert(coordinates.pos, node)
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
