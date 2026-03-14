package com.lucas.banking.banking_backend.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
            float leading = 16;
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

                List<String> lines = new ArrayList<>();
                lines.add("Date: " + transaction.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                lines.add("Amount: " + transaction.getAmount());
                lines.add("Type: " + transaction.getType());
                switch (transaction.getType()) {
                    case TRANSFER:
                        lines.add("From: " + transaction.getWallet().getUser().getName());
                        lines.add("To: " + transaction.getReceiverWallet().getUser().getName());
                        break;
                    case INVESTMENT:
                        lines.add("Financial Asset: " + transaction.getFinancialAsset().getName());
                        lines.add("Quantity: " + transaction.getQuantityFinancialAsset());
                        break;
                    case INVESTMENT_SELL:
                        lines.add("Financial Asset: " + transaction.getFinancialAsset().getName());
                        lines.add("Quantity: " + transaction.getQuantityFinancialAsset());
                        break;
                    case DEPOSIT:
                        break;
                    case WITHDRAW:
                        break;
                }
                lines.add("");
                float requiredHeight = lines.size() * leading;
                contentStream.beginText();
                contentStream.newLineAtOffset(50, y);
                for (int i = 0; i < lines.size(); i++) {
                    contentStream.showText(lines.get(i));
                    if (i < lines.size() - 1) {
                        contentStream.newLineAtOffset(0, -leading);
                    }
                }

                contentStream.endText();
                y -= requiredHeight;
            }
            contentStream.close();

            document.save(outputStream);
            return outputStream.toByteArray();
        }

    }
}
