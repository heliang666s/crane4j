package cn.crane4j.mybatis.plus.extension.example;

import cn.crane4j.annotation.ContainerMethod;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.Collection;

/**
 * 针对MP接口，同样也可以使用方法数据源容器
 *
 * @author huangchengxing
 */
@ContainerMethod(
    namespace = "foo", resultType = Foo.class,
    bindMethod = "selectBatchIds", bindMethodParamTypes = Collection.class
)
@Mapper
public interface FooMapper extends BaseMapper<Foo> {
}
