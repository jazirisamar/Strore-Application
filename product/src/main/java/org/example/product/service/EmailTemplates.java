package org.example.product.service;

public class EmailTemplates {

    public static String getWelcomeEmail(String name) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Bienvenue chez Marklio</title>" +
                "    <style>" +
                "        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0e; color: #ffffff; }" +
                "        .email-wrapper { background-color: #0c0c0e; padding: 40px 20px; }" +
                "        .email-container { max-width: 600px; margin: 0 auto; background: #16161a; border-radius: 24px; overflow: hidden; border: 1px solid #2d2d35; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }" +
                "        .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 60px 40px; text-align: center; position: relative; }" +
                "        .logo { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #ffffff; text-decoration: none; text-transform: uppercase; }" +
                "        .content { padding: 40px; text-align: left; }" +
                "        .greeting { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff; }" +
                "        .text { font-size: 16px; line-height: 1.7; color: #9ca3af; margin-bottom: 32px; }" +
                "        .cta-container { text-align: center; margin-bottom: 32px; }" +
                "        .button { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff !important; padding: 18px 36px; text-decoration: none; border-radius: 14px; font-weight: 600; font-size: 16px; display: inline-block; transition: transform 0.2s ease; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }" +
                "        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }" +
                "        .feature-item { background: #1f1f23; padding: 20px; border-radius: 16px; border: 1px solid #2d2d35; }" +
                "        .feature-icon { font-size: 24px; margin-bottom: 12px; }" +
                "        .feature-title { font-weight: 600; color: #ffffff; margin-bottom: 4px; }" +
                "        .feature-desc { font-size: 13px; color: #6b7280; }" +
                "        .footer { padding: 32px 40px; text-align: center; border-top: 1px solid #2d2d35; background: #16161a; }" +
                "        .footer-text { font-size: 13px; color: #4b5563; line-height: 1.5; }" +
                "        .social-links { margin-bottom: 20px; }" +
                "        .social-icon { margin: 0 10px; opacity: 0.5; }" +
                "        @media screen and (max-width: 480px) {" +
                "            .features { grid-template-columns: 1fr; }" +
                "            .header { padding: 40px 20px; }" +
                "            .content { padding: 30px 20px; }" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='email-wrapper'>" +
                "        <div class='email-container'>" +
                "            <div class='header'>" +
                "                <div class='logo'>MARKLIO</div>" +
                "                <div style='margin-top: 10px; color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;'>Propulsez vos projets vers l'infini</div>" +
                "            </div>" +
                "            <div class='content'>" +
                "                <h1 class='greeting'>Bienvenue, " + name + " ! 🚀</h1>" +
                "                <p class='text'>" +
                "                    Nous sommes ravis de vous accueillir dans l'univers Marklio. Votre compte a été configuré avec succès et vous êtes maintenant prêt à explorer notre sélection exclusive." +
                "                </p>" +
                "                <div class='cta-container'>" +
                "                    <a href='http://localhost:3000' class='button'>Explorer le Dashboard</a>" +
                "                </div>" +
                "                <div style='display: block; width: 100%; height: 1px; background: #2d2d35; margin: 32px 0;'></div>" +
                "                <div style='display: flex; flex-wrap: wrap; justify-content: space-between;'>" +
                "                    <div style='flex: 1; min-width: 200px; margin-bottom: 20px;'>" +
                "                        <div style='font-size: 20px; margin-bottom: 8px;'>🔒</div>" +
                "                        <div style='font-weight: 600; color: #ffffff;'>Sécurité Maximale</div>" +
                "                        <div style='font-size: 13px; color: #6b7280;'>Vos données sont protégées par nos protocoles de pointe.</div>" +
                "                    </div>" +
                "                    <div style='flex: 1; min-width: 200px; margin-bottom: 20px;'>" +
                "                        <div style='font-size: 20px; margin-bottom: 8px;'>⚡</div>" +
                "                        <div style='font-weight: 600; color: #ffffff;'>Expérience Fluide</div>" +
                "                        <div style='font-size: 13px; color: #6b7280;'>Naviguez avec une rapidite inégalée sur notre plateforme.</div>" +
                "                    </div>" +
                "                </div>" +
                "            </div>" +
                "            <div class='footer'>" +
                "                <p class='footer-text'>" +
                "                    Vous recevez cet email car vous avez créé un compte sur Marklio.<br>" +
                "                    &copy; 2026 Marklio Inc. | Innovation & Design" +
                "                </p>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    public static String getOrderConfirmation(String name, Long orderId, String itemsHtml, double totalPrice) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <meta charset='UTF-8'>" +
                "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "    <title>Confirmation de Commande - Marklio</title>" +
                "    <style>" +
                "        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #0c0c0e; color: #ffffff; }" +
                "        .email-wrapper { background-color: #0c0c0e; padding: 40px 20px; }" +
                "        .email-container { max-width: 650px; margin: 0 auto; background: #16161a; border-radius: 24px; overflow: hidden; border: 1px solid #2d2d35; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }" +
                "        .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 50px 40px; text-align: center; }" +
                "        .logo { font-size: 28px; font-weight: 800; letter-spacing: -1px; color: #ffffff; text-transform: uppercase; margin-bottom: 8px; }" +
                "        .content { padding: 40px; }" +
                "        .greeting { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }" +
                "        .text { font-size: 15px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px; }" +
                "        .order-card { background: #1f1f23; border-radius: 16px; border: 1px solid #2d2d35; padding: 25px; margin-bottom: 30px; }" +
                "        .order-header { border-bottom: 1px solid #2d2d35; padding-bottom: 15px; margin-bottom: 15px; }" +
                "        .order-id { font-size: 14px; font-weight: 600; color: #6366f1; }" +
                "        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }" +
                "        .table th { text-align: left; font-size: 12px; text-transform: uppercase; color: #4b5563; padding: 10px 0; border-bottom: 1px solid #2d2d35; }" +
                "        .table td { padding: 15px 0; border-bottom: 1px solid #2d2d35; color: #e5e7eb; font-size: 14px; }" +
                "        .total-row td { border-bottom: none; padding-top: 20px; font-weight: 700; font-size: 18px; color: #ffffff; }" +
                "        .footer { padding: 30px 40px; text-align: center; background: #111114; color: #4b5563; font-size: 12px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='email-wrapper'>" +
                "        <div class='email-container'>" +
                "            <div class='header'>" +
                "                <div class='logo'>MARKLIO</div>" +
                "                <div style='color: rgba(255,255,255,0.9); font-size: 14px;'>Confirmation de votre commande</div>" +
                "            </div>" +
                "            <div class='content'>" +
                "                <h1 class='greeting'>Merci pour votre commande, " + name + " !</h1>" +
                "                <p class='text'>Votre commande a été reçue et est en cours de traitement. Voici le récapitulatif de vos achats.</p>" +
                "                " +
                "                <div class='order-card'>" +
                "                    <div class='order-header'>" +
                "                        <div class='order-id'>COMMANDE #" + orderId + "</div>" +
                "                    </div>" +
                "                    <table class='table'>" +
                "                        <thead>" +
                "                            <tr>" +
                "                                <th>Produit</th>" +
                "                                <th style='text-align: center;'>Qté</th>" +
                "                                <th style='text-align: right;'>Prix</th>" +
                "                            </tr>" +
                "                        </thead>" +
                "                        <tbody>" +
                "                            " + itemsHtml +
                "                            <tr class='total-row'>" +
                "                                <td colspan='2'>Total</td>" +
                "                                <td style='text-align: right;'>" + String.format("%.2f", totalPrice) + " €</td>" +
                "                            </tr>" +
                "                        </tbody>" +
                "                    </table>" +
                "                </div>" +
                "                " +
                "                <div style='text-align: center; margin-top: 40px;'>" +
                "                    <a href='http://localhost:3000/orders' style='background: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;'>Suivre ma commande</a>" +
                "                </div>" +
                "            </div>" +
                "            <div class='footer'>" +
                "                &copy; 2026 Marklio Inc. | Besoin d'aide ? Contactez notre support." +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
