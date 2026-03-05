package com.hyper_aigent.hyper_aigent_be.mappers;

public interface Mapper<A, B> {
    B mapTo(A a);

    A mapFrom(B b);
}