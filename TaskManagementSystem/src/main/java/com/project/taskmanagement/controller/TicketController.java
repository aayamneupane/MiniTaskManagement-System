package com.project.taskmanagement.controller;

import com.project.taskmanagement.modal.Ticket;
import com.project.taskmanagement.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin("*")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket,
                               @RequestHeader("X-User-Id") Long actorId) {
        return ticketService.createTicket(ticket, actorId);
    }

    @GetMapping
    public List<Ticket> getAllTickets(@RequestHeader("X-User-Id") Long actorId) {
        return ticketService.getTicketsForUser(actorId);
    }

    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable Long id,
                               @RequestBody Ticket ticket,
                               @RequestHeader("X-User-Id") Long actorId) {
        return ticketService.updateTicket(id, ticket, actorId);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable Long id,
                                     @RequestBody Map<String, String> body,
                                     @RequestHeader("X-User-Id") Long actorId) {
        return ticketService.updateTicketStatus(id, body.get("status"), actorId);
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id,
                               @RequestHeader("X-User-Id") Long actorId) {
        ticketService.deleteTicketById(id, actorId);
        return "Ticket deleted successfully";
    }

    @GetMapping("/search")
    public List<Ticket> searchTickets(@RequestParam String title,
                                      @RequestHeader("X-User-Id") Long actorId) {
        return ticketService.searchTicketsByTitle(title, actorId);
    }

    @GetMapping("/{id}")
    public Optional<Ticket> getTicketById(@PathVariable Long id,
                                          @RequestHeader("X-User-Id") Long actorId) {
        return ticketService.getTicketById(id, actorId);
    }

    // for my testing purposes
}
