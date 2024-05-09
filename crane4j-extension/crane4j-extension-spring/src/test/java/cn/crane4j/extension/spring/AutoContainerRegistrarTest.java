package cn.crane4j.extension.spring;

import cn.crane4j.core.container.Container;
import cn.crane4j.core.container.ContainerManager;
import cn.crane4j.core.container.Containers;
import cn.crane4j.core.container.DefaultContainerManager;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * @author heliang
 */
public class AutoContainerRegistrarTest{
    @Test
    public void testAutoContainerRegistrar() {
        ContainerManager containerManager  = new DefaultContainerManager();
        AutoContainerRegistrar autoContainerRegistrar = getAutoContainerRegistrar();

        autoContainerRegistrar.doRegister(containerManager);
        Container<Object> test = containerManager.getContainer("test");
        Map<Object, ?> datas =  test.get(Arrays.asList(1, 2, 3));
        Assert.assertEquals("{1=a, 2=b, 3=c}",datas.toString());
    }

    private static AutoContainerRegistrar getAutoContainerRegistrar() {
        Map<Integer, String> map = new HashMap<>();
        map.put(1, "a");
        map.put(2, "b");
        map.put(3, "c");

        Map<Integer, ?> integerMap = new HashMap<>();
        return new AutoContainerRegistrar() {
            @Override
            public void doRegister(ContainerManager manager) {
                Container<Integer> container = Containers.forMap("test", map);
                manager.registerContainer(container);
            }
        };
    }

}