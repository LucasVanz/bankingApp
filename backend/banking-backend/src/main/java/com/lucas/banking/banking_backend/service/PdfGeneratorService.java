package com.lucas.banking.banking_backend.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.Transaction;

@Service
public class PdfGeneratorService {
    public byte[] generateStatementPdf(List<Transaction> listTransactions) throws IOException {
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

            float y = 750;

            contentStream.beginText();
            contentStream.newLineAtOffset(50, y);
            contentStream.showText("List of transactions");
            contentStream.endText();

            y -= 30;

            for (Transaction transaction : listTransactions) {
                if (y < 50) {
                    contentStream.close();
                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                    y = 750;
                }
                contentStream.beginText();
                contentStream.newLineAtOffset(50, y);
                String complementMessageTransaction = "";
                switch (transaction.getType()) {
                    case TRANSFER:
                        complementMessageTransaction = "From: " + transaction.getWallet().getUser().getName() + "\nTo: "
                                + transaction.getReceiverWallet().getUser().getName();
                    case INVESTMENT:
                        complementMessageTransaction = "Financial Asset: " + transaction.getFinancialAsset().getName()
                                + "\nQuantity: "
                                + transaction.getQuantityFinancialAsset();
                    case INVESTMENT_SELL:
                        complementMessageTransaction = "Financial Asset: " + transaction.getFinancialAsset().getName()
                                + "\nQuantity: "
                                + transaction.getQuantityFinancialAsset();
                    case DEPOSIT:
                        break;
                    case WITHDRAW:
                        break;
                }
                contentStream.showText(
                        "Date: " + transaction.getCreatedAt() + "\nAmount: " + transaction.getAmount() + "\nType: "
                                + transaction.getType() + "\n" + complementMessageTransaction + "\n\n");
                contentStream.endText();
                y -= 20;
            }
            contentStream.close();

            document.save(outputStream);
            return outputStream.toByteArray();
        }

    }
}
