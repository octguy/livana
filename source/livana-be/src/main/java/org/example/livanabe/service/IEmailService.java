package org.example.livanabe.service;

import jakarta.mail.MessagingException;

public interface IEmailService {

    void sendEmail(String to, String subject, String body) throws MessagingException;
}
