import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.CTZgbW0d.js";const g=JSON.parse('{"title":"容器提供者","description":"","frontmatter":{},"headers":[],"relativePath":"basic/container/container_provider.md","filePath":"basic/container/container_provider.md","lastUpdated":1697283224000}'),e={name:"basic/container/container_provider.md"},t=n(`<h1 id="容器提供者" tabindex="-1">容器提供者 <a class="header-anchor" href="#容器提供者" aria-label="Permalink to &quot;容器提供者&quot;">​</a></h1><p>容器提供者 <code>ContainerProvider</code> 是用于获取数据源容器的组件，类似于 Spring 中的 <code>FactoryBean</code>，全局配置类 <code>Crane4jGlobalConfiguration</code> 本身就是一个 <code>ContainerProvider</code>。</p><p>它被设计用于接入第基于三方框架实现的容器，比如 <code>MybatisPlusQueryContainerProvider</code>，我们可以通过它获取基于 <code>BaseMapper#selectList</code> 方法构建的特殊方法容器，当调用时等同于调用<code>BaseMapper#selectList</code> 方法。</p><p><img src="https://img.xiajibagao.top/image-20230311184930927.png" alt="image-20230311184930927"></p><h2 id="_1-创建并注册" tabindex="-1">1.创建并注册 <a class="header-anchor" href="#_1-创建并注册" aria-label="Permalink to &quot;1.创建并注册&quot;">​</a></h2><p>crane4j 默认提供了 <code>PartitionContainerProvider</code> 作为常用实现类，它可以满足绝大部分的需求，或者你也可以实现 <code>ContainerProvider</code> 接口，自己定义一个提供者。</p><p>当你创建了一个实例后，若你在非 Spring 环境中，你需要将其手动注册到全局配置中：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SimpleCrane4jGlobalConfiguration configuration </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SimpleCrane4jGlobalConfiguration.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">configuration.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">registerContainerProviderput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;fooContainerProvider&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, xxxContainerProvider);</span></span></code></pre></div><p>如果你是在 Spring 环境，那么你直接将其交给 Spring 管理即可，在项目启动后它会自动注册。</p><h2 id="_2-在配置中引用" tabindex="-1">2.在配置中引用 <a class="header-anchor" href="#_2-在配置中引用" aria-label="Permalink to &quot;2.在配置中引用&quot;">​</a></h2><p>你可以在 <code>@Assemble</code> 注解的 <code>containerProvider</code> 属性中，指定你需要的容器要从哪个提供者获取。比如：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserVO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Assemble</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        container</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;user&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">containerProvider</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;fooContainerProvider&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Mapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Integer id;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>当配置解析时，<code>crane4j</code> 将从用户指定的 <code>fooContainerProvider</code> 获取 <code>namespace</code> 为 <code>user</code> 的数据源容器。</p><p>当然，你也可以像 Spring 从 <code>FactoryBean</code> 获取 <code>bean</code> 那样，通过 <code>$$</code> 连接符拼接两者，然后将其作为 <code>namesapce</code>，比如上述配置可以改写为：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserVO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Assemble</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        container</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;fooContainerProvider&amp;&amp;user&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Mapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Integer id;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>两种方式效果一致，不过通常还是更推荐使用第一种方式，它会更直观一些。</p>`,16),p=[t];function h(l,k,r,d,o,c){return a(),i("div",null,p)}const y=s(e,[["render",h]]);export{g as __pageData,y as default};
