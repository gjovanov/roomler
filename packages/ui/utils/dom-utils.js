class DomUtils {
  checkInView (container, element, partial = false) {
    // Get container properties
    const cTop = container.scrollTop
    const cBottom = cTop + container.clientHeight

    // Get element properties
    const eTop = element.offsetTop
    const eBottom = eTop + element.clientHeight

    // Check if in view
    const isTotal = (eTop >= cTop && eBottom <= cBottom)
    const isPartial = partial && (
      (eTop < cTop && eBottom > cTop) ||
      (eBottom > cBottom && eTop < cBottom)
    )

    // Return outcome
    return (isTotal || isPartial)
  }

  isScrolledIntoView (el) {
    const rect = el.getBoundingClientRect()
    const hasSize = rect.width > 0 || rect.height > 0
    // const elemTop = rect.top
    // const elemBottom = rect.bottom

    // previous version
    // const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight)
    // Partially visible elements return true:
    const isVisible = hasSize && !(rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight)
    return isVisible
  }
}

export const domUtils = new DomUtils()
