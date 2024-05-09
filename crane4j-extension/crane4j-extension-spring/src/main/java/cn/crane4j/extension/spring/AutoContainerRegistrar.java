package cn.crane4j.extension.spring;

import cn.crane4j.core.container.ContainerManager;

/**
 * AutoContainerRegistrar
 */
public interface AutoContainerRegistrar {
    void doRegister(ContainerManager manager);
}
