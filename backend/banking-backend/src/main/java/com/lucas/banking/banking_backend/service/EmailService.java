package com.lucas.banking.banking_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.User;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Async
    public void sendEmailTransaction(Transaction transaction) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(mailFrom);
            String defaultMessage = "If you do not recognize this transaction, please contact our support team.\n" + //
                    "\n" +
                    "Best regards,  \n" +
                    "LBank Team";
            User user = transaction.getWallet().getUser();
            email.setTo(user.getEmail());
            switch (transaction.getType()) {
                case TRANSFER -> {
                    // Configurando os dados do email do recebedor
                    SimpleMailMessage emailReceiver = new SimpleMailMessage();
                    emailReceiver.setFrom(mailFrom);
                    emailReceiver.setTo(transaction.getReceiverWallet().getUser().getEmail());
                    emailReceiver.setSubject("Transfer received");
                    emailReceiver.setText("Hello,\n" + //
                            "\n" + //
                            "You have received a transfer.\n" + //
                            "\n" + //
                            "Sender: " + user.getName() + " \n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully credited to your account.\n" + //
                            "\n" + //
                            defaultMessage);
                    // Envia o email recebedor
                    mailSender.send(emailReceiver);
                    // Configurando os dados do email do rementente
                    email.setSubject("Transfer sent");
                    email.setText("Hello,\n" + //
                            "\n" + //
                            "You have made a transfer.\n" + //
                            "\n" + //
                            "Receiver: " + transaction.getReceiverWallet().getUser().getName() + " \n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully debited from your account.\n" + //
                            defaultMessage);
                }
                case DEPOSIT -> {
                    email.setSubject("Deposit realized");
                    email.setText("Hello,\n" + //
                            "\n" + //
                            "You have made a deposit.\n" + //
                            "\n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully credited to your account.\n" + //
                            defaultMessage);
                }
                case WITHDRAW -> {
                    email.setSubject("Withdrawal realized");
                    email.setText("Hello,\n" + //
                            "\n" + //
                            "You have made a withdrawal.\n" + //
                            "\n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully debited from your account.\n" + //
                            defaultMessage);
                }
                case INVESTMENT -> {
                    // Pega os dados do investimento
                    FinancialAsset financialAsset = transaction.getFinancialAsset();
                    email.setSubject("Investment realized");
                    email.setText("Hello,\n" + //
                            "\n" + //
                            "You have made an investment.\n" + //
                            "\n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Asset: " + financialAsset.getTicker() + " (" + financialAsset.getName() + ") \n" + //
                            "Quantity: " + transaction.getQuantityFinancialAsset() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully debited from your account and the asset added to your investment wallet.\n"
                            + //
                            defaultMessage);
                }
                case INVESTMENT_SELL -> {
                    // Pega os dados do investimento
                    FinancialAsset financialAsset = transaction.getFinancialAsset();
                    email.setSubject("Investment sell realized");
                    email.setText("Hello,\n" + //
                            "\n" + //
                            "You have sold an investment.\n" + //
                            "\n" + //
                            "Amount: " + transaction.getAmount() + "  \n" + //
                            "Asset: " + financialAsset.getTicker() + " (" + financialAsset.getName() + ") \n" + //
                            "Quantity: " + transaction.getQuantityFinancialAsset() + "  \n" + //
                            "Date: "
                            + transaction.getCreatedAt()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            + "\n" + //
                            "\n" + //
                            "The amount has been successfully credited to your account and the asset removed from your investment wallet.\n"
                            + //
                            defaultMessage);
                }
            }
            // Envia o email montado
            mailSender.send(email);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
        }
    }

    public void sendEmailStatement(List<Transaction> statement){

    }
}
