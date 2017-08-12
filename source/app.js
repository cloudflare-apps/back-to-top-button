import tinycolor from 'tinycolor2'
import * as ICONS from './icons'
import easeInOutQuad from './ease-in-out-quad'

(function () {
  if (!window.addEventListener) return // Check for IE9+

  const {requestAnimationFrame, cancelAnimationFrame} = window
  const getComputedStyle = document.defaultView.getComputedStyle || window.getComputedStyle
  const topThreshhold = 100 // px
  let animation = null
  let duration = null // ms
  let startTime = null
  let startPosition = null
  let backToTopping = false

  let options = INSTALL_OPTIONS
  let element
  const xmlns = 'http://www.w3.org/2000/svg'
  const icon = document.createElementNS(xmlns, 'svg')

  icon.setAttribute('class', 'cloudflare-icon')
  icon.setAttributeNS(null, 'viewBox', '0 0 256 256')
  icon.setAttributeNS(null, 'version', '1.1')

  function getColors () {
    const {strategy} = options.color

    const backgroundColor = (() => {
      if (strategy === 'dark') return tinycolor('#878787')
      if (strategy === 'light') return tinycolor('#ededed')
      if (strategy === 'custom') return tinycolor(options.color.custom)

      // Find contrasting color.
      const {backgroundColor} = getComputedStyle(document.body)
      const components = tinycolor(backgroundColor).toHsl()

      components.l = Math.abs((components.l + 0.5) % 1) + (1 - components.s) * 0.15

      return tinycolor(components)
    })()

    const iconColor = backgroundColor.clone()
    iconColor.setAlpha(0.9)

    backgroundColor.setAlpha(options.shape.showBackground ? 0.2 : 0)

    return {
      backgroundColor: backgroundColor.toRgbString(),
      iconColor: iconColor.toRgbString()
    }
  }

  function resetPositions () {
    startTime = null
    startPosition = null
    backToTopping = false
  }

  function animateLoop (time) {
    if (!startTime) startTime = time

    const timeSoFar = time - startTime
    const easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration)

    window.scrollTo(0, easedPosition)

    if (timeSoFar < duration) {
      animation = requestAnimationFrame(animateLoop)
    } else {
      resetPositions()
    }
  }

  function backToTop () {
    if (backToTopping) return

    backToTopping = true
    startPosition = document.documentElement.scrollTop || document.body.scrollTop
    duration = startPosition / 2

    requestAnimationFrame(animateLoop)
  }

  function setVisibility () {
    if (!element) return

    const visibility = window.scrollY > topThreshhold ? 'visible' : 'hidden'

    element.setAttribute('visibility', visibility)
  }

  function setColors () {
    if (!element) return

    const {backgroundColor, iconColor} = getColors()

    element.style.backgroundColor = backgroundColor
    icon.style.fill = iconColor
  }

  function setIcon () {
    icon.innerHTML = ''
    const path = document.createElementNS(xmlns, 'path')

    path.setAttributeNS(null, 'd', ICONS[options.shape.icon])
    icon.appendChild(path)
  }

  function setPosition () {
    if (!element) return

    element.setAttribute('data-position', options.position.value)
  }

  function setShape () {
    if (!element) return
    element.style.borderRadius = (element.clientHeight / 2 * options.shape.radius).toFixed(2) + 'px'
  }

  function updateElement () {
    element = document.createElement('cloudflare-app')

    element.setAttribute('app', 'back-to-top-button')
    element.addEventListener('click', backToTop)

    setVisibility()
    setIcon()
    setPosition()
    element.appendChild(icon)

    setColors()

    document.body.appendChild(element)
    requestAnimationFrame(setShape)
  }

  function bootstrap () {
    updateElement()

    window.addEventListener('blur', () => {
      if (backToTopping) {
        cancelAnimationFrame(animation)
        resetPositions()
        window.scrollTo(0, 0)
      }
    })

    window.addEventListener('scroll', setVisibility)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    updateColors (nextOptions) {
      options = nextOptions

      setColors()
    },
    updateShape (nextOptions) {
      options = nextOptions

      setIcon()
      setShape()
      setColors()
    },
    updatePosition (nextOptions) {
      options = nextOptions

      setPosition()
    }
  }
}())
