package cn.crane4j.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <p>Used to centrally configure a group of operations of assemble and disassemble on a class.<br />
 * It is generally used when it is inconvenient to
 * add {@link Assemble} and {@link Disassemble} directly on the attribute,
 * such as declaring operations based on the parent attribute in the subclass.
 *
 * @see Assemble
 * @see Disassemble
 * @author huangchengxing
 */
@Documented
@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Operations {

    /**
     * Operations of assemble.
     *
     * @return 装配操作
     */
    Assemble[] assembles() default {};

    /**
     * Operations of disassemble.
     *
     * @return 拆卸操作
     */
    Disassemble[] disassembles() default {};
}