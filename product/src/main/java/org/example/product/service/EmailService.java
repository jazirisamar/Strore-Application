package org.example.product.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.example.product.Panier;
import org.example.product.LigneCommande;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("no-reply@marklio.com");
        helper.setTo(toEmail);
        helper.setSubject("Bienvenue sur Marklio ! 🚀");

        String htmlContent = EmailTemplates.getWelcomeEmail(name);

        helper.setText(htmlContent, true);

        mailSender.send(message);
        System.out.println("Email de bienvenue envoyé avec succès à : " + toEmail);
    }

    public void sendOrderConfirmation(Panier panier) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("no-reply@marklio.com");
        helper.setTo(panier.getClient().getEmail());
        helper.setSubject("Confirmation de votre commande #" + panier.getId() + " - Marklio 📦");

        StringBuilder itemsHtml = new StringBuilder();
        double total = 0;
        for (LigneCommande lc : panier.getLigneCommandes()) {
            double price = lc.getProduct().getPrice();
            double subtotal = price * lc.getQuantity();
            total += subtotal;
            itemsHtml.append("<tr>")
                    .append("<td>").append(lc.getProduct().getName()).append("</td>")
                    .append("<td style='text-align: center;'>").append(lc.getQuantity()).append("</td>")
                    .append("<td style='text-align: right;'>").append(String.format("%.2f", price)).append(" €</td>")
                    .append("</tr>");
        }

        String htmlContent = EmailTemplates.getOrderConfirmation(
                panier.getClient().getName(),
                panier.getId(),
                itemsHtml.toString(),
                total
        );

        helper.setText(htmlContent, true);

        mailSender.send(message);
        System.out.println("Email de confirmation de commande #" + panier.getId() + " envoyé à " + panier.getClient().getEmail());
    }
}
