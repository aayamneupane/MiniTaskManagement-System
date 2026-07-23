package com.project.taskmanagement.dao;

import com.project.taskmanagement.modal.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByTitleContainingIgnoreCase(String title);
    List<Ticket> findByAssignedUserId(Long assignedUserId);
    List<Ticket> findByTitleContainingIgnoreCaseAndAssignedUserId(String title, Long assignedUserId);
    long countByStatus(String status);
    long countByPriority(String priority);
}
