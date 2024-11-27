# Bit2Go - SDK

[doc](https://documenter.getpostman.com/view/1700178/2sAXxY5UoF#42a55e5d-1312-4793-b25e-9d68ef5afaaa)

## How to use

### With pack manager

#### In web
```sh
npm install @Bit2Go/web
```

```js
import { createInvoice, setConfig } from '@Bit2Go/web'
setConfig({
  merchant: '<YOUR MERCHANT ID>',
  sign: '<YOUR SIGN>',
})

// Set your invoice panel ui position
const panel = createInvoice(/* props */).getElement()
document.body.appendChild(panel)

// Or origin modal
createInvoice(/* props */).openModal()
```

#### In nodejs
```sh
npm install @Bit2Go/api
```

```js
import { createInvoice, setConfig } from '@Bit2Go/api'
setConfig({
  merchant: '<YOUR MERCHANT ID>',
  sign: '<YOUR SIGN>',
})
createInvoice(/* props */).then((res) => {
  // do something
})
```

### With script tag
#### Use web API
```html
<script src="https://cdn.jsdelivr.net/npm/@bit2go/web/lib/index.global.js"></script>
```

```js
bit2goWeb.setConfig({
  merchant: '<YOUR MERCHANT ID>',
  sign: '<YOUR SIGN>',
})

// Set your invoice panel position
const panel = bit2goWeb.createInvoice(/* props */).getElement()
document.body.appendChild(panel)

// Or origin modal
bit2goWeb.createInvoice(/* props */).openModal()
```

#### Use only API
```html
<script src="https://cdn.jsdelivr.net/npm/@bit2go/api/lib/index.global.js"></script>
```

```js
bit2goApi.setConfig({
  merchant: '<YOUR MERCHANT ID>',
  sign: '<YOUR SIGN>',
})

bit2goApi.createInvoice().then((res) => {
  // do something
})
```
