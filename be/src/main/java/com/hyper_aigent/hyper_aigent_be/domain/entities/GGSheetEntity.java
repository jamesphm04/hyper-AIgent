package com.hyper_aigent.hyper_aigent_be.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "gg_sheets")
@EntityListeners(AuditingEntityListener.class)
public class GGSheetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gg_sheet_id_seq")
    @SequenceGenerator(
            name = "gg_sheet_id_seq",
            sequenceName = "gg_sheet_id_seq",
            allocationSize = 50  // Match this with the INCREMENT BY value in the sequence
    )
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "url")
    private String url;

    @Column(columnDefinition = "TEXT")
    private String columnDescriptions;

    @Lob
    @Column(name = "content")
    private byte[] content;

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
