package cn.crane4j.annotation.condition;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A condition what apply the operation only when the specified property exists and its value not empties.
 *
 * @author huangchengxing
 * @see cn.crane4j.core.condition.ConditionOnPropertyNotEmptyParser
 * @since 2.6.0
 */
@Repeatable(value = ConditionOnPropertyNotEmpty.List.class)
@Documented
@Target({ElementType.ANNOTATION_TYPE, ElementType.FIELD, ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ConditionOnPropertyNotEmpty {

    /**
     * <p>The id of operations which to bound.<br/>
     * If id is empty, the condition applies to all operations
     * what declared on the same element as annotated by current annotation.
     *
     * @return operation id.
     */
    String[] id() default {};

    /**
     * The type of multi conditions.
     *
     * @return condition type
     */
    ConditionType type() default ConditionType.AND;

    /**
     * Whether the current condition to be negated.
     *
     * @return boolean
     */
    boolean negate() default false;

    /**
     * Get the order of the condition.
     *
     * @return sort
     */
    int sort() default Integer.MAX_VALUE;

    /**
     * The property name.
     *
     * @return property name
     */
    String property() default "";

    @Documented
    @Target({ElementType.ANNOTATION_TYPE, ElementType.FIELD, ElementType.TYPE, ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
        ConditionOnPropertyNotEmpty[] value();
    }
}
