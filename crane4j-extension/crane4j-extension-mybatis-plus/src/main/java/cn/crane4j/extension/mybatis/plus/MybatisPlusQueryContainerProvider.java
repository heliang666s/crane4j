package cn.crane4j.extension.mybatis.plus;

import cn.crane4j.core.container.Container;
import cn.crane4j.core.container.ContainerProvider;
import cn.crane4j.core.container.MethodInvokerContainer;
import cn.crane4j.core.exception.Crane4jException;
import cn.crane4j.core.support.Crane4jGlobalConfiguration;
import cn.crane4j.core.support.MethodInvoker;
import cn.crane4j.core.support.container.MethodInvokerContainerCreator;
import cn.crane4j.core.support.container.query.AbstractNamespaceResolvableQueryContainerProvider;
import cn.crane4j.core.util.CollectionUtils;
import cn.crane4j.core.util.ReflectUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.injector.AbstractSqlInjector;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.TableFieldInfo;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.checkerframework.checker.nullness.qual.Nullable;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Proxy;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * <p>A {@link ContainerProvider} implementation based on mybatis-plus's {@link BaseMapper},
 * it's provides the ability that generate query container by the specified query information.<br/>
 * It is need register {@link BaseMapper} from mybatis-plus to this instance before use it.
 *
 * @author huangchengxing
 */
public class MybatisPlusQueryContainerProvider extends
    AbstractNamespaceResolvableQueryContainerProvider<BaseMapper<?>> {

    /**
     * Factory for creating {@link BaseMapper} instance if it is not registered.
     */
    @Setter
    @Nullable
    private Function<String, BaseMapper<?>> mapperFactory;

    /**
     * Global configuration.
     */
    protected final Crane4jGlobalConfiguration crane4jGlobalConfiguration;

    /**
     * Create a {@link MybatisPlusQueryContainerProvider} instance
     *
     * @param methodInvokerContainerCreator method invoker container creator
     * @param globalConfiguration global configuration
     */
    public MybatisPlusQueryContainerProvider(
            MethodInvokerContainerCreator methodInvokerContainerCreator, Crane4jGlobalConfiguration globalConfiguration) {
        this(methodInvokerContainerCreator, globalConfiguration, null);
    }

    /**
     * Create a {@link MybatisPlusQueryContainerProvider} instance
     *
     * @param methodInvokerContainerCreator method invoker container creator
     * @param globalConfiguration global configuration
     * @param mapperFactory mapper factory
     */
    public MybatisPlusQueryContainerProvider(
        MethodInvokerContainerCreator methodInvokerContainerCreator, Crane4jGlobalConfiguration globalConfiguration, @Nullable Function<String, BaseMapper<?>> mapperFactory) {
        super(methodInvokerContainerCreator);
        this.crane4jGlobalConfiguration = globalConfiguration;
        this.mapperFactory = mapperFactory;
    }

    /**
     * <p>Get a container based on repository object repository.<br />
     * When querying, the attribute name of the input parameter will be converted to
     * the table columns specified in the corresponding property.
     *
     * @param name        mapper name
     * @param keyProperty key field name for query, if it is empty, it defaults to the specified key field
     * @param properties  fields to query, if it is empty, all table columns will be queried by default.
     * @return container
     */
    @Override
    public <K> Container<K> getQueryContainer(String name, @Nullable String keyProperty, @Nullable List<String> properties) {
        if (!registeredRepositories.containsKey(name) && Objects.nonNull(mapperFactory)) {
            synchronized (registeredRepositories) {
                if (!registeredRepositories.containsKey(name)) {
                    registerRepository(name, mapperFactory.apply(name));
                }
            }
        }
        return super.getQueryContainer(name, keyProperty, properties);
    }

    /**
     * Create repository.
     *
     * @param name   name
     * @param target target
     * @return {@link Repository} instance
     */
    @Override
    protected Repository<BaseMapper<?>> createRepository(String name, BaseMapper<?> target) {
        TableInfo tableInfo = TableInfoHelper.getTableInfo(name);
        if (Objects.isNull(tableInfo)) {
            tableInfo = Optional.ofNullable(Proxy.getInvocationHandler(target))
                .map(h -> (Class<?>)ReflectUtils.getFieldValue(h, "mapperInterface"))
                .map(this::extractModelClass)
                .map(TableInfoHelper::getTableInfo)
                .orElseThrow(() -> new Crane4jException("cannot resolve bean type of mapper [{}]", name));
        }
        return new MapperInfo(tableInfo, target);
    }

    /**
     * Create a {@link MethodInvoker} of {@link MethodInvokerContainer}.
     *
     * @param namespace    namespace
     * @param repository   mapper
     * @param queryColumns query columns
     * @param keyColumn    key column
     * @param keyProperty key property
     * @return {@link Container}
     */
    @NonNull
    @Override
    protected MethodInvoker createMethodInvoker(
        String namespace, Repository<BaseMapper<?>> repository,
        Set<String> queryColumns, String keyColumn, String keyProperty) {
        return new Query<>(repository.getTarget(), queryColumns.toArray(new String[0]), keyColumn);
    }

    /**
     * Copy and optimize from {@link AbstractSqlInjector#extractModelClass}
     *
     * @param mapperClass mapper class
     * @return model class
     */
    protected Class<?> extractModelClass(Class<?> mapperClass) {
        return Arrays.stream(mapperClass.getGenericInterfaces())
            .filter(ParameterizedType.class::isInstance)
            .map(ParameterizedType.class::cast)
            .flatMap(type -> Arrays.stream(type.getActualTypeArguments()))
            .filter(Class.class::isInstance)
            .map(Class.class::cast)
            .filter(modelClass -> !Object.class.equals(modelClass))
            .findFirst()
            .orElse(null);
    }

    /**
     * An implementation of the Repository interface that provides access to data storage
     * through MybatisPlus's {@link TableInfo} and {@link BaseMapper}.
     *
     * @author huangchengxing
     */
    protected static class MapperInfo implements Repository<BaseMapper<?>> {

        private final TableInfo tableInfo;
        private final BaseMapper<?> baseMapper;
        private final Map<String, String> columnMap;
        private final Map<String, String> queryColumnMap;

        /**
         * Constructs a new instance of MapperInfo with the provided TableInfo and BaseMapper.
         *
         * @param tableInfo the TableInfo object for the repository.
         * @param baseMapper the BaseMapper object for the repository.
         */
        public MapperInfo(TableInfo tableInfo, BaseMapper<?> baseMapper) {
            this.tableInfo = tableInfo;
            this.baseMapper = baseMapper;
            this.columnMap = tableInfo.getFieldList().stream()
                .collect(Collectors.toMap(TableFieldInfo::getProperty, TableFieldInfo::getColumn));
            this.columnMap.put(tableInfo.getKeyProperty(), tableInfo.getKeyColumn());
            this.queryColumnMap = tableInfo.getFieldList().stream()
                .collect(Collectors.toMap(TableFieldInfo::getProperty, TableFieldInfo::getSqlSelect));
            this.queryColumnMap.put(tableInfo.getKeyProperty(), tableInfo.getKeySqlSelect());
        }

        /**
         * Returns the BaseMapper object stored in the repository.
         *
         * @return the BaseMapper object.
         */
        @Override
        public BaseMapper<?> getTarget() {
            return baseMapper;
        }

        /**
         * Returns the name of the table where the data is stored.
         *
         * @return the table name.
         */
        @Override
        public String getTableName() {
            return tableInfo.getTableName();
        }

        /**
         * Returns the entity type of the stored data.
         *
         * @return the entity type.
         */
        @Override
        public Class<?> getEntityType() {
            return tableInfo.getEntityType();
        }

        /**
         * Returns the key property for the data stored in the repository.
         *
         * @return the key property.
         */
        @Override
        public String getKeyProperty() {
            return tableInfo.getKeyProperty();
        }

        /**
         * Converts a property name to its corresponding column name.
         *
         * @param property the property to convert.
         * @param defaultValue the default value to return if no matching column is found.
         * @return the column name.
         */
        @Override
        public String propertyToColumn(String property, String defaultValue) {
            return columnMap.getOrDefault(property, defaultValue);
        }

        /**
         * Converts a property name to its corresponding query column name.
         *
         * @param property the property to convert.
         * @param defaultValue the default value to return if no matching query column is found.
         * @return the query column name.
         */
        @Override
        public String propertyToQueryColumn(String property, String defaultValue) {
            return queryColumnMap.getOrDefault(property, defaultValue);
        }
    }

    @RequiredArgsConstructor
    protected static class Query<T> implements MethodInvoker {

        private final BaseMapper<T> baseMapper;
        private final String[] queryColumns;
        private final String key;

        /**
         * Invoke method.
         *
         * @param target target
         * @param args   args
         * @return result of invoke
         */
        @Override
        public Object invoke(Object target, Object... args) {
            Collection<?> keys = CollectionUtils.adaptObjectToCollection(args[0]);
            return baseMapper.selectList(getQueryWrapper(keys));
        }

        private QueryWrapper<T> getQueryWrapper(Collection<?> keys) {
            QueryWrapper<T> wrapper = Wrappers.<T>query().in(key, keys);
            if (queryColumns.length > 0) {
                wrapper.select(queryColumns);
            }
            return wrapper;
        }
    }
}
