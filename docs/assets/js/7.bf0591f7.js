(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{273:function(e,r,t){e.exports=t.p+"assets/img/image-20230220150040070.63150c20.png"},288:function(e,r,t){"use strict";t.r(r);var _=t(14),v=Object(_.a)({},(function(){var e=this,r=e._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[r("img",{attrs:{src:t(273),alt:"image-20230220150040070"}})]),e._v(" "),r("h2",{attrs:{id:"为什么写"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#为什么写"}},[e._v("#")]),e._v(" 为什么写？")]),e._v(" "),r("p",[r("code",[e._v("crane4j")]),e._v(" 是由 "),r("code",[e._v("crane")]),e._v(" 框架发展而来。最初，我在公司开发中遇到了大量重复的字段填充需求，这些需求与核心业务无关，只是一些重复的关联查询操作。我厌倦了频繁的联查和手动赋值，于是花了时间添加了一个基于 "),r("code",[e._v("MybatisPlus")]),e._v(" 的小插件，用于自动查询并填充字段值。")]),e._v(" "),r("p",[e._v("随着时间推移，这个插件功能逐渐丰富，我还加入了对枚举和常量的转换支持，并实现了基于切面的自动填充功能。最终，这个插件发展成了一个独立的框架，即 "),r("code",[e._v("crane")]),e._v("，并在生产环境中广泛使用。")]),e._v(" "),r("p",[e._v("在 2022 年初，我对 "),r("code",[e._v("crane")]),e._v(" 框架进行了重构，并将其上传到 "),r("code",[e._v("Gitee")]),e._v("，形成了 "),r("a",{attrs:{href:"https://github.com/Createsequence/crane",target:"_blank",rel:"noopener noreferrer"}},[r("code",[e._v("crane")]),r("OutboundLink")],1),e._v(" 项目。经过半年多的更新，"),r("code",[e._v("crane")]),e._v(" 的功能逐渐稳定，但早期设计的不足导致扩展困难。因此，我重新梳理了功能，并决定在保留 "),r("code",[e._v("crane")]),e._v(" 功能和概念的基础上进行彻底的重构，从而诞生了现在的 "),r("code",[e._v("crane4j")]),e._v("。")]),e._v(" "),r("p",[e._v("相较于前身 "),r("code",[e._v("crane")]),e._v("，"),r("code",[e._v("crane4j")]),e._v(" 的代码更加健壮，设计更合理，功能更强大，使用更灵活。")]),e._v(" "),r("h2",{attrs:{id:"它解决了什么问题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#它解决了什么问题"}},[e._v("#")]),e._v(" 它解决了什么问题？")]),e._v(" "),r("p",[r("code",[e._v("crane4j")]),e._v(" 是一套基于注解的数据填充框架，“根据 A 的 key 值拿到 B，再把 B 的属性映射到 A” 就是 "),r("code",[e._v("crane4j")]),e._v(" 的核心功能。")]),e._v(" "),r("p",[e._v("在日常开发中，我们经常需要进行繁琐的数据组装工作，例如处理字典项、配置项、枚举常量，甚至进行关联数据的查询。这些数据来自不同的来源，与核心业务无关，但需要编写冗长的样板代码来处理，令人感到烦恼。")]),e._v(" "),r("p",[r("code",[e._v("crane4j")]),e._v(" 为了解决这个问题而生，它支持通过简单的注解配置，优雅而高效地完成不同数据源、数据类型和字段的数据填充。这样，我们就能够省去繁琐的字段填充工作，专注于核心业务的实现。")]),e._v(" "),r("h2",{attrs:{id:"它有什么特性"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#它有什么特性"}},[e._v("#")]),e._v(" 它有什么特性？")]),e._v(" "),r("ul",[r("li",[r("strong",[e._v("多样的数据源支持")]),e._v("：支持枚举、键值对缓存和方法作为数据源，也可通过简单的自定义扩展兼容更多类型的数据源，并提供对所有数据源的缓存支持；")]),e._v(" "),r("li",[r("strong",[e._v("强大的字段映射能力")]),e._v("：通过注解即可完成不同类型字段的自动映射转换，还支持包括模板、排序、分组和嵌套对象填充等功能；")]),e._v(" "),r("li",[r("strong",[e._v("高度可扩展")]),e._v("：用户可以自由替换所有主要组件，结合 Spring 的依赖注入可实现轻松优雅的自定义扩展；")]),e._v(" "),r("li",[r("strong",[e._v("丰富的可选功能")]),e._v("：提供额外的自动填充方法返回值和方法入参参数，多线程填充，自定义注解和表达式，数据库框架插件等可选功能；")]),e._v(" "),r("li",[r("strong",[e._v("开箱即用")]),e._v("：简单配置即可与 spring/springboot 快速集成，也支持在非 spring 环境中使用；")])]),e._v(" "),r("h2",{attrs:{id:"如何使用"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#如何使用"}},[e._v("#")]),e._v(" 如何使用？")]),e._v(" "),r("p",[e._v("想要快速体验 "),r("code",[e._v("crane4j")]),e._v("，或者仅想要使用基本功能，则阅读“基础”一章即可。如果想要进一步了解和使用 "),r("code",[e._v("crane4j")]),e._v("，可以按目录顺序完整的阅读文档，或者根据“基础”章节中的指引挑选感兴趣的部分阅读。")]),e._v(" "),r("p",[e._v("源码中记录每个类都有对应的测试用例，如果仍然感觉不好理解，可以在把源码中的示例模块 "),r("code",[e._v("crane4j-example")]),e._v(" ("),r("a",{attrs:{href:"https://gitee.com/CreateSequence/crane4j/tree/dev/crane4j-example",target:"_blank",rel:"noopener noreferrer"}},[e._v("Gitee"),r("OutboundLink")],1),e._v(" / "),r("a",{attrs:{href:"https://github.com/opengoofy/crane4j/tree/dev/crane4j-example",target:"_blank",rel:"noopener noreferrer"}},[e._v("GitHub"),r("OutboundLink")],1),e._v(")  拉到本地运行一下，里面有针对某些比较复杂的功能的集成测试，或许会有助于理解和使用对应功能。")])])}),[],!1,null,null,null);r.default=v.exports}}]);