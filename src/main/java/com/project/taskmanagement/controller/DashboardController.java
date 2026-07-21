package com.project.taskmanagement.controller;

import com.project.taskmanagement.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final TicketService ticketService;

    public DashboardController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public Map<String, Long> getDashboardCounts() {

        Map<String, Long> dashboardData = new HashMap<>();

        dashboardData.put("totalTickets", ticketService.countTotalTickets());

        dashboardData.put("openTickets", ticketService.countTicketsByStatus("Open"));
        dashboardData.put("inProgressTickets", ticketService.countTicketsByStatus("In Progress"));
        dashboardData.put("closedTickets", ticketService.countTicketsByStatus("Closed"));

        dashboardData.put("lowPriorityTickets", ticketService.countTicketsByPriority("Low"));
        dashboardData.put("mediumPriorityTickets", ticketService.countTicketsByPriority("Medium"));
        dashboardData.put("highPriorityTickets", ticketService.countTicketsByPriority("High"));

        return dashboardData;
    }
}