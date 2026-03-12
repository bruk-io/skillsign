/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis, tr = _t.ShadowRoot && (_t.ShadyCSS === void 0 || _t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rr = Symbol(), _r = /* @__PURE__ */ new WeakMap();
let Hr = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== rr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (tr && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = _r.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && _r.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ts = (t) => new Hr(typeof t == "string" ? t : t + "", void 0, rr), b = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((a, r, o) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new Hr(s, t, rr);
}, rs = (t, e) => {
  if (tr) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), r = _t.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = s.cssText, t.appendChild(a);
  }
}, xr = tr ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return ts(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ss, defineProperty: as, getOwnPropertyDescriptor: os, getOwnPropertyNames: is, getOwnPropertySymbols: ns, getPrototypeOf: ls } = Object, Y = globalThis, wr = Y.trustedTypes, hs = wr ? wr.emptyScript : "", Yt = Y.reactiveElementPolyfillSupport, Fe = (t, e) => t, xt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? hs : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, sr = (t, e) => !ss(t, e), $r = { attribute: !0, type: String, converter: xt, reflect: !1, useDefault: !1, hasChanged: sr };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Y.litPropertyMetadata ?? (Y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let me = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = $r) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), r = this.getPropertyDescriptor(e, a, s);
      r !== void 0 && as(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: r, set: o } = os(this.prototype, e) ?? { get() {
      return this[s];
    }, set(i) {
      this[s] = i;
    } };
    return { get: r, set(i) {
      const p = r == null ? void 0 : r.call(this);
      o == null || o.call(this, i), this.requestUpdate(e, p, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? $r;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Fe("elementProperties"))) return;
    const e = ls(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Fe("properties"))) {
      const s = this.properties, a = [...is(s), ...ns(s)];
      for (const r of a) this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [a, r] of s) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, a] of this.elementProperties) {
      const r = this._$Eu(s, a);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const r of a) s.unshift(xr(r));
    } else e !== void 0 && s.push(xr(e));
    return s;
  }
  static _$Eu(e, s) {
    const a = s.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((s) => s(this));
  }
  addController(e) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((s = e.hostConnected) == null || s.call(e));
  }
  removeController(e) {
    var s;
    (s = this._$EO) == null || s.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const a of s.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return rs(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostConnected) == null ? void 0 : a.call(s);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var a;
      return (a = s.hostDisconnected) == null ? void 0 : a.call(s);
    });
  }
  attributeChangedCallback(e, s, a) {
    this._$AK(e, a);
  }
  _$ET(e, s) {
    var o;
    const a = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, a);
    if (r !== void 0 && a.reflect === !0) {
      const i = (((o = a.converter) == null ? void 0 : o.toAttribute) !== void 0 ? a.converter : xt).toAttribute(s, a.type);
      this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var o, i;
    const a = this.constructor, r = a._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const p = a.getPropertyOptions(r), d = typeof p.converter == "function" ? { fromAttribute: p.converter } : ((o = p.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? p.converter : xt;
      this._$Em = r;
      const g = d.fromAttribute(s, p.type);
      this[r] = g ?? ((i = this._$Ej) == null ? void 0 : i.get(r)) ?? g, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, r = !1, o) {
    var i;
    if (e !== void 0) {
      const p = this.constructor;
      if (r === !1 && (o = this[e]), a ?? (a = p.getPropertyOptions(e)), !((a.hasChanged ?? sr)(o, s) || a.useDefault && a.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(p._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: r, wrapped: o }, i) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? s ?? this[e]), o !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, i] of this._$Ep) this[o] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, i] of r) {
        const { wrapped: p } = i, d = this[o];
        p !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, i, d);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (a = this._$EO) == null || a.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(s)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((a) => {
      var r;
      return (r = a.hostUpdated) == null ? void 0 : r.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
me.elementStyles = [], me.shadowRootOptions = { mode: "open" }, me[Fe("elementProperties")] = /* @__PURE__ */ new Map(), me[Fe("finalized")] = /* @__PURE__ */ new Map(), Yt == null || Yt({ ReactiveElement: me }), (Y.reactiveElementVersions ?? (Y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = globalThis, Cr = (t) => t, wt = Ve.trustedTypes, Pr = wt ? wt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Mr = "$lit$", W = `lit$${Math.random().toFixed(9).slice(2)}$`, Nr = "?" + W, cs = `<${Nr}>`, he = document, Je = () => he.createComment(""), Ke = (t) => t === null || typeof t != "object" && typeof t != "function", ar = Array.isArray, ps = (t) => ar(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Jt = `[ 	
\f\r]`, qe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Or = /-->/g, Ar = />/g, oe = RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), zr = /'/g, kr = /"/g, Ur = /^(?:script|style|textarea|title)$/i, ds = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), h = ds(1), x = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), Sr = /* @__PURE__ */ new WeakMap(), ne = he.createTreeWalker(he, 129);
function Rr(t, e) {
  if (!ar(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pr !== void 0 ? Pr.createHTML(e) : e;
}
const bs = (t, e) => {
  const s = t.length - 1, a = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = qe;
  for (let p = 0; p < s; p++) {
    const d = t[p];
    let g, m, v = -1, y = 0;
    for (; y < d.length && (i.lastIndex = y, m = i.exec(d), m !== null); ) y = i.lastIndex, i === qe ? m[1] === "!--" ? i = Or : m[1] !== void 0 ? i = Ar : m[2] !== void 0 ? (Ur.test(m[2]) && (r = RegExp("</" + m[2], "g")), i = oe) : m[3] !== void 0 && (i = oe) : i === oe ? m[0] === ">" ? (i = r ?? qe, v = -1) : m[1] === void 0 ? v = -2 : (v = i.lastIndex - m[2].length, g = m[1], i = m[3] === void 0 ? oe : m[3] === '"' ? kr : zr) : i === kr || i === zr ? i = oe : i === Or || i === Ar ? i = qe : (i = oe, r = void 0);
    const f = i === oe && t[p + 1].startsWith("/>") ? " " : "";
    o += i === qe ? d + cs : v >= 0 ? (a.push(g), d.slice(0, v) + Mr + d.slice(v) + W + f) : d + W + (v === -2 ? p : f);
  }
  return [Rr(t, o + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Xe {
  constructor({ strings: e, _$litType$: s }, a) {
    let r;
    this.parts = [];
    let o = 0, i = 0;
    const p = e.length - 1, d = this.parts, [g, m] = bs(e, s);
    if (this.el = Xe.createElement(g, a), ne.currentNode = this.el.content, s === 2 || s === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (r = ne.nextNode()) !== null && d.length < p; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const v of r.getAttributeNames()) if (v.endsWith(Mr)) {
          const y = m[i++], f = r.getAttribute(v).split(W), _ = /([.?@])?(.*)/.exec(y);
          d.push({ type: 1, index: o, name: _[2], strings: f, ctor: _[1] === "." ? vs : _[1] === "?" ? gs : _[1] === "@" ? fs : jt }), r.removeAttribute(v);
        } else v.startsWith(W) && (d.push({ type: 6, index: o }), r.removeAttribute(v));
        if (Ur.test(r.tagName)) {
          const v = r.textContent.split(W), y = v.length - 1;
          if (y > 0) {
            r.textContent = wt ? wt.emptyScript : "";
            for (let f = 0; f < y; f++) r.append(v[f], Je()), ne.nextNode(), d.push({ type: 2, index: ++o });
            r.append(v[y], Je());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Nr) d.push({ type: 2, index: o });
      else {
        let v = -1;
        for (; (v = r.data.indexOf(W, v + 1)) !== -1; ) d.push({ type: 7, index: o }), v += W.length - 1;
      }
      o++;
    }
  }
  static createElement(e, s) {
    const a = he.createElement("template");
    return a.innerHTML = e, a;
  }
}
function ye(t, e, s = t, a) {
  var i, p;
  if (e === x) return e;
  let r = a !== void 0 ? (i = s._$Co) == null ? void 0 : i[a] : s._$Cl;
  const o = Ke(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((p = r == null ? void 0 : r._$AO) == null || p.call(r, !1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = r : s._$Cl = r), r !== void 0 && (e = ye(t, r._$AS(t, e.values), r, a)), e;
}
class us {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: a } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? he).importNode(s, !0);
    ne.currentNode = r;
    let o = ne.nextNode(), i = 0, p = 0, d = a[0];
    for (; d !== void 0; ) {
      if (i === d.index) {
        let g;
        d.type === 2 ? g = new Ee(o, o.nextSibling, this, e) : d.type === 1 ? g = new d.ctor(o, d.name, d.strings, this, e) : d.type === 6 && (g = new ms(o, this, e)), this._$AV.push(g), d = a[++p];
      }
      i !== (d == null ? void 0 : d.index) && (o = ne.nextNode(), i++);
    }
    return ne.currentNode = he, r;
  }
  p(e) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, s), s += a.strings.length - 2) : a._$AI(e[s])), s++;
  }
}
class Ee {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, s, a, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = a, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = ye(this, e, s), Ke(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ps(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && Ke(this._$AH) ? this._$AA.nextSibling.data = e : this.T(he.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: s, _$litType$: a } = e, r = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Xe.createElement(Rr(a.h, a.h[0]), this.options)), a);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(s);
    else {
      const i = new us(r, this), p = i.u(this.options);
      i.p(s), this.T(p), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = Sr.get(e.strings);
    return s === void 0 && Sr.set(e.strings, s = new Xe(e)), s;
  }
  k(e) {
    ar(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, r = 0;
    for (const o of e) r === s.length ? s.push(a = new Ee(this.O(Je()), this.O(Je()), this, this.options)) : a = s[r], a._$AI(o), r++;
    r < s.length && (this._$AR(a && a._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const r = Cr(e).nextSibling;
      Cr(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class jt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = o, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = c;
  }
  _$AI(e, s = this, a, r) {
    const o = this.strings;
    let i = !1;
    if (o === void 0) e = ye(this, e, s, 0), i = !Ke(e) || e !== this._$AH && e !== x, i && (this._$AH = e);
    else {
      const p = e;
      let d, g;
      for (e = o[0], d = 0; d < o.length - 1; d++) g = ye(this, p[a + d], s, d), g === x && (g = this._$AH[d]), i || (i = !Ke(g) || g !== this._$AH[d]), g === c ? e = c : e !== c && (e += (g ?? "") + o[d + 1]), this._$AH[d] = g;
    }
    i && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class vs extends jt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class gs extends jt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class fs extends jt {
  constructor(e, s, a, r, o) {
    super(e, s, a, r, o), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ye(this, e, s, 0) ?? c) === x) return;
    const a = this._$AH, r = e === c && a !== c || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, o = e !== c && (a === c || r);
    r && this.element.removeEventListener(this.name, this, a), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ms {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ye(this, e);
  }
}
const ys = { I: Ee }, Kt = Ve.litHtmlPolyfillSupport;
Kt == null || Kt(Xe, Ee), (Ve.litHtmlVersions ?? (Ve.litHtmlVersions = [])).push("3.3.2");
const _s = (t, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let r = a._$litPart$;
  if (r === void 0) {
    const o = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = r = new Ee(e.insertBefore(Je(), o), o, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis;
let We = class extends me {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const e = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = e.firstChild), e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = _s(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return x;
  }
};
var Tr;
We._$litElement$ = !0, We.finalized = !0, (Tr = le.litElementHydrateSupport) == null || Tr.call(le, { LitElement: We });
const Xt = le.litElementPolyfillSupport;
Xt == null || Xt({ LitElement: We });
(le.litElementVersions ?? (le.litElementVersions = [])).push("4.2.2");
const mr = class mr extends We {
};
mr.styles = b`
    :host {
      box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }

    :host([hidden]) {
      display: none !important;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
let l = mr;
const xs = {
  A: [2, 5, 7, 5, 5],
  B: [6, 5, 6, 5, 6],
  C: [3, 4, 4, 4, 3],
  D: [6, 5, 5, 5, 6],
  E: [7, 4, 6, 4, 7],
  F: [7, 4, 6, 4, 4],
  G: [3, 4, 5, 5, 3],
  H: [5, 5, 7, 5, 5],
  I: [7, 2, 2, 2, 7],
  J: [1, 1, 1, 5, 2],
  K: [5, 5, 6, 5, 5],
  L: [4, 4, 4, 4, 7],
  M: [5, 7, 5, 5, 5],
  N: [5, 7, 7, 5, 5],
  O: [2, 5, 5, 5, 2],
  P: [6, 5, 6, 4, 4],
  Q: [2, 5, 5, 7, 3],
  R: [6, 5, 6, 5, 5],
  S: [3, 4, 2, 1, 6],
  T: [7, 2, 2, 2, 2],
  U: [5, 5, 5, 5, 2],
  V: [5, 5, 5, 2, 2],
  W: [5, 5, 5, 7, 5],
  X: [5, 5, 2, 5, 5],
  Y: [5, 5, 2, 2, 2],
  Z: [7, 1, 2, 4, 7],
  0: [7, 5, 5, 5, 7],
  1: [2, 6, 2, 2, 7],
  2: [6, 1, 2, 4, 7],
  3: [6, 1, 2, 1, 6],
  4: [5, 5, 7, 1, 1],
  5: [7, 4, 6, 1, 6],
  6: [3, 4, 7, 5, 7],
  7: [7, 1, 2, 2, 2],
  8: [7, 5, 2, 5, 7],
  9: [7, 5, 7, 1, 6],
  " ": [0, 0, 0, 0, 0],
  ":": [0, 2, 0, 2, 0],
  ".": [0, 0, 0, 0, 2],
  "%": [5, 1, 2, 4, 5],
  "/": [1, 1, 2, 4, 4],
  "-": [0, 0, 7, 0, 0],
  "!": [2, 2, 2, 0, 2],
  "+": [0, 2, 7, 2, 0]
};
function ws(t, e, s, a = 1) {
  const r = new Uint8Array(e * s), o = t.toUpperCase(), i = 5, p = 3, d = 1, g = Math.max(0, Math.floor((s - i) / 2));
  let m = 0;
  for (const v of o) {
    const y = xs[v];
    if (y) {
      for (let f = 0; f < i; f++) {
        const _ = y[f];
        for (let O = 0; O < p; O++)
          if (_ >> p - 1 - O & 1) {
            const Re = m + O, yr = g + f;
            Re < e && yr < s && (r[yr * e + Re] = a);
          }
      }
      if (m += p + d, m >= e) break;
    }
  }
  return r;
}
function $s(t, e, s, a = 1) {
  const r = new Uint8Array(e * s);
  if (t.length === 0 || s === 0 || e === 0) return r;
  const o = Math.max(...t), i = o > 0 ? t.map((m) => m / o) : t.map(() => 0), p = Math.max(0, i.length - e), d = i.slice(p), g = e - d.length;
  for (let m = 0; m < d.length; m++) {
    if (d[m] === 0) continue;
    const v = Math.round(d[m] * (s - 1));
    for (let y = 0; y <= v; y++) {
      const f = s - 1 - y;
      r[f * e + (g + m)] = a;
    }
  }
  return r;
}
function Cs(t, e, s, a = 1) {
  const r = new Uint8Array(e * s);
  if (s === 0 || e === 0) return r;
  const o = Math.max(0, Math.min(100, t)), i = Math.round(o / 100 * e), p = Math.floor(s / 2);
  for (let d = 0; d < i; d++)
    r[p * e + d] = a;
  return r;
}
function di(t, ...e) {
  const s = new Uint8Array(t);
  for (const a of e) {
    const r = Math.min(s.length, a.length);
    for (let o = 0; o < r; o++)
      a[o] !== 0 && (s[o] = a[o]);
  }
  return s;
}
const Ps = {
  primary: "bh-t-primary",
  success: "bh-t-success",
  warning: "bh-t-warning",
  danger: "bh-t-danger",
  text: "bh-t-text",
  bright: "bh-t-bright",
  muted: "bh-t-muted",
  tertiary: "bh-t-tertiary",
  bold: "bh-t-bold"
};
function Os(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function As(t) {
  return t.replace(/\{(\/?[a-zA-Z]*)\}/g, (e, s) => {
    if (s === "/")
      return "</span>";
    const a = Ps[s];
    return a ? `<span class="${a}">` : `{${s}}`;
  });
}
const zs = /https?:\/\/[^\s<>"']+/g;
function ks(t) {
  return t.replace(zs, (e) => `<a href="${e}" target="_blank" rel="noopener noreferrer" part="link">${e}</a>`);
}
function Le(t) {
  const e = Os(t), s = As(e);
  return ks(s);
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Ss = class extends Event {
  constructor(e, s, a, r) {
    super("context-request", { bubbles: !0, composed: !0 }), this.context = e, this.contextTarget = s, this.callback = a, this.subscribe = r ?? !1;
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Er = class {
  constructor(e, s, a, r) {
    if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (o, i) => {
      this.unsubscribe && (this.unsubscribe !== i && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = o, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(o, i)), this.unsubscribe = i;
    }, this.host = e, s.context !== void 0) {
      const o = s;
      this.context = o.context, this.callback = o.callback, this.subscribe = o.subscribe ?? !1;
    } else this.context = s, this.callback = a, this.subscribe = r ?? !1;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new Ss(this.context, this.host, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Es({ context: t, subscribe: e }) {
  return (s, a) => {
    typeof a == "object" ? a.addInitializer((function() {
      new Er(this, { context: t, callback: (r) => {
        s.set.call(this, r);
      }, subscribe: e });
    })) : s.constructor.addInitializer(((r) => {
      new Er(r, { context: t, callback: (o) => {
        r[a] = o;
      }, subscribe: e });
    }));
  };
}
const Ds = "bh-terminal-handler";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bs = { attribute: !0, type: String, converter: xt, reflect: !1, hasChanged: sr }, js = (t = Bs, e, s) => {
  const { kind: a, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(s.name, t), a === "accessor") {
    const { name: i } = s;
    return { set(p) {
      const d = e.get.call(this);
      e.set.call(this, p), this.requestUpdate(i, d, t, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(i, void 0, t, p), p;
    } };
  }
  if (a === "setter") {
    const { name: i } = s;
    return function(p) {
      const d = this[i];
      e.call(this, p), this.requestUpdate(i, d, t, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function n(t) {
  return (e, s) => typeof s == "object" ? js(t, e, s) : ((a, r, o) => {
    const i = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, a), i ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(t) {
  return n({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Is = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function It(t, e) {
  return (s, a, r) => {
    const o = (i) => {
      var p;
      return ((p = i.renderRoot) == null ? void 0 : p.querySelector(t)) ?? null;
    };
    return Is(s, a, { get() {
      return o(this);
    } });
  };
}
var Ts = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, De = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Hs(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ts(e, s, r), r;
};
let J = class extends l {
  constructor() {
    super(...arguments), this.size = "md", this.src = "", this.alt = "", this.initials = "", this._imgFailed = !1;
  }
  render() {
    return this.src && !this._imgFailed ? h`
        <img
          part="image"
          src=${this.src}
          alt=${this.alt || c}
          @error=${this._onImgError}
        />
      ` : this.initials ? h`
        <span class="initials" part="initials" aria-label=${this.alt || c}>
          ${this.initials.slice(0, 2)}
        </span>
      ` : h`
      <svg viewBox="0 0 24 24" aria-label=${this.alt || "User"}>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    `;
  }
  _onImgError() {
    this._imgFailed = !0;
  }
};
J.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--bh-radius-full);
        overflow: hidden;
        background: var(--bh-avatar-bg, var(--bh-color-secondary));
        color: var(--bh-avatar-color, var(--bh-color-secondary-text));
        font-family: var(--bh-font-sans);
        font-weight: var(--bh-font-semibold);
        flex-shrink: 0;
      }

      :host([size='sm']) {
        width: var(--bh-avatar-size, 2rem);
        height: var(--bh-avatar-size, 2rem);
        font-size: var(--bh-text-xs);
      }

      :host,
      :host([size='md']) {
        width: var(--bh-avatar-size, 2.5rem);
        height: var(--bh-avatar-size, 2.5rem);
        font-size: var(--bh-text-sm);
      }

      :host([size='lg']) {
        width: var(--bh-avatar-size, 3rem);
        height: var(--bh-avatar-size, 3rem);
        font-size: var(--bh-text-base);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .initials {
        line-height: var(--bh-leading-none);
        text-transform: uppercase;
        user-select: none;
      }

      svg {
        width: 60%;
        height: 60%;
        fill: currentColor;
      }
    `
];
De([
  n({ reflect: !0 })
], J.prototype, "size", 2);
De([
  n()
], J.prototype, "src", 2);
De([
  n()
], J.prototype, "alt", 2);
De([
  n()
], J.prototype, "initials", 2);
De([
  C()
], J.prototype, "_imgFailed", 2);
J = De([
  u("bh-avatar")
], J);
var Ms = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, or = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ns(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ms(e, s, r), r;
};
let Qe = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.size = "md";
  }
  render() {
    return h`<span part="badge"><slot></slot></span>`;
  }
};
Qe.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
      }

      span {
        display: inline-flex;
        align-items: center;
        font-family: var(--bh-font-sans);
        font-weight: var(--bh-font-medium);
        line-height: var(--bh-leading-none);
        border-radius: var(--bh-radius-full);
        white-space: nowrap;
        background: var(--bh-badge-bg);
        color: var(--bh-badge-color);
      }

      /* Sizes */
      :host([size='sm']) span {
        font-size: var(--bh-text-xs);
        padding: var(--bh-spacing-0-5) var(--bh-spacing-2);
      }

      span,
      :host([size='md']) span {
        font-size: var(--bh-text-sm);
        padding: var(--bh-spacing-1) var(--bh-spacing-2-5);
      }

      /* Default */
      span,
      :host([variant='default']) span {
        --bh-badge-bg: var(--bh-color-secondary);
        --bh-badge-color: var(--bh-color-secondary-text);
      }

      /* Primary */
      :host([variant='primary']) span {
        --bh-badge-bg: var(--bh-color-primary);
        --bh-badge-color: var(--bh-color-primary-text);
      }

      /* Success */
      :host([variant='success']) span {
        --bh-badge-bg: var(--bh-color-success);
        --bh-badge-color: var(--bh-color-text-inverse);
      }

      /* Warning */
      :host([variant='warning']) span {
        --bh-badge-bg: var(--bh-color-warning);
        --bh-badge-color: var(--bh-color-text);
      }

      /* Danger */
      :host([variant='danger']) span {
        --bh-badge-bg: var(--bh-color-danger);
        --bh-badge-color: var(--bh-color-danger-text);
      }
    `
];
or([
  n({ reflect: !0 })
], Qe.prototype, "variant", 2);
or([
  n({ reflect: !0 })
], Qe.prototype, "size", 2);
Qe = or([
  u("bh-badge")
], Qe);
var Us = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, ve = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Rs(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Us(e, s, r), r;
};
let q = class extends l {
  constructor() {
    super(...arguments), this.variant = "primary", this.size = "md", this.disabled = !1, this.iconOnly = !1, this.label = "", this.type = "button";
  }
  render() {
    return h`
      <button
        part="button"
        type=${this.type}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? "true" : c}
        aria-label=${this.label || c}
        @click=${this._handleClick}
      >
        <slot name="prefix"></slot>
        <span class="label"><slot>${this.label}</slot></span>
        <slot name="suffix"></slot>
      </button>
    `;
  }
  _handleClick(t) {
    if (this.disabled) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: t }
      })
    );
  }
};
q.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--bh-spacing-2);
        border: var(--bh-border-1) solid transparent;
        cursor: pointer;
        font-family: var(--bh-font-sans);
        font-weight: var(--bh-font-medium);
        line-height: var(--bh-leading-none);
        text-decoration: none;
        transition: all var(--bh-transition-fast);
        border-radius: var(--bh-button-radius, var(--bh-radius-md));
        background: var(--bh-button-bg);
        color: var(--bh-button-color);
        border-color: var(--bh-button-border, transparent);
      }

      /* Sizes */
      :host([size='sm']) button {
        font-size: var(--bh-text-sm);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
      }

      button,
      :host([size='md']) button {
        font-size: var(--bh-text-base);
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
      }

      :host([size='lg']) button {
        font-size: var(--bh-text-lg);
        padding: var(--bh-spacing-2-5) var(--bh-spacing-6);
      }

      /* Primary */
      :host([variant='primary']) button,
      button {
        --bh-button-bg: var(--bh-color-primary);
        --bh-button-color: var(--bh-color-primary-text);
      }

      :host([variant='primary']) button:hover:not(:disabled),
      button:hover:not(:disabled) {
        --bh-button-bg: var(--bh-color-primary-hover);
        transform: translateY(-1px);
      }

      :host([variant='primary']) button:active:not(:disabled),
      button:active:not(:disabled) {
        --bh-button-bg: var(--bh-color-primary-active);
        transform: translateY(0);
      }

      /* Secondary */
      :host([variant='secondary']) button {
        --bh-button-bg: var(--bh-color-secondary);
        --bh-button-color: var(--bh-color-secondary-text);
      }

      :host([variant='secondary']) button:hover:not(:disabled) {
        --bh-button-bg: var(--bh-color-secondary-hover);
        transform: translateY(-1px);
      }

      :host([variant='secondary']) button:active:not(:disabled) {
        --bh-button-bg: var(--bh-color-secondary-active);
        transform: translateY(0);
      }

      /* Ghost */
      :host([variant='ghost']) button {
        --bh-button-bg: transparent;
        --bh-button-color: var(--bh-color-text);
      }

      :host([variant='ghost']) button:hover:not(:disabled) {
        --bh-button-bg: var(--bh-color-secondary);
        transform: translateY(-1px);
      }

      :host([variant='ghost']) button:active:not(:disabled) {
        --bh-button-bg: var(--bh-color-secondary-hover);
        transform: translateY(0);
      }

      /* Danger */
      :host([variant='danger']) button {
        --bh-button-bg: var(--bh-color-danger);
        --bh-button-color: var(--bh-color-danger-text);
      }

      :host([variant='danger']) button:hover:not(:disabled) {
        --bh-button-bg: var(--bh-color-danger-hover);
        transform: translateY(-1px);
      }

      :host([variant='danger']) button:active:not(:disabled) {
        --bh-button-bg: var(--bh-color-danger-active);
        transform: translateY(0);
      }

      /* Focus */
      button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
      }

      /* Icon-only */
      :host([icon-only]) button {
        gap: 0;
      }

      :host([icon-only][size='sm']) button {
        padding: var(--bh-spacing-1-5);
      }

      :host([icon-only]) button,
      :host([icon-only][size='md']) button {
        padding: var(--bh-spacing-2);
      }

      :host([icon-only][size='lg']) button {
        padding: var(--bh-spacing-2-5);
      }

      :host([icon-only]) .label {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      /* Disabled */
      :host([disabled]) button {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
        transform: none;
      }
    `
];
ve([
  n({ reflect: !0 })
], q.prototype, "variant", 2);
ve([
  n({ reflect: !0 })
], q.prototype, "size", 2);
ve([
  n({ type: Boolean, reflect: !0 })
], q.prototype, "disabled", 2);
ve([
  n({ type: Boolean, reflect: !0, attribute: "icon-only" })
], q.prototype, "iconOnly", 2);
ve([
  n()
], q.prototype, "label", 2);
ve([
  n()
], q.prototype, "type", 2);
q = ve([
  u("bh-button")
], q);
var qs = Object.defineProperty, Ls = Object.getOwnPropertyDescriptor, ge = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ls(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && qs(e, s, r), r;
};
let L = class extends l {
  constructor() {
    super(...arguments), this.checked = !1, this.indeterminate = !1, this.disabled = !1, this.value = "", this.name = "", this.label = "";
  }
  render() {
    const t = this.indeterminate ? h`<svg viewBox="0 0 16 16"><path d="M3 8h10" stroke-linecap="round"/></svg>` : h`<svg viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return h`
      <label>
        <input
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          name=${this.name || c}
          value=${this.value || c}
          aria-label=${this.label || c}
          @change=${this._handleChange}
        />
        <span class="checkbox" part="checkbox">${t}</span>
        <span class="label" part="label"><slot>${this.label}</slot></span>
      </label>
    `;
  }
  _handleChange(t) {
    const e = t.target;
    this.checked = e.checked, this.indeterminate = !1, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { checked: this.checked }
      })
    );
  }
};
L.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        cursor: pointer;
      }

      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--bh-checkbox-size, 1.25rem);
        height: var(--bh-checkbox-size, 1.25rem);
        border: var(--bh-border-2) solid var(--bh-color-border);
        border-radius: var(--bh-checkbox-radius, var(--bh-radius-sm));
        background: var(--bh-color-surface-raised);
        transition: background var(--bh-transition-fast),
                    border-color var(--bh-transition-fast);
        flex-shrink: 0;
      }

      .checkbox svg {
        width: 0.75rem;
        height: 0.75rem;
        stroke: var(--bh-color-primary-text);
        stroke-width: 3;
        fill: none;
        opacity: 0;
        transition: opacity var(--bh-transition-fast);
      }

      /* Checked */
      :host([checked]) .checkbox {
        background: var(--bh-color-primary);
        border-color: var(--bh-color-primary);
      }

      :host([checked]) .checkbox svg {
        opacity: 1;
      }

      /* Indeterminate */
      :host([indeterminate]) .checkbox {
        background: var(--bh-color-primary);
        border-color: var(--bh-color-primary);
      }

      :host([indeterminate]) .checkbox svg {
        opacity: 1;
      }

      /* Focus */
      input:focus-visible ~ .checkbox {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
      }

      /* Label */
      .label {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-base);
        line-height: var(--bh-leading-normal);
        color: var(--bh-color-text);
        user-select: none;
      }
    `
];
ge([
  n({ type: Boolean, reflect: !0 })
], L.prototype, "checked", 2);
ge([
  n({ type: Boolean, reflect: !0 })
], L.prototype, "indeterminate", 2);
ge([
  n({ type: Boolean, reflect: !0 })
], L.prototype, "disabled", 2);
ge([
  n()
], L.prototype, "value", 2);
ge([
  n()
], L.prototype, "name", 2);
ge([
  n()
], L.prototype, "label", 2);
L = ge([
  u("bh-checkbox")
], L);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Be = (t) => (...e) => ({ _$litDirective$: t, values: e });
let dt = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, s, a) {
    this._$Ct = e, this._$AM = s, this._$Ci = a;
  }
  _$AS(e, s) {
    return this.update(e, s);
  }
  update(e, s) {
    return this.render(...s);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let $t = class extends dt {
  constructor(e) {
    if (super(e), this.it = c, e.type !== H.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(e) {
    if (e === c || e == null) return this._t = void 0, this.it = e;
    if (e === x) return e;
    if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (e === this.it) return this._t;
    this.it = e;
    const s = [e];
    return s.raw = s, this._t = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
};
$t.directiveName = "unsafeHTML", $t.resultType = 1;
const Gs = Be($t);
var Fs = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, F = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Vs(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Fs(e, s, r), r;
};
let B = class extends l {
  constructor() {
    super(...arguments), this.language = "text", this.filename = "", this.lineNumbers = !1, this.copyButton = !1, this.code = "", this.header = !1, this._copied = !1, this._slotCode = "";
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), !this.code && ((t = this.textContent) != null && t.trim()) && (this._slotCode = this.textContent, this.textContent = "");
  }
  _handleSlotChange(t) {
    const a = t.target.assignedNodes({ flatten: !0 }).map((r) => r.textContent).join("");
    a && (this._slotCode = a);
  }
  get _code() {
    return this.code || this._slotCode;
  }
  get _lines() {
    return this._code.replace(/^\n/, "").replace(/\n$/, "").split(`
`);
  }
  async _copy() {
    try {
      await navigator.clipboard.writeText(this._code.trim()), this._copied = !0, setTimeout(() => {
        this._copied = !1;
      }, 2e3);
    } catch {
    }
  }
  // All highlight methods produce HTML from our own escaped code strings.
  // Input is always self-generated (escaped via _esc), never raw user HTML.
  _highlight(t) {
    const e = this.language;
    return e === "text" ? this._esc(t) : e === "bash" || e === "shell" ? this._highlightBash(t) : e === "python" ? this._highlightPython(t) : e === "javascript" || e === "typescript" ? this._highlightJS(t) : e === "yaml" ? this._highlightYaml(t) : e === "json" ? this._highlightJson(t) : e === "html" ? this._highlightHtml(t) : e === "css" ? this._highlightCss(t) : this._esc(t);
  }
  _esc(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  _highlightBash(t) {
    let e = !1;
    return t.split(`
`).map((s) => {
      if (/^\s*\$\s/.test(s)) {
        const a = s.match(/^(\s*\$\s)/)[1], r = s.slice(a.length);
        return e = r.trimEnd().endsWith("\\"), `<span class="tok-prompt">${this._esc(a)}</span>${this._highlightBashLine(r)}`;
      }
      return e ? (e = s.trimEnd().endsWith("\\"), this._highlightBashLine(s)) : /^\s*✓/.test(s) ? `<span class="tok-success">${this._esc(s)}</span>` : this._esc(s);
    }).join(`
`);
  }
  _highlightBashLine(t) {
    return this._esc(t).replace(/(^|\s)(--?\w[\w-]*)/g, '$1<span class="tok-kw">$2</span>').replace(/(&quot;[^&]*&quot;|'[^']*')/g, '<span class="tok-str">$1</span>').replace(/(#.*)$/, '<span class="tok-cmt">$1</span>');
  }
  _highlightPython(t) {
    const e = "def|class|import|from|return|if|elif|else|for|while|try|except|with|as|yield|raise|pass|break|continue|and|or|not|in|is|None|True|False|self|async|await";
    return this._esc(t).replace(/(#.*)$/gm, '<span class="tok-cmt">$1</span>').replace(/(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;|&quot;[^&\n]*&quot;|'[^'\n]*')/g, '<span class="tok-str">$1</span>').replace(new RegExp(`\\b(${e})\\b`, "g"), '<span class="tok-kw">$1</span>').replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>').replace(/\b(\w+)(\s*\()/g, '<span class="tok-fn">$1</span>$2');
  }
  _highlightJS(t) {
    const e = "const|let|var|function|class|return|if|else|for|while|switch|case|break|continue|new|this|import|export|from|default|async|await|try|catch|throw|typeof|instanceof|null|undefined|true|false|void";
    return this._esc(t).replace(/(\/\/.*)$/gm, '<span class="tok-cmt">$1</span>').replace(/(`[^`]*`|&quot;[^&\n]*&quot;|'[^'\n]*')/g, '<span class="tok-str">$1</span>').replace(new RegExp(`\\b(${e})\\b`, "g"), '<span class="tok-kw">$1</span>').replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>').replace(/\b(\w+)(\s*\()/g, '<span class="tok-fn">$1</span>$2');
  }
  _highlightYaml(t) {
    return this._esc(t).replace(/(#.*)$/gm, '<span class="tok-cmt">$1</span>').replace(/^(\s*)([\w][\w.-]*)(\s*:)/gm, '$1<span class="tok-kw">$2</span><span class="tok-op">$3</span>').replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>').replace(/\b(true|false|null|yes|no)\b/gi, '<span class="tok-num">$1</span>');
  }
  _highlightJson(t) {
    return this._esc(t).replace(/(&quot;)([\w.-]+)(&quot;)(\s*:)/g, '$1<span class="tok-kw">$2</span>$3<span class="tok-op">$4</span>').replace(/(&quot;)(.*?)(&quot;)/g, '<span class="tok-str">$1$2$3</span>').replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>').replace(/\b(true|false|null)\b/g, '<span class="tok-num">$1</span>');
  }
  _highlightHtml(t) {
    return this._esc(t).replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-cmt">$1</span>').replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-kw">$2</span>').replace(/\b([\w-]+)(=)/g, '<span class="tok-fn">$1</span><span class="tok-op">$2</span>').replace(/(&quot;[^&]*?&quot;)/g, '<span class="tok-str">$1</span>');
  }
  _highlightCss(t) {
    return this._esc(t).replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>').replace(/^(\s*)([\w-]+)(\s*:)/gm, '$1<span class="tok-fn">$2</span><span class="tok-op">$3</span>').replace(/^(\s*)(.*?)(\s*\{)/gm, '$1<span class="tok-kw">$2</span>$3').replace(/(&quot;[^&]*?&quot;|'[^']*')/g, '<span class="tok-str">$1</span>').replace(/\b(\d+\.?\d*)(px|rem|em|%|vh|vw|s|ms)?\b/g, '<span class="tok-num">$1$2</span>');
  }
  _langLabel() {
    return {
      bash: "Bash",
      shell: "Shell",
      python: "Python",
      javascript: "JavaScript",
      typescript: "TypeScript",
      yaml: "YAML",
      json: "JSON",
      html: "HTML",
      css: "CSS",
      text: "Text"
    }[this.language] || this.language;
  }
  render() {
    const t = this._lines, e = this.header || this.filename, s = this._highlight(t.join(`
`)), a = this._copied ? h`<svg viewBox="0 0 16 16"><polyline points="4 8 7 11 12 5"/></svg>` : h`<svg viewBox="0 0 16 16"><rect x="5" y="5" width="8" height="8" rx="1"/><path d="M3 11V3h8"/></svg>`;
    return h`
      <div class="container" part="container">
        ${e ? h`
          <div class="header" part="header">
            <div class="header-left">
              <span class="lang-dot"></span>
              <span>${this.filename || this._langLabel()}</span>
            </div>
            ${this.copyButton ? h`
              <button class="copy-btn" part="copy" @click=${this._copy}>
                ${a}
                ${this._copied ? "Copied" : "Copy"}
              </button>
            ` : c}
          </div>
        ` : c}
        <div class="code-area">
          ${this.lineNumbers ? h`
            <div class="line-numbers" aria-hidden="true">
              ${t.map((r, o) => h`<span class="line-num" part="line-number">${o + 1}</span>`)}
            </div>
          ` : c}
          <pre part="pre"><code part="code">${!e && this.copyButton ? h`
              <button class="copy-btn inline-copy" part="copy" @click=${this._copy}>
                ${a}
                ${this._copied ? "Copied" : "Copy"}
              </button>
            ` : c}${Gs(s)}</code></pre>
        </div>
      </div>
      <div hidden><slot @slotchange=${this._handleSlotChange}></slot></div>
    `;
  }
};
B.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .container {
        border: 1px solid var(--bh-code-border, var(--bh-color-border));
        border-radius: var(--bh-radius-md);
        overflow: hidden;
      }

      /* Header */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
        background: var(--bh-code-header-bg, var(--bh-color-surface));
        border-bottom: 1px solid var(--bh-code-border, var(--bh-color-border));
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-xs);
        color: var(--bh-color-text-muted);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
      }

      .lang-dot {
        width: 8px;
        height: 8px;
        border-radius: var(--bh-radius-full);
        background: var(--bh-code-keyword, var(--bh-color-primary));
      }

      /* Copy button */
      .copy-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-1);
        padding: var(--bh-spacing-0-5) var(--bh-spacing-2);
        border: 1px solid var(--bh-code-border, var(--bh-color-border));
        border-radius: var(--bh-radius-sm);
        background: transparent;
        color: var(--bh-color-text-muted);
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-xs);
        cursor: pointer;
        transition: all var(--bh-transition-fast);
      }

      .copy-btn:hover {
        background: var(--bh-color-surface-recessed);
        color: var(--bh-color-text);
      }

      .copy-btn svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Code area */
      .code-area {
        display: flex;
        background: var(--bh-code-bg, var(--bh-color-surface-recessed));
        overflow-x: auto;
      }

      .line-numbers {
        padding: var(--bh-spacing-4) 0;
        text-align: right;
        user-select: none;
        border-right: 1px solid var(--bh-code-border, var(--bh-color-border));
        flex-shrink: 0;
      }

      .line-num {
        display: block;
        padding: 0 var(--bh-spacing-3);
        font-family: var(--bh-font-mono);
        font-size: var(--bh-code-font-size, var(--bh-text-sm));
        line-height: var(--bh-leading-relaxed);
        color: var(--bh-color-text-muted);
        opacity: 0.5;
      }

      pre {
        margin: 0;
        padding: var(--bh-spacing-4);
        flex: 1;
        overflow-x: auto;
      }

      code {
        display: block;
        font-family: var(--bh-font-mono);
        font-size: var(--bh-code-font-size, var(--bh-text-sm));
        line-height: var(--bh-leading-relaxed);
        color: var(--bh-color-text);
        white-space: pre;
        tab-size: 2;
      }

      /* Inline copy (no header) */
      .inline-copy {
        float: right;
        margin: calc(-1 * var(--bh-spacing-1)) 0 var(--bh-spacing-1) var(--bh-spacing-2);
      }

      /* Syntax token classes */
      .tok-kw { color: var(--bh-code-keyword, var(--bh-color-primary)); }
      .tok-str { color: var(--bh-code-string, #a5d6a7); }
      .tok-cmt { color: var(--bh-code-comment, #757575); font-style: italic; }
      .tok-num { color: var(--bh-code-number, #f8bd96); }
      .tok-fn { color: var(--bh-code-function, #82b1ff); }
      .tok-prompt { color: var(--bh-code-prompt, var(--bh-color-primary)); user-select: none; }
      .tok-success { color: var(--bh-code-success, var(--bh-color-success)); font-weight: var(--bh-font-bold); }
      .tok-op { color: var(--bh-color-text-muted); }
    `
];
F([
  n({ reflect: !0 })
], B.prototype, "language", 2);
F([
  n()
], B.prototype, "filename", 2);
F([
  n({ type: Boolean, reflect: !0, attribute: "line-numbers" })
], B.prototype, "lineNumbers", 2);
F([
  n({ type: Boolean, reflect: !0, attribute: "copy-button" })
], B.prototype, "copyButton", 2);
F([
  n()
], B.prototype, "code", 2);
F([
  n({ type: Boolean, reflect: !0 })
], B.prototype, "header", 2);
F([
  C()
], B.prototype, "_copied", 2);
F([
  C()
], B.prototype, "_slotCode", 2);
B = F([
  u("bh-code-block")
], B);
var Ws = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, Tt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ys(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ws(e, s, r), r;
};
let _e = class extends l {
  constructor() {
    super(...arguments), this.vertical = !1, this.spacing = "md", this.gradient = !1;
  }
  render() {
    return h`
      <hr part="divider" aria-hidden="true" />
      <div class="vertical" part="divider" aria-hidden="true"></div>
    `;
  }
};
_e.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      hr {
        border: none;
        height: 1px;
        background: var(--bh-divider-color, var(--bh-color-border-muted));
        box-shadow: var(--bh-divider-shadow, var(--bh-shadow-emboss));
        margin: 0;
      }

      /* Spacing */
      :host([spacing='sm']) {
        padding: var(--bh-spacing-2) 0;
      }

      :host,
      :host([spacing='md']) {
        padding: var(--bh-spacing-4) 0;
      }

      :host([spacing='lg']) {
        padding: var(--bh-spacing-8) 0;
      }

      /* Vertical */
      :host([vertical]) {
        display: inline-block;
        height: 100%;
        padding: 0;
      }

      :host([vertical]) hr {
        display: none;
      }

      .vertical {
        display: none;
        width: 1px;
        height: 100%;
        background: var(--bh-divider-color, var(--bh-color-border-muted));
        box-shadow: var(--bh-divider-shadow, var(--bh-shadow-emboss));
      }

      :host([vertical]) .vertical {
        display: block;
      }

      :host([vertical][spacing='sm']) {
        padding: 0 var(--bh-spacing-2);
      }

      :host([vertical][spacing='md']),
      :host([vertical]) {
        padding: 0 var(--bh-spacing-4);
      }

      :host([vertical][spacing='lg']) {
        padding: 0 var(--bh-spacing-8);
      }

      /* Gradient mode */
      :host([gradient]) hr {
        height: 2px;
        background: var(
          --bh-divider-gradient,
          linear-gradient(to right, var(--bh-color-primary), var(--bh-color-border-muted) 40%, transparent)
        );
        box-shadow: none;
      }

      :host([gradient][vertical]) .vertical {
        width: 2px;
        background: var(
          --bh-divider-gradient,
          linear-gradient(to bottom, var(--bh-color-primary), var(--bh-color-border-muted) 40%, transparent)
        );
        box-shadow: none;
      }
    `
];
Tt([
  n({ type: Boolean, reflect: !0 })
], _e.prototype, "vertical", 2);
Tt([
  n({ reflect: !0 })
], _e.prototype, "spacing", 2);
Tt([
  n({ type: Boolean, reflect: !0 })
], _e.prototype, "gradient", 2);
_e = Tt([
  u("bh-divider")
], _e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let er = class extends $t {
};
er.directiveName = "unsafeSVG", er.resultType = 2;
const Js = Be(er);
var Ks = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, Ht = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Xs(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ks(e, s, r), r;
};
const Qt = /* @__PURE__ */ new Map();
let w = class extends l {
  constructor() {
    super(...arguments), this.name = "", this.size = "md", this.label = "";
  }
  static register(t, e) {
    Qt.set(t, e);
  }
  static getIcon(t) {
    return Qt.get(t);
  }
  render() {
    const t = Qt.get(this.name), e = this.label ? c : "true", s = this.label ? "img" : c;
    return h`
      <svg
        part="svg"
        viewBox="0 0 24 24"
        aria-hidden=${e}
        role=${s}
        aria-label=${this.label || c}
      >
        ${t ? Js(t) : c}
      </svg>
    `;
  }
};
w.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--bh-icon-size, 1.25em);
        height: var(--bh-icon-size, 1.25em);
        color: inherit;
        flex-shrink: 0;
      }

      :host([size='sm']) {
        --bh-icon-size: 1rem;
      }

      :host([size='md']) {
        --bh-icon-size: 1.25rem;
      }

      :host([size='lg']) {
        --bh-icon-size: 1.5rem;
      }

      svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
];
Ht([
  n({ reflect: !0 })
], w.prototype, "name", 2);
Ht([
  n({ reflect: !0 })
], w.prototype, "size", 2);
Ht([
  n()
], w.prototype, "label", 2);
w = Ht([
  u("bh-icon")
], w);
w.register("x", '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');
w.register("check", '<path d="M20 6 9 17l-5-5"/>');
w.register("plus", '<path d="M5 12h14"/><path d="M12 5v14"/>');
w.register("minus", '<path d="M5 12h14"/>');
w.register("search", '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>');
w.register("chevron-down", '<path d="m6 9 6 6 6-6"/>');
w.register("chevron-up", '<path d="m18 15-6-6-6 6"/>');
w.register("chevron-left", '<path d="m15 18-6-6 6-6"/>');
w.register("chevron-right", '<path d="m9 18 6-6-6-6"/>');
w.register("menu", '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>');
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Qs } = ys, Dr = (t) => t, qr = (t) => t.strings === void 0, Br = () => document.createComment(""), Ge = (t, e, s) => {
  var o;
  const a = t._$AA.parentNode, r = e === void 0 ? t._$AB : e._$AA;
  if (s === void 0) {
    const i = a.insertBefore(Br(), r), p = a.insertBefore(Br(), r);
    s = new Qs(i, p, t, t.options);
  } else {
    const i = s._$AB.nextSibling, p = s._$AM, d = p !== t;
    if (d) {
      let g;
      (o = s._$AQ) == null || o.call(s, t), s._$AM = t, s._$AP !== void 0 && (g = t._$AU) !== p._$AU && s._$AP(g);
    }
    if (i !== r || d) {
      let g = s._$AA;
      for (; g !== i; ) {
        const m = Dr(g).nextSibling;
        Dr(a).insertBefore(g, r), g = m;
      }
    }
  }
  return s;
}, ie = (t, e, s = t) => (t._$AI(e, s), t), Zs = {}, Lr = (t, e = Zs) => t._$AH = e, ea = (t) => t._$AH, Zt = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gr = Be(class extends dt {
  constructor(t) {
    if (super(t), t.type !== H.PROPERTY && t.type !== H.ATTRIBUTE && t.type !== H.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!qr(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === x || e === c) return e;
    const s = t.element, a = t.name;
    if (t.type === H.PROPERTY) {
      if (e === s[a]) return x;
    } else if (t.type === H.BOOLEAN_ATTRIBUTE) {
      if (!!e === s.hasAttribute(a)) return x;
    } else if (t.type === H.ATTRIBUTE && s.getAttribute(a) === e + "") return x;
    return Lr(t), e;
  }
});
var ta = Object.defineProperty, ra = Object.getOwnPropertyDescriptor, I = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ra(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ta(e, s, r), r;
};
let k = class extends l {
  constructor() {
    super(...arguments), this.size = "md", this.type = "text", this.value = "", this.placeholder = "", this.name = "", this.label = "", this.disabled = !1, this.readonly = !1, this.required = !1, this.error = !1;
  }
  render() {
    return h`
      <div class="wrapper" part="wrapper">
        <span class="prefix"><slot name="prefix"></slot></span>
        <input
          part="input"
          type=${this.type}
          .value=${Gr(this.value)}
          placeholder=${this.placeholder || c}
          name=${this.name || c}
          aria-label=${this.label || c}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.error ? "true" : c}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        <span class="suffix"><slot name="suffix"></slot></span>
      </div>
    `;
  }
  _handleInput(t) {
    const e = t.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(t) {
    const e = t.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
};
k.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        background: var(--bh-input-bg, var(--bh-color-surface-raised));
        border: var(--bh-border-1) solid var(--bh-input-border, var(--bh-color-border));
        border-radius: var(--bh-input-radius, var(--bh-radius-md));
        box-shadow: var(--bh-shadow-inset);
        transition: all var(--bh-transition-fast);
      }

      input {
        flex: 1;
        min-width: 0;
        font-family: var(--bh-font-sans);
        line-height: var(--bh-leading-normal);
        color: var(--bh-input-color, var(--bh-color-text));
        background: transparent;
        border: none;
        outline: none;
      }

      input::placeholder {
        color: var(--bh-color-text-muted);
      }

      /* Slots */
      .prefix,
      .suffix {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        color: var(--bh-color-text-muted);
      }

      /* Sizes — wrapper padding */
      :host([size='sm']) .wrapper {
        font-size: var(--bh-text-sm);
        gap: var(--bh-spacing-1-5);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
      }

      .wrapper,
      :host([size='md']) .wrapper {
        font-size: var(--bh-text-base);
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
      }

      :host([size='lg']) .wrapper {
        font-size: var(--bh-text-lg);
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-2-5) var(--bh-spacing-6);
      }

      /* Sizes — input font inherits from wrapper */
      input {
        font-size: inherit;
      }

      /* Focus */
      .wrapper:focus-within {
        border-color: var(--bh-color-ring);
        box-shadow: 0 0 0 1px var(--bh-color-ring);
      }

      /* Error */
      :host([error]) .wrapper {
        border-color: var(--bh-color-danger);
      }

      :host([error]) .wrapper:focus-within {
        border-color: var(--bh-color-danger);
        box-shadow: 0 0 0 1px var(--bh-color-danger);
      }

      /* Disabled */
      :host([disabled]) .wrapper {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([disabled]) input {
        cursor: not-allowed;
      }

      /* Readonly */
      :host([readonly]) .wrapper {
        background: var(--bh-color-surface);
      }
    `
];
I([
  n({ reflect: !0 })
], k.prototype, "size", 2);
I([
  n()
], k.prototype, "type", 2);
I([
  n()
], k.prototype, "value", 2);
I([
  n()
], k.prototype, "placeholder", 2);
I([
  n()
], k.prototype, "name", 2);
I([
  n()
], k.prototype, "label", 2);
I([
  n({ type: Boolean, reflect: !0 })
], k.prototype, "disabled", 2);
I([
  n({ type: Boolean, reflect: !0 })
], k.prototype, "readonly", 2);
I([
  n({ type: Boolean, reflect: !0 })
], k.prototype, "required", 2);
I([
  n({ type: Boolean, reflect: !0 })
], k.prototype, "error", 2);
k = I([
  u("bh-input")
], k);
var sa = Object.defineProperty, aa = Object.getOwnPropertyDescriptor, bt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? aa(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && sa(e, s, r), r;
};
let ce = class extends l {
  constructor() {
    super(...arguments), this.color = "success", this.pulse = !1, this.size = "md", this.label = "";
  }
  render() {
    return h`
      <span
        part="led"
        role="status"
        aria-label=${this.label || c}
      ></span>
    `;
  }
};
ce.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      span {
        display: block;
        width: var(--bh-led-size, 8px);
        height: var(--bh-led-size, 8px);
        border-radius: var(--bh-radius-full);
        background: var(--bh-led-color);
        box-shadow: 0 0 6px var(--bh-led-glow);
      }

      /* Sizes */
      :host([size='sm']) span {
        --bh-led-size: 6px;
      }

      span,
      :host([size='md']) span {
        --bh-led-size: 8px;
      }

      /* Colors */
      span,
      :host([color='success']) span {
        --bh-led-color: var(--bh-color-success);
        --bh-led-glow: var(--bh-color-success-dim, rgba(42, 157, 78, 0.15));
      }

      :host([color='warning']) span {
        --bh-led-color: var(--bh-color-warning);
        --bh-led-glow: rgba(245, 158, 11, 0.25);
      }

      :host([color='danger']) span {
        --bh-led-color: var(--bh-color-danger);
        --bh-led-glow: rgba(220, 38, 38, 0.25);
      }

      :host([color='primary']) span {
        --bh-led-color: var(--bh-color-primary);
        --bh-led-glow: var(--bh-color-primary-glow, rgba(255, 107, 53, 0.12));
      }

      /* Pulse animation */
      :host([pulse]) span {
        animation: led-pulse 2s ease-in-out infinite;
      }

      @keyframes led-pulse {
        0%, 100% {
          opacity: 1;
          box-shadow: 0 0 6px var(--bh-led-glow);
        }
        50% {
          opacity: 0.6;
          box-shadow: 0 0 12px var(--bh-led-glow);
        }
      }
    `
];
bt([
  n({ reflect: !0 })
], ce.prototype, "color", 2);
bt([
  n({ type: Boolean, reflect: !0 })
], ce.prototype, "pulse", 2);
bt([
  n({ reflect: !0 })
], ce.prototype, "size", 2);
bt([
  n()
], ce.prototype, "label", 2);
ce = bt([
  u("bh-led")
], ce);
var oa = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, ut = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ia(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && oa(e, s, r), r;
};
let pe = class extends l {
  constructor() {
    super(...arguments), this.href = "", this.target = "", this.variant = "default", this.external = !1;
  }
  render() {
    const t = this.external ? "_blank" : this.target, e = this.external ? "noopener noreferrer" : void 0;
    return h`
      <a
        part="link"
        href=${this.href || c}
        target=${t || c}
        rel=${e || c}
        @click=${this._handleClick}
      >
        <slot></slot>${this.external ? h`<span class="external-icon"><svg viewBox="0 0 16 16"><path d="M6 3h7v7"/><path d="M13 3L6.5 9.5"/></svg></span>` : c}
      </a>
    `;
  }
  _handleClick(t) {
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: t }
      })
    );
  }
};
pe.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline;
      }

      a {
        color: var(--bh-link-color, var(--bh-color-link));
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        text-decoration: underline;
        text-decoration-color: transparent;
        text-underline-offset: 0.15em;
        transition: all var(--bh-transition-fast);
        cursor: pointer;
      }

      a:hover {
        color: var(--bh-color-link-hover);
        text-decoration-color: currentColor;
      }

      a:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
        border-radius: var(--bh-radius-sm);
      }

      /* Variants */
      :host([variant='muted']) a {
        --bh-link-color: var(--bh-color-link-subtle);
      }

      :host([variant='muted']) a:hover {
        color: var(--bh-color-link-subtle-hover);
      }

      :host([variant='accent']) a {
        --bh-link-color: var(--bh-color-primary);
        font-weight: var(--bh-font-medium);
      }

      /* External icon */
      .external-icon {
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        margin-left: 0.2em;
        vertical-align: baseline;
      }

      .external-icon svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
];
ut([
  n()
], pe.prototype, "href", 2);
ut([
  n()
], pe.prototype, "target", 2);
ut([
  n({ reflect: !0 })
], pe.prototype, "variant", 2);
ut([
  n({ type: Boolean })
], pe.prototype, "external", 2);
pe = ut([
  u("bh-link")
], pe);
var na = Object.defineProperty, la = Object.getOwnPropertyDescriptor, fe = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? la(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && na(e, s, r), r;
};
let G = class extends l {
  constructor() {
    super(...arguments), this.value = 0, this.max = 100, this.indeterminate = !1, this.size = "md", this.variant = "default", this.label = "Progress";
  }
  render() {
    const t = this.indeterminate ? void 0 : Math.min(100, Math.max(0, this.value / this.max * 100));
    return h`
      <div
        class="track"
        part="track"
        role="progressbar"
        aria-label=${this.label}
        aria-valuenow=${this.indeterminate ? "" : this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
      >
        <div
          class="bar"
          part="bar"
          style=${this.indeterminate ? "" : `width: ${t}%`}
        ></div>
      </div>
    `;
  }
};
G.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        width: 100%;
      }

      .track {
        width: 100%;
        border-radius: var(--bh-radius-full);
        background: var(--bh-progress-track, var(--bh-color-secondary));
        overflow: hidden;
      }

      :host([size='sm']) .track { height: 0.25rem; }
      .track, :host([size='md']) .track { height: 0.5rem; }
      :host([size='lg']) .track { height: 0.75rem; }

      .bar {
        height: 100%;
        border-radius: var(--bh-radius-full);
        background: var(--bh-progress-color, var(--bh-color-primary));
        transition: width var(--bh-transition-normal);
      }

      /* Variants */
      :host([variant='success']) .bar { --bh-progress-color: var(--bh-color-success); }
      :host([variant='warning']) .bar { --bh-progress-color: var(--bh-color-warning); }
      :host([variant='danger']) .bar { --bh-progress-color: var(--bh-color-danger); }

      /* Indeterminate */
      :host([indeterminate]) .bar {
        width: 40% !important;
        animation: indeterminate 1.5s var(--bh-ease-in-out) infinite;
      }

      @keyframes indeterminate {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }
    `
];
fe([
  n({ type: Number })
], G.prototype, "value", 2);
fe([
  n({ type: Number })
], G.prototype, "max", 2);
fe([
  n({ type: Boolean, reflect: !0 })
], G.prototype, "indeterminate", 2);
fe([
  n({ reflect: !0 })
], G.prototype, "size", 2);
fe([
  n({ reflect: !0 })
], G.prototype, "variant", 2);
fe([
  n()
], G.prototype, "label", 2);
G = fe([
  u("bh-progress")
], G);
var ha = Object.defineProperty, ca = Object.getOwnPropertyDescriptor, je = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ca(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ha(e, s, r), r;
};
let K = class extends l {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1, this.value = "", this.name = "", this.label = "";
  }
  render() {
    return h`
      <label>
        <input
          type="radio"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name || c}
          value=${this.value || c}
          aria-label=${this.label || c}
          @change=${this._handleChange}
        />
        <span class="radio" part="radio">
          <span class="dot"></span>
        </span>
        <span class="label" part="label"><slot>${this.label}</slot></span>
      </label>
    `;
  }
  _handleChange() {
    this.checked = !0, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { checked: !0, value: this.value }
      })
    );
  }
};
K.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        cursor: pointer;
      }

      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .radio {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--bh-radio-size, 1.25rem);
        height: var(--bh-radio-size, 1.25rem);
        border: var(--bh-border-2) solid var(--bh-color-border);
        border-radius: var(--bh-radius-full);
        background: var(--bh-color-surface-raised);
        transition: border-color var(--bh-transition-fast);
        flex-shrink: 0;
      }

      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: var(--bh-radius-full);
        background: var(--bh-color-primary-text);
        opacity: 0;
        transform: scale(0);
        transition: opacity var(--bh-transition-fast),
                    transform var(--bh-transition-fast);
      }

      /* Checked */
      :host([checked]) .radio {
        background: var(--bh-color-primary);
        border-color: var(--bh-color-primary);
      }

      :host([checked]) .dot {
        opacity: 1;
        transform: scale(1);
      }

      /* Focus */
      input:focus-visible ~ .radio {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
      }

      /* Label */
      .label {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-base);
        line-height: var(--bh-leading-normal);
        color: var(--bh-color-text);
        user-select: none;
      }
    `
];
je([
  n({ type: Boolean, reflect: !0 })
], K.prototype, "checked", 2);
je([
  n({ type: Boolean, reflect: !0 })
], K.prototype, "disabled", 2);
je([
  n()
], K.prototype, "value", 2);
je([
  n()
], K.prototype, "name", 2);
je([
  n()
], K.prototype, "label", 2);
K = je([
  u("bh-radio")
], K);
var pa = Object.defineProperty, da = Object.getOwnPropertyDescriptor, T = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? da(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && pa(e, s, r), r;
};
let S = class extends l {
  constructor() {
    super(...arguments), this.size = "md", this.value = "", this.name = "", this.label = "", this.placeholder = "", this.options = [], this.optionGroups = [], this.disabled = !1, this.required = !1, this.error = !1;
  }
  render() {
    return h`
      <div class="wrapper" part="wrapper">
        <span class="prefix"><slot name="prefix"></slot></span>
        <select
          part="select"
          name=${this.name || c}
          aria-label=${this.label || c}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? "true" : c}
          @change=${this._handleChange}
        >
          ${this.placeholder ? h`<option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>` : c}
          ${this.optionGroups.length > 0 ? this.optionGroups.map(
      (t) => h`
                  <optgroup label=${t.label}>
                    ${t.options.map(
        (e) => h`
                        <option
                          value=${e.value}
                          ?disabled=${e.disabled}
                          ?selected=${e.value === this.value}
                        >${e.label}</option>
                      `
      )}
                  </optgroup>
                `
    ) : this.options.map(
      (t) => h`
                  <option
                    value=${t.value}
                    ?disabled=${t.disabled}
                    ?selected=${t.value === this.value}
                  >${t.label}</option>
                `
    )}
        </select>
        <span class="chevron">
          <svg viewBox="0 0 16 16"><path d="M4 6l4 4 4-4"/></svg>
        </span>
      </div>
    `;
  }
  _handleChange(t) {
    const e = t.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
};
S.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        background: var(--bh-select-bg, var(--bh-color-surface-raised));
        border: var(--bh-border-1) solid var(--bh-select-border, var(--bh-color-border));
        border-radius: var(--bh-select-radius, var(--bh-radius-md));
        box-shadow: var(--bh-shadow-inset);
        transition: all var(--bh-transition-fast);
        cursor: pointer;
      }

      select {
        flex: 1;
        min-width: 0;
        font-family: var(--bh-font-sans);
        line-height: var(--bh-leading-normal);
        color: var(--bh-select-color, var(--bh-color-text));
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
      }

      /* Prefix slot */
      .prefix {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        color: var(--bh-color-text-muted);
      }

      /* Chevron indicator */
      .chevron {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        color: var(--bh-color-text-muted);
        pointer-events: none;
      }

      .chevron svg {
        width: 1em;
        height: 1em;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Sizes */
      :host([size='sm']) .wrapper {
        font-size: var(--bh-text-sm);
        gap: var(--bh-spacing-1-5);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
      }

      .wrapper,
      :host([size='md']) .wrapper {
        font-size: var(--bh-text-base);
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
      }

      :host([size='lg']) .wrapper {
        font-size: var(--bh-text-lg);
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-2-5) var(--bh-spacing-6);
      }

      select {
        font-size: inherit;
      }

      /* Focus */
      .wrapper:focus-within {
        border-color: var(--bh-color-ring);
        box-shadow: 0 0 0 1px var(--bh-color-ring);
      }

      /* Error */
      :host([error]) .wrapper {
        border-color: var(--bh-color-danger);
      }

      :host([error]) .wrapper:focus-within {
        border-color: var(--bh-color-danger);
        box-shadow: 0 0 0 1px var(--bh-color-danger);
      }

      /* Disabled */
      :host([disabled]) .wrapper {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([disabled]) select {
        cursor: not-allowed;
      }

      /* Placeholder styling */
      select:invalid {
        color: var(--bh-color-text-muted);
      }
    `
];
T([
  n({ reflect: !0 })
], S.prototype, "size", 2);
T([
  n()
], S.prototype, "value", 2);
T([
  n()
], S.prototype, "name", 2);
T([
  n()
], S.prototype, "label", 2);
T([
  n()
], S.prototype, "placeholder", 2);
T([
  n({ type: Array })
], S.prototype, "options", 2);
T([
  n({ type: Array, attribute: "option-groups" })
], S.prototype, "optionGroups", 2);
T([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "disabled", 2);
T([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "required", 2);
T([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "error", 2);
S = T([
  u("bh-select")
], S);
var ba = Object.defineProperty, ua = Object.getOwnPropertyDescriptor, Mt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ua(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ba(e, s, r), r;
};
let xe = class extends l {
  constructor() {
    super(...arguments), this.variant = "text", this.width = "", this.height = "";
  }
  render() {
    const t = [
      this.width ? `width: ${this.width}` : "",
      this.height ? `height: ${this.height}` : ""
    ].filter(Boolean).join("; ");
    return h`
      <div
        class="skeleton"
        part="skeleton"
        style=${t}
        aria-busy="true"
        aria-label="Loading"
      ></div>
    `;
  }
};
xe.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .skeleton {
        background: var(--bh-skeleton-color, var(--bh-color-secondary));
        animation: pulse 1.5s var(--bh-ease-in-out) infinite;
      }

      /* Text */
      :host([variant='text']) .skeleton,
      .skeleton {
        height: 1em;
        width: 100%;
        border-radius: var(--bh-radius-sm);
      }

      /* Circle */
      :host([variant='circle']) .skeleton {
        border-radius: var(--bh-radius-full);
      }

      /* Rect */
      :host([variant='rect']) .skeleton {
        border-radius: var(--bh-radius-md);
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `
];
Mt([
  n({ reflect: !0 })
], xe.prototype, "variant", 2);
Mt([
  n()
], xe.prototype, "width", 2);
Mt([
  n()
], xe.prototype, "height", 2);
xe = Mt([
  u("bh-skeleton")
], xe);
var va = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, ir = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ga(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && va(e, s, r), r;
};
let Ze = class extends l {
  constructor() {
    super(...arguments), this.size = "md", this.label = "Loading";
  }
  render() {
    return h`
      <svg
        part="spinner"
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label=${this.label || c}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    `;
  }
};
Ze.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      svg {
        animation: spin 0.75s linear infinite;
        color: currentColor;
      }

      :host([size='sm']) svg {
        width: 1rem;
        height: 1rem;
      }

      svg,
      :host([size='md']) svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      :host([size='lg']) svg {
        width: 1.5rem;
        height: 1.5rem;
      }

      circle {
        opacity: 0.25;
      }

      path {
        opacity: 0.75;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
];
ir([
  n({ reflect: !0 })
], Ze.prototype, "size", 2);
ir([
  n()
], Ze.prototype, "label", 2);
Ze = ir([
  u("bh-spinner")
], Ze);
var fa = Object.defineProperty, ma = Object.getOwnPropertyDescriptor, Nt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ma(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && fa(e, s, r), r;
};
let we = class extends l {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1, this.label = "";
  }
  render() {
    return h`
      <label>
        <input
          type="checkbox"
          role="switch"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          aria-checked=${this.checked ? "true" : "false"}
          aria-label=${this.label || c}
          @change=${this._handleChange}
        />
        <span class="track" part="track">
          <span class="thumb" part="thumb"></span>
        </span>
        <span class="label" part="label"><slot>${this.label}</slot></span>
      </label>
    `;
  }
  _handleChange(t) {
    const e = t.target;
    this.checked = e.checked, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { checked: this.checked }
      })
    );
  }
};
we.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        cursor: pointer;
      }

      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .track {
        position: relative;
        width: var(--bh-switch-width, 2.5rem);
        height: var(--bh-switch-height, 1.5rem);
        border-radius: var(--bh-radius-full);
        background: var(--bh-color-secondary);
        transition: all var(--bh-transition-fast);
        flex-shrink: 0;
      }

      .thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: calc(var(--bh-switch-height, 1.5rem) - 4px);
        height: calc(var(--bh-switch-height, 1.5rem) - 4px);
        border-radius: var(--bh-radius-full);
        background: var(--bh-color-white);
        box-shadow: var(--bh-shadow-sm);
        transition: all var(--bh-transition-fast);
      }

      /* Checked */
      :host([checked]) .track {
        background: var(--bh-color-primary);
      }

      :host([checked]) .thumb {
        transform: translateX(calc(var(--bh-switch-width, 2.5rem) - var(--bh-switch-height, 1.5rem)));
      }

      /* Focus */
      input:focus-visible ~ .track {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
      }

      /* Label */
      .label {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-base);
        line-height: var(--bh-leading-normal);
        color: var(--bh-color-text);
        user-select: none;
      }
    `
];
Nt([
  n({ type: Boolean, reflect: !0 })
], we.prototype, "checked", 2);
Nt([
  n({ type: Boolean, reflect: !0 })
], we.prototype, "disabled", 2);
Nt([
  n()
], we.prototype, "label", 2);
we = Nt([
  u("bh-switch")
], we);
var ya = Object.defineProperty, _a = Object.getOwnPropertyDescriptor, nr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? _a(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ya(e, s, r), r;
};
let et = class extends l {
  constructor() {
    super(...arguments), this.variant = "body", this.truncate = !1;
  }
  render() {
    const t = this.variant === "heading" ? "heading" : c, e = this.variant === "heading" ? "2" : c;
    return h`
      <span
        part="text"
        role=${t}
        aria-level=${e}
      >
        <slot></slot>
      </span>
    `;
  }
};
et.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        color: var(--bh-color-text);
        font-family: var(--bh-font-sans);
      }

      /* Body (default) */
      :host,
      :host([variant='body']) {
        font-size: var(--bh-body-size);
        font-weight: var(--bh-body-weight);
        line-height: var(--bh-body-leading);
      }

      /* Heading */
      :host([variant='heading']) {
        font-size: var(--bh-heading-size);
        font-weight: var(--bh-heading-weight);
        line-height: var(--bh-heading-leading);
      }

      /* Small */
      :host([variant='small']) {
        font-size: var(--bh-small-size);
        font-weight: var(--bh-small-weight);
        line-height: var(--bh-small-leading);
        color: var(--bh-color-text-muted);
      }

      /* Code */
      :host([variant='code']) {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-relaxed);
      }

      /* Truncation */
      :host([truncate]) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span {
        display: contents;
      }
    `
];
nr([
  n({ reflect: !0 })
], et.prototype, "variant", 2);
nr([
  n({ type: Boolean, reflect: !0 })
], et.prototype, "truncate", 2);
et = nr([
  u("bh-text")
], et);
var xa = Object.defineProperty, wa = Object.getOwnPropertyDescriptor, E = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? wa(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && xa(e, s, r), r;
};
let A = class extends l {
  constructor() {
    super(...arguments), this.size = "md", this.value = "", this.placeholder = "", this.name = "", this.label = "", this.rows = 3, this.resize = "vertical", this.disabled = !1, this.readonly = !1, this.required = !1, this.error = !1;
  }
  render() {
    return h`
      <div class="wrapper" part="wrapper">
        <textarea
          part="textarea"
          .value=${Gr(this.value)}
          placeholder=${this.placeholder || c}
          name=${this.name || c}
          aria-label=${this.label || c}
          rows=${this.rows}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.error ? "true" : c}
          @input=${this._handleInput}
          @change=${this._handleChange}
        ></textarea>
      </div>
    `;
  }
  _handleInput(t) {
    const e = t.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(t) {
    const e = t.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
};
A.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        width: 100%;
        background: var(--bh-textarea-bg, var(--bh-color-surface-raised));
        border: var(--bh-border-1) solid var(--bh-textarea-border, var(--bh-color-border));
        border-radius: var(--bh-textarea-radius, var(--bh-radius-md));
        box-shadow: var(--bh-shadow-inset);
        transition: all var(--bh-transition-fast);
      }

      textarea {
        flex: 1;
        min-width: 0;
        font-family: var(--bh-font-sans);
        line-height: var(--bh-leading-normal);
        color: var(--bh-textarea-color, var(--bh-color-text));
        background: transparent;
        border: none;
        outline: none;
        resize: vertical;
      }

      textarea::placeholder {
        color: var(--bh-color-text-muted);
      }

      /* Resize */
      :host([resize='none']) textarea { resize: none; }
      :host([resize='vertical']) textarea { resize: vertical; }
      :host([resize='horizontal']) textarea { resize: horizontal; }
      :host([resize='both']) textarea { resize: both; }

      /* Sizes */
      :host([size='sm']) .wrapper {
        font-size: var(--bh-text-sm);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
      }

      .wrapper,
      :host([size='md']) .wrapper {
        font-size: var(--bh-text-base);
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
      }

      :host([size='lg']) .wrapper {
        font-size: var(--bh-text-lg);
        padding: var(--bh-spacing-2-5) var(--bh-spacing-6);
      }

      textarea {
        font-size: inherit;
      }

      /* Focus */
      .wrapper:focus-within {
        border-color: var(--bh-color-ring);
        box-shadow: 0 0 0 1px var(--bh-color-ring);
      }

      /* Error */
      :host([error]) .wrapper {
        border-color: var(--bh-color-danger);
      }

      :host([error]) .wrapper:focus-within {
        border-color: var(--bh-color-danger);
        box-shadow: 0 0 0 1px var(--bh-color-danger);
      }

      /* Disabled */
      :host([disabled]) .wrapper {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host([disabled]) textarea {
        cursor: not-allowed;
      }

      /* Readonly */
      :host([readonly]) .wrapper {
        background: var(--bh-color-surface);
      }
    `
];
E([
  n({ reflect: !0 })
], A.prototype, "size", 2);
E([
  n()
], A.prototype, "value", 2);
E([
  n()
], A.prototype, "placeholder", 2);
E([
  n()
], A.prototype, "name", 2);
E([
  n()
], A.prototype, "label", 2);
E([
  n({ type: Number })
], A.prototype, "rows", 2);
E([
  n({ reflect: !0 })
], A.prototype, "resize", 2);
E([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "disabled", 2);
E([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "readonly", 2);
E([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "required", 2);
E([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "error", 2);
A = E([
  u("bh-textarea")
], A);
var $a = Object.defineProperty, Ca = Object.getOwnPropertyDescriptor, lr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ca(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && $a(e, s, r), r;
};
let tt = class extends l {
  constructor() {
    super(...arguments), this.content = "", this.placement = "top";
  }
  render() {
    return h`
      <span class="trigger">
        <slot></slot>
      </span>
      <span class="tooltip" part="tooltip" role="tooltip">${this.content}</span>
    `;
  }
};
tt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-flex;
        position: relative;
      }

      .trigger {
        display: inline-flex;
      }

      .tooltip {
        position: absolute;
        z-index: var(--bh-z-tooltip);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-normal);
        white-space: nowrap;
        border-radius: var(--bh-radius-md);
        background: var(--bh-tooltip-bg, var(--bh-color-cod));
        color: var(--bh-tooltip-color, var(--bh-color-white));
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--bh-transition-fast);
      }

      :host(:hover) .tooltip,
      :host(:focus-within) .tooltip {
        opacity: 1;
      }

      /* Placements */
      :host([placement='top']) .tooltip,
      .tooltip {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: var(--bh-spacing-1-5);
      }

      :host([placement='bottom']) .tooltip {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: var(--bh-spacing-1-5);
      }

      :host([placement='left']) .tooltip {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: var(--bh-spacing-1-5);
      }

      :host([placement='right']) .tooltip {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: var(--bh-spacing-1-5);
      }
    `
];
lr([
  n()
], tt.prototype, "content", 2);
lr([
  n({ reflect: !0 })
], tt.prototype, "placement", 2);
tt = lr([
  u("bh-tooltip")
], tt);
var Pa = Object.defineProperty, Oa = Object.getOwnPropertyDescriptor, vt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Oa(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Pa(e, s, r), r;
};
const jr = ["off", "primary", "success", "warning", "danger"];
let de = class extends l {
  constructor() {
    super(...arguments), this.cols = 20, this.rows = 5, this.label = "", this._pixelEls = [];
  }
  render() {
    const t = this.cols * this.rows, e = this.label.length > 0;
    return h`
      <div
        class="grid"
        part="grid"
        role=${e ? "img" : c}
        aria-label=${e ? this.label : c}
        aria-hidden=${e ? c : "true"}
        style="--_cols:${this.cols};--_rows:${this.rows}"
      >
        ${Array.from(
      { length: t },
      () => h`<div class="px" part="pixel" aria-hidden="true"></div>`
    )}
      </div>
    `;
  }
  updated() {
    const t = this.data, e = this._prevData, s = this.shadowRoot.querySelector(".grid");
    if (!s) return;
    this._pixelEls = Array.from(s.querySelectorAll(".px"));
    const a = this.cols * this.rows;
    for (let r = 0; r < a && r < this._pixelEls.length; r++) {
      const o = t && r < t.length ? t[r] : 0, i = e && r < e.length ? e[r] : -1;
      if (o !== i) {
        const p = this._pixelEls[r];
        p.className = `px ${o > 0 && o < jr.length ? jr[o] : ""}`.trimEnd();
      }
    }
    t && (this._prevData = new Uint8Array(t));
  }
};
de.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(var(--_cols), var(--bh-pixel-size, 4px));
        grid-template-rows: repeat(var(--_rows), var(--bh-pixel-size, 4px));
        gap: var(--bh-pixel-gap, 1px);
      }

      .px {
        width: var(--bh-pixel-size, 4px);
        height: var(--bh-pixel-size, 4px);
        border-radius: var(--bh-pixel-radius, 1px);
        background: var(--bh-pixel-off, var(--bh-color-surface-recessed));
        transition: background 0.15s, box-shadow 0.15s;
      }

      .px.primary {
        background: var(--bh-color-primary);
        box-shadow: 0 0 var(--bh-pixel-glow, 4px) var(--bh-color-primary-glow);
      }

      .px.success {
        background: var(--bh-color-success);
        box-shadow: 0 0 var(--bh-pixel-glow, 4px) var(--bh-color-success-dim);
      }

      .px.warning {
        background: var(--bh-color-warning);
        box-shadow: 0 0 var(--bh-pixel-glow, 4px) var(--bh-color-warning-dim);
      }

      .px.danger {
        background: var(--bh-color-danger);
        box-shadow: 0 0 var(--bh-pixel-glow, 4px) rgba(239, 68, 68, 0.4);
      }
    `
];
vt([
  n({ type: Number })
], de.prototype, "cols", 2);
vt([
  n({ type: Number })
], de.prototype, "rows", 2);
vt([
  n({ attribute: !1 })
], de.prototype, "data", 2);
vt([
  n()
], de.prototype, "label", 2);
de = vt([
  u("bh-pixel-display")
], de);
var Aa = Object.defineProperty, za = Object.getOwnPropertyDescriptor, Ie = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? za(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Aa(e, s, r), r;
};
let X = class extends l {
  constructor() {
    super(...arguments), this.value = "", this.color = "primary", this.size = "md", this.ghost = !1, this.label = "";
  }
  /** Character used for ghost segments. Defaults to '8' for digits, '~' for alpha. */
  get _ghostText() {
    return this.value.toUpperCase().split("").map((t) => /[0-9]/.test(t) ? "8" : /[A-Z]/.test(t) ? "~" : t).join("");
  }
  render() {
    const t = this.value.toUpperCase();
    return this.ghost ? h`
        <span class="wrapper">
          <span
            class="display ghost"
            aria-hidden="true"
          >${this._ghostText}</span>
          <span
            class="display"
            part="display"
            role="status"
            aria-label=${this.label || c}
          >${t}</span>
        </span>
      ` : h`
      <span
        class="display"
        part="display"
        role="status"
        aria-label=${this.label || c}
      >${t}</span>
    `;
  }
};
X.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
        font-family: 'DSEG14Classic', 'DSEG14', var(--bh-font-mono);
        text-transform: uppercase;
      }

      .display {
        font-size: var(--bh-segment-size, 14px);
        font-weight: normal;
        letter-spacing: var(--bh-segment-tracking, 1px);
        color: var(--bh-segment-color);
        text-shadow: 0 0 8px var(--bh-segment-glow);
        line-height: var(--bh-leading-none);
      }

      /* Ghost segments behind the lit text */
      :host([ghost]) .ghost {
        position: absolute;
        inset: 0;
        color: var(--bh-segment-off, var(--bh-color-surface-recessed));
        text-shadow: none;
        pointer-events: none;
        user-select: none;
      }

      :host([ghost]) .wrapper {
        position: relative;
        display: inline-block;
      }

      /* Sizes */
      :host([size='sm']) .display,
      :host([size='sm']) .ghost {
        --bh-segment-size: 10px;
        --bh-segment-tracking: 0.5px;
      }

      .display,
      .ghost,
      :host([size='md']) .display,
      :host([size='md']) .ghost {
        --bh-segment-size: 14px;
        --bh-segment-tracking: 1px;
      }

      :host([size='lg']) .display,
      :host([size='lg']) .ghost {
        --bh-segment-size: 20px;
        --bh-segment-tracking: 1.5px;
      }

      :host([size='xl']) .display,
      :host([size='xl']) .ghost {
        --bh-segment-size: 28px;
        --bh-segment-tracking: 2px;
      }

      /* Colors */
      :host,
      :host([color='primary']) {
        --bh-segment-color: var(--bh-color-primary);
        --bh-segment-glow: var(--bh-color-primary-glow, rgba(255, 107, 53, 0.25));
      }

      :host([color='success']) {
        --bh-segment-color: var(--bh-color-success);
        --bh-segment-glow: var(--bh-color-success-dim, rgba(42, 157, 78, 0.25));
      }

      :host([color='warning']) {
        --bh-segment-color: var(--bh-color-warning);
        --bh-segment-glow: rgba(245, 158, 11, 0.25);
      }

      :host([color='danger']) {
        --bh-segment-color: var(--bh-color-danger);
        --bh-segment-glow: rgba(220, 38, 38, 0.25);
      }

      :host([color='default']) {
        --bh-segment-color: var(--bh-color-text);
        --bh-segment-glow: transparent;
      }
    `
];
Ie([
  n()
], X.prototype, "value", 2);
Ie([
  n({ reflect: !0 })
], X.prototype, "color", 2);
Ie([
  n({ reflect: !0 })
], X.prototype, "size", 2);
Ie([
  n({ type: Boolean, reflect: !0 })
], X.prototype, "ghost", 2);
Ie([
  n()
], X.prototype, "label", 2);
X = Ie([
  u("bh-segment-display")
], X);
var ka = Object.defineProperty, Sa = Object.getOwnPropertyDescriptor, re = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Sa(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ka(e, s, r), r;
};
let M = class extends l {
  constructor() {
    super(...arguments), this.min = 0, this.max = 100, this.step = 1, this.value = 0, this.disabled = !1, this.showValue = !1, this.label = "";
  }
  render() {
    return h`
      <div class="slider">
        <input
          part="track"
          type="range"
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.step)}
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          aria-label=${this.label || "Slider"}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        ${this.showValue ? h`<span class="value" part="value">${this.value}</span>` : ""}
      </div>
    `;
  }
  _handleInput(t) {
    const e = t.target;
    this.value = Number(e.value), this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(t) {
    const e = t.target;
    this.value = Number(e.value), this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
};
M.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .slider {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-3);
      }

      input[type='range'] {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        height: var(--bh-slider-track-height, 4px);
        background: var(--bh-slider-track-color, var(--bh-color-surface-raised));
        border-radius: var(--bh-radius-full);
        outline: none;
        margin: 0;
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: var(--bh-slider-thumb-size, 14px);
        height: var(--bh-slider-thumb-size, 14px);
        border-radius: 50%;
        background: var(--bh-slider-thumb-color, var(--bh-color-primary));
        cursor: pointer;
        transition: box-shadow var(--bh-transition-fast);
      }

      input[type='range']:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 var(--bh-border-2) var(--bh-color-ring);
      }

      input[type='range']::-moz-range-thumb {
        width: var(--bh-slider-thumb-size, 14px);
        height: var(--bh-slider-thumb-size, 14px);
        border: none;
        border-radius: 50%;
        background: var(--bh-slider-thumb-color, var(--bh-color-primary));
        cursor: pointer;
      }

      input[type='range']:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 var(--bh-border-2) var(--bh-color-ring);
      }

      .value {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-sm);
        color: var(--bh-color-text-muted);
        font-variant-numeric: tabular-nums;
        min-width: 2ch;
        text-align: end;
      }

      /* Disabled */
      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }
    `
];
re([
  n({ type: Number })
], M.prototype, "min", 2);
re([
  n({ type: Number })
], M.prototype, "max", 2);
re([
  n({ type: Number })
], M.prototype, "step", 2);
re([
  n({ type: Number })
], M.prototype, "value", 2);
re([
  n({ type: Boolean, reflect: !0 })
], M.prototype, "disabled", 2);
re([
  n({ type: Boolean, reflect: !0, attribute: "show-value" })
], M.prototype, "showValue", 2);
re([
  n()
], M.prototype, "label", 2);
M = re([
  u("bh-slider")
], M);
var Ea = Object.defineProperty, Da = Object.getOwnPropertyDescriptor, hr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Da(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ea(e, s, r), r;
};
let rt = class extends l {
  constructor() {
    super(...arguments), this.shape = "line", this.blink = !0;
  }
  render() {
    return h`<span part="cursor"></span>`;
  }
};
rt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
      }

      span {
        display: inline-block;
        background: var(--bh-cursor-color, var(--bh-color-primary));
      }

      /* Shapes */
      span,
      :host([shape='line']) span {
        width: 2px;
        height: var(--bh-cursor-height, 1.2em);
      }

      :host([shape='block']) span {
        width: var(--bh-cursor-width, 8px);
        height: var(--bh-cursor-height, 1.2em);
      }

      :host([shape='underline']) span {
        width: var(--bh-cursor-width, 8px);
        height: 2px;
        vertical-align: bottom;
      }

      /* Blink animation */
      :host([blink]) span {
        animation: cursor-blink 1s ease-in-out infinite;
      }

      @keyframes cursor-blink {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.2;
        }
      }
    `
];
hr([
  n({ reflect: !0 })
], rt.prototype, "shape", 2);
hr([
  n({ type: Boolean, reflect: !0 })
], rt.prototype, "blink", 2);
rt = hr([
  u("bh-terminal-cursor")
], rt);
var Ba = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, se = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ja(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ba(e, s, r), r;
};
let N = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.padding = "md", this.cornerAccents = !1, this.callout = !1, this._hasHeader = !1, this._hasHeaderActions = !1, this._hasFooter = !1;
  }
  get _showHeader() {
    return this._hasHeader || this._hasHeaderActions;
  }
  render() {
    return h`
      <div class="card" part="card">
        ${this._showHeader ? h`<div class="header" part="header">
              <div class="header-start"><slot name="header" @slotchange=${this._onHeaderSlotChange}></slot></div>
              <div class="header-end"><slot name="header-actions" @slotchange=${this._onHeaderActionsSlotChange}></slot></div>
            </div>` : h`<slot name="header" @slotchange=${this._onHeaderSlotChange}></slot>
                 <slot name="header-actions" @slotchange=${this._onHeaderActionsSlotChange}></slot>`}
        <div class="body" part="body">
          <slot></slot>
        </div>
        ${this._hasFooter ? h`<div class="footer" part="footer"><slot name="footer" @slotchange=${this._onFooterSlotChange}></slot></div>` : h`<slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>`}
      </div>
    `;
  }
  _onHeaderSlotChange(t) {
    const e = t.target;
    this._hasHeader = e.assignedNodes({ flatten: !0 }).length > 0;
  }
  _onHeaderActionsSlotChange(t) {
    const e = t.target;
    this._hasHeaderActions = e.assignedNodes({ flatten: !0 }).length > 0;
  }
  _onFooterSlotChange(t) {
    const e = t.target;
    this._hasFooter = e.assignedNodes({ flatten: !0 }).length > 0;
  }
};
N.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        height: 100%;
      }

      .card {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--bh-card-bg, var(--bh-color-surface-raised));
        border-radius: var(--bh-card-radius, var(--bh-radius-lg));
        overflow: hidden;
      }

      /* Corner accents */
      :host([corner-accents]) .card::before,
      :host([corner-accents]) .card::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        border-color: var(--bh-card-accent-color, var(--bh-color-border));
        border-style: solid;
        border-width: 0;
        transition: border-color 0.2s, box-shadow 0.2s;
        pointer-events: none;
        z-index: 1;
      }

      :host([corner-accents]) .card::before {
        top: 0;
        left: 0;
        border-top-width: 2px;
        border-left-width: 2px;
        border-top-left-radius: var(--bh-card-radius, var(--bh-radius-lg));
      }

      :host([corner-accents]) .card::after {
        bottom: 0;
        right: 0;
        border-bottom-width: 2px;
        border-right-width: 2px;
        border-bottom-right-radius: var(--bh-card-radius, var(--bh-radius-lg));
      }

      :host([corner-accents]) .card:hover::before,
      :host([corner-accents]) .card:hover::after {
        border-color: var(--bh-card-accent-hover-color, var(--bh-color-primary));
        box-shadow: 0 0 6px var(--bh-card-accent-glow, var(--bh-color-primary-glow));
      }

      /* Default — shadow, no border */
      .card,
      :host([variant='default']) .card {
        box-shadow: var(--bh-card-shadow, var(--bh-shadow-md));
        border: var(--bh-border-1) solid transparent;
      }

      /* Outlined — border, no shadow */
      :host([variant='outlined']) .card {
        border: var(--bh-border-1) solid var(--bh-card-border, var(--bh-color-border));
        box-shadow: none;
      }

      /* Flat — no border, no shadow */
      :host([variant='flat']) .card {
        border: var(--bh-border-1) solid transparent;
        box-shadow: none;
      }

      /* Callout — left border accent */
      :host([callout]) .card {
        border-left: var(--bh-card-callout-width, 3px) solid var(--bh-card-callout-color, var(--bh-color-warning));
      }

      /* Padding */
      .body {
        padding: var(--bh-spacing-4);
        flex: 1;
      }

      :host([padding='none']) .body {
        padding: 0;
      }

      :host([padding='sm']) .body {
        padding: var(--bh-spacing-2);
      }

      :host([padding='md']) .body {
        padding: var(--bh-spacing-4);
      }

      :host([padding='lg']) .body {
        padding: var(--bh-spacing-6);
      }

      /* Header */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-4);
        border-bottom: var(--bh-border-1) solid var(--bh-color-border);
      }

      :host([padding='sm']) .header {
        padding: var(--bh-spacing-2);
      }

      :host([padding='lg']) .header {
        padding: var(--bh-spacing-6);
      }

      :host([padding='none']) .header {
        padding: var(--bh-spacing-4);
      }

      .header-start {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        min-width: 0;
      }

      .header-end {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        flex-shrink: 0;
      }

      /* Footer */
      .footer {
        padding: var(--bh-spacing-4);
        border-top: var(--bh-border-1) solid var(--bh-color-border);
      }

      :host([padding='sm']) .footer {
        padding: var(--bh-spacing-2);
      }

      :host([padding='lg']) .footer {
        padding: var(--bh-spacing-6);
      }

      :host([padding='none']) .footer {
        padding: var(--bh-spacing-4);
      }
    `
];
se([
  n({ reflect: !0 })
], N.prototype, "variant", 2);
se([
  n({ reflect: !0 })
], N.prototype, "padding", 2);
se([
  n({ type: Boolean, reflect: !0, attribute: "corner-accents" })
], N.prototype, "cornerAccents", 2);
se([
  n({ type: Boolean, reflect: !0 })
], N.prototype, "callout", 2);
se([
  C()
], N.prototype, "_hasHeader", 2);
se([
  C()
], N.prototype, "_hasHeaderActions", 2);
se([
  C()
], N.prototype, "_hasFooter", 2);
N = se([
  u("bh-card")
], N);
var Ia = Object.defineProperty, Ta = Object.getOwnPropertyDescriptor, Te = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ta(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ia(e, s, r), r;
};
let Q = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.size = "md", this.dismissible = !1, this.selected = !1, this.disabled = !1;
  }
  render() {
    return h`
      <button
        part="chip"
        ?disabled=${this.disabled}
        aria-pressed=${this.selected ? "true" : c}
        @click=${this._handleClick}
      >
        <slot name="prefix"></slot>
        <slot></slot>
        ${this.dismissible ? h`<button
              class="dismiss"
              part="dismiss"
              aria-label="Remove"
              tabindex="-1"
              @click=${this._handleDismiss}
            ><bh-icon name="x"></bh-icon></button>` : c}
      </button>
    `;
  }
  _handleClick(t) {
    if (this.disabled) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: t }
      })
    );
  }
  _handleDismiss(t) {
    t.stopPropagation(), !this.disabled && this.dispatchEvent(
      new CustomEvent("bh-dismiss", {
        bubbles: !0,
        composed: !0,
        detail: {}
      })
    );
  }
};
Q.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
      }

      button {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-1-5);
        border: var(--bh-border-1) solid transparent;
        cursor: pointer;
        font-family: var(--bh-font-sans);
        font-weight: var(--bh-font-medium);
        line-height: var(--bh-leading-none);
        border-radius: var(--bh-chip-radius, var(--bh-radius-full));
        background: var(--bh-chip-bg);
        color: var(--bh-chip-color);
        transition: all var(--bh-transition-fast);
      }

      /* Sizes */
      :host([size='sm']) button {
        font-size: var(--bh-text-xs);
        padding: var(--bh-spacing-0-5) var(--bh-spacing-2);
      }

      button,
      :host([size='md']) button {
        font-size: var(--bh-text-sm);
        padding: var(--bh-spacing-1) var(--bh-spacing-2-5);
      }

      /* Default */
      button,
      :host([variant='default']) button {
        --bh-chip-bg: var(--bh-color-secondary);
        --bh-chip-color: var(--bh-color-secondary-text);
      }

      :host([variant='default']) button:hover,
      button:hover {
        --bh-chip-bg: var(--bh-color-secondary-hover);
      }

      /* Primary */
      :host([variant='primary']) button {
        --bh-chip-bg: var(--bh-color-primary);
        --bh-chip-color: var(--bh-color-primary-text);
      }

      :host([variant='primary']) button:hover {
        --bh-chip-bg: var(--bh-color-primary-hover);
      }

      /* Success */
      :host([variant='success']) button {
        --bh-chip-bg: var(--bh-color-success);
        --bh-chip-color: var(--bh-color-text-inverse);
      }

      :host([variant='success']) button:hover {
        --bh-chip-bg: var(--bh-color-success-hover);
      }

      /* Warning */
      :host([variant='warning']) button {
        --bh-chip-bg: var(--bh-color-warning);
        --bh-chip-color: var(--bh-color-text);
      }

      :host([variant='warning']) button:hover {
        --bh-chip-bg: var(--bh-color-warning-hover);
      }

      /* Danger */
      :host([variant='danger']) button {
        --bh-chip-bg: var(--bh-color-danger);
        --bh-chip-color: var(--bh-color-danger-text);
      }

      :host([variant='danger']) button:hover {
        --bh-chip-bg: var(--bh-color-danger-hover);
      }

      /* Selected */
      :host([selected]) button {
        border-color: currentColor;
        box-shadow: 0 0 0 1px currentColor;
      }

      /* Focus */
      button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
      }

      /* Disabled */
      :host([disabled]) button {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Dismiss */
      .dismiss {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        margin-left: var(--bh-spacing-0-5);
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
        border-radius: var(--bh-radius-full);
        width: 1em;
        height: 1em;
        line-height: 1;
        opacity: 0.7;
        transition: opacity var(--bh-transition-fast);
      }

      .dismiss:hover {
        opacity: 1;
      }

      .dismiss:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 1px;
      }

      .dismiss bh-icon {
        --bh-icon-size: 1em;
        color: inherit;
      }
    `
];
Te([
  n({ reflect: !0 })
], Q.prototype, "variant", 2);
Te([
  n({ reflect: !0 })
], Q.prototype, "size", 2);
Te([
  n({ type: Boolean, reflect: !0 })
], Q.prototype, "dismissible", 2);
Te([
  n({ type: Boolean, reflect: !0 })
], Q.prototype, "selected", 2);
Te([
  n({ type: Boolean, reflect: !0 })
], Q.prototype, "disabled", 2);
Q = Te([
  u("bh-chip")
], Q);
var Ha = Object.defineProperty, Ma = Object.getOwnPropertyDescriptor, He = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ma(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ha(e, s, r), r;
};
let Na = 0, Z = class extends l {
  constructor() {
    super(...arguments), this.label = "", this.helpText = "", this.error = "", this.required = !1, this._uniqueId = `bh-ff-${++Na}`;
  }
  render() {
    const t = `${this._uniqueId}-label`, e = `${this._uniqueId}-help`, s = `${this._uniqueId}-error`;
    return h`
      <div class="field" part="field">
        ${this.label ? h`<label id=${t} part="label">
              ${this.label}${this.required ? h`<span class="required-marker" aria-hidden="true">*</span>` : c}
            </label>` : c}
        <slot @slotchange=${this._onSlotChange}></slot>
        ${this.helpText && !this.error ? h`<div id=${e} class="help-text" part="help-text">${this.helpText}</div>` : c}
        ${this.error ? h`<div id=${s} class="error" part="error" role="alert">${this.error}</div>` : c}
      </div>
    `;
  }
  updated() {
    this._linkAria();
  }
  _onSlotChange() {
    this._linkAria();
  }
  _linkAria() {
    if (!this._defaultSlot) return;
    const t = this._defaultSlot.assignedElements({ flatten: !0 });
    if (t.length === 0) return;
    const e = t[0], s = `${this._uniqueId}-label`, a = `${this._uniqueId}-help`, r = `${this._uniqueId}-error`;
    this.label ? e.setAttribute("aria-labelledby", s) : e.removeAttribute("aria-labelledby"), this.error ? e.setAttribute("aria-describedby", r) : this.helpText ? e.setAttribute("aria-describedby", a) : e.removeAttribute("aria-describedby"), this.error ? e.setAttribute("aria-invalid", "true") : e.removeAttribute("aria-invalid"), this.required ? e.setAttribute("aria-required", "true") : e.removeAttribute("aria-required");
  }
};
Z.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: var(--bh-form-field-gap, var(--bh-spacing-1-5));
      }

      label {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        font-weight: var(--bh-font-medium);
        line-height: var(--bh-leading-normal);
        color: var(--bh-form-field-label-color, var(--bh-color-text));
      }

      .required-marker {
        color: var(--bh-form-field-error-color, var(--bh-color-danger));
        margin-left: var(--bh-spacing-0-5);
      }

      .help-text {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-normal);
        color: var(--bh-color-text-muted);
      }

      .error {
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-normal);
        color: var(--bh-form-field-error-color, var(--bh-color-danger));
      }
    `
];
He([
  n()
], Z.prototype, "label", 2);
He([
  n({ attribute: "help-text" })
], Z.prototype, "helpText", 2);
He([
  n()
], Z.prototype, "error", 2);
He([
  n({ type: Boolean })
], Z.prototype, "required", 2);
He([
  It("slot:not([name])")
], Z.prototype, "_defaultSlot", 2);
Z = He([
  u("bh-form-field")
], Z);
var Ua = Object.defineProperty, Ra = Object.getOwnPropertyDescriptor, gt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ra(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ua(e, s, r), r;
};
let be = class extends l {
  constructor() {
    super(...arguments), this.active = !1, this.disabled = !1, this.href = "", this.target = "";
  }
  render() {
    return this.href ? h`
        <a
          part="item"
          href=${this.href}
          target=${this.target || c}
          aria-current=${this.active ? "page" : c}
          aria-disabled=${this.disabled ? "true" : c}
          @click=${this._handleClick}
        >
          <slot name="prefix"></slot>
          <slot></slot>
          <span class="suffix"><slot name="suffix"></slot></span>
        </a>
      ` : h`
      <button
        part="item"
        ?disabled=${this.disabled}
        aria-current=${this.active ? "page" : c}
        @click=${this._handleClick}
      >
        <slot name="prefix"></slot>
        <slot></slot>
        <span class="suffix"><slot name="suffix"></slot></span>
      </button>
    `;
  }
  _handleClick(t) {
    if (this.disabled) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: t }
      })
    );
  }
};
be.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      a,
      button {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        width: 100%;
        padding: var(--bh-spacing-2) var(--bh-spacing-3);
        border: none;
        border-radius: var(--bh-radius-md);
        background: var(--bh-nav-item-bg, transparent);
        color: var(--bh-nav-item-color, var(--bh-color-text));
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-base);
        font-weight: var(--bh-font-normal);
        line-height: var(--bh-leading-normal);
        text-decoration: none;
        cursor: pointer;
        transition: background var(--bh-transition-fast),
                    color var(--bh-transition-fast);
      }

      a:hover,
      button:hover {
        background: var(--bh-nav-item-hover-bg, var(--bh-color-secondary));
      }

      a:focus-visible,
      button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: -2px;
      }

      /* Active */
      :host([active]) a,
      :host([active]) button {
        background: var(--bh-nav-item-active-bg, var(--bh-color-secondary));
        color: var(--bh-nav-item-active-color, var(--bh-color-primary));
        font-weight: var(--bh-font-medium);
      }

      /* Disabled */
      :host([disabled]) a,
      :host([disabled]) button {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Suffix pushed to end */
      .suffix {
        margin-left: auto;
      }
    `
];
gt([
  n({ type: Boolean, reflect: !0 })
], be.prototype, "active", 2);
gt([
  n({ type: Boolean, reflect: !0 })
], be.prototype, "disabled", 2);
gt([
  n()
], be.prototype, "href", 2);
gt([
  n()
], be.prototype, "target", 2);
be = gt([
  u("bh-nav-item")
], be);
var qa = Object.defineProperty, La = Object.getOwnPropertyDescriptor, Me = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? La(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && qa(e, s, r), r;
};
let U = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.density = "default", this.stickyHeader = !1, this.columns = [], this.rows = [];
  }
  _renderHeaderCell(t) {
    return h`
      <th
        part="th"
        class=${t.align ? `align-${t.align}` : ""}
        style=${t.width ? `width: ${t.width}` : ""}
      >
        ${t.label}
      </th>
    `;
  }
  get _displayRows() {
    return this.rows;
  }
  render() {
    return h`
      <div class="wrapper">
        <table part="table">
          <thead part="thead">
            <tr>
              ${this.columns.map((t) => this._renderHeaderCell(t))}
            </tr>
          </thead>
          <tbody part="tbody">
            ${this._displayRows.map(
      (t) => h`
                <tr part="row">
                  ${this.columns.map(
        (e) => h`
                      <td
                        part="td"
                        class=${e.align ? `align-${e.align}` : ""}
                      >
                        ${String(t[e.key] ?? "")}
                      </td>
                    `
      )}
                </tr>
              `
    )}
          </tbody>
        </table>
      </div>
    `;
  }
};
U.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .wrapper {
        overflow-x: auto;
        border-radius: var(--bh-table-radius, var(--bh-radius-lg));
        border: var(--bh-border-1) solid var(--bh-table-border, var(--bh-color-border));
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--bh-table-bg, var(--bh-color-surface-raised));
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-normal);
      }

      /* Header */
      thead {
        background: var(--bh-table-header-bg, var(--bh-color-surface));
      }

      th {
        font-weight: var(--bh-font-semibold);
        color: var(--bh-color-text-muted);
        text-align: left;
        white-space: nowrap;
        border-bottom: var(--bh-border-1) solid var(--bh-table-border, var(--bh-color-border));
      }

      /* Body */
      td {
        color: var(--bh-color-text);
        border-bottom: var(--bh-border-1) solid var(--bh-table-border, var(--bh-color-border));
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      /* Hover */
      tbody tr:hover {
        background: var(--bh-table-hover-bg, var(--bh-color-secondary));
      }

      /* Density — default */
      th,
      td,
      :host([density='default']) th,
      :host([density='default']) td {
        padding: var(--bh-spacing-3) var(--bh-spacing-4);
      }

      /* Density — compact */
      :host([density='compact']) th,
      :host([density='compact']) td {
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
        font-size: var(--bh-text-xs);
      }

      /* Density — comfortable */
      :host([density='comfortable']) th,
      :host([density='comfortable']) td {
        padding: var(--bh-spacing-4) var(--bh-spacing-6);
      }

      /* Striped */
      :host([variant='striped']) tbody tr:nth-child(even) {
        background: var(--bh-table-stripe-bg, var(--bh-color-surface));
      }

      /* Bordered */
      :host([variant='bordered']) th,
      :host([variant='bordered']) td {
        border: var(--bh-border-1) solid var(--bh-table-border, var(--bh-color-border));
      }

      /* Alignment */
      .align-center {
        text-align: center;
      }

      .align-end {
        text-align: right;
      }

      /* Sticky header */
      :host([sticky-header]) thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--bh-table-header-bg, var(--bh-color-surface));
      }
    `
];
Me([
  n({ reflect: !0 })
], U.prototype, "variant", 2);
Me([
  n({ reflect: !0 })
], U.prototype, "density", 2);
Me([
  n({ type: Boolean, reflect: !0, attribute: "sticky-header" })
], U.prototype, "stickyHeader", 2);
Me([
  n({ type: Array })
], U.prototype, "columns", 2);
Me([
  n({ type: Array })
], U.prototype, "rows", 2);
U = Me([
  u("bh-table")
], U);
class Ga {
  constructor(e, s) {
    this._buffer = [], this._text = "", this._host = e, this._cols = s.cols, this._rows = s.rows, this._type = s.type, this._color = s.color ?? 1, this._bufferSize = s.bufferSize ?? s.cols, this._grid = new Uint8Array(s.cols * s.rows), e.addController(this);
  }
  hostConnected() {
  }
  hostDisconnected() {
  }
  get grid() {
    return this._grid;
  }
  get latest() {
    return this._buffer.length > 0 ? this._buffer[this._buffer.length - 1] : void 0;
  }
  get values() {
    return this._buffer.slice();
  }
  push(e) {
    this._buffer.push(e), this._buffer.length > this._bufferSize && (this._buffer = this._buffer.slice(this._buffer.length - this._bufferSize)), this._regenerate();
  }
  set(e) {
    this._buffer = e.slice(-this._bufferSize), this._regenerate();
  }
  setText(e) {
    this._text = e, this._regenerate();
  }
  setGrid(e) {
    this._applyGrid(e);
  }
  resize(e, s) {
    this._cols = e, this._rows = s, this._grid = new Uint8Array(e * s), this._regenerate();
  }
  configure(e) {
    let s = !1;
    e.cols !== void 0 && e.cols !== this._cols && (this._cols = e.cols, s = !0), e.rows !== void 0 && e.rows !== this._rows && (this._rows = e.rows, s = !0), e.type !== void 0 && e.type !== this._type && (this._type = e.type, s = !0), e.color !== void 0 && e.color !== this._color && (this._color = e.color, s = !0), e.bufferSize !== void 0 && e.bufferSize !== this._bufferSize && (this._bufferSize = e.bufferSize, this._buffer.length > this._bufferSize && (this._buffer = this._buffer.slice(this._buffer.length - this._bufferSize)), s = !0), s && (this._grid = new Uint8Array(this._cols * this._rows), this._regenerate());
  }
  _regenerate() {
    const { _cols: e, _rows: s, _color: a, _type: r } = this;
    if (e === 0 || s === 0) return;
    let o;
    switch (r) {
      case "sparkline":
        o = $s(this._buffer, e, s, a);
        break;
      case "bar":
        o = Cs(this._buffer.length > 0 ? this._buffer[this._buffer.length - 1] : 0, e, s, a);
        break;
      case "text":
        o = ws(this._text, e, s, a);
        break;
      case "raw":
        return;
    }
    this._applyGrid(o);
  }
  _applyGrid(e) {
    const s = this._grid, a = Math.min(s.length, e.length);
    let r = s.length !== e.length;
    if (!r) {
      for (let o = 0; o < a; o++)
        if (s[o] !== e[o]) {
          r = !0;
          break;
        }
    }
    r && (this._grid = e, this._host.requestUpdate());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = (t, e) => {
  var a;
  const s = t._$AN;
  if (s === void 0) return !1;
  for (const r of s) (a = r._$AO) == null || a.call(r, e, !1), Ye(r, e);
  return !0;
}, Ct = (t) => {
  let e, s;
  do {
    if ((e = t._$AM) === void 0) break;
    s = e._$AN, s.delete(t), t = e;
  } while ((s == null ? void 0 : s.size) === 0);
}, Fr = (t) => {
  for (let e; e = t._$AM; t = e) {
    let s = e._$AN;
    if (s === void 0) e._$AN = s = /* @__PURE__ */ new Set();
    else if (s.has(t)) break;
    s.add(t), Wa(e);
  }
};
function Fa(t) {
  this._$AN !== void 0 ? (Ct(this), this._$AM = t, Fr(this)) : this._$AM = t;
}
function Va(t, e = !1, s = 0) {
  const a = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (e) if (Array.isArray(a)) for (let o = s; o < a.length; o++) Ye(a[o], !1), Ct(a[o]);
  else a != null && (Ye(a, !1), Ct(a));
  else Ye(this, t);
}
const Wa = (t) => {
  t.type == H.CHILD && (t._$AP ?? (t._$AP = Va), t._$AQ ?? (t._$AQ = Fa));
};
class Ya extends dt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, s, a) {
    super._$AT(e, s, a), Fr(this), this.isConnected = e._$AU;
  }
  _$AO(e, s = !0) {
    var a, r;
    e !== this.isConnected && (this.isConnected = e, e ? (a = this.reconnected) == null || a.call(this) : (r = this.disconnected) == null || r.call(this)), s && (Ye(this, e), Ct(this));
  }
  setValue(e) {
    if (qr(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const s = [...this._$Ct._$AH];
      s[this._$Ci] = e, this._$Ct._$AI(s, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
class Ja extends Ya {
  constructor(e) {
    super(e), this._fps = 12, this._cols = 0, this._sweepCursor = 0, this._sweepSpeed = 1, this._rafId = 0, this._pending = !1, this._stepRafId = 0, this._tickSweep = () => {
      if (!this._target || !this._prev) return;
      this._sweepCursor += this._sweepSpeed;
      const s = this._cols, a = this._target.length / s;
      if (this._sweepCursor >= s) {
        this._current = this._target, this.setValue(this._target), this._prev = void 0, this._target = void 0, this._rafId = 0;
        return;
      }
      const r = new Uint8Array(this._target.length);
      for (let o = 0; o < a; o++)
        for (let i = 0; i < s; i++) {
          const p = o * s + i;
          r[p] = i < this._sweepCursor ? this._target[p] : this._prev[p];
        }
      this.setValue(r), this._rafId = requestAnimationFrame(this._tickSweep);
    };
  }
  render(e, s) {
    const a = (s == null ? void 0 : s.transition) ?? "step", r = (s == null ? void 0 : s.fps) ?? 12, o = (s == null ? void 0 : s.cols) ?? 0;
    return this._fps = r, this._cols = o, a === "sweep" && o > 0 ? this._handleSweep(e) : this._handleStep(e);
  }
  _handleStep(e) {
    return this._current ? (e === this._current || (this._target = e, this._pending) || (this._pending = !0, this._stepRafId = requestAnimationFrame(() => {
      this._stepRafId = 0, this._pending = !1;
      const s = this._target;
      this._current = s, this._target = void 0, this.setValue(s);
    })), x) : (this._current = e, e);
  }
  _handleSweep(e) {
    return this._current ? (e === this._current || (this._cancelSweep(), this._prev = this._current, this._target = e, this._sweepCursor = 0, this._sweepSpeed = Math.ceil(this._cols / Math.ceil(0.3 * this._fps)), this._tickSweep()), x) : (this._current = e, e);
  }
  _cancelSweep() {
    this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = 0);
  }
  disconnected() {
    this._cancelSweep(), this._stepRafId && (cancelAnimationFrame(this._stepRafId), this._stepRafId = 0);
  }
  reconnected() {
    this._target && this._prev && this._sweepCursor < this._cols && (this._rafId = requestAnimationFrame(this._tickSweep));
  }
}
const Ka = Be(Ja);
var Xa = Object.defineProperty, Qa = Object.getOwnPropertyDescriptor, D = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Qa(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Xa(e, s, r), r;
};
let z = class extends l {
  constructor() {
    super(...arguments), this.label = "", this.value = "", this.footerStart = "", this.footerEnd = "", this.cols = 0, this.rows = 0, this.type = "sparkline", this.transition = "step", this.fps = 12, this.color = 1, this.bufferSize = 0;
  }
  get _managed() {
    return this.cols > 0 && this.rows > 0;
  }
  willUpdate(t) {
    this._managed && (this._ctrl ? (t.has("cols") || t.has("rows") || t.has("type") || t.has("color") || t.has("bufferSize")) && this._ctrl.configure({
      cols: this.cols,
      rows: this.rows,
      type: this.type,
      color: this.color,
      bufferSize: this.bufferSize || this.cols
    }) : this._ctrl = new Ga(this, {
      cols: this.cols,
      rows: this.rows,
      type: this.type,
      color: this.color,
      bufferSize: this.bufferSize || this.cols
    }));
  }
  push(t) {
    var e;
    (e = this._ctrl) == null || e.push(t);
  }
  set(t) {
    var e;
    (e = this._ctrl) == null || e.set(t);
  }
  setText(t) {
    var e;
    (e = this._ctrl) == null || e.setText(t);
  }
  setGrid(t) {
    var e;
    (e = this._ctrl) == null || e.setGrid(t);
  }
  _renderDisplay() {
    return h`
      <bh-pixel-display
        .cols=${this.cols}
        .rows=${this.rows}
        .data=${Ka(this._ctrl.grid, {
      transition: this.transition,
      fps: this.fps,
      cols: this.cols
    })}
        label=${this.label}
      ></bh-pixel-display>
    `;
  }
  render() {
    return h`
      <bh-card class="panel" part="panel" variant="outlined" padding="none" role="group" aria-label=${this.label || "panel"}>
        <div class="header" part="header">
          <span class="label" part="label"><slot name="label">${this.label}</slot></span>
          <span class="value" part="value"><slot name="value">${this.value}</slot></span>
        </div>
        <div class="body" part="body">
          ${this._managed ? this._renderDisplay() : h`<slot></slot>`}
        </div>
        <div class="footer" part="footer">
          <span><slot name="footer-start">${this.footerStart}</slot></span>
          <span><slot name="footer-end">${this.footerEnd}</slot></span>
        </div>
      </bh-card>
    `;
  }
};
z.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: inline-block;
      }

      bh-card {
        --bh-card-bg: var(--bh-pixel-panel-bg, var(--bh-color-surface));
        --bh-card-border: var(--bh-pixel-panel-border, var(--bh-color-border));
        --bh-card-radius: var(--bh-pixel-panel-radius, var(--bh-radius-lg));
        --bh-card-shadow: none;
      }

      .header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-2) var(--bh-spacing-3);
      }

      .label {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-2xs);
        font-weight: var(--bh-font-semibold);
        letter-spacing: var(--bh-tracking-wider);
        text-transform: uppercase;
        color: var(--bh-color-text-muted);
      }

      .value {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-2xs);
        font-weight: var(--bh-font-semibold);
        color: var(--bh-color-text);
      }

      .body {
        padding: 0 var(--bh-spacing-3) var(--bh-spacing-2);
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
        border-top: var(--bh-border-1) solid var(--bh-color-border-muted);
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-2xs);
        color: var(--bh-color-text-muted);
      }
    `
];
D([
  n()
], z.prototype, "label", 2);
D([
  n()
], z.prototype, "value", 2);
D([
  n({ attribute: "footer-start" })
], z.prototype, "footerStart", 2);
D([
  n({ attribute: "footer-end" })
], z.prototype, "footerEnd", 2);
D([
  n({ type: Number })
], z.prototype, "cols", 2);
D([
  n({ type: Number })
], z.prototype, "rows", 2);
D([
  n()
], z.prototype, "type", 2);
D([
  n()
], z.prototype, "transition", 2);
D([
  n({ type: Number })
], z.prototype, "fps", 2);
D([
  n({ type: Number })
], z.prototype, "color", 2);
D([
  n({ type: Number, attribute: "buffer-size" })
], z.prototype, "bufferSize", 2);
z = D([
  u("bh-pixel-panel")
], z);
var Za = Object.defineProperty, eo = Object.getOwnPropertyDescriptor, cr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? eo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Za(e, s, r), r;
};
let st = class extends l {
  constructor() {
    super(...arguments), this.heading = "";
  }
  render() {
    const t = this.count !== void 0;
    return h`
      <div class="header" part="header">
        <span class="title" part="title" role="heading" aria-level="3">
          <slot>${this.heading}</slot>
        </span>
        ${t ? h`<span part="badge"><slot name="badge"><bh-badge size="sm" variant="primary">${this.count}</bh-badge></slot></span>` : h`<slot name="badge"></slot>`}
        <bh-divider part="line"></bh-divider>
        <slot name="end"></slot>
      </div>
    `;
  }
};
st.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .header {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
      }

      .title {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-section-header-size, var(--bh-text-xs));
        font-weight: var(--bh-font-semibold);
        letter-spacing: var(--bh-section-header-tracking, var(--bh-tracking-widest));
        text-transform: uppercase;
        color: var(--bh-section-header-color, var(--bh-color-text-muted));
        white-space: nowrap;
      }

      bh-divider {
        flex: 1;
        padding: 0;
        --bh-divider-color: var(--bh-section-header-line-color, var(--bh-color-border-muted));
      }
    `
];
cr([
  n()
], st.prototype, "heading", 2);
cr([
  n({ type: Number })
], st.prototype, "count", 2);
st = cr([
  u("bh-section-header")
], st);
var to = Object.defineProperty, ro = Object.getOwnPropertyDescriptor, pr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ro(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && to(e, s, r), r;
};
w.register("sort-asc", '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>');
w.register("sort-desc", '<path d="M12 5v14"/><path d="m5 12 7 7 7-7"/>');
let at = class extends U {
  constructor() {
    super(...arguments), this._sortColumn = "", this._sortDirection = "none";
  }
  get _sortedRows() {
    if (this._sortDirection === "none" || !this._sortColumn)
      return this.rows;
    const t = this._sortColumn, e = this._sortDirection === "asc" ? 1 : -1;
    return [...this.rows].sort((s, a) => {
      const r = s[t], o = a[t];
      return r == null && o == null ? 0 : r == null ? 1 : o == null ? -1 : typeof r == "number" && typeof o == "number" ? (r - o) * e : String(r).localeCompare(String(o)) * e;
    });
  }
  get _displayRows() {
    return this._sortedRows;
  }
  _renderHeaderCell(t) {
    if (!t.sortable)
      return super._renderHeaderCell(t);
    const s = this._sortColumn === t.key && this._sortDirection !== "none";
    return h`
      <th
        part="th"
        class=${t.align ? `align-${t.align}` : ""}
        style=${t.width ? `width: ${t.width}` : ""}
        aria-sort=${s ? this._sortDirection === "asc" ? "ascending" : "descending" : c}
      >
        <button
          class="sort-button"
          part="sort-button"
          @click=${() => this._onSortClick(t.key)}
        >
          ${t.label}
          <span class="sort-icon ${s ? "active" : ""}">
            <bh-icon name=${s && this._sortDirection === "desc" ? "sort-desc" : "sort-asc"}></bh-icon>
          </span>
        </button>
      </th>
    `;
  }
  _onSortClick(t) {
    let e;
    this._sortColumn === t ? this._sortDirection === "none" ? e = "asc" : this._sortDirection === "asc" ? e = "desc" : e = "none" : e = "asc", this._sortColumn = t, this._sortDirection = e, this.dispatchEvent(
      new CustomEvent("bh-sort", {
        bubbles: !0,
        composed: !0,
        detail: { column: t, direction: e }
      })
    );
  }
};
at.styles = [
  ...[U.styles].flat(),
  b`
      /* Sort button */
      .sort-button {
        display: inline-flex;
        align-items: center;
        gap: var(--bh-spacing-1);
        padding: 0;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
        font-weight: inherit;
        cursor: pointer;
        white-space: nowrap;
      }

      .sort-button:hover {
        color: var(--bh-color-text);
      }

      .sort-button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: 2px;
        border-radius: var(--bh-radius-sm);
      }

      /* Sort icons */
      .sort-icon {
        display: inline-flex;
        flex-shrink: 0;
        opacity: 0.3;
        transition: opacity var(--bh-transition-fast);
      }

      .sort-icon.active {
        opacity: 1;
      }

      .sort-icon bh-icon {
        --bh-icon-size: 1em;
      }
    `
];
pr([
  C()
], at.prototype, "_sortColumn", 2);
pr([
  C()
], at.prototype, "_sortDirection", 2);
at = pr([
  u("bh-data-table")
], at);
var so = Object.defineProperty, ao = Object.getOwnPropertyDescriptor, Ut = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ao(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && so(e, s, r), r;
};
let $e = class extends l {
  constructor() {
    super(...arguments), this.tabId = "", this.label = "", this.active = !1;
  }
  render() {
    return h`
      <button
        part="button"
        role="tab"
        aria-selected=${this.active ? "true" : "false"}
        @click=${this._handleClick}
      >
        <slot>${this.label}</slot>
      </button>
    `;
  }
  _handleClick() {
    this.dispatchEvent(
      new CustomEvent("bh-tab-click", {
        bubbles: !0,
        composed: !0,
        detail: { tabId: this.tabId }
      })
    );
  }
};
$e.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      button {
        display: flex;
        align-items: center;
        padding: 0 var(--bh-spacing-4);
        height: 100%;
        background: transparent;
        border: none;
        border-bottom: var(--bh-border-2) solid transparent;
        color: var(--bh-tab-color, var(--bh-color-text-muted));
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        cursor: pointer;
        white-space: nowrap;
        transition: color var(--bh-transition-fast);
      }

      button:hover {
        color: var(--bh-tab-active-color, var(--bh-color-text));
      }

      button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: -2px;
      }

      :host([active]) button {
        color: var(--bh-tab-active-color, var(--bh-color-text));
        border-bottom-color: var(--bh-tab-active-border, var(--bh-color-primary));
      }
    `
];
Ut([
  n({ attribute: "tab-id" })
], $e.prototype, "tabId", 2);
Ut([
  n()
], $e.prototype, "label", 2);
Ut([
  n({ type: Boolean, reflect: !0 })
], $e.prototype, "active", 2);
$e = Ut([
  u("bh-tab")
], $e);
var oo = Object.defineProperty, io = Object.getOwnPropertyDescriptor, Vr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? io(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && oo(e, s, r), r;
};
let Pt = class extends l {
  constructor() {
    super(...arguments), this.active = "";
  }
  render() {
    return h`
      <div class="tabs" role="tablist" @bh-tab-click=${this._handleTabClick}>
        <slot @slotchange=${this._syncActive}></slot>
      </div>
    `;
  }
  updated(t) {
    t.has("active") && this._syncActive();
  }
  _syncActive() {
    const t = this._getTabs();
    for (const e of t)
      e.active = e.tabId === this.active;
  }
  _handleTabClick(t) {
    t.stopPropagation(), this.active = t.detail.tabId, this.dispatchEvent(
      new CustomEvent("bh-tab-change", {
        bubbles: !0,
        composed: !0,
        detail: { tabId: t.detail.tabId }
      })
    );
  }
  _getTabs() {
    var e;
    const t = (e = this.shadowRoot) == null ? void 0 : e.querySelector("slot");
    return t ? t.assignedElements({ flatten: !0 }).filter((s) => s.tagName === "BH-TAB") : [];
  }
};
Pt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .tabs {
        display: flex;
        align-items: center;
        height: var(--bh-tab-bar-height, 36px);
        background: var(--bh-tab-bar-bg, transparent);
        border-bottom: var(--bh-border-1) solid var(--bh-tab-bar-border, var(--bh-color-border));
        overflow-x: auto;
      }

      ::slotted(bh-tab) {
        height: 100%;
      }
    `
];
Vr([
  n()
], Pt.prototype, "active", 2);
Pt = Vr([
  u("bh-tab-bar")
], Pt);
var no = Object.defineProperty, lo = Object.getOwnPropertyDescriptor, dr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? lo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && no(e, s, r), r;
};
let ot = class extends l {
  constructor() {
    super(...arguments), this.tabId = "", this.active = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "tabpanel"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0");
  }
  render() {
    return h`<slot></slot>`;
  }
};
ot.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: none;
        height: 100%;
        overflow: auto;
      }

      :host([active]) {
        display: block;
      }
    `
];
dr([
  n({ attribute: "tab-id" })
], ot.prototype, "tabId", 2);
dr([
  n({ type: Boolean, reflect: !0 })
], ot.prototype, "active", 2);
ot = dr([
  u("bh-tab-panel")
], ot);
var ho = Object.defineProperty, co = Object.getOwnPropertyDescriptor, Wr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? co(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ho(e, s, r), r;
};
let Ot = class extends l {
  constructor() {
    super(...arguments), this.active = "";
  }
  render() {
    return h`
      <slot name="tab-bar" @bh-tab-change=${this._handleTabChange}></slot>
      <div class="panels">
        <slot @slotchange=${this._syncPanels}></slot>
      </div>
    `;
  }
  updated(t) {
    t.has("active") && (this._syncPanels(), this._syncTabBar());
  }
  _handleTabChange(t) {
    t.stopPropagation(), this.active = t.detail.tabId, this.dispatchEvent(
      new CustomEvent("bh-tab-change", {
        bubbles: !0,
        composed: !0,
        detail: { tabId: t.detail.tabId }
      })
    );
  }
  _syncPanels() {
    const t = this._getPanels();
    for (const e of t)
      e.active = e.tabId === this.active;
  }
  _syncTabBar() {
    const t = this._getTabBar();
    t && (t.active = this.active);
  }
  _getPanels() {
    var e;
    const t = (e = this.shadowRoot) == null ? void 0 : e.querySelector("slot:not([name])");
    return t ? t.assignedElements({ flatten: !0 }).filter(
      (s) => s.tagName === "BH-TAB-PANEL"
    ) : [];
  }
  _getTabBar() {
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector('slot[name="tab-bar"]');
    return t ? t.assignedElements({ flatten: !0 }).find(
      (a) => a.tagName === "BH-TAB-BAR"
    ) ?? null : null;
  }
};
Ot.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-direction: column;
      }

      .panels {
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }
    `
];
Wr([
  n()
], Ot.prototype, "active", 2);
Ot = Wr([
  u("bh-tabs")
], Ot);
var po = Object.defineProperty, bo = Object.getOwnPropertyDescriptor, Yr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? bo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && po(e, s, r), r;
};
let At = class extends l {
  constructor() {
    super(...arguments), this.sidebarOpen = !1;
  }
  render() {
    return h`
      <div class="grid" part="grid">
        <div class="activity">
          <slot name="activity"></slot>
        </div>
        <div class="sidebar">
          <slot name="sidebar"></slot>
        </div>
        <div class="main">
          <slot></slot>
        </div>
        <div class="status">
          <slot name="status"></slot>
        </div>
      </div>
    `;
  }
};
At.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
        background: var(--bh-shell-bg, var(--bh-color-bg));
      }

      .grid {
        display: grid;
        grid-template-columns:
          var(--bh-shell-activity-width, 48px)
          var(--bh-shell-sidebar-width, 0px)
          1fr;
        grid-template-rows: 1fr var(--bh-shell-status-height, 24px);
        grid-template-areas:
          "activity sidebar main"
          "status   status  status";
        height: 100%;
        width: 100%;
        transition: grid-template-columns var(--bh-transition-normal);
      }

      :host([sidebar-open]) .grid {
        --bh-shell-sidebar-width: 250px;
      }

      .activity {
        grid-area: activity;
        min-width: 0;
      }

      .sidebar {
        grid-area: sidebar;
        min-width: 0;
        overflow: hidden;
      }

      .main {
        grid-area: main;
        min-width: 0;
        overflow: auto;
      }

      .status {
        grid-area: status;
        min-width: 0;
      }
    `
];
Yr([
  n({ type: Boolean, reflect: !0, attribute: "sidebar-open" })
], At.prototype, "sidebarOpen", 2);
At = Yr([
  u("bh-app-shell")
], At);
var uo = Object.defineProperty, vo = Object.getOwnPropertyDescriptor, Rt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? vo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && uo(e, s, r), r;
};
let Ce = class extends l {
  constructor() {
    super(...arguments), this.active = !1, this.label = "", this.itemId = "";
  }
  render() {
    return h`
      <button
        part="button"
        title=${this.label || c}
        aria-label=${this.label || c}
        aria-pressed=${this.active ? "true" : "false"}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
  _handleClick() {
    this.dispatchEvent(
      new CustomEvent("bh-activity-item-click", {
        bubbles: !0,
        composed: !0,
        detail: { id: this.itemId, label: this.label }
      })
    );
  }
};
Ce.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--bh-activity-item-size, 40px);
        height: var(--bh-activity-item-size, 40px);
        background: none;
        border: none;
        border-left: var(--bh-border-2) solid transparent;
        border-radius: 0;
        color: var(--bh-color-text-muted);
        cursor: pointer;
        padding: 0;
        transition: color var(--bh-transition-fast), background var(--bh-transition-fast);
      }

      button:hover {
        color: var(--bh-color-text);
      }

      button:focus-visible {
        outline: 2px solid var(--bh-color-ring);
        outline-offset: -2px;
      }

      :host([active]) button {
        color: var(--bh-color-text);
        border-left-color: var(--bh-activity-item-active-border, var(--bh-color-primary));
        background: var(--bh-color-surface);
      }
    `
];
Rt([
  n({ type: Boolean, reflect: !0 })
], Ce.prototype, "active", 2);
Rt([
  n()
], Ce.prototype, "label", 2);
Rt([
  n({ attribute: "item-id" })
], Ce.prototype, "itemId", 2);
Ce = Rt([
  u("bh-activity-item")
], Ce);
var go = Object.defineProperty, fo = Object.getOwnPropertyDescriptor, Jr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? fo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && go(e, s, r), r;
};
let zt = class extends l {
  constructor() {
    super(...arguments), this._activeId = "";
  }
  render() {
    return h`
      <div class="items" part="container" @bh-activity-item-click=${this._handleItemClick}>
        <slot></slot>
      </div>
    `;
  }
  get activeId() {
    return this._activeId;
  }
  setActive(t) {
    this._activeId = t, this._updateItems();
  }
  _handleItemClick(t) {
    const { id: e, label: s } = t.detail, a = this._activeId === e;
    this._activeId = a ? "" : e, this._updateItems(), this.dispatchEvent(
      new CustomEvent("bh-activity-change", {
        bubbles: !0,
        composed: !0,
        detail: {
          id: this._activeId,
          label: this._activeId ? s : ""
        }
      })
    );
  }
  _updateItems() {
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector("slot");
    if (!t) return;
    const e = t.assignedElements({ flatten: !0 }).filter(
      (a) => a.tagName === "BH-ACTIVITY-ITEM"
    );
    for (const a of e)
      a.active = a.itemId === this._activeId;
  }
};
zt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-direction: column;
        width: var(--bh-activity-bar-width, 48px);
        background: var(--bh-activity-bar-bg, var(--bh-color-surface-recessed));
        border-right: var(--bh-border-1) solid var(--bh-activity-bar-border, var(--bh-color-border));
        padding-top: var(--bh-spacing-2);
      }

      .items {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--bh-spacing-1);
      }
    `
];
Jr([
  C()
], zt.prototype, "_activeId", 2);
zt = Jr([
  u("bh-activity-bar")
], zt);
var mo = Object.defineProperty, yo = Object.getOwnPropertyDescriptor, Kr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? yo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && mo(e, s, r), r;
};
let kt = class extends l {
  constructor() {
    super(...arguments), this.collapsed = !1, this._firstUpdate = !0;
  }
  render() {
    return h`
      <div class="header" part="header">
        <slot name="header"></slot>
      </div>
      <div class="body" part="body">
        <slot></slot>
      </div>
    `;
  }
  updated(t) {
    if (this._firstUpdate) {
      this._firstUpdate = !1;
      return;
    }
    t.has("collapsed") && this.dispatchEvent(
      new CustomEvent("bh-sidebar-collapse", {
        bubbles: !0,
        composed: !0,
        detail: { collapsed: this.collapsed }
      })
    );
  }
};
kt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        width: var(--bh-sidebar-panel-width, 250px);
        background: var(--bh-sidebar-panel-bg, var(--bh-color-surface));
        border-right: var(--bh-border-1) solid var(--bh-sidebar-panel-border, var(--bh-color-border));
        overflow: hidden;
        transition: width var(--bh-transition-normal);
      }

      :host([collapsed]) {
        width: 0;
      }

      .header {
        display: flex;
        align-items: center;
        height: var(--bh-spacing-9);
        padding: 0 var(--bh-spacing-3);
        border-bottom: var(--bh-border-1) solid var(--bh-sidebar-panel-border, var(--bh-color-border));
        flex-shrink: 0;
      }

      .body {
        overflow-y: auto;
        height: calc(100% - var(--bh-spacing-9));
      }
    `
];
Kr([
  n({ type: Boolean, reflect: !0 })
], kt.prototype, "collapsed", 2);
kt = Kr([
  u("bh-sidebar-panel")
], kt);
var _o = Object.defineProperty, xo = Object.getOwnPropertyDescriptor, br = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? xo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && _o(e, s, r), r;
};
let it = class extends l {
  constructor() {
    super(...arguments), this.message = "", this.error = !1;
  }
  render() {
    return h`
      <div class="bar" part="bar" role="status" aria-live="polite">
        <div class="start">
          ${this.message ? h`<span class="message">${this.message}</span>` : ""}
          <slot></slot>
        </div>
        <div class="end">
          <slot name="end"></slot>
        </div>
      </div>
    `;
  }
};
it.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        height: var(--bh-spacing-6);
        background: var(--bh-status-bar-bg, var(--bh-color-surface));
        border-top: var(--bh-border-1) solid var(--bh-status-bar-border, var(--bh-color-border));
        color: var(--bh-status-bar-text, var(--bh-color-text-muted));
        font-size: var(--bh-text-xs);
        line-height: var(--bh-spacing-6);
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 var(--bh-spacing-3);
        gap: var(--bh-spacing-2);
      }

      .start,
      .end {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        min-width: 0;
      }

      .start {
        flex: 1;
        overflow: hidden;
      }

      .end {
        flex-shrink: 0;
      }

      .message {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      :host([error]) {
        color: var(--bh-status-bar-error-text, var(--bh-color-danger));
      }
    `
];
br([
  n()
], it.prototype, "message", 2);
br([
  n({ type: Boolean, reflect: !0 })
], it.prototype, "error", 2);
it = br([
  u("bh-status-bar")
], it);
var wo = Object.defineProperty, $o = Object.getOwnPropertyDescriptor, Xr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? $o(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && wo(e, s, r), r;
};
let St = class extends l {
  constructor() {
    super(...arguments), this.label = "";
  }
  render() {
    return h`
      <div class="header" part="header">
        <span class="label" part="label">${this.label}</span>
        <div class="end">
          <slot name="end"></slot>
        </div>
      </div>
    `;
  }
};
St.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--bh-panel-header-height, 36px);
        padding: 0 var(--bh-spacing-3);
        gap: var(--bh-spacing-2);
      }

      .label {
        font-size: var(--bh-text-xs);
        font-weight: var(--bh-font-semibold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--bh-panel-header-text, var(--bh-color-text-muted));
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .end {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-1);
        flex-shrink: 0;
      }
    `
];
Xr([
  n()
], St.prototype, "label", 2);
St = Xr([
  u("bh-panel-header")
], St);
var Co = Object.defineProperty, Po = Object.getOwnPropertyDescriptor, qt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Po(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Co(e, s, r), r;
};
let Pe = class extends l {
  constructor() {
    super(...arguments), this.gap = "sm", this.variant = "default", this.sticky = !1;
  }
  render() {
    return h`
      <div class="toolbar" part="toolbar" role="toolbar">
        <div class="start"><slot name="start"></slot></div>
        <div class="center"><slot></slot></div>
        <div class="end"><slot name="end"></slot></div>
      </div>
    `;
  }
};
Pe.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .toolbar {
        display: flex;
        align-items: center;
        padding: var(--bh-spacing-2) var(--bh-spacing-4);
      }

      /* Variant: surface */
      :host([variant='surface']) .toolbar {
        background: var(--bh-toolbar-bg, var(--bh-color-surface));
      }

      /* Sticky border */
      :host([sticky]) {
        position: sticky;
        top: 0;
        z-index: var(--bh-z-sticky);
      }

      :host([sticky]) .toolbar {
        border-bottom: var(--bh-border-1) solid var(--bh-toolbar-border, var(--bh-color-border));
      }

      /* Gap sizes */
      .toolbar {
        gap: var(--bh-spacing-2);
      }

      :host([gap='xs']) .toolbar {
        gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) .toolbar {
        gap: var(--bh-spacing-2);
      }

      :host([gap='md']) .toolbar {
        gap: var(--bh-spacing-4);
      }

      /* Sections */
      .start,
      .center,
      .end {
        display: flex;
        align-items: center;
        gap: inherit;
      }

      .start {
        margin-inline-end: auto;
      }

      .center {
        flex: 1;
        justify-content: center;
      }

      .end {
        margin-inline-start: auto;
      }
    `
];
qt([
  n({ reflect: !0 })
], Pe.prototype, "gap", 2);
qt([
  n({ reflect: !0 })
], Pe.prototype, "variant", 2);
qt([
  n({ type: Boolean, reflect: !0 })
], Pe.prototype, "sticky", 2);
Pe = qt([
  u("bh-toolbar")
], Pe);
var Oo = Object.defineProperty, Ao = Object.getOwnPropertyDescriptor, ft = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ao(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Oo(e, s, r), r;
};
let Et = class extends l {
  constructor() {
    super(...arguments), this.multiple = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("bh-toggle", this._handleItemToggle);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("bh-toggle", this._handleItemToggle);
  }
  _handleItemToggle(t) {
    if (this.multiple || !t.detail.open) return;
    const e = t.composedPath().find(
      (a) => a.tagName === "BH-ACCORDION-ITEM"
    ), s = this.querySelectorAll("bh-accordion-item");
    for (const a of s)
      a !== e && a.open && (a.open = !1);
  }
  render() {
    return h`<slot></slot>`;
  }
};
Et.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }
    `
];
ft([
  n({ type: Boolean, reflect: !0 })
], Et.prototype, "multiple", 2);
Et = ft([
  u("bh-accordion")
], Et);
let nt = class extends l {
  constructor() {
    super(...arguments), this.label = "", this.open = !1;
  }
  render() {
    return h`
      <button
        class="header"
        part="header"
        aria-expanded=${this.open}
        aria-controls="accordion-content"
        @click=${this._toggle}
      >
        <slot name="header">${this.label}</slot>
        <bh-icon class="chevron" part="chevron" name="chevron-right" size="sm" aria-hidden="true"></bh-icon>
      </button>
      <div class="content-wrapper">
        <div id="accordion-content" class="content" part="content">
          <div class="content-inner">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
  _toggle() {
    this.open = !this.open, this.dispatchEvent(
      new CustomEvent("bh-toggle", {
        bubbles: !0,
        composed: !0,
        detail: { open: this.open, label: this.label }
      })
    );
  }
};
nt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        border-bottom: var(--bh-border-1) solid var(--bh-accordion-border, var(--bh-color-border));
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--bh-spacing-3) var(--bh-spacing-4);
        cursor: pointer;
        user-select: none;
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        color: var(--bh-color-text);
        background: none;
        border: none;
        width: 100%;
        text-align: start;
      }

      .header:hover {
        background: var(--bh-color-surface);
      }

      .header:focus-visible {
        outline: var(--bh-border-2) solid var(--bh-color-ring);
        outline-offset: -2px;
      }

      .chevron {
        display: inline-flex;
        transition: transform var(--bh-transition-fast);
        color: var(--bh-color-text-muted);
        flex-shrink: 0;
      }

      :host([open]) .chevron {
        transform: rotate(90deg);
      }

      .content-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows var(--bh-transition-fast);
      }

      :host([open]) .content-wrapper {
        grid-template-rows: 1fr;
      }

      .content {
        overflow: hidden;
      }

      .content-inner {
        padding: 0 var(--bh-spacing-4) var(--bh-spacing-3);
      }
    `
];
ft([
  n()
], nt.prototype, "label", 2);
ft([
  n({ type: Boolean, reflect: !0 })
], nt.prototype, "open", 2);
nt = ft([
  u("bh-accordion-item")
], nt);
var zo = Object.defineProperty, ko = Object.getOwnPropertyDescriptor, Lt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ko(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && zo(e, s, r), r;
};
let Oe = class extends l {
  constructor() {
    super(...arguments), this.title = "Terminal", this.status = "", this.statusColor = "success";
  }
  render() {
    return h`
      <div class="bar" part="bar">
        <div class="bar-left">
          <bh-led color="danger" size="sm"></bh-led>
          <bh-led color="warning" size="sm"></bh-led>
          <bh-led color="success" size="sm"></bh-led>
          <span class="title" part="title">${this.title}</span>
        </div>
        <div class="bar-right">
          ${this.status ? h`
                <span class="status" part="status">
                  <bh-led color=${this.statusColor} size="sm" pulse></bh-led>
                  ${this.status}
                </span>
              ` : c}
        </div>
      </div>
    `;
  }
};
Oe.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--bh-terminal-bar-height, 32px);
        padding: 0 12px;
        background: var(--bh-terminal-bar-bg, var(--bh-color-surface-recessed));
        border-bottom: 1px solid var(--bh-color-border);
        box-shadow: var(--bh-shadow-emboss);
        user-select: none;
      }

      .bar-left {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .title {
        font-family: var(--bh-font-mono);
        font-size: 10px;
        font-weight: var(--bh-font-medium);
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--bh-color-text-tertiary);
        margin-left: 8px;
      }

      .bar-right {
        display: flex;
        align-items: center;
      }

      .status {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: var(--bh-font-mono);
        font-size: 8px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--bh-color-text-tertiary);
      }
    `
];
Lt([
  n()
], Oe.prototype, "title", 2);
Lt([
  n()
], Oe.prototype, "status", 2);
Lt([
  n({ reflect: !0, attribute: "status-color" })
], Oe.prototype, "statusColor", 2);
Oe = Lt([
  u("bh-terminal-bar")
], Oe);
var So = Object.defineProperty, Eo = Object.getOwnPropertyDescriptor, V = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Eo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && So(e, s, r), r;
};
let j = class extends l {
  constructor() {
    super(...arguments), this.prompt = "▸ ", this.promptUser = "", this.promptPath = "~", this.disabled = !1, this._history = [], this._historyIndex = -1, this._tempLine = "";
  }
  /** Focus the internal input element. */
  focus() {
    this.updateComplete.then(() => {
      var t;
      (t = this._input) == null || t.focus();
    });
  }
  _onKeydown(t) {
    const e = this._input;
    if (t.key === "Enter") {
      t.preventDefault();
      const s = e.value.trim();
      s && (this._history = [...this._history, s], this._historyIndex = -1, this._tempLine = "", this.dispatchEvent(
        new CustomEvent("bh-command", { detail: s, bubbles: !0, composed: !0 })
      ), e.value = "");
      return;
    }
    if (t.key === "ArrowUp") {
      if (t.preventDefault(), this._history.length === 0) return;
      this._historyIndex === -1 ? (this._tempLine = e.value, this._historyIndex = this._history.length - 1) : this._historyIndex > 0 && this._historyIndex--, e.value = this._history[this._historyIndex];
      return;
    }
    if (t.key === "ArrowDown") {
      if (t.preventDefault(), this._historyIndex === -1) return;
      this._historyIndex++, this._historyIndex >= this._history.length ? (this._historyIndex = -1, e.value = this._tempLine, this._tempLine = "") : e.value = this._history[this._historyIndex];
      return;
    }
    if (t.key === "Tab") {
      t.preventDefault(), this.dispatchEvent(
        new CustomEvent("bh-tab-complete", {
          detail: e.value,
          bubbles: !0,
          composed: !0
        })
      );
      return;
    }
    if (t.ctrlKey)
      switch (t.key) {
        case "c":
          t.preventDefault(), this.dispatchEvent(
            new CustomEvent("bh-interrupt", { bubbles: !0, composed: !0 })
          ), e.value = "";
          return;
        case "l":
          t.preventDefault(), this.dispatchEvent(
            new CustomEvent("bh-clear", { bubbles: !0, composed: !0 })
          );
          return;
        case "u":
          t.preventDefault(), e.value = "";
          return;
        case "k":
          t.preventDefault(), e.value = e.value.substring(0, e.selectionStart ?? 0);
          return;
        case "a":
          t.preventDefault(), e.setSelectionRange(0, 0);
          return;
        case "e":
          t.preventDefault(), e.setSelectionRange(e.value.length, e.value.length);
          return;
      }
  }
  render() {
    return h`
      <div class="input-area" part="input-area">
        ${this.promptUser ? h`
              <div class="prompt-line">
                <span class="prompt-chrome">\u250C\u2500[</span>
                <span class="prompt-user">${this.promptUser}</span>
                <span class="prompt-chrome">]\u2500[</span>
                <span class="prompt-path">${this.promptPath}</span>
                <span class="prompt-chrome">]</span>
              </div>
            ` : c}
        <div class="prompt-line">
          ${this.promptUser ? h`<span class="prompt-chrome">\u2514\u2500</span>` : c}
          <span class="prompt-char" part="prompt">${this.prompt}</span>
          <input
            type="text"
            class="cmd-input"
            part="input"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            @keydown=${this._onKeydown}
          />
        </div>
      </div>
    `;
  }
};
j.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .input-area {
        background: var(--bh-color-bg, var(--bh-color-cod));
        padding: 0 16px 12px;
        flex-shrink: 0;
      }

      .prompt-line {
        display: flex;
        align-items: flex-start;
        font-family: var(--bh-font-mono);
        font-size: 13px;
        line-height: 1.5;
      }

      .prompt-chrome {
        color: var(--bh-color-text-tertiary);
        white-space: pre;
        user-select: none;
      }

      .prompt-user {
        color: var(--bh-color-primary);
      }

      .prompt-path {
        color: var(--bh-color-success, var(--bh-color-text));
      }

      .prompt-char {
        color: var(--bh-color-primary);
        white-space: pre;
        user-select: none;
        flex-shrink: 0;
      }

      .cmd-input {
        flex: 1;
        font-family: var(--bh-font-mono);
        font-size: 13px;
        line-height: 1.5;
        color: var(--bh-color-text);
        background: transparent;
        border: none;
        outline: none;
        caret-color: var(--bh-color-primary);
        padding: 0;
        margin: 0;
      }

      .cmd-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        .cmd-input {
          font-size: 16px;
        }
      }
    `
];
V([
  n()
], j.prototype, "prompt", 2);
V([
  n({ attribute: "prompt-user" })
], j.prototype, "promptUser", 2);
V([
  n({ attribute: "prompt-path" })
], j.prototype, "promptPath", 2);
V([
  n({ type: Boolean, reflect: !0 })
], j.prototype, "disabled", 2);
V([
  C()
], j.prototype, "_history", 2);
V([
  C()
], j.prototype, "_historyIndex", 2);
V([
  C()
], j.prototype, "_tempLine", 2);
V([
  It(".cmd-input")
], j.prototype, "_input", 2);
j = V([
  u("bh-terminal-input")
], j);
var Do = Object.defineProperty, Bo = Object.getOwnPropertyDescriptor, Qr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Bo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Do(e, s, r), r;
};
let Dt = class extends l {
  constructor() {
    super(...arguments), this.hints = [];
  }
  render() {
    return h`
      <div class="bar" part="bar">
        ${this.hints.map(
      (t) => h`
            <span class="hint">
              <kbd>${t.key}</kbd> ${t.label}
            </span>
          `
    )}
      </div>
    `;
  }
};
Dt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .bar {
        display: flex;
        align-items: center;
        height: 24px;
        padding: 0 12px;
        gap: 16px;
        background: var(--bh-color-surface-recessed);
        border-top: 1px solid var(--bh-color-border);
      }

      .hint {
        font-family: var(--bh-font-mono);
        font-size: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--bh-color-text-tertiary);
      }

      kbd {
        color: var(--bh-color-primary);
        font-family: inherit;
      }

      @media (hover: none) and (pointer: coarse) {
        :host {
          display: none;
        }
      }
    `
];
Qr([
  n({ attribute: !1 })
], Dt.prototype, "hints", 2);
Dt = Qr([
  u("bh-terminal-hint-bar")
], Dt);
var jo = Object.defineProperty, Io = Object.getOwnPropertyDescriptor, ae = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Io(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && jo(e, s, r), r;
};
let R = class extends l {
  constructor() {
    super(...arguments), this.value = "", this.label = "", this.selected = !1, this.expanded = !1, this.indent = 0, this.roving = !1, this._hasChildren = !1;
  }
  render() {
    return h`
      <div
        class="row"
        part="row"
        role="treeitem"
        aria-level=${this.indent + 1}
        aria-expanded=${this._hasChildren ? String(this.expanded) : c}
        aria-selected=${String(this.selected)}
        tabindex=${this.selected || this.roving ? "0" : "-1"}
        style="--indent-level: ${this.indent}"
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        ${this._hasChildren ? h`<bh-icon class="chevron" part="chevron" name="chevron-right" size="sm" aria-hidden="true"></bh-icon>` : h`<span class="chevron-placeholder"></span>`}
        <slot name="icon"></slot>
        <span class="label" part="label">${this.label}</span>
        <span class="end"><slot name="end"></slot></span>
      </div>
      <div class="children" role="group">
        <slot name="children" @slotchange=${this._onChildrenSlotChange}></slot>
      </div>
    `;
  }
  _onChildrenSlotChange(t) {
    const e = t.target;
    this._hasChildren = e.assignedElements().length > 0;
  }
  _handleClick() {
    this._hasChildren && (this.expanded = !this.expanded), this.dispatchEvent(
      new CustomEvent("bh-tree-item-click", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value, label: this.label }
      })
    );
  }
  _handleKeydown(t) {
    t.key === "Enter" || t.key === " " ? (t.preventDefault(), this._handleClick()) : t.key === "ArrowRight" && this._hasChildren && !this.expanded ? (t.preventDefault(), this.expanded = !0) : t.key === "ArrowLeft" && this.expanded && (t.preventDefault(), this.expanded = !1);
  }
};
R.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }

      .row {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        width: 100%;
        padding: var(--bh-spacing-1) var(--bh-spacing-2);
        padding-left: calc(var(--bh-spacing-4) + var(--indent-level) * var(--bh-spacing-4));
        border: none;
        border-left: var(--bh-border-2) solid transparent;
        border-radius: 0;
        background: none;
        color: var(--bh-color-text);
        font-family: var(--bh-font-sans);
        font-size: var(--bh-text-sm);
        line-height: var(--bh-leading-normal);
        text-align: left;
        cursor: pointer;
        transition: background var(--bh-transition-fast),
                    color var(--bh-transition-fast);
      }

      .row:hover {
        background: var(--bh-tree-item-hover-bg, var(--bh-color-secondary));
      }

      .row:focus-visible {
        outline: var(--bh-border-2) solid var(--bh-color-ring);
        outline-offset: -2px;
      }

      :host([selected]) .row {
        background: var(--bh-tree-item-selected-bg, var(--bh-color-surface-raised));
        color: var(--bh-tree-item-selected-color, var(--bh-color-primary));
        border-left-color: var(--bh-color-primary);
      }

      .chevron {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--bh-spacing-4);
        height: var(--bh-spacing-4);
        flex-shrink: 0;
        transition: transform var(--bh-transition-fast);
      }

      :host([expanded]) .chevron {
        transform: rotate(90deg);
      }

      .chevron-placeholder {
        width: var(--bh-spacing-4);
        height: var(--bh-spacing-4);
        flex-shrink: 0;
      }

      .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .end {
        margin-left: auto;
        flex-shrink: 0;
      }

      .children {
        display: none;
      }

      :host([expanded]) .children {
        display: block;
      }
    `
];
ae([
  n()
], R.prototype, "value", 2);
ae([
  n()
], R.prototype, "label", 2);
ae([
  n({ type: Boolean, reflect: !0 })
], R.prototype, "selected", 2);
ae([
  n({ type: Boolean, reflect: !0 })
], R.prototype, "expanded", 2);
ae([
  n({ type: Number })
], R.prototype, "indent", 2);
ae([
  n({ type: Boolean })
], R.prototype, "roving", 2);
ae([
  C()
], R.prototype, "_hasChildren", 2);
R = ae([
  u("bh-tree-item")
], R);
var To = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, Zr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ho(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && To(e, s, r), r;
};
let Bt = class extends l {
  constructor() {
    super(...arguments), this.selected = "", this._onItemClick = (t) => {
      const { value: e, label: s } = t.detail;
      this.selected = e, this.dispatchEvent(
        new CustomEvent("bh-select", {
          bubbles: !0,
          composed: !0,
          detail: { value: e, label: s }
        })
      );
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("bh-tree-item-click", this._onItemClick), this.setAttribute("role", "tree"), this._updateSelection();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("bh-tree-item-click", this._onItemClick);
  }
  updated(t) {
    t.has("selected") && this._updateSelection();
  }
  render() {
    return h`<slot></slot>`;
  }
  _updateSelection() {
    const t = this.querySelectorAll("bh-tree-item");
    let e = !1;
    t.forEach((s) => {
      s.selected = s.value === this.selected, s.roving = !1, s.selected && (e = !0);
    }), !e && t.length > 0 && (t[0].roving = !0);
  }
};
Bt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }
    `
];
Zr([
  n()
], Bt.prototype, "selected", 2);
Bt = Zr([
  u("bh-tree")
], Bt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ir = (t, e, s) => {
  const a = /* @__PURE__ */ new Map();
  for (let r = e; r <= s; r++) a.set(t[r], r);
  return a;
}, es = Be(class extends dt {
  constructor(t) {
    if (super(t), t.type !== H.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, s) {
    let a;
    s === void 0 ? s = e : e !== void 0 && (a = e);
    const r = [], o = [];
    let i = 0;
    for (const p of t) r[i] = a ? a(p, i) : i, o[i] = s(p, i), i++;
    return { values: o, keys: r };
  }
  render(t, e, s) {
    return this.dt(t, e, s).values;
  }
  update(t, [e, s, a]) {
    const r = ea(t), { values: o, keys: i } = this.dt(e, s, a);
    if (!Array.isArray(r)) return this.ut = i, o;
    const p = this.ut ?? (this.ut = []), d = [];
    let g, m, v = 0, y = r.length - 1, f = 0, _ = o.length - 1;
    for (; v <= y && f <= _; ) if (r[v] === null) v++;
    else if (r[y] === null) y--;
    else if (p[v] === i[f]) d[f] = ie(r[v], o[f]), v++, f++;
    else if (p[y] === i[_]) d[_] = ie(r[y], o[_]), y--, _--;
    else if (p[v] === i[_]) d[_] = ie(r[v], o[_]), Ge(t, d[_ + 1], r[v]), v++, _--;
    else if (p[y] === i[f]) d[f] = ie(r[y], o[f]), Ge(t, r[v], r[y]), y--, f++;
    else if (g === void 0 && (g = Ir(i, f, _), m = Ir(p, v, y)), g.has(p[v])) if (g.has(p[y])) {
      const O = m.get(i[f]), yt = O !== void 0 ? r[O] : null;
      if (yt === null) {
        const Re = Ge(t, r[v]);
        ie(Re, o[f]), d[f] = Re;
      } else d[f] = ie(yt, o[f]), Ge(t, r[v], yt), r[O] = null;
      f++;
    } else Zt(r[y]), y--;
    else Zt(r[v]), v++;
    for (; f <= _; ) {
      const O = Ge(t, d[_ + 1]);
      ie(O, o[f]), d[f++] = O;
    }
    for (; v <= y; ) {
      const O = r[v++];
      O !== null && Zt(O);
    }
    return this.ut = i, Lr(t, d), x;
  }
});
var Mo = Object.defineProperty, No = Object.getOwnPropertyDescriptor, Ne = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? No(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Mo(e, s, r), r;
};
let ee = class extends l {
  constructor() {
    super(...arguments), this.open = !1, this.placeholder = "Type a command...", this.items = [], this._query = "", this._selectedIndex = 0;
  }
  get _filteredItems() {
    return this._query ? this.items.map((t) => ({
      item: t,
      score: this._fuzzyScore(t.label, this._query)
    })).filter((t) => t.score > 0).sort((t, e) => e.score - t.score).map((t) => t.item) : this.items;
  }
  _fuzzyScore(t, e) {
    const s = t.toLowerCase(), a = e.toLowerCase();
    let r = 0, o = 0, i = 0;
    for (let p = 0; p < s.length && o < a.length; p++)
      s[p] === a[o] ? (r += 1 + i, i++, o++) : i = 0;
    return o === a.length ? r : 0;
  }
  toggle() {
    this.open ? this.close() : this.show();
  }
  show() {
    this.open = !0, this._query = "", this._selectedIndex = 0, this.dispatchEvent(
      new CustomEvent("bh-open", { bubbles: !0, composed: !0 })
    ), this.updateComplete.then(() => {
      var t, e;
      (e = (t = this.shadowRoot) == null ? void 0 : t.querySelector("input")) == null || e.focus();
    });
  }
  close() {
    this.open = !1, this.dispatchEvent(
      new CustomEvent("bh-close", { bubbles: !0, composed: !0 })
    );
  }
  _onInput(t) {
    this._query = t.target.value, this._selectedIndex = 0;
  }
  _onKeydown(t) {
    const e = this._filteredItems;
    switch (t.key) {
      case "ArrowDown":
        t.preventDefault(), this._selectedIndex = Math.min(
          this._selectedIndex + 1,
          e.length - 1
        );
        break;
      case "ArrowUp":
        t.preventDefault(), this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
        break;
      case "Enter":
        t.preventDefault(), this._executeItem(e[this._selectedIndex]);
        break;
      case "Escape":
        this.close();
        break;
    }
  }
  _executeItem(t) {
    t && (this.close(), this.dispatchEvent(
      new CustomEvent("bh-execute", {
        bubbles: !0,
        composed: !0,
        detail: { id: t.id, label: t.label }
      })
    ));
  }
  _onItemClick(t) {
    this._executeItem(t);
  }
  render() {
    if (!this.open) return c;
    const t = this._filteredItems, e = t.length > 0 ? `cp-item-${this._selectedIndex}` : void 0;
    return h`
      <div class="backdrop" @click=${this.close}></div>
      <div class="palette" role="combobox" aria-expanded="true" aria-haspopup="listbox">
        <input
          type="text"
          .placeholder=${this.placeholder}
          .value=${this._query}
          @input=${this._onInput}
          @keydown=${this._onKeydown}
          aria-label=${this.placeholder || "Search commands"}
          aria-autocomplete="list"
          aria-controls="cp-results"
          aria-activedescendant=${e ?? c}
        />
        <div class="results" id="cp-results" role="listbox" aria-live="polite">
          ${t.length === 0 ? h`<div class="empty">No matching commands</div>` : es(
      t,
      (s) => s.id,
      (s, a) => h`
                  <div
                    id="cp-item-${a}"
                    class="item"
                    role="option"
                    aria-selected=${String(a === this._selectedIndex)}
                    @click=${() => this._onItemClick(s)}
                  >
                    <span class="item-label">
                      ${s.category ? h`<span class="item-category">${s.category}:</span>` : c}
                      ${s.label}
                    </span>
                    ${s.keybinding ? h`<span class="item-keybinding">${s.keybinding}</span>` : c}
                  </div>
                `
    )}
        </div>
      </div>
    `;
  }
  updated() {
    var e;
    const t = (e = this.shadowRoot) == null ? void 0 : e.querySelector('.item[aria-selected="true"]');
    t == null || t.scrollIntoView({ block: "nearest" });
  }
};
ee.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: none;
        position: fixed;
        inset: 0;
        z-index: var(--bh-z-modal);
      }

      :host([open]) {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 15vh;
      }

      .backdrop {
        position: fixed;
        inset: 0;
        background: var(--bh-command-palette-backdrop, var(--bh-color-overlay));
      }

      .palette {
        position: relative;
        width: var(--bh-command-palette-width, min(500px, 90vw));
        background: var(--bh-color-surface);
        border: var(--bh-border-1) solid var(--bh-color-border);
        border-radius: var(--bh-radius-lg);
        box-shadow: var(--bh-shadow-xl);
        overflow: hidden;
      }

      input {
        width: 100%;
        padding: var(--bh-spacing-2) var(--bh-spacing-3);
        background: var(--bh-color-surface-recessed);
        border: none;
        border-bottom: var(--bh-border-1) solid var(--bh-color-border);
        color: var(--bh-color-text);
        font-size: var(--bh-text-sm);
        font-family: inherit;
        outline: none;
      }

      input::placeholder {
        color: var(--bh-color-text-muted);
      }

      .results {
        max-height: var(--bh-command-palette-max-height, 300px);
        overflow-y: auto;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--bh-spacing-2) var(--bh-spacing-3);
        cursor: pointer;
        transition: background var(--bh-transition-fast);
      }

      .item:hover,
      .item[aria-selected='true'] {
        background: var(--bh-color-surface-raised);
      }

      .item-label {
        font-size: var(--bh-text-sm);
        color: var(--bh-color-text);
      }

      .item-category {
        font-size: var(--bh-text-xs);
        color: var(--bh-color-text-muted);
        margin-right: var(--bh-spacing-2);
      }

      .item-keybinding {
        font-family: var(--bh-font-mono);
        font-size: var(--bh-text-xs);
        color: var(--bh-color-text-muted);
        background: var(--bh-color-surface-recessed);
        padding: var(--bh-spacing-0-5) var(--bh-spacing-1-5);
        border-radius: var(--bh-radius-sm);
      }

      .empty {
        padding: var(--bh-spacing-3);
        font-size: var(--bh-text-sm);
        color: var(--bh-color-text-muted);
      }
    `
];
Ne([
  n({ type: Boolean, reflect: !0 })
], ee.prototype, "open", 2);
Ne([
  n({ type: String })
], ee.prototype, "placeholder", 2);
Ne([
  n({ type: Array })
], ee.prototype, "items", 2);
Ne([
  C()
], ee.prototype, "_query", 2);
Ne([
  C()
], ee.prototype, "_selectedIndex", 2);
ee = Ne([
  u("bh-command-palette")
], ee);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Uo = Be(class extends dt {
  constructor(t) {
    var e;
    if (super(t), t.type !== H.ATTRIBUTE || t.name !== "class" || ((e = t.strings) == null ? void 0 : e.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((e) => t[e]).join(" ") + " ";
  }
  update(t, [e]) {
    var a, r;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((o) => o !== "")));
      for (const o in e) e[o] && !((a = this.nt) != null && a.has(o)) && this.st.add(o);
      return this.render(e);
    }
    const s = t.element.classList;
    for (const o of this.st) o in e || (s.remove(o), this.st.delete(o));
    for (const o in e) {
      const i = !!e[o];
      i === this.st.has(o) || (r = this.nt) != null && r.has(o) || (i ? (s.add(o), this.st.add(o)) : (s.remove(o), this.st.delete(o)));
    }
    return x;
  }
});
var Ro = Object.defineProperty, qo = Object.getOwnPropertyDescriptor, Ue = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? qo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Ro(e, s, r), r;
};
let te = class extends l {
  constructor() {
    super(...arguments), this.open = !1, this.x = 0, this.y = 0, this.items = [], this._selectedIndex = -1;
  }
  get _actionableItems() {
    return this.items.filter((t) => !t.separator && !t.disabled);
  }
  show(t, e, s) {
    s && (this.items = s), this.x = t, this.y = e, this.open = !0, this._selectedIndex = -1;
  }
  hide() {
    this.open = !1, this._selectedIndex = -1;
  }
  _onBackdropClick() {
    this.hide();
  }
  _onKeydown(t) {
    const e = this._actionableItems;
    switch (t.key) {
      case "Escape":
        this.hide();
        break;
      case "ArrowDown": {
        t.preventDefault();
        const s = this._selectedIndex + 1;
        s < e.length && (this._selectedIndex = s);
        break;
      }
      case "ArrowUp": {
        t.preventDefault();
        const s = this._selectedIndex - 1;
        s >= 0 && (this._selectedIndex = s);
        break;
      }
      case "Enter": {
        t.preventDefault();
        const s = e[this._selectedIndex];
        s && this._selectItem(s);
        break;
      }
    }
  }
  _selectItem(t) {
    t.disabled || (this.hide(), this.dispatchEvent(
      new CustomEvent("bh-select", {
        bubbles: !0,
        composed: !0,
        detail: { id: t.id, label: t.label }
      })
    ));
  }
  _isSelected(t) {
    return this._actionableItems[this._selectedIndex] === t;
  }
  render() {
    if (!this.open) return c;
    const e = this._actionableItems[this._selectedIndex], s = e ? `ctx-item-${this.items.indexOf(e)}` : void 0;
    return h`
      <div class="backdrop" @click=${this._onBackdropClick}></div>
      <div
        class="menu"
        role="menu"
        tabindex="-1"
        aria-activedescendant=${s ?? c}
        style="left: ${this.x}px; top: ${this.y}px"
        @keydown=${this._onKeydown}
      >
        ${es(
      this.items,
      (a) => a.id,
      (a, r) => a.separator ? h`<div class="separator" role="separator"></div>` : h`
                  <div
                    id="ctx-item-${r}"
                    class=${Uo({
        item: !0,
        disabled: !!a.disabled
      })}
                    role="menuitem"
                    aria-disabled=${a.disabled ? "true" : "false"}
                    aria-selected=${String(this._isSelected(a))}
                    @click=${() => this._selectItem(a)}
                  >
                    ${a.icon ? h`<bh-icon name=${a.icon} size="sm" aria-hidden="true"></bh-icon>` : c}
                    ${a.label}
                  </div>
                `
    )}
      </div>
    `;
  }
  updated() {
    var t;
    if (this.open) {
      const e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(".menu");
      e == null || e.focus();
    }
  }
};
te.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: none;
        position: fixed;
        inset: 0;
        z-index: var(--bh-z-popover);
      }

      :host([open]) {
        display: block;
      }

      .backdrop {
        position: fixed;
        inset: 0;
      }

      .menu {
        position: fixed;
        min-width: var(--bh-context-menu-min-width, 160px);
        background: var(--bh-color-surface-raised);
        border: var(--bh-border-1) solid var(--bh-color-border);
        border-radius: var(--bh-radius-md);
        box-shadow: var(--bh-shadow-md);
        padding: var(--bh-spacing-1) 0;
        overflow: hidden;
      }

      .item {
        display: flex;
        align-items: center;
        gap: var(--bh-spacing-2);
        padding: var(--bh-spacing-1-5) var(--bh-spacing-3);
        cursor: pointer;
        font-size: var(--bh-text-sm);
        color: var(--bh-color-text);
        transition: background var(--bh-transition-fast);
      }

      .item:hover,
      .item[aria-selected='true'] {
        background: var(--bh-color-surface-overlay);
      }

      .item.disabled {
        color: var(--bh-color-text-muted);
        cursor: default;
        pointer-events: none;
      }

      .separator {
        height: 1px;
        margin: var(--bh-spacing-1) 0;
        background: var(--bh-color-border-muted);
      }
    `
];
Ue([
  n({ type: Boolean, reflect: !0 })
], te.prototype, "open", 2);
Ue([
  n({ type: Number })
], te.prototype, "x", 2);
Ue([
  n({ type: Number })
], te.prototype, "y", 2);
Ue([
  n({ type: Array })
], te.prototype, "items", 2);
Ue([
  C()
], te.prototype, "_selectedIndex", 2);
te = Ue([
  u("bh-context-menu")
], te);
var Lo = Object.defineProperty, Go = Object.getOwnPropertyDescriptor, P = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Go(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Lo(e, s, r), r;
};
let $ = class extends l {
  constructor() {
    super(...arguments), this.title = "Terminal", this.status = "", this.statusColor = "success", this.prompt = "▸ ", this.promptUser = "", this.promptPath = "~", this.maxLines = 1e3, this.autoscroll = !0, this.hints = [], this.scanlines = !1, this._mode = "idle";
  }
  // --- TerminalAdapter implementation ---
  /** Append text to the current (last) line. Create a line if none exist. */
  write(t) {
    if (!this._output) return;
    let e = this._output.querySelector(".line:last-child");
    e || (e = document.createElement("div"), e.className = "line", this._output.appendChild(e)), e.innerHTML += Le(t), this._scrollToBottom();
  }
  /** Append a complete line. Optionally tag it with an id for later replacement. */
  writeLine(t, e) {
    if (!this._output) return;
    const s = document.createElement("div");
    s.className = "line", s.innerHTML = Le(t), e != null && e.id && s.setAttribute("data-line-id", e.id), this._output.appendChild(s), this._trimLines(), this._scrollToBottom();
  }
  /** Write a line styled as an error. */
  writeError(t) {
    this.writeLine("{danger}" + t + "{/}");
  }
  /** Update a previously written line identified by id. Falls back to writeLine. */
  replaceLine(t, e) {
    if (!this._output) return;
    const s = this._output.querySelector(`[data-line-id="${t}"]`);
    s ? s.innerHTML = Le(e) : this.writeLine(e, { id: t });
  }
  /** Enter RUNNING state — disable input. */
  startCommand() {
    this._mode = "running";
  }
  /** Return to IDLE state — re-enable and focus input. */
  endCommand() {
    this._mode = "idle", this.updateComplete.then(() => {
      var t;
      (t = this._input) == null || t.focus();
    });
  }
  /** Clear the scrollback buffer. */
  clear() {
    this._output && (this._output.innerHTML = "");
  }
  /** Focus the terminal input. */
  focus() {
    var t;
    (t = this._input) == null || t.focus();
  }
  // --- Private helpers ---
  _scrollToBottom() {
    this.autoscroll && this._output && requestAnimationFrame(() => {
      this._output.scrollTop = this._output.scrollHeight;
    });
  }
  _trimLines() {
    if (this._output && this.maxLines > 0)
      for (; this._output.children.length > this.maxLines; )
        this._output.removeChild(this._output.firstChild);
  }
  /** Echo the user's command to the output area with prompt decoration. */
  _echo(t) {
    if (this._output) {
      if (this.promptUser) {
        const e = document.createElement("div");
        e.className = "line", e.innerHTML = '<span class="bh-t-tertiary">┌─[</span><span class="bh-t-primary">' + this.promptUser + '</span><span class="bh-t-tertiary">]─[</span><span class="bh-t-success">' + this.promptPath + '</span><span class="bh-t-tertiary">]</span>', this._output.appendChild(e);
        const s = document.createElement("div");
        s.className = "line", s.innerHTML = '<span class="bh-t-tertiary">└─</span><span class="bh-t-primary">' + this.prompt + "</span>" + Le(t), this._output.appendChild(s);
      } else {
        const e = document.createElement("div");
        e.className = "line", e.innerHTML = '<span class="bh-t-primary">' + this.prompt + "</span>" + Le(t), this._output.appendChild(e);
      }
      this._trimLines(), this._scrollToBottom();
    }
  }
  // --- Event handlers ---
  async _onCommand(t) {
    const e = t.detail;
    if (this._echo(e), this._handler) {
      const s = e.split(/\s+/), a = s[0], r = s.slice(1);
      try {
        await this._handler.execute(a, r, this);
      } catch (o) {
        this.writeError(o instanceof Error ? o.message : String(o));
      }
    } else
      this.dispatchEvent(
        new CustomEvent("bh-command", {
          detail: e,
          bubbles: !0,
          composed: !0
        })
      );
  }
  _onInterrupt() {
    this._mode === "running" && this.endCommand(), this.writeLine("{tertiary}^C{/}");
  }
  _onTabComplete(t) {
    var e, s;
    if ((e = this._handler) != null && e.complete) {
      const a = this._handler.complete(t.detail);
      if (a.length === 1) {
        const o = (s = this._input.shadowRoot) == null ? void 0 : s.querySelector(".cmd-input");
        o && (o.value = a[0]);
      } else a.length > 1 && this.writeLine(a.join("  "));
    } else
      this.dispatchEvent(
        new CustomEvent("bh-tab-complete", {
          detail: t.detail,
          bubbles: !0,
          composed: !0
        })
      );
  }
  render() {
    return h`
      <div class="terminal" part="terminal">
        <bh-terminal-bar
          title=${this.title}
          status=${this.status}
          status-color=${this.statusColor}
        ></bh-terminal-bar>
        <div class="output" part="output"></div>
        <bh-terminal-input
          prompt=${this.prompt}
          prompt-user=${this.promptUser}
          prompt-path=${this.promptPath}
          ?disabled=${this._mode === "running"}
          @bh-command=${this._onCommand}
          @bh-interrupt=${this._onInterrupt}
          @bh-tab-complete=${this._onTabComplete}
          @bh-clear=${() => this.clear()}
        ></bh-terminal-input>
        ${this.hints.length ? h`<bh-terminal-hint-bar .hints=${this.hints}></bh-terminal-hint-bar>` : ""}
      </div>
    `;
  }
};
$.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
        color-scheme: dark;
      }

      .terminal {
        display: flex;
        flex-direction: column;
        height: var(--bh-terminal-height, 100%);
        background: var(--bh-color-cod, #0d0c0a);
        border: 1px solid var(--bh-color-tundora, #2a2826);
        border-radius: var(--bh-radius-lg, 8px);
        overflow: hidden;
        color: var(--bh-color-swiss-coffee, #c8c4bc);
        font-family: var(--bh-font-mono);
      }

      .output {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 12px 16px 0;
        min-height: 0;
        background: var(--bh-color-cod, #0d0c0a);
      }

      .output::-webkit-scrollbar {
        width: 6px;
      }
      .output::-webkit-scrollbar-track {
        background: var(--bh-color-cod, #0d0c0a);
      }
      .output::-webkit-scrollbar-thumb {
        background: var(--bh-color-tundora, #2a2826);
        border-radius: 3px;
      }

      .line {
        font-family: var(--bh-font-mono);
        font-size: 13px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
        min-height: 1.5em;
      }

      /* Scanlines overlay */
      :host([scanlines]) .terminal {
        position: relative;
      }

      :host([scanlines]) .terminal::after {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.08) 2px,
          rgba(0, 0, 0, 0.08) 4px
        );
        pointer-events: none;
        z-index: 1;
      }

      /* Links in terminal output */
      .output a {
        color: var(--bh-color-primary);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .output a:hover {
        color: var(--bh-color-primary-hover, var(--bh-color-primary));
      }

      /* Terminal color tag classes — map to bh-01 semantic tokens */
      .bh-t-primary {
        color: var(--bh-color-primary);
      }
      .bh-t-success {
        color: var(--bh-color-success);
      }
      .bh-t-warning {
        color: var(--bh-color-warning);
      }
      .bh-t-danger {
        color: var(--bh-color-danger);
      }
      .bh-t-text {
        color: var(--bh-color-text);
      }
      .bh-t-bright {
        color: var(--bh-color-text-bright);
      }
      .bh-t-muted {
        color: var(--bh-color-text-muted);
      }
      .bh-t-tertiary {
        color: var(--bh-color-text-tertiary);
      }
      .bh-t-bold {
        font-weight: var(--bh-font-medium, 500);
      }
    `
];
P([
  n()
], $.prototype, "title", 2);
P([
  n()
], $.prototype, "status", 2);
P([
  n({ attribute: "status-color" })
], $.prototype, "statusColor", 2);
P([
  n()
], $.prototype, "prompt", 2);
P([
  n({ attribute: "prompt-user" })
], $.prototype, "promptUser", 2);
P([
  n({ attribute: "prompt-path" })
], $.prototype, "promptPath", 2);
P([
  n({ type: Number, attribute: "max-lines" })
], $.prototype, "maxLines", 2);
P([
  n({ type: Boolean })
], $.prototype, "autoscroll", 2);
P([
  n({ attribute: !1 })
], $.prototype, "hints", 2);
P([
  n({ type: Boolean, reflect: !0 })
], $.prototype, "scanlines", 2);
P([
  Es({ context: Ds, subscribe: !0 })
], $.prototype, "_handler", 2);
P([
  C()
], $.prototype, "_mode", 2);
P([
  It(".output")
], $.prototype, "_output", 2);
P([
  It("bh-terminal-input")
], $.prototype, "_input", 2);
$ = P([
  u("bh-terminal")
], $);
var Fo = Object.defineProperty, Vo = Object.getOwnPropertyDescriptor, Gt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Vo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Fo(e, s, r), r;
};
let Ae = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.align = "stretch", this.wrap = !1;
  }
  render() {
    return h`<slot></slot>`;
  }
};
Ae.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--bh-stack-gap, var(--bh-spacing-4));
        min-width: 0;
      }

      /* Gap */
      :host([gap='none']) {
        --bh-stack-gap: 0;
      }

      :host([gap='xs']) {
        --bh-stack-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-stack-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-stack-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-stack-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-stack-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-stack-gap: var(--bh-spacing-12);
      }

      /* Align */
      :host([align='start']) {
        align-items: flex-start;
      }

      :host([align='center']) {
        align-items: center;
      }

      :host([align='end']) {
        align-items: flex-end;
      }

      :host([align='stretch']) {
        align-items: stretch;
      }

      /* Wrap */
      :host([wrap]) {
        flex-wrap: wrap;
      }
    `
];
Gt([
  n({ reflect: !0 })
], Ae.prototype, "gap", 2);
Gt([
  n({ reflect: !0 })
], Ae.prototype, "align", 2);
Gt([
  n({ type: Boolean, reflect: !0 })
], Ae.prototype, "wrap", 2);
Ae = Gt([
  u("bh-stack")
], Ae);
var Wo = Object.defineProperty, Yo = Object.getOwnPropertyDescriptor, mt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Yo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Wo(e, s, r), r;
};
let ue = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.justify = "start", this.align = "center", this.nowrap = !1;
  }
  render() {
    return h`<slot></slot>`;
  }
};
ue.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--bh-cluster-gap, var(--bh-spacing-4));
        min-width: 0;
      }

      /* Gap */
      :host([gap='none']) {
        --bh-cluster-gap: 0;
      }

      :host([gap='xs']) {
        --bh-cluster-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-cluster-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-cluster-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-cluster-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-cluster-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-cluster-gap: var(--bh-spacing-12);
      }

      /* Justify */
      :host([justify='start']) {
        justify-content: flex-start;
      }

      :host([justify='center']) {
        justify-content: center;
      }

      :host([justify='end']) {
        justify-content: flex-end;
      }

      :host([justify='between']) {
        justify-content: space-between;
      }

      :host([justify='around']) {
        justify-content: space-around;
      }

      :host([justify='evenly']) {
        justify-content: space-evenly;
      }

      /* Align */
      :host([align='start']) {
        align-items: flex-start;
      }

      :host([align='center']) {
        align-items: center;
      }

      :host([align='end']) {
        align-items: flex-end;
      }

      :host([align='stretch']) {
        align-items: stretch;
      }

      /* Nowrap */
      :host([nowrap]) {
        flex-wrap: nowrap;
      }
    `
];
mt([
  n({ reflect: !0 })
], ue.prototype, "gap", 2);
mt([
  n({ reflect: !0 })
], ue.prototype, "justify", 2);
mt([
  n({ reflect: !0 })
], ue.prototype, "align", 2);
mt([
  n({ type: Boolean, reflect: !0 })
], ue.prototype, "nowrap", 2);
ue = mt([
  u("bh-cluster")
], ue);
var Jo = Object.defineProperty, Ko = Object.getOwnPropertyDescriptor, ur = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Ko(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Jo(e, s, r), r;
};
let lt = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.align = "center";
  }
  render() {
    return h`<slot></slot>`;
  }
};
lt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--bh-repel-gap, var(--bh-spacing-4));
        min-width: 0;
      }

      /* Gap */
      :host([gap='none']) {
        --bh-repel-gap: 0;
      }

      :host([gap='xs']) {
        --bh-repel-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-repel-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-repel-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-repel-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-repel-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-repel-gap: var(--bh-spacing-12);
      }

      /* Align */
      :host([align='start']) {
        align-items: flex-start;
      }

      :host([align='center']) {
        align-items: center;
      }

      :host([align='end']) {
        align-items: flex-end;
      }

      :host([align='stretch']) {
        align-items: stretch;
      }
    `
];
ur([
  n({ reflect: !0 })
], lt.prototype, "gap", 2);
ur([
  n({ reflect: !0 })
], lt.prototype, "align", 2);
lt = ur([
  u("bh-repel")
], lt);
var Xo = Object.defineProperty, Qo = Object.getOwnPropertyDescriptor, Ft = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? Qo(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Xo(e, s, r), r;
};
let ze = class extends l {
  constructor() {
    super(...arguments), this.max = "none", this.gutters = "none", this.intrinsic = !1;
  }
  willUpdate(t) {
    t.has("max") && this.style.setProperty("--bh-center-max", this.max);
  }
  render() {
    return h`<slot></slot>`;
  }
};
ze.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        max-inline-size: var(--bh-center-max, none);
        padding-inline: var(--bh-center-gutters, 0);
        margin-inline: auto;
        min-width: 0;
      }

      /* Intrinsic */
      :host([intrinsic]) {
        align-items: center;
      }

      /* Gutters */
      :host([gutters='none']) {
        --bh-center-gutters: 0;
      }

      :host([gutters='xs']) {
        --bh-center-gutters: var(--bh-spacing-1);
      }

      :host([gutters='sm']) {
        --bh-center-gutters: var(--bh-spacing-2);
      }

      :host([gutters='md']) {
        --bh-center-gutters: var(--bh-spacing-4);
      }

      :host([gutters='lg']) {
        --bh-center-gutters: var(--bh-spacing-6);
      }

      :host([gutters='xl']) {
        --bh-center-gutters: var(--bh-spacing-8);
      }

      :host([gutters='2xl']) {
        --bh-center-gutters: var(--bh-spacing-12);
      }
    `
];
Ft([
  n({ reflect: !0 })
], ze.prototype, "max", 2);
Ft([
  n({ reflect: !0 })
], ze.prototype, "gutters", 2);
Ft([
  n({ type: Boolean, reflect: !0 })
], ze.prototype, "intrinsic", 2);
ze = Ft([
  u("bh-center")
], ze);
var Zo = Object.defineProperty, ei = Object.getOwnPropertyDescriptor, Vt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ei(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && Zo(e, s, r), r;
};
let ke = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.itemWidth = "auto", this.snap = !1;
  }
  willUpdate(t) {
    t.has("itemWidth") && this.style.setProperty("--bh-reel-item-width", this.itemWidth);
  }
  render() {
    return h`<slot></slot>`;
  }
};
ke.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        overflow-x: auto;
        gap: var(--bh-reel-gap, var(--bh-spacing-4));
        min-width: 0;
      }

      /* Gap */
      :host([gap='none']) {
        --bh-reel-gap: 0;
      }

      :host([gap='xs']) {
        --bh-reel-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-reel-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-reel-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-reel-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-reel-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-reel-gap: var(--bh-spacing-12);
      }

      /* Snap */
      :host([snap]) {
        scroll-snap-type: x mandatory;
      }

      :host([snap]) ::slotted(*) {
        scroll-snap-align: start;
      }

      /* Item width */
      ::slotted(*) {
        flex: 0 0 var(--bh-reel-item-width, auto);
      }
    `
];
Vt([
  n({ reflect: !0 })
], ke.prototype, "gap", 2);
Vt([
  n({ reflect: !0, attribute: "item-width" })
], ke.prototype, "itemWidth", 2);
Vt([
  n({ type: Boolean, reflect: !0 })
], ke.prototype, "snap", 2);
ke = Vt([
  u("bh-reel")
], ke);
var ti = Object.defineProperty, ri = Object.getOwnPropertyDescriptor, vr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ri(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ti(e, s, r), r;
};
let ht = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.minHeight = "100vh";
  }
  willUpdate(t) {
    t.has("minHeight") && this.style.setProperty("--bh-cover-min-height", this.minHeight);
  }
  render() {
    return h`
      <slot></slot>
      <slot name="center"></slot>
      <slot name="bottom"></slot>
    `;
  }
};
ht.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--bh-cover-gap, var(--bh-spacing-4));
        min-block-size: var(--bh-cover-min-height, 100vh);
        min-width: 0;
      }

      /* Gap */
      :host([gap='none']) {
        --bh-cover-gap: 0;
      }

      :host([gap='xs']) {
        --bh-cover-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-cover-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-cover-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-cover-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-cover-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-cover-gap: var(--bh-spacing-12);
      }

      ::slotted([slot='center']) {
        flex-grow: 1;
      }
    `
];
vr([
  n({ reflect: !0 })
], ht.prototype, "gap", 2);
vr([
  n({ reflect: !0, attribute: "min-height" })
], ht.prototype, "minHeight", 2);
ht = vr([
  u("bh-cover")
], ht);
var si = Object.defineProperty, ai = Object.getOwnPropertyDescriptor, gr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ai(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && si(e, s, r), r;
};
let ct = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.min = "250px";
  }
  willUpdate(t) {
    t.has("min") && this.style.setProperty("--bh-grid-min", this.min);
  }
  render() {
    return h`<slot></slot>`;
  }
};
ct.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(min(100%, var(--bh-grid-min, 250px)), 1fr)
        );
        gap: var(--bh-grid-gap, var(--bh-spacing-4));
      }

      /* Gap */
      :host([gap='none']) {
        --bh-grid-gap: 0;
      }

      :host([gap='xs']) {
        --bh-grid-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-grid-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-grid-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-grid-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-grid-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-grid-gap: var(--bh-spacing-12);
      }
    `
];
gr([
  n({ reflect: !0 })
], ct.prototype, "gap", 2);
gr([
  n({ reflect: !0 })
], ct.prototype, "min", 2);
ct = gr([
  u("bh-grid")
], ct);
var oi = Object.defineProperty, ii = Object.getOwnPropertyDescriptor, fr = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? ii(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && oi(e, s, r), r;
};
let pt = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.ratio = "1/1";
  }
  willUpdate(t) {
    if (t.has("ratio")) {
      const e = this.ratio.split("/").map((s) => `${s.trim()}fr`).join(" ");
      this.style.setProperty("grid-template-columns", e);
    }
  }
  render() {
    return h`<slot></slot>`;
  }
};
pt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: grid;
        gap: var(--bh-split-gap, var(--bh-spacing-4));
      }

      /* Gap */
      :host([gap='none']) {
        --bh-split-gap: 0;
      }

      :host([gap='xs']) {
        --bh-split-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-split-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-split-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-split-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-split-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-split-gap: var(--bh-spacing-12);
      }
    `
];
fr([
  n({ reflect: !0 })
], pt.prototype, "gap", 2);
fr([
  n({ reflect: !0 })
], pt.prototype, "ratio", 2);
pt = fr([
  u("bh-split")
], pt);
var ni = Object.defineProperty, li = Object.getOwnPropertyDescriptor, Wt = (t, e, s, a) => {
  for (var r = a > 1 ? void 0 : a ? li(e, s) : e, o = t.length - 1, i; o >= 0; o--)
    (i = t[o]) && (r = (a ? i(e, s, r) : i(r)) || r);
  return a && r && ni(e, s, r), r;
};
let Se = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.threshold = "30rem", this.limit = 4;
  }
  willUpdate(t) {
    if (t.has("threshold") || t.has("limit")) {
      this.style.setProperty("--bh-switcher-threshold", this.threshold);
      const e = `calc(100% / ${this.limit})`, s = "var(--bh-switcher-threshold, 30rem)";
      this.style.gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, max(${s}, ${e})), 1fr))`;
    }
  }
  render() {
    return h`<slot></slot>`;
  }
};
Se.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: grid;
        gap: var(--bh-switcher-gap, var(--bh-spacing-4));
      }

      /* Gap */
      :host([gap='none']) {
        --bh-switcher-gap: 0;
      }

      :host([gap='xs']) {
        --bh-switcher-gap: var(--bh-spacing-1);
      }

      :host([gap='sm']) {
        --bh-switcher-gap: var(--bh-spacing-2);
      }

      :host([gap='md']) {
        --bh-switcher-gap: var(--bh-spacing-4);
      }

      :host([gap='lg']) {
        --bh-switcher-gap: var(--bh-spacing-6);
      }

      :host([gap='xl']) {
        --bh-switcher-gap: var(--bh-spacing-8);
      }

      :host([gap='2xl']) {
        --bh-switcher-gap: var(--bh-spacing-12);
      }
    `
];
Wt([
  n({ reflect: !0 })
], Se.prototype, "gap", 2);
Wt([
  n({ reflect: !0 })
], Se.prototype, "threshold", 2);
Wt([
  n({ type: Number, reflect: !0 })
], Se.prototype, "limit", 2);
Se = Wt([
  u("bh-switcher")
], Se);
export {
  l as BaseElement,
  Et as BhAccordion,
  nt as BhAccordionItem,
  zt as BhActivityBar,
  Ce as BhActivityItem,
  At as BhAppShell,
  J as BhAvatar,
  Qe as BhBadge,
  q as BhButton,
  N as BhCard,
  ze as BhCenter,
  L as BhCheckbox,
  Q as BhChip,
  ue as BhCluster,
  B as BhCodeBlock,
  ee as BhCommandPalette,
  te as BhContextMenu,
  ht as BhCover,
  at as BhDataTable,
  _e as BhDivider,
  Z as BhFormField,
  ct as BhGrid,
  w as BhIcon,
  k as BhInput,
  ce as BhLed,
  pe as BhLink,
  be as BhNavItem,
  St as BhPanelHeader,
  de as BhPixelDisplay,
  z as BhPixelPanel,
  G as BhProgress,
  K as BhRadio,
  ke as BhReel,
  lt as BhRepel,
  st as BhSectionHeader,
  X as BhSegmentDisplay,
  S as BhSelect,
  kt as BhSidebarPanel,
  xe as BhSkeleton,
  M as BhSlider,
  Ze as BhSpinner,
  pt as BhSplit,
  Ae as BhStack,
  it as BhStatusBar,
  we as BhSwitch,
  Se as BhSwitcher,
  $e as BhTab,
  Pt as BhTabBar,
  ot as BhTabPanel,
  U as BhTable,
  Ot as BhTabs,
  $ as BhTerminal,
  Oe as BhTerminalBar,
  rt as BhTerminalCursor,
  Dt as BhTerminalHintBar,
  j as BhTerminalInput,
  et as BhText,
  A as BhTextarea,
  Pe as BhToolbar,
  tt as BhTooltip,
  Bt as BhTree,
  R as BhTreeItem,
  xs as PIXEL_FONT,
  Ga as PixelDataController,
  Ps as TERMINAL_TAG_MAP,
  Ka as animatePixels,
  Cs as barToGrid,
  Ds as commandHandlerContext,
  di as compositeGrids,
  Os as escapeTerminalHtml,
  ks as linkifyUrls,
  As as parseColorTags,
  Le as renderTerminalText,
  $s as sparklineToGrid,
  ws as textToGrid
};
