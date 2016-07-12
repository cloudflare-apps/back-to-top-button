(function () {
  if (!window.addEventListener) return // Check for IE9+

  const {tinycolor} = window
  const getComputedStyle = document.defaultView.getComputedStyle || window.getComputedStyle
  const topThreshhold = 100 // px
  let animation = null
  let duration = null // ms
  let startTime = null
  let startPosition = null
  let backToTopping = false

  let options = INSTALL_OPTIONS
  let element
  let icon

  const ICONS = {
    fancy: `<svg viewBox="0 0 256 256" version="1.1">
      <path d="M83.5244052,130.453237 L129.059785,84.9178576 L174.595164,130.453237 L144.213452,130.453237 L144.213452,186.792818 L113.896389,186.792818 L113.896389,130.453237 L83.5244052,130.453237 Z M64.431707,68.715835 L64.431707,75.0983746 L193.678134,75.0983746 L193.678134,68.715835 L64.431707,68.715835 Z"></path>
    </svg>`,
    line: `<svg viewBox="0 0 256 256" version="1.1">
      <path d="M88.4020203,153.455844 L128,113.857864 L167.59798,153.455844 L173.254834,147.79899 L128,102.544156 L125.171573,105.372583 L82.745166,147.79899 L88.4020203,153.455844 Z"></path>
    </svg>`,
    pointer: `<svg viewBox="0 0 256 256" version="1.1">
      <path d="M92.9062438,130.532138 C89.0010007,134.437382 82.6693513,134.437382 78.7641081,130.532138 C74.858865,126.626895 74.858865,120.295246 78.7641081,116.390003 L115.887214,79.2668969 L121.190515,73.963596 C125.095758,70.0583529 131.427408,70.0583529 135.332651,73.963596 L140.635951,79.2668969 L177.759058,116.390003 C181.664301,120.295246 181.664301,126.626895 177.759058,130.532138 C173.853814,134.437382 167.522165,134.437382 163.616922,130.532138 L138,104.915217 L138,175 C138,180.522848 133.522848,185 128,185 C122.477152,185 118,180.522848 118,175 L118,105.438382 L92.9062438,130.532138 Z"></path>
    </svg>`,
    triangle: `<svg viewBox="0 0 256 256" version="1.1">
      <path d="M185.081032,156.382867 L128.006097,99.3079319 L70.9311613,156.382867 L185.081032,156.382867 Z"></path>
    </svg>`
  }

  function getColors() {
    let backgroundColor

    if (options.color.strategy === "custom") {
      backgroundColor = tinycolor(options.color.custom)
    }
    else {
      const documentBackgroundColor = getComputedStyle(document.body).backgroundColor
      const components = tinycolor(documentBackgroundColor).toHsl()

      // Find contrasting color.
      components.l = Math.abs((components.l + 0.5) % 1) + (1 - components.s) * 0.15
      backgroundColor = tinycolor(components)
    }

    const iconColor = backgroundColor.clone()

    backgroundColor.setAlpha(0.2)
    iconColor.setAlpha(0.9)

    return {
      backgroundColor: backgroundColor.toRgbString(),
      iconColor: iconColor.toRgbString()
    }
  }

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

  function setVisibility() {
    if (!element) return

    const visibility = window.scrollY > topThreshhold ? "visible" : "hidden"

    element.setAttribute("visibility", visibility)
  }

  function setColors() {
    if (!element || !icon) return

    const {backgroundColor, iconColor} = getColors()

    element.style.backgroundColor = backgroundColor
    icon.style.fill = iconColor
  }

  function setIcon() {
    if (!icon) return

    icon.innerHTML = ICONS[options.icon]
  }

  function setShape() {
    if (!element) return

    element.setAttribute("shape", options.shape)
  }

  function updateElement() {
    element = document.createElement("eager-app")
    icon = document.createElement("eager-icon")

    element.setAttribute("app-id", "back-to-top-button")
    element.addEventListener("click", backToTop)

    setVisibility()
    setIcon()
    element.appendChild(icon)

    setShape()
    setColors()

    document.body.appendChild(element)
  }

  function bootstrap() {
    updateElement()

    window.addEventListener("blur", () => {
      if (!element) return

      if (backToTopping) {
        cancelAnimationFrame(animation)
        resetPositions()
        window.scrollTo(0, 0)
      }
    })

    window.addEventListener("scroll", setVisibility)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap)
  }
  else {
    bootstrap()
  }


  window.INSTALL_SCOPE = {
    updateColors(nextOptions) {
      options = nextOptions

      setColors()
    },
    updateIcon(nextOptions) {
      options = nextOptions

      setIcon()
    },
    updateShape(nextOptions) {
      options = nextOptions

      setShape()
    }
  }
}())
