package com.hyper_aigent.hyper_aigent_be.domain.entities.upload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hyper_aigent.hyper_aigent_be.domain.entities.ChatEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "files")
@EntityListeners(AuditingEntityListener.class)
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "file_id_seq")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Lob
    @Column(name = "content")
    private byte[] content;

    @Column(name = "size")
    private Long size;

    @Column(columnDefinition = "TEXT")
    private String columnDescriptions;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @JoinColumn(name = "chat_id")
    private ChatEntity chat;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}
