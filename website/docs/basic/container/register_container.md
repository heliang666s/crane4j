# 注册数据源容器

## 1.在 Spring 环境

### 1.1.自动注册

在 Spring 环境中，你可以将你的容器直接交给 Spring 管理，项目启动后 crane4j 将会自动注册：

~~~java
@Component // 交给 Spring 管理
public class FooContainer implements Container<Integer> {
    public String getNamespace() {
        return "user";
    }
    public Map<Integer, Foo> get(Collection<Integer> ids) {
      // retrun some datas
    }
}
~~~

或者你也可以在配置类中注册：

~~~java
@Configuration
public class Crane4jExampleConfiguration {
  	@Bean
  	public Container<Integer> testContainer() {
      	return Containers.<Integer>forMap("test", Collections.emptyMap());
    }
}
~~~

:::warning

注意，容器的命名空间必须是一个**非空字符串**！

:::

### 1.2.手动注册

此外，你也可以从 Spring 容器获取 `ContainerManager` 后进行手动注册：

~~~java
@Component
public class Crane4jContainerRegistrar implements ApplicationRunner {
  
		@Autowired
  	private ContainerManager containerManager;
  
    @Override
    public void run(ApplicationArguments args) {
      	Container<Integer> containers = Containers.<Integer>forMap("test", Collections.emptyMap());
      	containerManager.registerContainer(containers);
    }
}
~~~

## 2.在非 Spring 环境

在非 Spring 环境中，你可以直接将容器注册到全局配置对象 `Crane4jGlobalConfiguration` 中：

~~~java
Crane4jGlobalConfiguration configuration = SimpleCrane4jGlobalConfiguration.create();
Container<Integer> containers = Containers.<Integer>forMap("test", Collections.emptyMap());
configuration.registerContainer(containers);
~~~

