package com.hyper_aigent.hyper_aigent_be.repositories;

import com.hyper_aigent.hyper_aigent_be.domain.entities.ImageEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ImageRepository extends CrudRepository<ImageEntity, Long> {

    @Query(value = "SELECT * FROM images WHERE qa_pair_id = :qa_pair_id AND role = :role LIMIT 1", nativeQuery = true)
    Optional<ImageEntity> findByQAPairId(@Param("qa_pair_id") long qaPairId, @Param("role") String role);
}
