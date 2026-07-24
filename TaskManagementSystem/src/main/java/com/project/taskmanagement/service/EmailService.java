package com.project.taskmanagement.service;

import com.project.taskmanagement.modal.User;
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

        String ticketLink = frontendBaseUrl + "/tickets/" + ticketId;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Assigned Ticket");
        message.setText("You have been assigned a ticket. \n\n"
                + "Ticket title: " + ticketTitle + "\n\n"
                + "View it here: " + ticketLink + "\n\n"
                + "Thankyou");

        mailSender.send(message);
    }
}
