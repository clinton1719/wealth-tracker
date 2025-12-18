package com.backend.wealth_tracker.pdf;

import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.util.List;

public class ExpensePdfGenerator {

    private static String loadHtmlFromResources(String path) throws Exception {
        try (InputStream is =
                     ExpensePdfGenerator.class
                             .getClassLoader()
                             .getResourceAsStream(path)) {

            if (is == null) {
                throw new IllegalStateException("Resource not found: " + path);
            }

            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    public static void main(String[] args) throws Exception {

        List<Expense> expenses = List.of(
                new Expense("2025-01-03", "Food", "This is lunch money for Clinton", "Clinton", 320.50),
                new Expense("2025-01-07", "Transport", "This is for taxi used in weekends for camp outing and other expenses included", "Melissa", 540.00),
                new Expense("2025-01-12", "Shopping", "Groceries", "Clinton", 1250.75),
                new Expense("2025-01-20", "Utilities", "Electricity Bill", "Clinton", 980.00)
        );

        DecimalFormat df = new DecimalFormat("#,##0.00");

        double total = expenses.stream().mapToDouble(e -> e.amount).sum();

        StringBuilder rows = new StringBuilder();
        int count = 10;
        while (count > 0) {
            for (Expense e : expenses) {
                rows.append("""
                        <tr>
                          <td>%s</td>
                          <td>%s</td>
                          <td>%s</td>
                          <td>%s</td>
                          <td class="amount">%s</td>
                        </tr>
                        """.formatted(
                        e.date,
                        e.category,
                        e.description,
                        e.profile,
                        df.format(e.amount)
                ));
            }
            count--;
        }

        String html = loadHtmlFromResources("pdf/expense-report.html");


        html = html.replace("{{ROWS}}", rows.toString())
                .replace("{{TOTAL}}", df.format(total));

        try (FileOutputStream os = new FileOutputStream("expense-report.pdf")) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.useFont(
                    () -> ExpensePdfGenerator.class.getResourceAsStream("/fonts/NotoSans-Regular.ttf"),
                    "Noto Sans",
                    400,
                    BaseRendererBuilder.FontStyle.NORMAL,
                    true
            );

// Italic
            builder.useFont(
                    () -> ExpensePdfGenerator.class.getResourceAsStream("/fonts/NotoSans-Italic.ttf"),
                    "Noto Sans",
                    400,
                    BaseRendererBuilder.FontStyle.ITALIC,
                    true
            );

// Bold
            builder.useFont(
                    () -> ExpensePdfGenerator.class.getResourceAsStream("/fonts/NotoSans-Bold.ttf"),
                    "Noto Sans",
                    700,
                    BaseRendererBuilder.FontStyle.NORMAL,
                    true
            );

// Bold Italic
            builder.useFont(
                    () -> ExpensePdfGenerator.class.getResourceAsStream("/fonts/NotoSans-BoldItalic.ttf"),
                    "Noto Sans",
                    700,
                    BaseRendererBuilder.FontStyle.ITALIC,
                    true
            );
            builder.toStream(os);
            builder.run();
        }
        System.out.println("Working directory: " + System.getProperty("user.dir"));


        System.out.println("PDF generated: expense-report.pdf");
    }

    static class Expense {
        String date;
        String category;
        String description;
        String profile;
        double amount;

        Expense(String date, String category, String description, String profile, double amount) {
            this.date = date;
            this.category = category;
            this.description = description;
            this.profile = profile;
            this.amount = amount;
        }
    }
}
