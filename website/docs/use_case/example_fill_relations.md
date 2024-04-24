# 示例：如何级联填充

本示例将指导你如何指定填充的顺序，从而实现级联填充的效果。在这之前，请先确保你已经阅读过[快速开始](./../user_guide/getting_started/getting_started_abstract.md)，并且成功将 crane4j 引入你的项目。

## 1.指定填充顺序

我们假设现在有一个员工对象，我们需要填充其所属的一级、二级与三级部门的信息。不过，我们数据库中只存储了三级部门 ID，此时，我们需要先查询三级部门的信息，然后填充该部门归属的二级部门 ID……依次类推。

则此时，如果我们没有一个根据三级部门 ID 查询全部关联上级部门的接口，而只有分别根据某一级部门 ID 查询的接口，那么我们可以通过**指定填充顺序**来实现级联填充的效果：

~~~java
public Emp {
  
    @Assemble(
      	container = "dept", 
      	prop = { "name:firstDeptName" },
      	sort = 3 // 指定顺序
    )
  	private Integer firstIdDeptId;
  	private String firstDeptName;
  
  	@Assemble(
      	container = "dept", 
      	prop = { "name:secondDeptName", "parentDeptId:firstIdDeptId"},
      	sort = 2 // 指定顺序
    )
  	private Integer secondDeptId;
  	private String secondDeptName;
  
  	@Assemble(
      	container = "dept", 
      	prop = { "name:thirdDeptName", "parentDeptId:secondDeptId"},
      	sort = 1 // 指定顺序
    )
  	private Integer thirdDeptId;
  	private String thirdDeptName;
}
~~~

如果你使用的是基于 AOP 的自动填充，那么你可以在 `@AutoOperate` 注解中指定：

~~~java
// 显式指定操作执行器
@AutoOperate(type = Student.class, executorType = OrderedBeanOperationExecutor.class)
public List<Student> listStudent(List<Integer> ids) {
    // do something
}
~~~

:::tip

关于如何配置填充顺序的具体内容，请参见：[指定操作顺序](./../basic/operation_sort.md)。

:::

## 2.在数据源层面处理级联关系

指定顺序执行器会导致该对象中所有的操作都变为同步的，即使两个不同的操作都来自相同的数据源，它们依然会分开成两个步骤分别查库。如果你觉得这一步比较消耗性能，或者有其他的顾虑，你也可以直接在数据源的层面直接就处理好级联关系。

这里我们以方法数据源容器为例，我们可以直接提供一个方法数据源容器，它从一开始就支持通过下级部门 ID 获取所有关联的上级部门：

~~~java
@Component
@RequiredArgsConstructor
public class DeptService {
  	private final DeptMapper deptMapper;
  
  	@ContainerMethod(
    		container = "thirdDept", resultType = Map.class, resultKey = "thirdDeptId"
    )
  	public List<Map<String, Object>> queryDeptWithParentByThirdDept(List<Integer> thirdDeptIds) {
      	// 查询一级部门，并按 ID 分组
      	Map<Interger, Dept> thirdDepts = deptMapper.listByIds(thirdDeptIds).stream()
          .collect(Collectors.toMap(Dept::getId, dept -> dept));
      
      	// 查询二级部门，并按 ID 分组
      	Set<Interger> secondDeptIds = thirdDepts.values().stream()
          	.map(Dept::getParentId)
          	.collect(Collector.toSet());
      	Map<Interger, Dept> secondDepts = deptMapper.listByIds(secondDeptIds).stream()
          .collect(Collectors.toMap(Dept::getId, dept -> dept));
      
      	// 查询一级部门，并按 ID 分组
      	Set<Interger> firstDeptIds = secondDeptIds.values().stream()
          	.map(Dept::getParentId)
          	.collect(Collector.toSet());
      	Map<Interger, Dept> firstDepts = deptMapper.listByIds(firstDeptIds).stream()
          .collect(Collectors.toMap(Dept::getId, dept -> dept));
      
      	// 组装数据
      	List<Map<String, String>> results = new ArrayLsit<>(thirdDepts.size());
      	thirdDepts.values().forEach(td -> {
          	Dept sd = secondDepts.get(td.getParentId());
          	Dept fd = firstDepts.get(sd.getParentIds());
          
          	Map<String, Object> r = new HashMap<>(6);
          	r.put("thirdDeptId", r.getId());
          	r.put("thirdDeptName", r.getName());
          	r.put("secondDeptId", sd.getId());
          	r.put("secondDeptName", sd.getName());
          	r.put("firstIdDeptId", fd.getId());
          	r.put("firstIdDeptName", fd.getName());
          	results.put(r);
        });
        return results;
    } 
}
~~~

随后，我们在部门对象上直接引用相关属性即可：

~~~java
public Emp {
  	private Integer firstIdDeptId;
  	private String firstDeptName;
  	private Integer secondDeptId;
  	private String secondDeptName;
  	@Assemble(
      	container = "thirdDept", 
      	prop = { 
          "thirdDeptName", 
          "secondDeptId", "secondDeptName",
          "firstIdDeptId", "firstIdDeptName"
        },
    )
  	private Integer thirdDeptId;
  	private String thirdDeptName;
}
~~~

:::tip

关于方法容器的使用和配置，请参见 [方法容器](./../basic/container/method_container.md) 一节。

:::
