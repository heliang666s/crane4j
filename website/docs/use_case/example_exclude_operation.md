# 示例：如何在执行时排除某些操作

本示例将指导你如何在执行时选择性的排除某一些操作，在这之前，请先确保你已经阅读过[快速开始](./../user_guide/getting_started/getting_started_abstract.md)，并且成功将 crane4j 引入你的项目。

有时候，我们会希望在执行时根据情况选择性的排除某一些操作，比如我们现在在 Foo 类中声明了三组操作，接下来我们需要根据情况对他们进行排除：

~~~java
public class Foo {
  
  	@Assemble(container = "test1", prop = ":name1")
  	private Integer id1;
  	private String name1;
  
  	@Assemble(container = "test2", prop = ":name2")
  	private Integer id2;
  	private String name2;
  
  	@Assemble(container = "test3", prop = ":name3")
  	private Integer id3;
  	private String name3;
}
~~~

## 1.进行分组填充

你可以为三个操作分别指定其所属的分组，然后再在执行时指定仅执行哪些分组的操作：

~~~java
public class Foo {
  
  	@Assemble(container = "test1", prop = ":name1", groups = { "g1" })
  	private Integer id1;
  	private String name1;
  
  	@Assemble(container = "test2", prop = ":name2", groups = { "g1" })
  	private Integer id2;
  	private String name2;
  
  	@Assemble(container = "test3", prop = ":name3", groups = { "g2" })
  	private Integer id3;
  	private String name3;
}

// 在自动填充时，指定仅填充属于 g1 组别的操作
@AutoOperate(type = Foo.class, includes = { "g1" })
public List<Foo> listFoo() {
  	// do something
}
~~~

在上述代码中，我们在自动填充时配置只填充属于 "g1" 组别的操作。

更多内容可以参见 [操作分组](./../basic/operation_group.md) 一节。

## 2.设置条件填充

你可以为每个操作指定生效条件，此后执行时仅当条件满足时才会应用该操作：

~~~java
public class Foo {
  
  	// 仅当 id1 不为 null 时才生效
    @ConditionOnPropertyNotNull
  	@Assemble(container = "test1", prop = ":name1", groups = { "g1" })
  	private Integer id1;
  	private String name1;
  
    // 仅当 id1 为整数时才生效
    @ConditionOnExpression(value = "#target.name % 2 == 0")
  	@Assemble(container = "test2", prop = ":name2", groups = { "g1" })
  	private Integer id2;
  	private String name2;
  
    // 仅当 id3 为 10086 时才生效
    @ConditionOnProperty(value = "10086", valueType = Integer.class) 
  	private Integer id3;
  	private String name3;
}
~~~

更多内容可以参见 [条件填充](./../basic/operation_condition.md) 一节。

## 3.手动排除

除了基于分组和条件填充外，你可以通过编码的方式更灵活的排除一些操作。

**在代码时排除**

比如，如果你是通过 `OperateTemplate` 进行手动填充，那么你可以直接在代码中指定过滤器：

~~~java
OperateTeamplte template = SpringUtil.getBean(OperateTemplate.class);
template.execute(fooList, op -> op instanceof AssembleOperation); // 只执行装配操作
~~~

关于手动填充，具体可参见 [触发填充操作](./../basic/trigger_operation.md) 一节中手动填充部分内容。

**通过回调接口排除**

此外，即使使用自动填充，你也可以通过让目标对象实现 `OperationAwareBean` 回调接口来排除某些操作：

~~~java
public class Foo implements OperationAwareBean {
  
  	@Assemble(container = "test1", prop = ":name1")
  	private Integer id1;
  	private String name1;
  
  	@Assemble(container = "test2", prop = ":name2")
  	private Integer id2;
  	private String name2;
  
  	@Assemble(container = "test3", prop = ":name3")
  	private Integer id3;
  	private String name3;

    @Override
    public boolean supportOperation(String key) {
        // 若 id3 为空，则不进行针对 id3 属性的填充
        return !Objects.equals("id3", key) 
            || Objects.nonNull(this.id3)
    }
}
~~~

在上述代码中，当 `id3` 属性为空时，不执行对应的填充操作。

关于此类回调接口，具体可参见 [组件的回调接口](./../advanced/callback_of_component.md) 一节。
