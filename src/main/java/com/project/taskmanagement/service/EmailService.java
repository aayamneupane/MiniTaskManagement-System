package com.project.taskmanagement.service;

import com.project.taskmanagement.modal.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTicketAssignedEmail(String toEmail, String ticketTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Assigned Ticket");
        message.setText("You have been assigned a ticket. \n\nTicket title: " + ticketTitle + "\n\nThankyou");

        mailSender.send(message);
    }
}
