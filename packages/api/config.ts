const CONFIG = {
  merchant: '',
  sign: '',
}
export default CONFIG

export function setConfig(props: typeof CONFIG) {
  Object.assign(CONFIG, props)
}
