(function () {
  if (!window.addEventListener) return // Check for IE9+

  const topThreshhold = 100 // px
  let animation = null
  let duration = null // ms
  let startTime = null
  let startPosition = null
  let backToTopping = false

  let options = INSTALL_OPTIONS
  let element

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  function resetPositions() {
    startTime = null
    startPosition = null
    backToTopping = false
  }

  function animateLoop(time) {
    if (!startTime) startTime = time

    const timeSoFar = time - startTime
    const easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration)

    window.scrollTo(0, easedPosition)

    if (timeSoFar < duration) {
      animation = requestAnimationFrame(animateLoop)
    }
    else {
      resetPositions()
    }
  }

  function backToTop() {
    if (backToTopping) return

    backToTopping = true
    startPosition = document.documentElement.scrollTop || document.body.scrollTop
    duration = startPosition / 2

    requestAnimationFrame(animateLoop)
  }

  function updateElement() {
    element = Eager.createElement({selector: "body", method: "append"}, element)
    const text = document.createElement("text")

    element.setAttribute("app-id", "back-to-top-button")
    element.appendChild(text)

    element.addEventListener("click", backToTop)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }

  window.addEventListener("blur", () => {
    if (!element) return

    if (backToTopping) {
      cancelAnimationFrame(animation)
      resetPositions()
      window.scrollTo(0, 0)
    }
  })

  window.addEventListener("scroll", () => {
    if (!element) return

    const visibility = element.getAttribute("visibility")
    const nextVisibility = window.scrollY > topThreshhold ? "visible" : "hidden"

    if (visibility !== nextVisibility) {
      element.setAttribute("visibility", nextVisibility)
    }
  })

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      options = nextOptions

      updateElement()
    }
  }
}())
