import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.CTZgbW0d.js";const g=JSON.parse('{"title":"自定义容器","description":"","frontmatter":{},"headers":[],"relativePath":"basic/container/custom_container.md","filePath":"basic/container/custom_container.md","lastUpdated":1705332275000}'),t={name:"basic/container/custom_container.md"},e=n(`<h1 id="自定义容器" tabindex="-1">自定义容器 <a class="header-anchor" href="#自定义容器" aria-label="Permalink to &quot;自定义容器&quot;">​</a></h1><p>用户可以通过实现 <code>Container</code> 接口来自定义容器，并将其声明为 <code>@Bean</code> 或 <code>@Component</code>，以便在程序中使用。</p><p>下面是一个示例：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequiredArgsConstructor</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserContainer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Container</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Integer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserService userService;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getNamespace</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;user&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Map&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Integer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UserDO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Collection&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Integer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ids</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        List&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UserDO</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; users </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> userService.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">listByIds</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ids);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> users.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stream</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Collectors.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toMap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(UserDO</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">getId, Function.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">identity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>在上述示例中，我们实现了 <code>Container</code> 接口，并创建了一个根据用户ID返回<code>UserDO</code>集合的数据源容器。</p><p>在 Spring 环境中，你只需要将 <code>UserContainer</code> 交给 Spring 管理（比如在类上添加 <code>@Component</code> 注解）即可在项目启动后自动注册，在非 Spring 环境需要手动注册到 <code>Crane4jGlobalConfiguration</code> 中。</p><p>此外，你可以在自定义的容器类上直接添加 <code>@ContainerCache</code> 注解即可为其应用缓存，具体可参见后文 <a href="./../../advanced/cache.html">缓存</a> 一节。</p>`,7),h=[e];function p(l,k,r,E,d,c){return a(),i("div",null,h)}const y=s(t,[["render",p]]);export{g as __pageData,y as default};
