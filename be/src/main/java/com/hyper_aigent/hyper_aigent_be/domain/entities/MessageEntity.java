package com.hyper_aigent.hyper_aigent_be.domain.entities;

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
@Entity
@Builder
@Table(name = "messages")
@EntityListeners(AuditingEntityListener.class)
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "message_id_seq")
    private Long id;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String script;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY) //2to1
    @JoinColumn(name = "message_pair_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private MessagePairEntity messagePair;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}