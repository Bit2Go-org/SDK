import { isNull, isNumber, isObject, isUndefined } from 'lodash-es'

type TransStringValToAny<
  T extends Record<string, any>,
  val = string | number,
> = {
  [K in keyof T]: T[K] extends string ? val : T[K]
}

export function createElement<
  T extends HTMLElement,
  TAG extends keyof HTMLElementTagNameMap,
>(
  tag: TAG,
  option?: Partial<Omit<T, 'style' | 'dataset' | 'children'>> & {
    /** 支持传入number，自动转化成px */
    style?: Partial<TransStringValToAny<CSSStyleDeclaration>> | string
    /** 不支持驼峰写法，请传`a-bc`这样，但取的时候是dataset['aBc'] */
    dataset?: Record<string, string | number>
    /** 传入子DOM */
    children?: HTMLElement[]
    [k: string]: any
  },
): HTMLElementTagNameMap[typeof tag] {
  const { children, dataset, style, ...op } = { ...option }
  const el = document.createElement(tag)
  Object.assign(el, op)
  if (style) {
    if (isObject(style)) {
      Object.entries(style).forEach(([k, v]) => {
        if (isNumber(v)) {
          v = `${v}px`
        }
        if (isUndefined(v) || isNull(v))
          return
        el.style[k as any] = v as any
      })
    }
    else {
      el.style.cssText = style
    }
  }
  if (dataset) {
    Object.entries(dataset).forEach(([key, val]) => {
      el.setAttribute(`data-${key}`, `${val}`)
    })
  }
  if (children) {
    children.forEach((c) => {
      el.appendChild(c)
    })
  }
  return el
}
