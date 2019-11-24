import { Mention, Suggestions } from 'tiptap-extensions'
import { replaceText } from 'tiptap-commands'

import Fuse from 'fuse.js'
import tippy from 'tippy.js'

export default class CustomMention extends Mention {
  constructor (options) {
    options.query = null
    options.popup = null
    options.suggestionRange = null
    options.filteredItems = []
    options.navigatedIndex = 0
    options.observer = null
    options.insertMention = null
    super(options)
  }

  renderPopup (node, templateId) {
    if (this.options.popup) {
      return
    }
    const options = {
      content: this.options.$refs[templateId],
      trigger: 'mouseenter',
      interactive: true,
      theme: 'dark',
      placement: 'top',
      inertia: true,
      duration: [400, 200],
      showOnInit: true,
      arrow: true,
      arrowType: 'round'
    }
    this.options.popup = tippy(node, options)
    // we have to update tippy whenever the DOM is updated
    if (MutationObserver) {
      this.options.observer = new MutationObserver(() => {
        this.options.popup.popperInstance.scheduleUpdate()
      })
      this.options.observer.observe(this.options.$refs[templateId], {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
  }

  destroyPopup () {
    if (this.options.popup) {
      this.options.popup.destroy()
      this.options.popup = null
    }
    if (this.options.observer) {
      this.options.observer.disconnect()
    }
  }

  selectItem (item) {
    this.options.insertMention({
      range: this.options.suggestionRange,
      attrs: this.options.attrMapper(item)
    })
    this.editor.focus()
  }

  get schema () {
    const customSchema = {
      toDOM: node => [
        'a',
        {
          class: this.options.mentionClass,
          userkey: node.attrs.id,
          'data-username': node.attrs.label,
          'data-linked-resource-type': 'userinfo',
          href: `/@/${node.attrs.label}`
        },
        node.attrs.label
      ],
      parseDOM: [
        {
          tag: 'a[userkey]',
          getAttrs: (dom) => {
            const id = dom.getAttribute('userkey')
            const label = dom.textContent.split(this.options.matcher.char).join('')
            return { id, label }
          }
        }
      ]
    }

    return {
      ...super.schema,
      ...customSchema
    }
  }

  get plugins () {
    const self = this
    return [
      Suggestions({
        command: ({ range, attrs, schema }) => replaceText(range, schema.nodes[this.name], attrs),
        appendText: ' ',
        matcher: this.options.matcher,
        items: this.options.items,
        onEnter: ({ items, query, range, command, virtualNode }) => {
          self.options.navigatedIndex = 0
          self.options.query = query
          self.options.filteredItems = items
          self.options.suggestionRange = range
          self.renderPopup(virtualNode, self.options.templateId)
          self.options.insertMention = command
        },
        onChange: ({ items, query, range, virtualNode }) => {
          self.options.query = query
          self.options.filteredItems = items
          self.options.suggestionRange = range
          self.options.navigatedIndex = 0
          self.renderPopup(virtualNode, self.options.templateId)
        },
        onExit: () => {
          self.options.query = null
          self.options.filteredItems = []
          self.options.suggestionRange = null
          self.options.navigatedIndex = 0
          self.destroyPopup()
        },
        onKeyDown: ({ event }) => {
          // pressing up arrow
          if (event.keyCode === 38) {
            self.options.navigatedIndex = ((self.options.navigatedIndex + self.options.filteredItems.length) - 1) % self.options.filteredItems.length
            return true
          }
          // pressing down arrow
          if (event.keyCode === 40) {
            self.options.navigatedIndex = (self.options.navigatedIndex + 1) % self.options.filteredItems.length
            return true
          }
          // pressing enter
          if (event.keyCode === 13) {
            const item = self.options.filteredItems[self.options.navigatedIndex]
            if (item) {
              self.selectItem(item)
              return true
            }
          }
          return false
        },
        onFilter: (items, query) => {
          if (!query) {
            return self.options.filterLimit ? items.slice(0, self.options.filterLimit) : items
          }
          const fuse = new Fuse(items, {
            threshold: 0.2,
            keys: self.options.filterKeys
          })
          return self.options.filterLimit ? fuse.search(query).slice(0, self.options.filterLimit) : fuse.search(query)
        },
        suggestionClass: self.options.suggestionClass
      })
    ]
  }
}
