package com.project.taskmanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTicketAssignedEmail(String toEmail, String ticketTitle, Long ticketId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Assigned Ticket");
        message.setText("You have been assigned a ticket.\n\n"
                + "Ticket title: " + ticketTitle + "\n\n"
                + "View it here: " + buildTicketLink(ticketId) + "\n\n"
                + "Thankyou");

        mailSender.send(message);
    }

    public void sendTicketUpdatedEmail(String toEmail, String ticketTitle, Long ticketId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Ticket Updated");
        message.setText("A ticket assigned to you has been updated.\n\n"
                + "Ticket title: " + ticketTitle + "\n\n"
                + "View it here: " + buildTicketLink(ticketId) + "\n\n"
                + "Thankyou");

        mailSender.send(message);
    }

    private String buildTicketLink(Long ticketId) {
        return frontendBaseUrl + "/tickets/" + ticketId;
    }
}