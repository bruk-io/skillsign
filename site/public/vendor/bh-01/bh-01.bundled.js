/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, Zt = mt.ShadowRoot && (mt.ShadyCSS === void 0 || mt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, er = Symbol(), mr = /* @__PURE__ */ new WeakMap();
let Br = class {
  constructor(e, s, a) {
    if (this._$cssResult$ = !0, a !== er) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Zt && e === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (e = mr.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && mr.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zr = (r) => new Br(typeof r == "string" ? r : r + "", void 0, er), b = (r, ...e) => {
  const s = r.length === 1 ? r[0] : e.reduce((a, t, o) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(t) + r[o + 1], r[0]);
  return new Br(s, r, er);
}, es = (r, e) => {
  if (Zt) r.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const a = document.createElement("style"), t = mt.litNonce;
    t !== void 0 && a.setAttribute("nonce", t), a.textContent = s.cssText, r.appendChild(a);
  }
}, yr = Zt ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const a of e.cssRules) s += a.cssText;
  return Zr(s);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ts, defineProperty: rs, getOwnPropertyDescriptor: ss, getOwnPropertyNames: as, getOwnPropertySymbols: os, getPrototypeOf: is } = Object, V = globalThis, _r = V.trustedTypes, ns = _r ? _r.emptyScript : "", Ft = V.reactiveElementPolyfillSupport, Le = (r, e) => r, yt = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? ns : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let s = r;
  switch (e) {
    case Boolean:
      s = r !== null;
      break;
    case Number:
      s = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(r);
      } catch {
        s = null;
      }
  }
  return s;
} }, tr = (r, e) => !ts(r, e), xr = { attribute: !0, type: String, converter: yt, reflect: !1, useDefault: !1, hasChanged: tr };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), V.litPropertyMetadata ?? (V.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let fe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = xr) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const a = Symbol(), t = this.getPropertyDescriptor(e, a, s);
      t !== void 0 && rs(this.prototype, e, t);
    }
  }
  static getPropertyDescriptor(e, s, a) {
    const { get: t, set: o } = ss(this.prototype, e) ?? { get() {
      return this[s];
    }, set(i) {
      this[s] = i;
    } };
    return { get: t, set(i) {
      const p = t == null ? void 0 : t.call(this);
      o == null || o.call(this, i), this.requestUpdate(e, p, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? xr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Le("elementProperties"))) return;
    const e = is(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Le("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Le("properties"))) {
      const s = this.properties, a = [...as(s), ...os(s)];
      for (const t of a) this.createProperty(t, s[t]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [a, t] of s) this.elementProperties.set(a, t);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, a] of this.elementProperties) {
      const t = this._$Eu(s, a);
      t !== void 0 && this._$Eh.set(t, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const t of a) s.unshift(yr(t));
    } else e !== void 0 && s.push(yr(e));
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
    return es(e, this.constructor.elementStyles), e;
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
    const a = this.constructor.elementProperties.get(e), t = this.constructor._$Eu(e, a);
    if (t !== void 0 && a.reflect === !0) {
      const i = (((o = a.converter) == null ? void 0 : o.toAttribute) !== void 0 ? a.converter : yt).toAttribute(s, a.type);
      this._$Em = e, i == null ? this.removeAttribute(t) : this.setAttribute(t, i), this._$Em = null;
    }
  }
  _$AK(e, s) {
    var o, i;
    const a = this.constructor, t = a._$Eh.get(e);
    if (t !== void 0 && this._$Em !== t) {
      const p = a.getPropertyOptions(t), d = typeof p.converter == "function" ? { fromAttribute: p.converter } : ((o = p.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? p.converter : yt;
      this._$Em = t;
      const f = d.fromAttribute(s, p.type);
      this[t] = f ?? ((i = this._$Ej) == null ? void 0 : i.get(t)) ?? f, this._$Em = null;
    }
  }
  requestUpdate(e, s, a, t = !1, o) {
    var i;
    if (e !== void 0) {
      const p = this.constructor;
      if (t === !1 && (o = this[e]), a ?? (a = p.getPropertyOptions(e)), !((a.hasChanged ?? tr)(o, s) || a.useDefault && a.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(p._$Eu(e, a)))) return;
      this.C(e, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: a, reflect: t, wrapped: o }, i) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? s ?? this[e]), o !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (s = void 0), this._$AL.set(e, s)), t === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
      const t = this.constructor.elementProperties;
      if (t.size > 0) for (const [o, i] of t) {
        const { wrapped: p } = i, d = this[o];
        p !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, i, d);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), (a = this._$EO) == null || a.forEach((t) => {
        var o;
        return (o = t.hostUpdate) == null ? void 0 : o.call(t);
      }), this.update(s)) : this._$EM();
    } catch (t) {
      throw e = !1, this._$EM(), t;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var s;
    (s = this._$EO) == null || s.forEach((a) => {
      var t;
      return (t = a.hostUpdated) == null ? void 0 : t.call(a);
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
fe.elementStyles = [], fe.shadowRootOptions = { mode: "open" }, fe[Le("elementProperties")] = /* @__PURE__ */ new Map(), fe[Le("finalized")] = /* @__PURE__ */ new Map(), Ft == null || Ft({ ReactiveElement: fe }), (V.reactiveElementVersions ?? (V.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = globalThis, wr = (r) => r, _t = qe.trustedTypes, $r = _t ? _t.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Tr = "$lit$", F = `lit$${Math.random().toFixed(9).slice(2)}$`, Mr = "?" + F, ls = `<${Mr}>`, ie = document, Ve = () => ie.createComment(""), We = (r) => r === null || typeof r != "object" && typeof r != "function", rr = Array.isArray, hs = (r) => rr(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Vt = `[ 	
\f\r]`, He = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pr = /-->/g, Cr = />/g, re = RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Or = /'/g, Ar = /"/g, Ur = /^(?:script|style|textarea|title)$/i, cs = (r) => (e, ...s) => ({ _$litType$: r, strings: e, values: s }), h = cs(1), x = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), zr = /* @__PURE__ */ new WeakMap(), ae = ie.createTreeWalker(ie, 129);
function Hr(r, e) {
  if (!rr(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $r !== void 0 ? $r.createHTML(e) : e;
}
const ps = (r, e) => {
  const s = r.length - 1, a = [];
  let t, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = He;
  for (let p = 0; p < s; p++) {
    const d = r[p];
    let f, m, v = -1, y = 0;
    for (; y < d.length && (i.lastIndex = y, m = i.exec(d), m !== null); ) y = i.lastIndex, i === He ? m[1] === "!--" ? i = Pr : m[1] !== void 0 ? i = Cr : m[2] !== void 0 ? (Ur.test(m[2]) && (t = RegExp("</" + m[2], "g")), i = re) : m[3] !== void 0 && (i = re) : i === re ? m[0] === ">" ? (i = t ?? He, v = -1) : m[1] === void 0 ? v = -2 : (v = i.lastIndex - m[2].length, f = m[1], i = m[3] === void 0 ? re : m[3] === '"' ? Ar : Or) : i === Ar || i === Or ? i = re : i === Pr || i === Cr ? i = He : (i = re, t = void 0);
    const g = i === re && r[p + 1].startsWith("/>") ? " " : "";
    o += i === He ? d + ls : v >= 0 ? (a.push(f), d.slice(0, v) + Tr + d.slice(v) + F + g) : d + F + (v === -2 ? p : g);
  }
  return [Hr(r, o + (r[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Ye {
  constructor({ strings: e, _$litType$: s }, a) {
    let t;
    this.parts = [];
    let o = 0, i = 0;
    const p = e.length - 1, d = this.parts, [f, m] = ps(e, s);
    if (this.el = Ye.createElement(f, a), ae.currentNode = this.el.content, s === 2 || s === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (t = ae.nextNode()) !== null && d.length < p; ) {
      if (t.nodeType === 1) {
        if (t.hasAttributes()) for (const v of t.getAttributeNames()) if (v.endsWith(Tr)) {
          const y = m[i++], g = t.getAttribute(v).split(F), _ = /([.?@])?(.*)/.exec(y);
          d.push({ type: 1, index: o, name: _[2], strings: g, ctor: _[1] === "." ? bs : _[1] === "?" ? us : _[1] === "@" ? vs : Dt }), t.removeAttribute(v);
        } else v.startsWith(F) && (d.push({ type: 6, index: o }), t.removeAttribute(v));
        if (Ur.test(t.tagName)) {
          const v = t.textContent.split(F), y = v.length - 1;
          if (y > 0) {
            t.textContent = _t ? _t.emptyScript : "";
            for (let g = 0; g < y; g++) t.append(v[g], Ve()), ae.nextNode(), d.push({ type: 2, index: ++o });
            t.append(v[y], Ve());
          }
        }
      } else if (t.nodeType === 8) if (t.data === Mr) d.push({ type: 2, index: o });
      else {
        let v = -1;
        for (; (v = t.data.indexOf(F, v + 1)) !== -1; ) d.push({ type: 7, index: o }), v += F.length - 1;
      }
      o++;
    }
  }
  static createElement(e, s) {
    const a = ie.createElement("template");
    return a.innerHTML = e, a;
  }
}
function ge(r, e, s = r, a) {
  var i, p;
  if (e === x) return e;
  let t = a !== void 0 ? (i = s._$Co) == null ? void 0 : i[a] : s._$Cl;
  const o = We(e) ? void 0 : e._$litDirective$;
  return (t == null ? void 0 : t.constructor) !== o && ((p = t == null ? void 0 : t._$AO) == null || p.call(t, !1), o === void 0 ? t = void 0 : (t = new o(r), t._$AT(r, s, a)), a !== void 0 ? (s._$Co ?? (s._$Co = []))[a] = t : s._$Cl = t), t !== void 0 && (e = ge(r, t._$AS(r, e.values), t, a)), e;
}
class ds {
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
    const { el: { content: s }, parts: a } = this._$AD, t = ((e == null ? void 0 : e.creationScope) ?? ie).importNode(s, !0);
    ae.currentNode = t;
    let o = ae.nextNode(), i = 0, p = 0, d = a[0];
    for (; d !== void 0; ) {
      if (i === d.index) {
        let f;
        d.type === 2 ? f = new Ee(o, o.nextSibling, this, e) : d.type === 1 ? f = new d.ctor(o, d.name, d.strings, this, e) : d.type === 6 && (f = new fs(o, this, e)), this._$AV.push(f), d = a[++p];
      }
      i !== (d == null ? void 0 : d.index) && (o = ae.nextNode(), i++);
    }
    return ae.currentNode = ie, t;
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
  constructor(e, s, a, t) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = a, this.options = t, this._$Cv = (t == null ? void 0 : t.isConnected) ?? !0;
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
    e = ge(this, e, s), We(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : hs(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && We(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ie.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: s, _$litType$: a } = e, t = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Ye.createElement(Hr(a.h, a.h[0]), this.options)), a);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === t) this._$AH.p(s);
    else {
      const i = new ds(t, this), p = i.u(this.options);
      i.p(s), this.T(p), this._$AH = i;
    }
  }
  _$AC(e) {
    let s = zr.get(e.strings);
    return s === void 0 && zr.set(e.strings, s = new Ye(e)), s;
  }
  k(e) {
    rr(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, t = 0;
    for (const o of e) t === s.length ? s.push(a = new Ee(this.O(Ve()), this.O(Ve()), this, this.options)) : a = s[t], a._$AI(o), t++;
    t < s.length && (this._$AR(a && a._$AB.nextSibling, t), s.length = t);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, s); e !== this._$AB; ) {
      const t = wr(e).nextSibling;
      wr(e).remove(), e = t;
    }
  }
  setConnected(e) {
    var s;
    this._$AM === void 0 && (this._$Cv = e, (s = this._$AP) == null || s.call(this, e));
  }
}
class Dt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, a, t, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = s, this._$AM = t, this.options = o, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = c;
  }
  _$AI(e, s = this, a, t) {
    const o = this.strings;
    let i = !1;
    if (o === void 0) e = ge(this, e, s, 0), i = !We(e) || e !== this._$AH && e !== x, i && (this._$AH = e);
    else {
      const p = e;
      let d, f;
      for (e = o[0], d = 0; d < o.length - 1; d++) f = ge(this, p[a + d], s, d), f === x && (f = this._$AH[d]), i || (i = !We(f) || f !== this._$AH[d]), f === c ? e = c : e !== c && (e += (f ?? "") + o[d + 1]), this._$AH[d] = f;
    }
    i && !t && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class bs extends Dt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class us extends Dt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class vs extends Dt {
  constructor(e, s, a, t, o) {
    super(e, s, a, t, o), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = ge(this, e, s, 0) ?? c) === x) return;
    const a = this._$AH, t = e === c && a !== c || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, o = e !== c && (a === c || t);
    t && this.element.removeEventListener(this.name, this, a), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class fs {
  constructor(e, s, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ge(this, e);
  }
}
const gs = { I: Ee }, Wt = qe.litHtmlPolyfillSupport;
Wt == null || Wt(Ye, Ee), (qe.litHtmlVersions ?? (qe.litHtmlVersions = [])).push("3.3.2");
const ms = (r, e, s) => {
  const a = (s == null ? void 0 : s.renderBefore) ?? e;
  let t = a._$litPart$;
  if (t === void 0) {
    const o = (s == null ? void 0 : s.renderBefore) ?? null;
    a._$litPart$ = t = new Ee(e.insertBefore(Ve(), o), o, void 0, s ?? {});
  }
  return t._$AI(r), t;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis;
let Ge = class extends fe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ms(s, this.renderRoot, this.renderOptions);
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
var kr;
Ge._$litElement$ = !0, Ge.finalized = !0, (kr = oe.litElementHydrateSupport) == null || kr.call(oe, { LitElement: Ge });
const Yt = oe.litElementPolyfillSupport;
Yt == null || Yt({ LitElement: Ge });
(oe.litElementVersions ?? (oe.litElementVersions = [])).push("4.2.2");
const fr = class fr extends Ge {
};
fr.styles = b`
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
let l = fr;
const ys = {
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
function _s(r, e, s, a = 1) {
  const t = new Uint8Array(e * s), o = r.toUpperCase(), i = 5, p = 3, d = 1, f = Math.max(0, Math.floor((s - i) / 2));
  let m = 0;
  for (const v of o) {
    const y = ys[v];
    if (y) {
      for (let g = 0; g < i; g++) {
        const _ = y[g];
        for (let O = 0; O < p; O++)
          if (_ >> p - 1 - O & 1) {
            const Ue = m + O, gr = f + g;
            Ue < e && gr < s && (t[gr * e + Ue] = a);
          }
      }
      if (m += p + d, m >= e) break;
    }
  }
  return t;
}
function xs(r, e, s, a = 1) {
  const t = new Uint8Array(e * s);
  if (r.length === 0 || s === 0 || e === 0) return t;
  const o = Math.max(...r), i = o > 0 ? r.map((m) => m / o) : r.map(() => 0), p = Math.max(0, i.length - e), d = i.slice(p), f = e - d.length;
  for (let m = 0; m < d.length; m++) {
    if (d[m] === 0) continue;
    const v = Math.round(d[m] * (s - 1));
    for (let y = 0; y <= v; y++) {
      const g = s - 1 - y;
      t[g * e + (f + m)] = a;
    }
  }
  return t;
}
function ws(r, e, s, a = 1) {
  const t = new Uint8Array(e * s);
  if (s === 0 || e === 0) return t;
  const o = Math.max(0, Math.min(100, r)), i = Math.round(o / 100 * e), p = Math.floor(s / 2);
  for (let d = 0; d < i; d++)
    t[p * e + d] = a;
  return t;
}
function ni(r, ...e) {
  const s = new Uint8Array(r);
  for (const a of e) {
    const t = Math.min(s.length, a.length);
    for (let o = 0; o < t; o++)
      a[o] !== 0 && (s[o] = a[o]);
  }
  return s;
}
const $s = {
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
function Ps(r) {
  return r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Cs(r) {
  return r.replace(/\{(\/?[a-zA-Z]*)\}/g, (e, s) => {
    if (s === "/")
      return "</span>";
    const a = $s[s];
    return a ? `<span class="${a}">` : `{${s}}`;
  });
}
const Os = /https?:\/\/[^\s<>"']+/g;
function As(r) {
  return r.replace(Os, (e) => `<a href="${e}" target="_blank" rel="noopener noreferrer" part="link">${e}</a>`);
}
function Ne(r) {
  const e = Ps(r), s = Cs(e);
  return As(s);
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let zs = class extends Event {
  constructor(e, s, a, t) {
    super("context-request", { bubbles: !0, composed: !0 }), this.context = e, this.contextTarget = s, this.callback = a, this.subscribe = t ?? !1;
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
  constructor(e, s, a, t) {
    if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (o, i) => {
      this.unsubscribe && (this.unsubscribe !== i && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = o, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(o, i)), this.unsubscribe = i;
    }, this.host = e, s.context !== void 0) {
      const o = s;
      this.context = o.context, this.callback = o.callback, this.subscribe = o.subscribe ?? !1;
    } else this.context = s, this.callback = a, this.subscribe = t ?? !1;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new zs(this.context, this.host, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Es({ context: r, subscribe: e }) {
  return (s, a) => {
    typeof a == "object" ? a.addInitializer((function() {
      new Er(this, { context: r, callback: (t) => {
        s.set.call(this, t);
      }, subscribe: e });
    })) : s.constructor.addInitializer(((t) => {
      new Er(t, { context: r, callback: (o) => {
        t[a] = o;
      }, subscribe: e });
    }));
  };
}
const Ss = "bh-terminal-handler";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (r) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ds = { attribute: !0, type: String, converter: yt, reflect: !1, hasChanged: tr }, Is = (r = Ds, e, s) => {
  const { kind: a, metadata: t } = s;
  let o = globalThis.litPropertyMetadata.get(t);
  if (o === void 0 && globalThis.litPropertyMetadata.set(t, o = /* @__PURE__ */ new Map()), a === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(s.name, r), a === "accessor") {
    const { name: i } = s;
    return { set(p) {
      const d = e.get.call(this);
      e.set.call(this, p), this.requestUpdate(i, d, r, !0, p);
    }, init(p) {
      return p !== void 0 && this.C(i, void 0, r, p), p;
    } };
  }
  if (a === "setter") {
    const { name: i } = s;
    return function(p) {
      const d = this[i];
      e.call(this, p), this.requestUpdate(i, d, r, !0, p);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function n(r) {
  return (e, s) => typeof s == "object" ? Is(r, e, s) : ((a, t, o) => {
    const i = t.hasOwnProperty(o);
    return t.constructor.createProperty(o, a), i ? Object.getOwnPropertyDescriptor(t, o) : void 0;
  })(r, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(r) {
  return n({ ...r, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const js = (r, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(r, e, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function It(r, e) {
  return (s, a, t) => {
    const o = (i) => {
      var p;
      return ((p = i.renderRoot) == null ? void 0 : p.querySelector(r)) ?? null;
    };
    return js(s, a, { get() {
      return o(this);
    } });
  };
}
var ks = Object.defineProperty, Bs = Object.getOwnPropertyDescriptor, Se = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Bs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ks(e, s, t), t;
};
let W = class extends l {
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
W.styles = [
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
Se([
  n({ reflect: !0 })
], W.prototype, "size", 2);
Se([
  n()
], W.prototype, "src", 2);
Se([
  n()
], W.prototype, "alt", 2);
Se([
  n()
], W.prototype, "initials", 2);
Se([
  P()
], W.prototype, "_imgFailed", 2);
W = Se([
  u("bh-avatar")
], W);
var Ts = Object.defineProperty, Ms = Object.getOwnPropertyDescriptor, sr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ms(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ts(e, s, t), t;
};
let Ke = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.size = "md";
  }
  render() {
    return h`<span part="badge"><slot></slot></span>`;
  }
};
Ke.styles = [
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
sr([
  n({ reflect: !0 })
], Ke.prototype, "variant", 2);
sr([
  n({ reflect: !0 })
], Ke.prototype, "size", 2);
Ke = sr([
  u("bh-badge")
], Ke);
var Us = Object.defineProperty, Hs = Object.getOwnPropertyDescriptor, de = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Hs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Us(e, s, t), t;
};
let N = class extends l {
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
  _handleClick(r) {
    if (this.disabled) {
      r.preventDefault(), r.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: r }
      })
    );
  }
};
N.styles = [
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
de([
  n({ reflect: !0 })
], N.prototype, "variant", 2);
de([
  n({ reflect: !0 })
], N.prototype, "size", 2);
de([
  n({ type: Boolean, reflect: !0 })
], N.prototype, "disabled", 2);
de([
  n({ type: Boolean, reflect: !0, attribute: "icon-only" })
], N.prototype, "iconOnly", 2);
de([
  n()
], N.prototype, "label", 2);
de([
  n()
], N.prototype, "type", 2);
N = de([
  u("bh-button")
], N);
var Ns = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, be = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Rs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ns(e, s, t), t;
};
let R = class extends l {
  constructor() {
    super(...arguments), this.checked = !1, this.indeterminate = !1, this.disabled = !1, this.value = "", this.name = "", this.label = "";
  }
  render() {
    const r = this.indeterminate ? h`<svg viewBox="0 0 16 16"><path d="M3 8h10" stroke-linecap="round"/></svg>` : h`<svg viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
        <span class="checkbox" part="checkbox">${r}</span>
        <span class="label" part="label"><slot>${this.label}</slot></span>
      </label>
    `;
  }
  _handleChange(r) {
    const e = r.target;
    this.checked = e.checked, this.indeterminate = !1, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { checked: this.checked }
      })
    );
  }
};
R.styles = [
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
be([
  n({ type: Boolean, reflect: !0 })
], R.prototype, "checked", 2);
be([
  n({ type: Boolean, reflect: !0 })
], R.prototype, "indeterminate", 2);
be([
  n({ type: Boolean, reflect: !0 })
], R.prototype, "disabled", 2);
be([
  n()
], R.prototype, "value", 2);
be([
  n()
], R.prototype, "name", 2);
be([
  n()
], R.prototype, "label", 2);
R = be([
  u("bh-checkbox")
], R);
var Ls = Object.defineProperty, qs = Object.getOwnPropertyDescriptor, jt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? qs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ls(e, s, t), t;
};
let me = class extends l {
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
me.styles = [
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
jt([
  n({ type: Boolean, reflect: !0 })
], me.prototype, "vertical", 2);
jt([
  n({ reflect: !0 })
], me.prototype, "spacing", 2);
jt([
  n({ type: Boolean, reflect: !0 })
], me.prototype, "gradient", 2);
me = jt([
  u("bh-divider")
], me);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ht = (r) => (...e) => ({ _$litDirective$: r, values: e });
let ct = class {
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
let Jt = class extends ct {
  constructor(e) {
    if (super(e), this.it = c, e.type !== T.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
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
Jt.directiveName = "unsafeHTML", Jt.resultType = 1;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Qt = class extends Jt {
};
Qt.directiveName = "unsafeSVG", Qt.resultType = 2;
const Gs = ht(Qt);
var Fs = Object.defineProperty, Vs = Object.getOwnPropertyDescriptor, kt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Vs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Fs(e, s, t), t;
};
const Kt = /* @__PURE__ */ new Map();
let w = class extends l {
  constructor() {
    super(...arguments), this.name = "", this.size = "md", this.label = "";
  }
  static register(r, e) {
    Kt.set(r, e);
  }
  static getIcon(r) {
    return Kt.get(r);
  }
  render() {
    const r = Kt.get(this.name), e = this.label ? c : "true", s = this.label ? "img" : c;
    return h`
      <svg
        part="svg"
        viewBox="0 0 24 24"
        aria-hidden=${e}
        role=${s}
        aria-label=${this.label || c}
      >
        ${r ? Gs(r) : c}
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
kt([
  n({ reflect: !0 })
], w.prototype, "name", 2);
kt([
  n({ reflect: !0 })
], w.prototype, "size", 2);
kt([
  n()
], w.prototype, "label", 2);
w = kt([
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
const { I: Ws } = gs, Sr = (r) => r, Nr = (r) => r.strings === void 0, Dr = () => document.createComment(""), Re = (r, e, s) => {
  var o;
  const a = r._$AA.parentNode, t = e === void 0 ? r._$AB : e._$AA;
  if (s === void 0) {
    const i = a.insertBefore(Dr(), t), p = a.insertBefore(Dr(), t);
    s = new Ws(i, p, r, r.options);
  } else {
    const i = s._$AB.nextSibling, p = s._$AM, d = p !== r;
    if (d) {
      let f;
      (o = s._$AQ) == null || o.call(s, r), s._$AM = r, s._$AP !== void 0 && (f = r._$AU) !== p._$AU && s._$AP(f);
    }
    if (i !== t || d) {
      let f = s._$AA;
      for (; f !== i; ) {
        const m = Sr(f).nextSibling;
        Sr(a).insertBefore(f, t), f = m;
      }
    }
  }
  return s;
}, se = (r, e, s = r) => (r._$AI(e, s), r), Ys = {}, Rr = (r, e = Ys) => r._$AH = e, Ks = (r) => r._$AH, Xt = (r) => {
  r._$AR(), r._$AA.remove();
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lr = ht(class extends ct {
  constructor(r) {
    if (super(r), r.type !== T.PROPERTY && r.type !== T.ATTRIBUTE && r.type !== T.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Nr(r)) throw Error("`live` bindings can only contain a single expression");
  }
  render(r) {
    return r;
  }
  update(r, [e]) {
    if (e === x || e === c) return e;
    const s = r.element, a = r.name;
    if (r.type === T.PROPERTY) {
      if (e === s[a]) return x;
    } else if (r.type === T.BOOLEAN_ATTRIBUTE) {
      if (!!e === s.hasAttribute(a)) return x;
    } else if (r.type === T.ATTRIBUTE && s.getAttribute(a) === e + "") return x;
    return Rr(r), e;
  }
});
var Xs = Object.defineProperty, Js = Object.getOwnPropertyDescriptor, k = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Js(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Xs(e, s, t), t;
};
let E = class extends l {
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
          .value=${Lr(this.value)}
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
  _handleInput(r) {
    const e = r.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(r) {
    const e = r.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
};
E.styles = [
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
k([
  n({ reflect: !0 })
], E.prototype, "size", 2);
k([
  n()
], E.prototype, "type", 2);
k([
  n()
], E.prototype, "value", 2);
k([
  n()
], E.prototype, "placeholder", 2);
k([
  n()
], E.prototype, "name", 2);
k([
  n()
], E.prototype, "label", 2);
k([
  n({ type: Boolean, reflect: !0 })
], E.prototype, "disabled", 2);
k([
  n({ type: Boolean, reflect: !0 })
], E.prototype, "readonly", 2);
k([
  n({ type: Boolean, reflect: !0 })
], E.prototype, "required", 2);
k([
  n({ type: Boolean, reflect: !0 })
], E.prototype, "error", 2);
E = k([
  u("bh-input")
], E);
var Qs = Object.defineProperty, Zs = Object.getOwnPropertyDescriptor, pt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Zs(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Qs(e, s, t), t;
};
let ne = class extends l {
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
ne.styles = [
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
pt([
  n({ reflect: !0 })
], ne.prototype, "color", 2);
pt([
  n({ type: Boolean, reflect: !0 })
], ne.prototype, "pulse", 2);
pt([
  n({ reflect: !0 })
], ne.prototype, "size", 2);
pt([
  n()
], ne.prototype, "label", 2);
ne = pt([
  u("bh-led")
], ne);
var ea = Object.defineProperty, ta = Object.getOwnPropertyDescriptor, dt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ta(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ea(e, s, t), t;
};
let le = class extends l {
  constructor() {
    super(...arguments), this.href = "", this.target = "", this.variant = "default", this.external = !1;
  }
  render() {
    const r = this.external ? "_blank" : this.target, e = this.external ? "noopener noreferrer" : void 0;
    return h`
      <a
        part="link"
        href=${this.href || c}
        target=${r || c}
        rel=${e || c}
        @click=${this._handleClick}
      >
        <slot></slot>${this.external ? h`<span class="external-icon"><svg viewBox="0 0 16 16"><path d="M6 3h7v7"/><path d="M13 3L6.5 9.5"/></svg></span>` : c}
      </a>
    `;
  }
  _handleClick(r) {
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: r }
      })
    );
  }
};
le.styles = [
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
dt([
  n()
], le.prototype, "href", 2);
dt([
  n()
], le.prototype, "target", 2);
dt([
  n({ reflect: !0 })
], le.prototype, "variant", 2);
dt([
  n({ type: Boolean })
], le.prototype, "external", 2);
le = dt([
  u("bh-link")
], le);
var ra = Object.defineProperty, sa = Object.getOwnPropertyDescriptor, ue = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? sa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ra(e, s, t), t;
};
let L = class extends l {
  constructor() {
    super(...arguments), this.value = 0, this.max = 100, this.indeterminate = !1, this.size = "md", this.variant = "default", this.label = "Progress";
  }
  render() {
    const r = this.indeterminate ? void 0 : Math.min(100, Math.max(0, this.value / this.max * 100));
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
          style=${this.indeterminate ? "" : `width: ${r}%`}
        ></div>
      </div>
    `;
  }
};
L.styles = [
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
ue([
  n({ type: Number })
], L.prototype, "value", 2);
ue([
  n({ type: Number })
], L.prototype, "max", 2);
ue([
  n({ type: Boolean, reflect: !0 })
], L.prototype, "indeterminate", 2);
ue([
  n({ reflect: !0 })
], L.prototype, "size", 2);
ue([
  n({ reflect: !0 })
], L.prototype, "variant", 2);
ue([
  n()
], L.prototype, "label", 2);
L = ue([
  u("bh-progress")
], L);
var aa = Object.defineProperty, oa = Object.getOwnPropertyDescriptor, De = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? oa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && aa(e, s, t), t;
};
let Y = class extends l {
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
Y.styles = [
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
De([
  n({ type: Boolean, reflect: !0 })
], Y.prototype, "checked", 2);
De([
  n({ type: Boolean, reflect: !0 })
], Y.prototype, "disabled", 2);
De([
  n()
], Y.prototype, "value", 2);
De([
  n()
], Y.prototype, "name", 2);
De([
  n()
], Y.prototype, "label", 2);
Y = De([
  u("bh-radio")
], Y);
var ia = Object.defineProperty, na = Object.getOwnPropertyDescriptor, B = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? na(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ia(e, s, t), t;
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
      (r) => h`
                  <optgroup label=${r.label}>
                    ${r.options.map(
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
      (r) => h`
                  <option
                    value=${r.value}
                    ?disabled=${r.disabled}
                    ?selected=${r.value === this.value}
                  >${r.label}</option>
                `
    )}
        </select>
        <span class="chevron">
          <svg viewBox="0 0 16 16"><path d="M4 6l4 4 4-4"/></svg>
        </span>
      </div>
    `;
  }
  _handleChange(r) {
    const e = r.target;
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
B([
  n({ reflect: !0 })
], S.prototype, "size", 2);
B([
  n()
], S.prototype, "value", 2);
B([
  n()
], S.prototype, "name", 2);
B([
  n()
], S.prototype, "label", 2);
B([
  n()
], S.prototype, "placeholder", 2);
B([
  n({ type: Array })
], S.prototype, "options", 2);
B([
  n({ type: Array, attribute: "option-groups" })
], S.prototype, "optionGroups", 2);
B([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "disabled", 2);
B([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "required", 2);
B([
  n({ type: Boolean, reflect: !0 })
], S.prototype, "error", 2);
S = B([
  u("bh-select")
], S);
var la = Object.defineProperty, ha = Object.getOwnPropertyDescriptor, Bt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ha(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && la(e, s, t), t;
};
let ye = class extends l {
  constructor() {
    super(...arguments), this.variant = "text", this.width = "", this.height = "";
  }
  render() {
    const r = [
      this.width ? `width: ${this.width}` : "",
      this.height ? `height: ${this.height}` : ""
    ].filter(Boolean).join("; ");
    return h`
      <div
        class="skeleton"
        part="skeleton"
        style=${r}
        aria-busy="true"
        aria-label="Loading"
      ></div>
    `;
  }
};
ye.styles = [
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
Bt([
  n({ reflect: !0 })
], ye.prototype, "variant", 2);
Bt([
  n()
], ye.prototype, "width", 2);
Bt([
  n()
], ye.prototype, "height", 2);
ye = Bt([
  u("bh-skeleton")
], ye);
var ca = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, ar = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? pa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ca(e, s, t), t;
};
let Xe = class extends l {
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
Xe.styles = [
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
ar([
  n({ reflect: !0 })
], Xe.prototype, "size", 2);
ar([
  n()
], Xe.prototype, "label", 2);
Xe = ar([
  u("bh-spinner")
], Xe);
var da = Object.defineProperty, ba = Object.getOwnPropertyDescriptor, Tt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ba(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && da(e, s, t), t;
};
let _e = class extends l {
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
  _handleChange(r) {
    const e = r.target;
    this.checked = e.checked, this.dispatchEvent(
      new CustomEvent("bh-change", {
        bubbles: !0,
        composed: !0,
        detail: { checked: this.checked }
      })
    );
  }
};
_e.styles = [
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
Tt([
  n({ type: Boolean, reflect: !0 })
], _e.prototype, "checked", 2);
Tt([
  n({ type: Boolean, reflect: !0 })
], _e.prototype, "disabled", 2);
Tt([
  n()
], _e.prototype, "label", 2);
_e = Tt([
  u("bh-switch")
], _e);
var ua = Object.defineProperty, va = Object.getOwnPropertyDescriptor, or = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? va(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ua(e, s, t), t;
};
let Je = class extends l {
  constructor() {
    super(...arguments), this.variant = "body", this.truncate = !1;
  }
  render() {
    const r = this.variant === "heading" ? "heading" : c, e = this.variant === "heading" ? "2" : c;
    return h`
      <span
        part="text"
        role=${r}
        aria-level=${e}
      >
        <slot></slot>
      </span>
    `;
  }
};
Je.styles = [
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
or([
  n({ reflect: !0 })
], Je.prototype, "variant", 2);
or([
  n({ type: Boolean, reflect: !0 })
], Je.prototype, "truncate", 2);
Je = or([
  u("bh-text")
], Je);
var fa = Object.defineProperty, ga = Object.getOwnPropertyDescriptor, D = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ga(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && fa(e, s, t), t;
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
          .value=${Lr(this.value)}
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
  _handleInput(r) {
    const e = r.target;
    this.value = e.value, this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(r) {
    const e = r.target;
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
D([
  n({ reflect: !0 })
], A.prototype, "size", 2);
D([
  n()
], A.prototype, "value", 2);
D([
  n()
], A.prototype, "placeholder", 2);
D([
  n()
], A.prototype, "name", 2);
D([
  n()
], A.prototype, "label", 2);
D([
  n({ type: Number })
], A.prototype, "rows", 2);
D([
  n({ reflect: !0 })
], A.prototype, "resize", 2);
D([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "disabled", 2);
D([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "readonly", 2);
D([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "required", 2);
D([
  n({ type: Boolean, reflect: !0 })
], A.prototype, "error", 2);
A = D([
  u("bh-textarea")
], A);
var ma = Object.defineProperty, ya = Object.getOwnPropertyDescriptor, ir = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ya(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ma(e, s, t), t;
};
let Qe = class extends l {
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
Qe.styles = [
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
ir([
  n()
], Qe.prototype, "content", 2);
ir([
  n({ reflect: !0 })
], Qe.prototype, "placement", 2);
Qe = ir([
  u("bh-tooltip")
], Qe);
var _a = Object.defineProperty, xa = Object.getOwnPropertyDescriptor, bt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? xa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && _a(e, s, t), t;
};
const Ir = ["off", "primary", "success", "warning", "danger"];
let he = class extends l {
  constructor() {
    super(...arguments), this.cols = 20, this.rows = 5, this.label = "", this._pixelEls = [];
  }
  render() {
    const r = this.cols * this.rows, e = this.label.length > 0;
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
      { length: r },
      () => h`<div class="px" part="pixel" aria-hidden="true"></div>`
    )}
      </div>
    `;
  }
  updated() {
    const r = this.data, e = this._prevData, s = this.shadowRoot.querySelector(".grid");
    if (!s) return;
    this._pixelEls = Array.from(s.querySelectorAll(".px"));
    const a = this.cols * this.rows;
    for (let t = 0; t < a && t < this._pixelEls.length; t++) {
      const o = r && t < r.length ? r[t] : 0, i = e && t < e.length ? e[t] : -1;
      if (o !== i) {
        const p = this._pixelEls[t];
        p.className = `px ${o > 0 && o < Ir.length ? Ir[o] : ""}`.trimEnd();
      }
    }
    r && (this._prevData = new Uint8Array(r));
  }
};
he.styles = [
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
bt([
  n({ type: Number })
], he.prototype, "cols", 2);
bt([
  n({ type: Number })
], he.prototype, "rows", 2);
bt([
  n({ attribute: !1 })
], he.prototype, "data", 2);
bt([
  n()
], he.prototype, "label", 2);
he = bt([
  u("bh-pixel-display")
], he);
var wa = Object.defineProperty, $a = Object.getOwnPropertyDescriptor, Ie = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? $a(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && wa(e, s, t), t;
};
let K = class extends l {
  constructor() {
    super(...arguments), this.value = "", this.color = "primary", this.size = "md", this.ghost = !1, this.label = "";
  }
  /** Character used for ghost segments. Defaults to '8' for digits, '~' for alpha. */
  get _ghostText() {
    return this.value.toUpperCase().split("").map((r) => /[0-9]/.test(r) ? "8" : /[A-Z]/.test(r) ? "~" : r).join("");
  }
  render() {
    const r = this.value.toUpperCase();
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
          >${r}</span>
        </span>
      ` : h`
      <span
        class="display"
        part="display"
        role="status"
        aria-label=${this.label || c}
      >${r}</span>
    `;
  }
};
K.styles = [
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
], K.prototype, "value", 2);
Ie([
  n({ reflect: !0 })
], K.prototype, "color", 2);
Ie([
  n({ reflect: !0 })
], K.prototype, "size", 2);
Ie([
  n({ type: Boolean, reflect: !0 })
], K.prototype, "ghost", 2);
Ie([
  n()
], K.prototype, "label", 2);
K = Ie([
  u("bh-segment-display")
], K);
var Pa = Object.defineProperty, Ca = Object.getOwnPropertyDescriptor, ee = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ca(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Pa(e, s, t), t;
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
  _handleInput(r) {
    const e = r.target;
    this.value = Number(e.value), this.dispatchEvent(
      new CustomEvent("bh-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this.value }
      })
    );
  }
  _handleChange(r) {
    const e = r.target;
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
ee([
  n({ type: Number })
], M.prototype, "min", 2);
ee([
  n({ type: Number })
], M.prototype, "max", 2);
ee([
  n({ type: Number })
], M.prototype, "step", 2);
ee([
  n({ type: Number })
], M.prototype, "value", 2);
ee([
  n({ type: Boolean, reflect: !0 })
], M.prototype, "disabled", 2);
ee([
  n({ type: Boolean, reflect: !0, attribute: "show-value" })
], M.prototype, "showValue", 2);
ee([
  n()
], M.prototype, "label", 2);
M = ee([
  u("bh-slider")
], M);
var Oa = Object.defineProperty, Aa = Object.getOwnPropertyDescriptor, nr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Aa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Oa(e, s, t), t;
};
let Ze = class extends l {
  constructor() {
    super(...arguments), this.shape = "line", this.blink = !0;
  }
  render() {
    return h`<span part="cursor"></span>`;
  }
};
Ze.styles = [
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
nr([
  n({ reflect: !0 })
], Ze.prototype, "shape", 2);
nr([
  n({ type: Boolean, reflect: !0 })
], Ze.prototype, "blink", 2);
Ze = nr([
  u("bh-terminal-cursor")
], Ze);
var za = Object.defineProperty, Ea = Object.getOwnPropertyDescriptor, ve = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ea(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && za(e, s, t), t;
};
let q = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.padding = "md", this.cornerAccents = !1, this._hasHeader = !1, this._hasHeaderActions = !1, this._hasFooter = !1;
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
  _onHeaderSlotChange(r) {
    const e = r.target;
    this._hasHeader = e.assignedNodes({ flatten: !0 }).length > 0;
  }
  _onHeaderActionsSlotChange(r) {
    const e = r.target;
    this._hasHeaderActions = e.assignedNodes({ flatten: !0 }).length > 0;
  }
  _onFooterSlotChange(r) {
    const e = r.target;
    this._hasFooter = e.assignedNodes({ flatten: !0 }).length > 0;
  }
};
q.styles = [
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
ve([
  n({ reflect: !0 })
], q.prototype, "variant", 2);
ve([
  n({ reflect: !0 })
], q.prototype, "padding", 2);
ve([
  n({ type: Boolean, reflect: !0, attribute: "corner-accents" })
], q.prototype, "cornerAccents", 2);
ve([
  P()
], q.prototype, "_hasHeader", 2);
ve([
  P()
], q.prototype, "_hasHeaderActions", 2);
ve([
  P()
], q.prototype, "_hasFooter", 2);
q = ve([
  u("bh-card")
], q);
var Sa = Object.defineProperty, Da = Object.getOwnPropertyDescriptor, je = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Da(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Sa(e, s, t), t;
};
let X = class extends l {
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
  _handleClick(r) {
    if (this.disabled) {
      r.preventDefault(), r.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: r }
      })
    );
  }
  _handleDismiss(r) {
    r.stopPropagation(), !this.disabled && this.dispatchEvent(
      new CustomEvent("bh-dismiss", {
        bubbles: !0,
        composed: !0,
        detail: {}
      })
    );
  }
};
X.styles = [
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
je([
  n({ reflect: !0 })
], X.prototype, "variant", 2);
je([
  n({ reflect: !0 })
], X.prototype, "size", 2);
je([
  n({ type: Boolean, reflect: !0 })
], X.prototype, "dismissible", 2);
je([
  n({ type: Boolean, reflect: !0 })
], X.prototype, "selected", 2);
je([
  n({ type: Boolean, reflect: !0 })
], X.prototype, "disabled", 2);
X = je([
  u("bh-chip")
], X);
var Ia = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, ke = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ja(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ia(e, s, t), t;
};
let ka = 0, J = class extends l {
  constructor() {
    super(...arguments), this.label = "", this.helpText = "", this.error = "", this.required = !1, this._uniqueId = `bh-ff-${++ka}`;
  }
  render() {
    const r = `${this._uniqueId}-label`, e = `${this._uniqueId}-help`, s = `${this._uniqueId}-error`;
    return h`
      <div class="field" part="field">
        ${this.label ? h`<label id=${r} part="label">
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
    const r = this._defaultSlot.assignedElements({ flatten: !0 });
    if (r.length === 0) return;
    const e = r[0], s = `${this._uniqueId}-label`, a = `${this._uniqueId}-help`, t = `${this._uniqueId}-error`;
    this.label ? e.setAttribute("aria-labelledby", s) : e.removeAttribute("aria-labelledby"), this.error ? e.setAttribute("aria-describedby", t) : this.helpText ? e.setAttribute("aria-describedby", a) : e.removeAttribute("aria-describedby"), this.error ? e.setAttribute("aria-invalid", "true") : e.removeAttribute("aria-invalid"), this.required ? e.setAttribute("aria-required", "true") : e.removeAttribute("aria-required");
  }
};
J.styles = [
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
ke([
  n()
], J.prototype, "label", 2);
ke([
  n({ attribute: "help-text" })
], J.prototype, "helpText", 2);
ke([
  n()
], J.prototype, "error", 2);
ke([
  n({ type: Boolean })
], J.prototype, "required", 2);
ke([
  It("slot:not([name])")
], J.prototype, "_defaultSlot", 2);
J = ke([
  u("bh-form-field")
], J);
var Ba = Object.defineProperty, Ta = Object.getOwnPropertyDescriptor, ut = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ta(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ba(e, s, t), t;
};
let ce = class extends l {
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
  _handleClick(r) {
    if (this.disabled) {
      r.preventDefault(), r.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("bh-click", {
        bubbles: !0,
        composed: !0,
        detail: { originalEvent: r }
      })
    );
  }
};
ce.styles = [
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
ut([
  n({ type: Boolean, reflect: !0 })
], ce.prototype, "active", 2);
ut([
  n({ type: Boolean, reflect: !0 })
], ce.prototype, "disabled", 2);
ut([
  n()
], ce.prototype, "href", 2);
ut([
  n()
], ce.prototype, "target", 2);
ce = ut([
  u("bh-nav-item")
], ce);
var Ma = Object.defineProperty, Ua = Object.getOwnPropertyDescriptor, Be = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ua(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ma(e, s, t), t;
};
let U = class extends l {
  constructor() {
    super(...arguments), this.variant = "default", this.density = "default", this.stickyHeader = !1, this.columns = [], this.rows = [];
  }
  _renderHeaderCell(r) {
    return h`
      <th
        part="th"
        class=${r.align ? `align-${r.align}` : ""}
        style=${r.width ? `width: ${r.width}` : ""}
      >
        ${r.label}
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
              ${this.columns.map((r) => this._renderHeaderCell(r))}
            </tr>
          </thead>
          <tbody part="tbody">
            ${this._displayRows.map(
      (r) => h`
                <tr part="row">
                  ${this.columns.map(
        (e) => h`
                      <td
                        part="td"
                        class=${e.align ? `align-${e.align}` : ""}
                      >
                        ${String(r[e.key] ?? "")}
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
Be([
  n({ reflect: !0 })
], U.prototype, "variant", 2);
Be([
  n({ reflect: !0 })
], U.prototype, "density", 2);
Be([
  n({ type: Boolean, reflect: !0, attribute: "sticky-header" })
], U.prototype, "stickyHeader", 2);
Be([
  n({ type: Array })
], U.prototype, "columns", 2);
Be([
  n({ type: Array })
], U.prototype, "rows", 2);
U = Be([
  u("bh-table")
], U);
class Ha {
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
    const { _cols: e, _rows: s, _color: a, _type: t } = this;
    if (e === 0 || s === 0) return;
    let o;
    switch (t) {
      case "sparkline":
        o = xs(this._buffer, e, s, a);
        break;
      case "bar":
        o = ws(this._buffer.length > 0 ? this._buffer[this._buffer.length - 1] : 0, e, s, a);
        break;
      case "text":
        o = _s(this._text, e, s, a);
        break;
      case "raw":
        return;
    }
    this._applyGrid(o);
  }
  _applyGrid(e) {
    const s = this._grid, a = Math.min(s.length, e.length);
    let t = s.length !== e.length;
    if (!t) {
      for (let o = 0; o < a; o++)
        if (s[o] !== e[o]) {
          t = !0;
          break;
        }
    }
    t && (this._grid = e, this._host.requestUpdate());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = (r, e) => {
  var a;
  const s = r._$AN;
  if (s === void 0) return !1;
  for (const t of s) (a = t._$AO) == null || a.call(t, e, !1), Fe(t, e);
  return !0;
}, xt = (r) => {
  let e, s;
  do {
    if ((e = r._$AM) === void 0) break;
    s = e._$AN, s.delete(r), r = e;
  } while ((s == null ? void 0 : s.size) === 0);
}, qr = (r) => {
  for (let e; e = r._$AM; r = e) {
    let s = e._$AN;
    if (s === void 0) e._$AN = s = /* @__PURE__ */ new Set();
    else if (s.has(r)) break;
    s.add(r), La(e);
  }
};
function Na(r) {
  this._$AN !== void 0 ? (xt(this), this._$AM = r, qr(this)) : this._$AM = r;
}
function Ra(r, e = !1, s = 0) {
  const a = this._$AH, t = this._$AN;
  if (t !== void 0 && t.size !== 0) if (e) if (Array.isArray(a)) for (let o = s; o < a.length; o++) Fe(a[o], !1), xt(a[o]);
  else a != null && (Fe(a, !1), xt(a));
  else Fe(this, r);
}
const La = (r) => {
  r.type == T.CHILD && (r._$AP ?? (r._$AP = Ra), r._$AQ ?? (r._$AQ = Na));
};
class qa extends ct {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, s, a) {
    super._$AT(e, s, a), qr(this), this.isConnected = e._$AU;
  }
  _$AO(e, s = !0) {
    var a, t;
    e !== this.isConnected && (this.isConnected = e, e ? (a = this.reconnected) == null || a.call(this) : (t = this.disconnected) == null || t.call(this)), s && (Fe(this, e), xt(this));
  }
  setValue(e) {
    if (Nr(this._$Ct)) this._$Ct._$AI(e, this);
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
class Ga extends qa {
  constructor(e) {
    super(e), this._fps = 12, this._cols = 0, this._sweepCursor = 0, this._sweepSpeed = 1, this._rafId = 0, this._pending = !1, this._stepRafId = 0, this._tickSweep = () => {
      if (!this._target || !this._prev) return;
      this._sweepCursor += this._sweepSpeed;
      const s = this._cols, a = this._target.length / s;
      if (this._sweepCursor >= s) {
        this._current = this._target, this.setValue(this._target), this._prev = void 0, this._target = void 0, this._rafId = 0;
        return;
      }
      const t = new Uint8Array(this._target.length);
      for (let o = 0; o < a; o++)
        for (let i = 0; i < s; i++) {
          const p = o * s + i;
          t[p] = i < this._sweepCursor ? this._target[p] : this._prev[p];
        }
      this.setValue(t), this._rafId = requestAnimationFrame(this._tickSweep);
    };
  }
  render(e, s) {
    const a = (s == null ? void 0 : s.transition) ?? "step", t = (s == null ? void 0 : s.fps) ?? 12, o = (s == null ? void 0 : s.cols) ?? 0;
    return this._fps = t, this._cols = o, a === "sweep" && o > 0 ? this._handleSweep(e) : this._handleStep(e);
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
const Fa = ht(Ga);
var Va = Object.defineProperty, Wa = Object.getOwnPropertyDescriptor, I = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Wa(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Va(e, s, t), t;
};
let z = class extends l {
  constructor() {
    super(...arguments), this.label = "", this.value = "", this.footerStart = "", this.footerEnd = "", this.cols = 0, this.rows = 0, this.type = "sparkline", this.transition = "step", this.fps = 12, this.color = 1, this.bufferSize = 0;
  }
  get _managed() {
    return this.cols > 0 && this.rows > 0;
  }
  willUpdate(r) {
    this._managed && (this._ctrl ? (r.has("cols") || r.has("rows") || r.has("type") || r.has("color") || r.has("bufferSize")) && this._ctrl.configure({
      cols: this.cols,
      rows: this.rows,
      type: this.type,
      color: this.color,
      bufferSize: this.bufferSize || this.cols
    }) : this._ctrl = new Ha(this, {
      cols: this.cols,
      rows: this.rows,
      type: this.type,
      color: this.color,
      bufferSize: this.bufferSize || this.cols
    }));
  }
  push(r) {
    var e;
    (e = this._ctrl) == null || e.push(r);
  }
  set(r) {
    var e;
    (e = this._ctrl) == null || e.set(r);
  }
  setText(r) {
    var e;
    (e = this._ctrl) == null || e.setText(r);
  }
  setGrid(r) {
    var e;
    (e = this._ctrl) == null || e.setGrid(r);
  }
  _renderDisplay() {
    return h`
      <bh-pixel-display
        .cols=${this.cols}
        .rows=${this.rows}
        .data=${Fa(this._ctrl.grid, {
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
I([
  n()
], z.prototype, "label", 2);
I([
  n()
], z.prototype, "value", 2);
I([
  n({ attribute: "footer-start" })
], z.prototype, "footerStart", 2);
I([
  n({ attribute: "footer-end" })
], z.prototype, "footerEnd", 2);
I([
  n({ type: Number })
], z.prototype, "cols", 2);
I([
  n({ type: Number })
], z.prototype, "rows", 2);
I([
  n()
], z.prototype, "type", 2);
I([
  n()
], z.prototype, "transition", 2);
I([
  n({ type: Number })
], z.prototype, "fps", 2);
I([
  n({ type: Number })
], z.prototype, "color", 2);
I([
  n({ type: Number, attribute: "buffer-size" })
], z.prototype, "bufferSize", 2);
z = I([
  u("bh-pixel-panel")
], z);
var Ya = Object.defineProperty, Ka = Object.getOwnPropertyDescriptor, lr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ka(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ya(e, s, t), t;
};
let et = class extends l {
  constructor() {
    super(...arguments), this.heading = "";
  }
  render() {
    const r = this.count !== void 0;
    return h`
      <div class="header" part="header">
        <span class="title" part="title" role="heading" aria-level="3">
          <slot>${this.heading}</slot>
        </span>
        ${r ? h`<span part="badge"><slot name="badge"><bh-badge size="sm" variant="primary">${this.count}</bh-badge></slot></span>` : h`<slot name="badge"></slot>`}
        <bh-divider part="line"></bh-divider>
        <slot name="end"></slot>
      </div>
    `;
  }
};
et.styles = [
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
lr([
  n()
], et.prototype, "heading", 2);
lr([
  n({ type: Number })
], et.prototype, "count", 2);
et = lr([
  u("bh-section-header")
], et);
var Xa = Object.defineProperty, Ja = Object.getOwnPropertyDescriptor, hr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ja(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Xa(e, s, t), t;
};
w.register("sort-asc", '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>');
w.register("sort-desc", '<path d="M12 5v14"/><path d="m5 12 7 7 7-7"/>');
let tt = class extends U {
  constructor() {
    super(...arguments), this._sortColumn = "", this._sortDirection = "none";
  }
  get _sortedRows() {
    if (this._sortDirection === "none" || !this._sortColumn)
      return this.rows;
    const r = this._sortColumn, e = this._sortDirection === "asc" ? 1 : -1;
    return [...this.rows].sort((s, a) => {
      const t = s[r], o = a[r];
      return t == null && o == null ? 0 : t == null ? 1 : o == null ? -1 : typeof t == "number" && typeof o == "number" ? (t - o) * e : String(t).localeCompare(String(o)) * e;
    });
  }
  get _displayRows() {
    return this._sortedRows;
  }
  _renderHeaderCell(r) {
    if (!r.sortable)
      return super._renderHeaderCell(r);
    const s = this._sortColumn === r.key && this._sortDirection !== "none";
    return h`
      <th
        part="th"
        class=${r.align ? `align-${r.align}` : ""}
        style=${r.width ? `width: ${r.width}` : ""}
        aria-sort=${s ? this._sortDirection === "asc" ? "ascending" : "descending" : c}
      >
        <button
          class="sort-button"
          part="sort-button"
          @click=${() => this._onSortClick(r.key)}
        >
          ${r.label}
          <span class="sort-icon ${s ? "active" : ""}">
            <bh-icon name=${s && this._sortDirection === "desc" ? "sort-desc" : "sort-asc"}></bh-icon>
          </span>
        </button>
      </th>
    `;
  }
  _onSortClick(r) {
    let e;
    this._sortColumn === r ? this._sortDirection === "none" ? e = "asc" : this._sortDirection === "asc" ? e = "desc" : e = "none" : e = "asc", this._sortColumn = r, this._sortDirection = e, this.dispatchEvent(
      new CustomEvent("bh-sort", {
        bubbles: !0,
        composed: !0,
        detail: { column: r, direction: e }
      })
    );
  }
};
tt.styles = [
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
hr([
  P()
], tt.prototype, "_sortColumn", 2);
hr([
  P()
], tt.prototype, "_sortDirection", 2);
tt = hr([
  u("bh-data-table")
], tt);
var Qa = Object.defineProperty, Za = Object.getOwnPropertyDescriptor, Mt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Za(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Qa(e, s, t), t;
};
let xe = class extends l {
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
xe.styles = [
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
Mt([
  n({ attribute: "tab-id" })
], xe.prototype, "tabId", 2);
Mt([
  n()
], xe.prototype, "label", 2);
Mt([
  n({ type: Boolean, reflect: !0 })
], xe.prototype, "active", 2);
xe = Mt([
  u("bh-tab")
], xe);
var eo = Object.defineProperty, to = Object.getOwnPropertyDescriptor, Gr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? to(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && eo(e, s, t), t;
};
let wt = class extends l {
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
  updated(r) {
    r.has("active") && this._syncActive();
  }
  _syncActive() {
    const r = this._getTabs();
    for (const e of r)
      e.active = e.tabId === this.active;
  }
  _handleTabClick(r) {
    r.stopPropagation(), this.active = r.detail.tabId, this.dispatchEvent(
      new CustomEvent("bh-tab-change", {
        bubbles: !0,
        composed: !0,
        detail: { tabId: r.detail.tabId }
      })
    );
  }
  _getTabs() {
    var e;
    const r = (e = this.shadowRoot) == null ? void 0 : e.querySelector("slot");
    return r ? r.assignedElements({ flatten: !0 }).filter((s) => s.tagName === "BH-TAB") : [];
  }
};
wt.styles = [
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
Gr([
  n()
], wt.prototype, "active", 2);
wt = Gr([
  u("bh-tab-bar")
], wt);
var ro = Object.defineProperty, so = Object.getOwnPropertyDescriptor, cr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? so(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ro(e, s, t), t;
};
let rt = class extends l {
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
rt.styles = [
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
cr([
  n({ attribute: "tab-id" })
], rt.prototype, "tabId", 2);
cr([
  n({ type: Boolean, reflect: !0 })
], rt.prototype, "active", 2);
rt = cr([
  u("bh-tab-panel")
], rt);
var ao = Object.defineProperty, oo = Object.getOwnPropertyDescriptor, Fr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? oo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ao(e, s, t), t;
};
let $t = class extends l {
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
  updated(r) {
    r.has("active") && (this._syncPanels(), this._syncTabBar());
  }
  _handleTabChange(r) {
    r.stopPropagation(), this.active = r.detail.tabId, this.dispatchEvent(
      new CustomEvent("bh-tab-change", {
        bubbles: !0,
        composed: !0,
        detail: { tabId: r.detail.tabId }
      })
    );
  }
  _syncPanels() {
    const r = this._getPanels();
    for (const e of r)
      e.active = e.tabId === this.active;
  }
  _syncTabBar() {
    const r = this._getTabBar();
    r && (r.active = this.active);
  }
  _getPanels() {
    var e;
    const r = (e = this.shadowRoot) == null ? void 0 : e.querySelector("slot:not([name])");
    return r ? r.assignedElements({ flatten: !0 }).filter(
      (s) => s.tagName === "BH-TAB-PANEL"
    ) : [];
  }
  _getTabBar() {
    var s;
    const r = (s = this.shadowRoot) == null ? void 0 : s.querySelector('slot[name="tab-bar"]');
    return r ? r.assignedElements({ flatten: !0 }).find(
      (a) => a.tagName === "BH-TAB-BAR"
    ) ?? null : null;
  }
};
$t.styles = [
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
Fr([
  n()
], $t.prototype, "active", 2);
$t = Fr([
  u("bh-tabs")
], $t);
var io = Object.defineProperty, no = Object.getOwnPropertyDescriptor, Vr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? no(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && io(e, s, t), t;
};
let Pt = class extends l {
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
Pt.styles = [
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
Vr([
  n({ type: Boolean, reflect: !0, attribute: "sidebar-open" })
], Pt.prototype, "sidebarOpen", 2);
Pt = Vr([
  u("bh-app-shell")
], Pt);
var lo = Object.defineProperty, ho = Object.getOwnPropertyDescriptor, Ut = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ho(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && lo(e, s, t), t;
};
let we = class extends l {
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
we.styles = [
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
Ut([
  n({ type: Boolean, reflect: !0 })
], we.prototype, "active", 2);
Ut([
  n()
], we.prototype, "label", 2);
Ut([
  n({ attribute: "item-id" })
], we.prototype, "itemId", 2);
we = Ut([
  u("bh-activity-item")
], we);
var co = Object.defineProperty, po = Object.getOwnPropertyDescriptor, Wr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? po(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && co(e, s, t), t;
};
let Ct = class extends l {
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
  setActive(r) {
    this._activeId = r, this._updateItems();
  }
  _handleItemClick(r) {
    const { id: e, label: s } = r.detail, a = this._activeId === e;
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
    const r = (s = this.shadowRoot) == null ? void 0 : s.querySelector("slot");
    if (!r) return;
    const e = r.assignedElements({ flatten: !0 }).filter(
      (a) => a.tagName === "BH-ACTIVITY-ITEM"
    );
    for (const a of e)
      a.active = a.itemId === this._activeId;
  }
};
Ct.styles = [
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
Wr([
  P()
], Ct.prototype, "_activeId", 2);
Ct = Wr([
  u("bh-activity-bar")
], Ct);
var bo = Object.defineProperty, uo = Object.getOwnPropertyDescriptor, Yr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? uo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && bo(e, s, t), t;
};
let Ot = class extends l {
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
  updated(r) {
    if (this._firstUpdate) {
      this._firstUpdate = !1;
      return;
    }
    r.has("collapsed") && this.dispatchEvent(
      new CustomEvent("bh-sidebar-collapse", {
        bubbles: !0,
        composed: !0,
        detail: { collapsed: this.collapsed }
      })
    );
  }
};
Ot.styles = [
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
Yr([
  n({ type: Boolean, reflect: !0 })
], Ot.prototype, "collapsed", 2);
Ot = Yr([
  u("bh-sidebar-panel")
], Ot);
var vo = Object.defineProperty, fo = Object.getOwnPropertyDescriptor, pr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? fo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && vo(e, s, t), t;
};
let st = class extends l {
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
st.styles = [
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
pr([
  n()
], st.prototype, "message", 2);
pr([
  n({ type: Boolean, reflect: !0 })
], st.prototype, "error", 2);
st = pr([
  u("bh-status-bar")
], st);
var go = Object.defineProperty, mo = Object.getOwnPropertyDescriptor, Kr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? mo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && go(e, s, t), t;
};
let At = class extends l {
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
At.styles = [
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
Kr([
  n()
], At.prototype, "label", 2);
At = Kr([
  u("bh-panel-header")
], At);
var yo = Object.defineProperty, _o = Object.getOwnPropertyDescriptor, Ht = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? _o(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && yo(e, s, t), t;
};
let $e = class extends l {
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
$e.styles = [
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
Ht([
  n({ reflect: !0 })
], $e.prototype, "gap", 2);
Ht([
  n({ reflect: !0 })
], $e.prototype, "variant", 2);
Ht([
  n({ type: Boolean, reflect: !0 })
], $e.prototype, "sticky", 2);
$e = Ht([
  u("bh-toolbar")
], $e);
var xo = Object.defineProperty, wo = Object.getOwnPropertyDescriptor, vt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? wo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && xo(e, s, t), t;
};
let zt = class extends l {
  constructor() {
    super(...arguments), this.multiple = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("bh-toggle", this._handleItemToggle);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("bh-toggle", this._handleItemToggle);
  }
  _handleItemToggle(r) {
    if (this.multiple || !r.detail.open) return;
    const e = r.composedPath().find(
      (a) => a.tagName === "BH-ACCORDION-ITEM"
    ), s = this.querySelectorAll("bh-accordion-item");
    for (const a of s)
      a !== e && a.open && (a.open = !1);
  }
  render() {
    return h`<slot></slot>`;
  }
};
zt.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }
    `
];
vt([
  n({ type: Boolean, reflect: !0 })
], zt.prototype, "multiple", 2);
zt = vt([
  u("bh-accordion")
], zt);
let at = class extends l {
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
at.styles = [
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
vt([
  n()
], at.prototype, "label", 2);
vt([
  n({ type: Boolean, reflect: !0 })
], at.prototype, "open", 2);
at = vt([
  u("bh-accordion-item")
], at);
var $o = Object.defineProperty, Po = Object.getOwnPropertyDescriptor, Nt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Po(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && $o(e, s, t), t;
};
let Pe = class extends l {
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
Pe.styles = [
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
Nt([
  n()
], Pe.prototype, "title", 2);
Nt([
  n()
], Pe.prototype, "status", 2);
Nt([
  n({ reflect: !0, attribute: "status-color" })
], Pe.prototype, "statusColor", 2);
Pe = Nt([
  u("bh-terminal-bar")
], Pe);
var Co = Object.defineProperty, Oo = Object.getOwnPropertyDescriptor, G = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Oo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Co(e, s, t), t;
};
let j = class extends l {
  constructor() {
    super(...arguments), this.prompt = "▸ ", this.promptUser = "", this.promptPath = "~", this.disabled = !1, this._history = [], this._historyIndex = -1, this._tempLine = "";
  }
  /** Focus the internal input element. */
  focus() {
    this.updateComplete.then(() => {
      var r;
      (r = this._input) == null || r.focus();
    });
  }
  _onKeydown(r) {
    const e = this._input;
    if (r.key === "Enter") {
      r.preventDefault();
      const s = e.value.trim();
      s && (this._history = [...this._history, s], this._historyIndex = -1, this._tempLine = "", this.dispatchEvent(
        new CustomEvent("bh-command", { detail: s, bubbles: !0, composed: !0 })
      ), e.value = "");
      return;
    }
    if (r.key === "ArrowUp") {
      if (r.preventDefault(), this._history.length === 0) return;
      this._historyIndex === -1 ? (this._tempLine = e.value, this._historyIndex = this._history.length - 1) : this._historyIndex > 0 && this._historyIndex--, e.value = this._history[this._historyIndex];
      return;
    }
    if (r.key === "ArrowDown") {
      if (r.preventDefault(), this._historyIndex === -1) return;
      this._historyIndex++, this._historyIndex >= this._history.length ? (this._historyIndex = -1, e.value = this._tempLine, this._tempLine = "") : e.value = this._history[this._historyIndex];
      return;
    }
    if (r.key === "Tab") {
      r.preventDefault(), this.dispatchEvent(
        new CustomEvent("bh-tab-complete", {
          detail: e.value,
          bubbles: !0,
          composed: !0
        })
      );
      return;
    }
    if (r.ctrlKey)
      switch (r.key) {
        case "c":
          r.preventDefault(), this.dispatchEvent(
            new CustomEvent("bh-interrupt", { bubbles: !0, composed: !0 })
          ), e.value = "";
          return;
        case "l":
          r.preventDefault(), this.dispatchEvent(
            new CustomEvent("bh-clear", { bubbles: !0, composed: !0 })
          );
          return;
        case "u":
          r.preventDefault(), e.value = "";
          return;
        case "k":
          r.preventDefault(), e.value = e.value.substring(0, e.selectionStart ?? 0);
          return;
        case "a":
          r.preventDefault(), e.setSelectionRange(0, 0);
          return;
        case "e":
          r.preventDefault(), e.setSelectionRange(e.value.length, e.value.length);
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
G([
  n()
], j.prototype, "prompt", 2);
G([
  n({ attribute: "prompt-user" })
], j.prototype, "promptUser", 2);
G([
  n({ attribute: "prompt-path" })
], j.prototype, "promptPath", 2);
G([
  n({ type: Boolean, reflect: !0 })
], j.prototype, "disabled", 2);
G([
  P()
], j.prototype, "_history", 2);
G([
  P()
], j.prototype, "_historyIndex", 2);
G([
  P()
], j.prototype, "_tempLine", 2);
G([
  It(".cmd-input")
], j.prototype, "_input", 2);
j = G([
  u("bh-terminal-input")
], j);
var Ao = Object.defineProperty, zo = Object.getOwnPropertyDescriptor, Xr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? zo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Ao(e, s, t), t;
};
let Et = class extends l {
  constructor() {
    super(...arguments), this.hints = [];
  }
  render() {
    return h`
      <div class="bar" part="bar">
        ${this.hints.map(
      (r) => h`
            <span class="hint">
              <kbd>${r.key}</kbd> ${r.label}
            </span>
          `
    )}
      </div>
    `;
  }
};
Et.styles = [
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
Xr([
  n({ attribute: !1 })
], Et.prototype, "hints", 2);
Et = Xr([
  u("bh-terminal-hint-bar")
], Et);
var Eo = Object.defineProperty, So = Object.getOwnPropertyDescriptor, te = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? So(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Eo(e, s, t), t;
};
let H = class extends l {
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
  _onChildrenSlotChange(r) {
    const e = r.target;
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
  _handleKeydown(r) {
    r.key === "Enter" || r.key === " " ? (r.preventDefault(), this._handleClick()) : r.key === "ArrowRight" && this._hasChildren && !this.expanded ? (r.preventDefault(), this.expanded = !0) : r.key === "ArrowLeft" && this.expanded && (r.preventDefault(), this.expanded = !1);
  }
};
H.styles = [
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
te([
  n()
], H.prototype, "value", 2);
te([
  n()
], H.prototype, "label", 2);
te([
  n({ type: Boolean, reflect: !0 })
], H.prototype, "selected", 2);
te([
  n({ type: Boolean, reflect: !0 })
], H.prototype, "expanded", 2);
te([
  n({ type: Number })
], H.prototype, "indent", 2);
te([
  n({ type: Boolean })
], H.prototype, "roving", 2);
te([
  P()
], H.prototype, "_hasChildren", 2);
H = te([
  u("bh-tree-item")
], H);
var Do = Object.defineProperty, Io = Object.getOwnPropertyDescriptor, Jr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Io(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Do(e, s, t), t;
};
let St = class extends l {
  constructor() {
    super(...arguments), this.selected = "", this._onItemClick = (r) => {
      const { value: e, label: s } = r.detail;
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
  updated(r) {
    r.has("selected") && this._updateSelection();
  }
  render() {
    return h`<slot></slot>`;
  }
  _updateSelection() {
    const r = this.querySelectorAll("bh-tree-item");
    let e = !1;
    r.forEach((s) => {
      s.selected = s.value === this.selected, s.roving = !1, s.selected && (e = !0);
    }), !e && r.length > 0 && (r[0].roving = !0);
  }
};
St.styles = [
  ...[l.styles].flat(),
  b`
      :host {
        display: block;
      }
    `
];
Jr([
  n()
], St.prototype, "selected", 2);
St = Jr([
  u("bh-tree")
], St);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jr = (r, e, s) => {
  const a = /* @__PURE__ */ new Map();
  for (let t = e; t <= s; t++) a.set(r[t], t);
  return a;
}, Qr = ht(class extends ct {
  constructor(r) {
    if (super(r), r.type !== T.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(r, e, s) {
    let a;
    s === void 0 ? s = e : e !== void 0 && (a = e);
    const t = [], o = [];
    let i = 0;
    for (const p of r) t[i] = a ? a(p, i) : i, o[i] = s(p, i), i++;
    return { values: o, keys: t };
  }
  render(r, e, s) {
    return this.dt(r, e, s).values;
  }
  update(r, [e, s, a]) {
    const t = Ks(r), { values: o, keys: i } = this.dt(e, s, a);
    if (!Array.isArray(t)) return this.ut = i, o;
    const p = this.ut ?? (this.ut = []), d = [];
    let f, m, v = 0, y = t.length - 1, g = 0, _ = o.length - 1;
    for (; v <= y && g <= _; ) if (t[v] === null) v++;
    else if (t[y] === null) y--;
    else if (p[v] === i[g]) d[g] = se(t[v], o[g]), v++, g++;
    else if (p[y] === i[_]) d[_] = se(t[y], o[_]), y--, _--;
    else if (p[v] === i[_]) d[_] = se(t[v], o[_]), Re(r, d[_ + 1], t[v]), v++, _--;
    else if (p[y] === i[g]) d[g] = se(t[y], o[g]), Re(r, t[v], t[y]), y--, g++;
    else if (f === void 0 && (f = jr(i, g, _), m = jr(p, v, y)), f.has(p[v])) if (f.has(p[y])) {
      const O = m.get(i[g]), gt = O !== void 0 ? t[O] : null;
      if (gt === null) {
        const Ue = Re(r, t[v]);
        se(Ue, o[g]), d[g] = Ue;
      } else d[g] = se(gt, o[g]), Re(r, t[v], gt), t[O] = null;
      g++;
    } else Xt(t[y]), y--;
    else Xt(t[v]), v++;
    for (; g <= _; ) {
      const O = Re(r, d[_ + 1]);
      se(O, o[g]), d[g++] = O;
    }
    for (; v <= y; ) {
      const O = t[v++];
      O !== null && Xt(O);
    }
    return this.ut = i, Rr(r, d), x;
  }
});
var jo = Object.defineProperty, ko = Object.getOwnPropertyDescriptor, Te = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ko(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && jo(e, s, t), t;
};
let Q = class extends l {
  constructor() {
    super(...arguments), this.open = !1, this.placeholder = "Type a command...", this.items = [], this._query = "", this._selectedIndex = 0;
  }
  get _filteredItems() {
    return this._query ? this.items.map((r) => ({
      item: r,
      score: this._fuzzyScore(r.label, this._query)
    })).filter((r) => r.score > 0).sort((r, e) => e.score - r.score).map((r) => r.item) : this.items;
  }
  _fuzzyScore(r, e) {
    const s = r.toLowerCase(), a = e.toLowerCase();
    let t = 0, o = 0, i = 0;
    for (let p = 0; p < s.length && o < a.length; p++)
      s[p] === a[o] ? (t += 1 + i, i++, o++) : i = 0;
    return o === a.length ? t : 0;
  }
  toggle() {
    this.open ? this.close() : this.show();
  }
  show() {
    this.open = !0, this._query = "", this._selectedIndex = 0, this.dispatchEvent(
      new CustomEvent("bh-open", { bubbles: !0, composed: !0 })
    ), this.updateComplete.then(() => {
      var r, e;
      (e = (r = this.shadowRoot) == null ? void 0 : r.querySelector("input")) == null || e.focus();
    });
  }
  close() {
    this.open = !1, this.dispatchEvent(
      new CustomEvent("bh-close", { bubbles: !0, composed: !0 })
    );
  }
  _onInput(r) {
    this._query = r.target.value, this._selectedIndex = 0;
  }
  _onKeydown(r) {
    const e = this._filteredItems;
    switch (r.key) {
      case "ArrowDown":
        r.preventDefault(), this._selectedIndex = Math.min(
          this._selectedIndex + 1,
          e.length - 1
        );
        break;
      case "ArrowUp":
        r.preventDefault(), this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
        break;
      case "Enter":
        r.preventDefault(), this._executeItem(e[this._selectedIndex]);
        break;
      case "Escape":
        this.close();
        break;
    }
  }
  _executeItem(r) {
    r && (this.close(), this.dispatchEvent(
      new CustomEvent("bh-execute", {
        bubbles: !0,
        composed: !0,
        detail: { id: r.id, label: r.label }
      })
    ));
  }
  _onItemClick(r) {
    this._executeItem(r);
  }
  render() {
    if (!this.open) return c;
    const r = this._filteredItems, e = r.length > 0 ? `cp-item-${this._selectedIndex}` : void 0;
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
          ${r.length === 0 ? h`<div class="empty">No matching commands</div>` : Qr(
      r,
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
    const r = (e = this.shadowRoot) == null ? void 0 : e.querySelector('.item[aria-selected="true"]');
    r == null || r.scrollIntoView({ block: "nearest" });
  }
};
Q.styles = [
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
Te([
  n({ type: Boolean, reflect: !0 })
], Q.prototype, "open", 2);
Te([
  n({ type: String })
], Q.prototype, "placeholder", 2);
Te([
  n({ type: Array })
], Q.prototype, "items", 2);
Te([
  P()
], Q.prototype, "_query", 2);
Te([
  P()
], Q.prototype, "_selectedIndex", 2);
Q = Te([
  u("bh-command-palette")
], Q);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bo = ht(class extends ct {
  constructor(r) {
    var e;
    if (super(r), r.type !== T.ATTRIBUTE || r.name !== "class" || ((e = r.strings) == null ? void 0 : e.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(r) {
    return " " + Object.keys(r).filter((e) => r[e]).join(" ") + " ";
  }
  update(r, [e]) {
    var a, t;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), r.strings !== void 0 && (this.nt = new Set(r.strings.join(" ").split(/\s/).filter((o) => o !== "")));
      for (const o in e) e[o] && !((a = this.nt) != null && a.has(o)) && this.st.add(o);
      return this.render(e);
    }
    const s = r.element.classList;
    for (const o of this.st) o in e || (s.remove(o), this.st.delete(o));
    for (const o in e) {
      const i = !!e[o];
      i === this.st.has(o) || (t = this.nt) != null && t.has(o) || (i ? (s.add(o), this.st.add(o)) : (s.remove(o), this.st.delete(o)));
    }
    return x;
  }
});
var To = Object.defineProperty, Mo = Object.getOwnPropertyDescriptor, Me = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Mo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && To(e, s, t), t;
};
let Z = class extends l {
  constructor() {
    super(...arguments), this.open = !1, this.x = 0, this.y = 0, this.items = [], this._selectedIndex = -1;
  }
  get _actionableItems() {
    return this.items.filter((r) => !r.separator && !r.disabled);
  }
  show(r, e, s) {
    s && (this.items = s), this.x = r, this.y = e, this.open = !0, this._selectedIndex = -1;
  }
  hide() {
    this.open = !1, this._selectedIndex = -1;
  }
  _onBackdropClick() {
    this.hide();
  }
  _onKeydown(r) {
    const e = this._actionableItems;
    switch (r.key) {
      case "Escape":
        this.hide();
        break;
      case "ArrowDown": {
        r.preventDefault();
        const s = this._selectedIndex + 1;
        s < e.length && (this._selectedIndex = s);
        break;
      }
      case "ArrowUp": {
        r.preventDefault();
        const s = this._selectedIndex - 1;
        s >= 0 && (this._selectedIndex = s);
        break;
      }
      case "Enter": {
        r.preventDefault();
        const s = e[this._selectedIndex];
        s && this._selectItem(s);
        break;
      }
    }
  }
  _selectItem(r) {
    r.disabled || (this.hide(), this.dispatchEvent(
      new CustomEvent("bh-select", {
        bubbles: !0,
        composed: !0,
        detail: { id: r.id, label: r.label }
      })
    ));
  }
  _isSelected(r) {
    return this._actionableItems[this._selectedIndex] === r;
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
        ${Qr(
      this.items,
      (a) => a.id,
      (a, t) => a.separator ? h`<div class="separator" role="separator"></div>` : h`
                  <div
                    id="ctx-item-${t}"
                    class=${Bo({
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
    var r;
    if (this.open) {
      const e = (r = this.shadowRoot) == null ? void 0 : r.querySelector(".menu");
      e == null || e.focus();
    }
  }
};
Z.styles = [
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
Me([
  n({ type: Boolean, reflect: !0 })
], Z.prototype, "open", 2);
Me([
  n({ type: Number })
], Z.prototype, "x", 2);
Me([
  n({ type: Number })
], Z.prototype, "y", 2);
Me([
  n({ type: Array })
], Z.prototype, "items", 2);
Me([
  P()
], Z.prototype, "_selectedIndex", 2);
Z = Me([
  u("bh-context-menu")
], Z);
var Uo = Object.defineProperty, Ho = Object.getOwnPropertyDescriptor, C = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ho(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Uo(e, s, t), t;
};
let $ = class extends l {
  constructor() {
    super(...arguments), this.title = "Terminal", this.status = "", this.statusColor = "success", this.prompt = "▸ ", this.promptUser = "", this.promptPath = "~", this.maxLines = 1e3, this.autoscroll = !0, this.hints = [], this.scanlines = !1, this._mode = "idle";
  }
  // --- TerminalAdapter implementation ---
  /** Append text to the current (last) line. Create a line if none exist. */
  write(r) {
    if (!this._output) return;
    let e = this._output.querySelector(".line:last-child");
    e || (e = document.createElement("div"), e.className = "line", this._output.appendChild(e)), e.innerHTML += Ne(r), this._scrollToBottom();
  }
  /** Append a complete line. Optionally tag it with an id for later replacement. */
  writeLine(r, e) {
    if (!this._output) return;
    const s = document.createElement("div");
    s.className = "line", s.innerHTML = Ne(r), e != null && e.id && s.setAttribute("data-line-id", e.id), this._output.appendChild(s), this._trimLines(), this._scrollToBottom();
  }
  /** Write a line styled as an error. */
  writeError(r) {
    this.writeLine("{danger}" + r + "{/}");
  }
  /** Update a previously written line identified by id. Falls back to writeLine. */
  replaceLine(r, e) {
    if (!this._output) return;
    const s = this._output.querySelector(`[data-line-id="${r}"]`);
    s ? s.innerHTML = Ne(e) : this.writeLine(e, { id: r });
  }
  /** Enter RUNNING state — disable input. */
  startCommand() {
    this._mode = "running";
  }
  /** Return to IDLE state — re-enable and focus input. */
  endCommand() {
    this._mode = "idle", this.updateComplete.then(() => {
      var r;
      (r = this._input) == null || r.focus();
    });
  }
  /** Clear the scrollback buffer. */
  clear() {
    this._output && (this._output.innerHTML = "");
  }
  /** Focus the terminal input. */
  focus() {
    var r;
    (r = this._input) == null || r.focus();
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
  _echo(r) {
    if (this._output) {
      if (this.promptUser) {
        const e = document.createElement("div");
        e.className = "line", e.innerHTML = '<span class="bh-t-tertiary">┌─[</span><span class="bh-t-primary">' + this.promptUser + '</span><span class="bh-t-tertiary">]─[</span><span class="bh-t-success">' + this.promptPath + '</span><span class="bh-t-tertiary">]</span>', this._output.appendChild(e);
        const s = document.createElement("div");
        s.className = "line", s.innerHTML = '<span class="bh-t-tertiary">└─</span><span class="bh-t-primary">' + this.prompt + "</span>" + Ne(r), this._output.appendChild(s);
      } else {
        const e = document.createElement("div");
        e.className = "line", e.innerHTML = '<span class="bh-t-primary">' + this.prompt + "</span>" + Ne(r), this._output.appendChild(e);
      }
      this._trimLines(), this._scrollToBottom();
    }
  }
  // --- Event handlers ---
  async _onCommand(r) {
    const e = r.detail;
    if (this._echo(e), this._handler) {
      const s = e.split(/\s+/), a = s[0], t = s.slice(1);
      try {
        await this._handler.execute(a, t, this);
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
  _onTabComplete(r) {
    var e, s;
    if ((e = this._handler) != null && e.complete) {
      const a = this._handler.complete(r.detail);
      if (a.length === 1) {
        const o = (s = this._input.shadowRoot) == null ? void 0 : s.querySelector(".cmd-input");
        o && (o.value = a[0]);
      } else a.length > 1 && this.writeLine(a.join("  "));
    } else
      this.dispatchEvent(
        new CustomEvent("bh-tab-complete", {
          detail: r.detail,
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
C([
  n()
], $.prototype, "title", 2);
C([
  n()
], $.prototype, "status", 2);
C([
  n({ attribute: "status-color" })
], $.prototype, "statusColor", 2);
C([
  n()
], $.prototype, "prompt", 2);
C([
  n({ attribute: "prompt-user" })
], $.prototype, "promptUser", 2);
C([
  n({ attribute: "prompt-path" })
], $.prototype, "promptPath", 2);
C([
  n({ type: Number, attribute: "max-lines" })
], $.prototype, "maxLines", 2);
C([
  n({ type: Boolean })
], $.prototype, "autoscroll", 2);
C([
  n({ attribute: !1 })
], $.prototype, "hints", 2);
C([
  n({ type: Boolean, reflect: !0 })
], $.prototype, "scanlines", 2);
C([
  Es({ context: Ss, subscribe: !0 })
], $.prototype, "_handler", 2);
C([
  P()
], $.prototype, "_mode", 2);
C([
  It(".output")
], $.prototype, "_output", 2);
C([
  It("bh-terminal-input")
], $.prototype, "_input", 2);
$ = C([
  u("bh-terminal")
], $);
var No = Object.defineProperty, Ro = Object.getOwnPropertyDescriptor, Rt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ro(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && No(e, s, t), t;
};
let Ce = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.align = "stretch", this.wrap = !1;
  }
  render() {
    return h`<slot></slot>`;
  }
};
Ce.styles = [
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
Rt([
  n({ reflect: !0 })
], Ce.prototype, "gap", 2);
Rt([
  n({ reflect: !0 })
], Ce.prototype, "align", 2);
Rt([
  n({ type: Boolean, reflect: !0 })
], Ce.prototype, "wrap", 2);
Ce = Rt([
  u("bh-stack")
], Ce);
var Lo = Object.defineProperty, qo = Object.getOwnPropertyDescriptor, ft = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? qo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Lo(e, s, t), t;
};
let pe = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.justify = "start", this.align = "center", this.nowrap = !1;
  }
  render() {
    return h`<slot></slot>`;
  }
};
pe.styles = [
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
ft([
  n({ reflect: !0 })
], pe.prototype, "gap", 2);
ft([
  n({ reflect: !0 })
], pe.prototype, "justify", 2);
ft([
  n({ reflect: !0 })
], pe.prototype, "align", 2);
ft([
  n({ type: Boolean, reflect: !0 })
], pe.prototype, "nowrap", 2);
pe = ft([
  u("bh-cluster")
], pe);
var Go = Object.defineProperty, Fo = Object.getOwnPropertyDescriptor, dr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Fo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Go(e, s, t), t;
};
let ot = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.align = "center";
  }
  render() {
    return h`<slot></slot>`;
  }
};
ot.styles = [
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
dr([
  n({ reflect: !0 })
], ot.prototype, "gap", 2);
dr([
  n({ reflect: !0 })
], ot.prototype, "align", 2);
ot = dr([
  u("bh-repel")
], ot);
var Vo = Object.defineProperty, Wo = Object.getOwnPropertyDescriptor, Lt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Wo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Vo(e, s, t), t;
};
let Oe = class extends l {
  constructor() {
    super(...arguments), this.max = "none", this.gutters = "none", this.intrinsic = !1;
  }
  willUpdate(r) {
    r.has("max") && this.style.setProperty("--bh-center-max", this.max);
  }
  render() {
    return h`<slot></slot>`;
  }
};
Oe.styles = [
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
Lt([
  n({ reflect: !0 })
], Oe.prototype, "max", 2);
Lt([
  n({ reflect: !0 })
], Oe.prototype, "gutters", 2);
Lt([
  n({ type: Boolean, reflect: !0 })
], Oe.prototype, "intrinsic", 2);
Oe = Lt([
  u("bh-center")
], Oe);
var Yo = Object.defineProperty, Ko = Object.getOwnPropertyDescriptor, qt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Ko(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Yo(e, s, t), t;
};
let Ae = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.itemWidth = "auto", this.snap = !1;
  }
  willUpdate(r) {
    r.has("itemWidth") && this.style.setProperty("--bh-reel-item-width", this.itemWidth);
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
qt([
  n({ reflect: !0 })
], Ae.prototype, "gap", 2);
qt([
  n({ reflect: !0, attribute: "item-width" })
], Ae.prototype, "itemWidth", 2);
qt([
  n({ type: Boolean, reflect: !0 })
], Ae.prototype, "snap", 2);
Ae = qt([
  u("bh-reel")
], Ae);
var Xo = Object.defineProperty, Jo = Object.getOwnPropertyDescriptor, br = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Jo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Xo(e, s, t), t;
};
let it = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.minHeight = "100vh";
  }
  willUpdate(r) {
    r.has("minHeight") && this.style.setProperty("--bh-cover-min-height", this.minHeight);
  }
  render() {
    return h`
      <slot></slot>
      <slot name="center"></slot>
      <slot name="bottom"></slot>
    `;
  }
};
it.styles = [
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
br([
  n({ reflect: !0 })
], it.prototype, "gap", 2);
br([
  n({ reflect: !0, attribute: "min-height" })
], it.prototype, "minHeight", 2);
it = br([
  u("bh-cover")
], it);
var Qo = Object.defineProperty, Zo = Object.getOwnPropertyDescriptor, ur = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? Zo(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && Qo(e, s, t), t;
};
let nt = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.min = "250px";
  }
  willUpdate(r) {
    r.has("min") && this.style.setProperty("--bh-grid-min", this.min);
  }
  render() {
    return h`<slot></slot>`;
  }
};
nt.styles = [
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
ur([
  n({ reflect: !0 })
], nt.prototype, "gap", 2);
ur([
  n({ reflect: !0 })
], nt.prototype, "min", 2);
nt = ur([
  u("bh-grid")
], nt);
var ei = Object.defineProperty, ti = Object.getOwnPropertyDescriptor, vr = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? ti(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ei(e, s, t), t;
};
let lt = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.ratio = "1/1";
  }
  willUpdate(r) {
    if (r.has("ratio")) {
      const e = this.ratio.split("/").map((s) => `${s.trim()}fr`).join(" ");
      this.style.setProperty("grid-template-columns", e);
    }
  }
  render() {
    return h`<slot></slot>`;
  }
};
lt.styles = [
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
vr([
  n({ reflect: !0 })
], lt.prototype, "gap", 2);
vr([
  n({ reflect: !0 })
], lt.prototype, "ratio", 2);
lt = vr([
  u("bh-split")
], lt);
var ri = Object.defineProperty, si = Object.getOwnPropertyDescriptor, Gt = (r, e, s, a) => {
  for (var t = a > 1 ? void 0 : a ? si(e, s) : e, o = r.length - 1, i; o >= 0; o--)
    (i = r[o]) && (t = (a ? i(e, s, t) : i(t)) || t);
  return a && t && ri(e, s, t), t;
};
let ze = class extends l {
  constructor() {
    super(...arguments), this.gap = "md", this.threshold = "30rem", this.limit = 4;
  }
  willUpdate(r) {
    if (r.has("threshold") || r.has("limit")) {
      this.style.setProperty("--bh-switcher-threshold", this.threshold);
      const e = `calc(100% / ${this.limit})`, s = "var(--bh-switcher-threshold, 30rem)";
      this.style.gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, max(${s}, ${e})), 1fr))`;
    }
  }
  render() {
    return h`<slot></slot>`;
  }
};
ze.styles = [
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
Gt([
  n({ reflect: !0 })
], ze.prototype, "gap", 2);
Gt([
  n({ reflect: !0 })
], ze.prototype, "threshold", 2);
Gt([
  n({ type: Number, reflect: !0 })
], ze.prototype, "limit", 2);
ze = Gt([
  u("bh-switcher")
], ze);
export {
  l as BaseElement,
  zt as BhAccordion,
  at as BhAccordionItem,
  Ct as BhActivityBar,
  we as BhActivityItem,
  Pt as BhAppShell,
  W as BhAvatar,
  Ke as BhBadge,
  N as BhButton,
  q as BhCard,
  Oe as BhCenter,
  R as BhCheckbox,
  X as BhChip,
  pe as BhCluster,
  Q as BhCommandPalette,
  Z as BhContextMenu,
  it as BhCover,
  tt as BhDataTable,
  me as BhDivider,
  J as BhFormField,
  nt as BhGrid,
  w as BhIcon,
  E as BhInput,
  ne as BhLed,
  le as BhLink,
  ce as BhNavItem,
  At as BhPanelHeader,
  he as BhPixelDisplay,
  z as BhPixelPanel,
  L as BhProgress,
  Y as BhRadio,
  Ae as BhReel,
  ot as BhRepel,
  et as BhSectionHeader,
  K as BhSegmentDisplay,
  S as BhSelect,
  Ot as BhSidebarPanel,
  ye as BhSkeleton,
  M as BhSlider,
  Xe as BhSpinner,
  lt as BhSplit,
  Ce as BhStack,
  st as BhStatusBar,
  _e as BhSwitch,
  ze as BhSwitcher,
  xe as BhTab,
  wt as BhTabBar,
  rt as BhTabPanel,
  U as BhTable,
  $t as BhTabs,
  $ as BhTerminal,
  Pe as BhTerminalBar,
  Ze as BhTerminalCursor,
  Et as BhTerminalHintBar,
  j as BhTerminalInput,
  Je as BhText,
  A as BhTextarea,
  $e as BhToolbar,
  Qe as BhTooltip,
  St as BhTree,
  H as BhTreeItem,
  ys as PIXEL_FONT,
  Ha as PixelDataController,
  $s as TERMINAL_TAG_MAP,
  Fa as animatePixels,
  ws as barToGrid,
  Ss as commandHandlerContext,
  ni as compositeGrids,
  Ps as escapeTerminalHtml,
  As as linkifyUrls,
  Cs as parseColorTags,
  Ne as renderTerminalText,
  xs as sparklineToGrid,
  _s as textToGrid
};
