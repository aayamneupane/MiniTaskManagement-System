package com.project.taskmanagement.repository;

import com.project.taskmanagement.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByTitleContainingIgnoreCase(String title);
    long countByStatus(String status);
    long countByPriority(String priority);
}
