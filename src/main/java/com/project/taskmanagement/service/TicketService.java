package com.project.taskmanagement.service;

import com.project.taskmanagement.modal.Ticket;
import com.project.taskmanagement.dao.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }


    public Optional<Ticket> getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId);
    }

    public Ticket updateTicket(Long id, Ticket updatedTicket) {
        Ticket existingTicket = ticketRepository.findById(id).orElse(null);
        if (existingTicket == null) {
            return null;
        }

        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setStatus(updatedTicket.getStatus());
        existingTicket.setDueDate(updatedTicket.getDueDate());
        existingTicket.setAssignedUserId(updatedTicket.getAssignedUserId());

        return ticketRepository.save(existingTicket);
    }

    public void deleteTicketById(Long ticketId) {
        ticketRepository.deleteById(ticketId);
    }

    public List<Ticket> searchTicketsByTitle(String title) {
        return ticketRepository.findByTitleContainingIgnoreCase(title);
    }

    public long countTotalTickets() {
        return ticketRepository.count();
    }

    public long countTicketsByStatus(String status) {
        return ticketRepository.countByStatus(status);
    }

    public long countTicketsByPriority(String priority) {
        return ticketRepository.countByPriority(priority);
    }

}
