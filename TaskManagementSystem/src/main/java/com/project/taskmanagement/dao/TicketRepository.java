package com.project.taskmanagement.dao;

import com.project.taskmanagement.modal.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByTitleContainingIgnoreCase(String title);
    long countByStatus(String status);
    long countByPriority(String priority);
}