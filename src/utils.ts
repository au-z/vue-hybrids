/*
From the vue-web-component wrapper source code
https://github.com/vuejs/vue-web-component-wrapper/blob/e2b84569c4671a7ea451b3887840533261e71715/src/utils.js#L61
*/

export function toVNodes (h, children) {
  const res = []
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(h, children[i]))
  }
  return res
}

function toVNode (h, node) {
  if (node.nodeType === 3) {
    return node.data.trim() ? node.data : null
  } else if (node.nodeType === 1) {

    const data: any = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML
      }
    }

    /* copy hybrids API props */
    node._propKeys?.forEach((prop) => data.domProps[prop] = node[prop])

    if (data.attrs.slot) {
      data.slot = data.attrs.slot
      delete data.attrs.slot
    }
    return h(node.tagName, data)
  } else {
    return null
  }
}

function getAttributes (node): any {
  const res = {}
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i]
    res[attr.nodeName] = attr.nodeValue
  }
  return res
}