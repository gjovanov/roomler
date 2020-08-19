import {
  Node
} from 'tiptap'
import { Plugin } from 'prosemirror-state'
import { Slice, Fragment } from 'prosemirror-model'
// import { updateMark, removeMark } from 'tiptap-commands'

export default class Iframe extends Node {
  get name () {
    return 'iframe'
  }

  get schema () {
    return {
      attrs: {
        src: {
          default: null
        },
        class: {
          default: 'iframe_embed'
        }
      },
      group: 'block',
      selectable: false,
      parseDOM: [{
        tag: 'iframe',
        getAttrs: dom => ({
          src: dom.getAttribute('src'),
          class: dom.getAttribute('class')
        })
      }],
      toDOM: node => ['iframe', {
        src: node.attrs.src,
        class: node.attrs.class,
        frameborder: 0,
        allowfullscreen: 'true'
      }]
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

  get view () {
    return {
      props: ['node', 'updateAttrs', 'view'],
      computed: {
        src: {
          get () {
            return this.node.attrs.src
          },
          set (src) {
            this.updateAttrs({
              src
            })
          }
        },
        class: {
          get () {
            return this.node.attrs.class
          },
          set (cl) {
            this.updateAttrs({
              class: cl
            })
          }
        }
      },
      template: `
          <iframe class="iframe_embed" :src="src" allowfullscreen style="max-width: 100%;"></iframe>
      `
    }
  }

  nodePasteRule (regexp, type, getAttrs) {
    const handler = (fragment) => {
      const nodes = []

      fragment.forEach((child) => {
        if (child.isText) {
          const { text } = child
          let pos = 0
          let match

          // eslint-disable-next-line
          while ((match = regexp.exec(text)) !== null) {
            if (match[0]) {
              const start = match.index
              const end = start + match[0].length
              const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs

              // adding text before markdown to nodes
              if (start > 0) {
                nodes.push(child.cut(pos, start))
              }

              // create the node
              nodes.push(type.create(attrs))

              pos = end
            }
          }

          // adding rest of text to nodes
          if (pos < text.length) {
            nodes.push(child.cut(pos))
          }
        } else {
          nodes.push(child.copy(handler(child.content)))
        }
      })
      return Fragment.fromArray(nodes)
    }
    return new Plugin({
      props: {
        transformPasted: slice => new Slice(handler(slice.content), slice.openStart, slice.openEnd)
      }
    })
  }

  pasteRules ({ type }) {
    const self = this
    return [
      self.nodePasteRule(
        /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,
        type,
        (url) => {
          return { src: `https://www.youtube-nocookie.com/embed/${url[1]}` }
        }
      ),
      self.nodePasteRule(
        /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g,
        type,
        (url) => {
          return { src: `https://player.vimeo.com/video/${url[1]}` }
        }
      )
    ]
  }
}
