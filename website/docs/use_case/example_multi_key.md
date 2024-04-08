# 示例：如何通过多个Key关联数据

本示例将指导你如何处理当需要通过多个 key 字段关联数据的场景。在这之前，请先确保你已经阅读过[快速开始](./../user_guide/getting_started/getting_started_abstract.md)，并且成功将 crane4j 引入你的项目。

首先，我们假设存在如下 `Dict` 对象：

~~~java
@Data
public class Dict {
  	private Integer id;
  	private String type;
  	private String name;
}
~~~

现在，我们需要对其 `name` 字段进行填充，然而我们并不能简单的直接通过 `id` 找到关联的数据，而是需要同时根据 `id` 与 `type` 进行查找。

在这种情况下，我们有三种可能的解决方案：

## 1.使用对象容器

参见 [对象容器](./../basic/container/object_container.md) 一节，最简单的粗暴的方法，就是直接尽可能的手动处理完整个过程：

~~~java
@Assemble(container = "dict", props = @Mapping(ref = "name"))
@Data
public class Dict {
  	private Integer id;
  	private String type;
  	private String name;
}

@Getter
@RequiredArgsConstructor
public static class DictContainer implements Container<Dict> {
  	private final DictService dictService;
  	private String namespace = "dict";
  	private Map<Dict, ?> get(Collection<Dict> dicts) {
      	Map<Dict, String> results = new HashMap<>(dicts.size());
      	Map<String, List<Dict>> grouped = dicts.stream().collect(Collectors.group(Dict::getType));
      	grouped.forEach((type, ds) -> {
          	// 查询指定 type 下的管理字典数据
          	Set<String> ids = ds.stream().map(Dict::getId).collect(Collectors.toSet());
          	Map<Integer, DictVO> sources = dictService.listByTypeAndIds(type, ids)
                .stream().collect(Collectors.toMap(DictVO::getId));
          	ds.forEach(d -> {
              	// 获取字典对应的 name，并添加到 results 结果集
              	DictVO dict = sources.get(d.getId());
              	results.put(d, dict.getName());
            })
        });
      	// 返回的数据集直接以对象为 Key
      	return results;
    }
}
~~~

简而言之，我们直接在容其中获取要填充的 `Dict`，然后跟业务代码一样把关联的数据查出来，最后返回以 `Dict` 对象为 Key 的集合。

当然，到既然你已经可以在容器中直接拿到要填充的对象了，那么不妨直接绕过 crane4j，直接顺带手动的设置一下值：

~~~java
@Getter
@RequiredArgsConstructor
@Component
public static class DictContainer implements Container<Dict> {
  	private final DictService dictService;
  	private String namespace = "dict";
  	private Map<Dict, ?> get(Collection<Dict> dicts) {
      	Map<String, List<Dict>> grouped = dicts.stream().collect(Collectors.group(Dict::getType));
      	grouped.forEach((type, ds) -> {
          	// 查询指定 type 下的管理字典数据
          	Set<String> ids = ds.stream().map(Dict::getId).collect(Collectors.toSet());
          	Map<Integer, DictVO> sources = dictService.listByTypeAndIds(type, ids)
                .stream().collect(Collectors.toMap(DictVO::getId));
          	ds.forEach(d -> {
              	// 获取字典对应的 name，并直接设置值
              	DictVO dict = sources.get(d.getId());
              	dict.setName(dict.getName());
            })
        });
      	// 因为已经手动设置完值了，所以直接返回一个空集合
      	return Collections.emptyMap();
    }
}
~~~

## 2.使用方法容器

参见 [方法容器](./../basic/container/method_container.md) 一节，我们定义一个接受参数对象的方法作为数据源容器，然后指定装配操作生成参数对象作为 Key：

~~~java
@AssembleMethod(
    props = @Mapping("name"),
  	targetType = DictService.class,
  	method = @ContainerMethod(bindMethod = "listByTypeAndId", type = MappingType.NO_Mapping),
  	keyType = DictQueryDTO.class, // 将 DictQueryDTO 参数对象作为 key
  	keyDesc = "id:dictId, type:dictType"
)
@Data
public class Dict {
  	private Integer id;
  	private String type;
  	private String name;
}

// 参数对象
@Data
public class DictQueryDTO {
  	private Integer dictId;
  	private String dictType;
}

// 查询接口
@Getter
@RequiredArgsConstructor
@Component
public static class DictService {
  	private final DictMapper dictMapper;
  	private Map<DictQueryDTO, DictVO> listByTypeAndId(Collection<DictQueryDTO> dtos) {
      	// 查询数据
    }
}
~~~

在 `listByTypeAndId` 方法中，你可以根据参数对象查询出相关的数据，最终返回一个按照参数对象分组的数据集，crane4j 将会根据参数对象为填充操作找到对应的数据源对象进行属性映射。

:::tip

-   关于方法容器，具体可参见 [方法容器](./../basic/container/method_container.md) 一节；
-   关于 Key 值解析器，具体可参见 [声明装配操作](./../basic/declare_assemble_operation.md) 一节中的键值解析策略部分；

:::

## 3.配合容器提供者使用

如果你在使用时，就能确认 type 为某个固定值，那么你也可以配合容器提供者来节省一点功夫，比如：

~~~java
@Data
public class Dict {
    @Assemble(
        containerProvider = "dictContainerProvider", 
      	container = "order-dict", // 总是查询固定的字典类型
      	props = @Mapping(ref = "name")
    )
  	private Integer id;
  	private String name;
}

// 容器提供者
@Component
@RequiredArgsConstructor
public DictContainerProvider implements ContainerProvider {
  	private final DictService dictService;
    @Nullable
    @Override
    public <K> Container<K> getContainer(String dictType) {
      	// 返回的容器会根据固定的字典类型查询 DictVO 数据，并返回按 id 分组的数据集
      	return (Container<K>) dictIds -> dictService.listByTypeAndIds(dictType, dictIds)
          	.stream().collect(Collectors.toMap<>(DictVO::getId, dict -> dict));
    }
}
~~~

具体参见 [数据源容器提供者](./../basic/container/container_provider.md) 一节；