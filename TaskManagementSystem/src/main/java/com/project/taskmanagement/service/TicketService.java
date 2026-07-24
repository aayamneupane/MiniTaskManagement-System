package com.project.taskmanagement.service;

import com.project.taskmanagement.dao.TicketRepository;
import com.project.taskmanagement.dao.UserRepository;
import com.project.taskmanagement.modal.Ticket;
import com.project.taskmanagement.modal.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TicketService {
    private static final Set<String> ALLOWED_STATUSES = Set.of("Open", "In Progress", "Complete");

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public Ticket createTicket(Ticket ticket, Long actorId) {
        User actor = requireUser(actorId);

        if (!isAdmin(actor)) {
            ticket.setAssignedUserId(actor.getId());
        } else if (ticket.getAssignedUserId() != null) {
            requireUser(ticket.getAssignedUserId());
        }

        if (!ALLOWED_STATUSES.contains(ticket.getStatus())) {
            ticket.setStatus("Open");
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        sendAssignmentEmail(savedTicket);
        return savedTicket;
    }

    public List<Ticket> getTicketsForUser(Long actorId) {
        User actor = requireUser(actorId);
        return isAdmin(actor)
                ? ticketRepository.findAll()
                : ticketRepository.findByAssignedUserId(actor.getId());
    }

    public Optional<Ticket> getTicketById(Long ticketId, Long actorId) {
        User actor = requireUser(actorId);
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        if (ticket.isPresent() && !isAdmin(actor) && !actor.getId().equals(ticket.get().getAssignedUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own tickets");
        }
        return ticket;
    }

    public Ticket updateTicket(Long id, Ticket updatedTicket, Long actorId) {
        User actor = requireUser(actorId);
        requireAdmin(actor);
        Ticket existingTicket = requireTicket(id);

        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setPriority(updatedTicket.getPriority());
        existingTicket.setDueDate(updatedTicket.getDueDate());
        if (updatedTicket.getAssignedUserId() != null) {
            requireUser(updatedTicket.getAssignedUserId());
        }
        existingTicket.setAssignedUserId(updatedTicket.getAssignedUserId());
        if (ALLOWED_STATUSES.contains(updatedTicket.getStatus())) {
            existingTicket.setStatus(updatedTicket.getStatus());
        }
        Ticket savedTicket = ticketRepository.save(existingTicket);
        sendUpdateEmail(savedTicket);
        return savedTicket;
    }

    public Ticket updateTicketStatus(Long id, String status, Long actorId) {
        User actor = requireUser(actorId);
        Ticket ticket = requireTicket(id);

        if (!ALLOWED_STATUSES.contains(status) || "Open".equals(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status can only move to In Progress or Complete");
        }
        if (!isAdmin(actor) && !actor.getId().equals(ticket.getAssignedUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update tickets assigned to you");
        }

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public void deleteTicketById(Long ticketId, Long actorId) {
        requireAdmin(requireUser(actorId));
        ticketRepository.deleteById(ticketId);
    }

    public List<Ticket> searchTicketsByTitle(String title, Long actorId) {
        User actor = requireUser(actorId);
        return isAdmin(actor)
                ? ticketRepository.findByTitleContainingIgnoreCase(title)
                : ticketRepository.findByTitleContainingIgnoreCaseAndAssignedUserId(title, actor.getId());
    }

    public long countTotalTickets() { return ticketRepository.count(); }
    public long countTicketsByStatus(String status) { return ticketRepository.countByStatus(status); }
    public long countTicketsByPriority(String priority) { return ticketRepository.countByPriority(priority); }
    private User requireUser(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login is required");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Ticket requireTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
    }

    private boolean isAdmin(User user) {
        return "ADMIN".equalsIgnoreCase(user.getRole());
    }

    private void requireAdmin(User user) {
        if (!isAdmin(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is required");
        }
    }

    private void sendAssignmentEmail(Ticket ticket) {
        if (ticket.getAssignedUserId() == null) return;
        userRepository.findById(ticket.getAssignedUserId()).ifPresent(user -> {
            try {
                emailService.sendTicketAssignedEmail(user.getEmail(), ticket.getTitle(), ticket.getId());
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }
        });
    }

    private void sendUpdateEmail(Ticket ticket) {
        if (ticket.getAssignedUserId() == null) return;
        userRepository.findById(ticket.getAssignedUserId()).ifPresent(user -> {
            try {
                emailService.sendTicketUpdatedEmail(user.getEmail(), ticket.getTitle(), ticket.getId());
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }
        });
    }
}