package cn.crane4j.core.support.aop;

import cn.crane4j.annotation.AutoOperate;
import cn.crane4j.core.support.AnnotationFinder;
import cn.crane4j.core.support.auto.AutoOperateAnnotatedElement;
import cn.crane4j.core.support.auto.AutoOperateAnnotatedElementResolver;
import cn.crane4j.core.support.expression.MethodBasedExpressionEvaluator;
import cn.crane4j.core.util.CollectionUtils;
import cn.crane4j.core.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.nullness.qual.NonNull;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * <p>一个用于在方法调用后，根据{@link AutoOperate}注解的配置，对方法返回结果进行填充的辅助类。
 *
 * <p>在方法调用后，其将会把方法返回结果解析为{@link AutoOperateAnnotatedElement 一个需要进行填充的元素}，
 * 方法返回结果对应的{@link AutoOperateAnnotatedElement}将会被缓存，避免重复解析。<br/>
 * 当方法被调用后，辅助类将根据配置对方法返回结果进行填充。
 *
 * <p>辅助类支持通过{@link AutoOperate#condition()}设置的条件表达式，
 * 每次执行时都会通过{@link MethodBasedExpressionEvaluator}来进行求值，
 * 只有当表达式返回true或者 "true" 字符串时，才会执行填充。
 * <hr/>
 *
 * <p>Support class for completing the operation for the result of method which annotated by {@link AutoOperate}.
 *
 * <p>Before the method is called, the method return type will be resolved
 * to {@link AutoOperateAnnotatedElement} by {@link AutoOperateAnnotatedElement} and cached.<br />
 * After the method is called, the {@link AutoOperateAnnotatedElement}
 * will be used to complete the operation of data from the method result.
 *
 * <p>Support expression for {@link AutoOperate#condition()}, if the expression is not empty,
 * the expression will be evaluated by {@link MethodBasedExpressionEvaluator},
 * only when the expression returns true or "true", the operation will be applied.
 *
 * @author huangchengxing
 * @see AutoOperateAnnotatedElementResolver
 */
@Slf4j
@RequiredArgsConstructor
public class MethodResultAutoOperateSupport {

    protected final Map<Method, AutoOperateAnnotatedElement> methodCaches = CollectionUtils.newWeakConcurrentMap();
    protected final AutoOperateAnnotatedElementResolver elementResolver;
    protected final MethodBasedExpressionEvaluator expressionEvaluator;
    protected final AnnotationFinder annotationFinder;

    /**
     * After the method is called, process the returning result
     * of the method according to the configuration of {@link AutoOperate} annotation.
     *
     * @param method method
     * @param result result
     * @param args args
     */
    public void afterMethodInvoke(Method method, Object result, Object[] args) {
        // has annotation?
        if (Objects.isNull(result)) {
            return;
        }
        // get and build method cache
        log.debug("process result for [{}]", method);
        // fix https://gitee.com/opengoofy/crane4j/issues/I82EAC
        AutoOperateAnnotatedElement element = CollectionUtils.computeIfAbsent(
            methodCaches, method, this::resolveReturn
        );
        // fix https://github.com/opengoofy/crane4j/issues/204
        if (element == AutoOperateAnnotatedElement.EMPTY) {
            return;
        }
        // whether to apply the operation?
        String condition = element.getAnnotation().condition();
        if (support(method, result, args, condition)) {
            element.execute(result);
        }
    }

    /**
     * Resolve the {@link AutoOperate} annotation on the method
     *
     * @param method method
     * @return operation configuration of method result,
     * if not found, return {@link AutoOperateAnnotatedElement#EMPTY}
     * @see AutoOperateAnnotatedElement#EMPTY
     */
    @NonNull
    protected AutoOperateAnnotatedElement resolveReturn(Method method) {
        if (Objects.equals(Void.TYPE, method.getReturnType())) {
            log.warn("cannot apply auto operate for method [{}], because return type is void", method);
            return AutoOperateAnnotatedElement.EMPTY;
        }
        return Optional.ofNullable(annotationFinder.findAnnotation(method, AutoOperate.class))
            .map(annotation -> elementResolver.resolve(method, annotation))
            .orElse(AutoOperateAnnotatedElement.EMPTY);
    }

    /**
     * Clear resources when destroying the bean.
     */
    public void destroy() {
        methodCaches.clear();
    }

    private boolean support(Method method, Object result, Object[] args, String condition) {
        return StringUtils.isEmpty(condition) || Boolean.TRUE.equals(expressionEvaluator.execute(condition, Boolean.class, method, args, result));
    }
}
