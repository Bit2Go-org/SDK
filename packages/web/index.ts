import type { CreateInvoiceParams } from '@bit2go/api'
import { createInvoice as createInvoiceAPI } from '@bit2go/api'
import { createElement } from './utils'

export function createInvoice(props: CreateInvoiceParams) {
  const iframeEl = createElement('iframe', {
    style: {
      width: '100%',
      height: '100%',
    },
  })
  const loadingElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  loadingElement.style.position = 'absolute'
  loadingElement.style.top = '50%'
  loadingElement.style.left = '50%'
  loadingElement.style.transform = 'translate(-50%, -50%)'
  loadingElement.setAttribute('width', '100')
  loadingElement.setAttribute('viewBox', '0 0 200 200')
  loadingElement.innerHTML = `<circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle>`

  const element = createElement('div', {
    style: { position: 'relative', height: '100%' },
    children: [loadingElement as any],
  })
  createInvoiceAPI(props).then((res) => {
    const payUrl = res.data.payurl
    if (!payUrl)
      return
    iframeEl.src = payUrl
    element.appendChild(iframeEl)
    element.removeChild(loadingElement)
  })

  return {
    getElement: () => element,
    openModal: (props: { width?: string | number, height?: string | number } = {}) => {
      const { height = 500, width = 800 } = props
      const modal = createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
        },
        children: [
          createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
            },
            onclick: () => {
              document.body.removeChild(modal)
            },
          }),
          createElement('div', {
            style: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              borderRadius: '8px',
              backgroundColor: '#fff',
              width,
              height,
            },
            children: [element],
          }),
        ],
      })
      document.body.append(modal)
    },
  }
}

export { setConfig } from '@bit2go/api'
