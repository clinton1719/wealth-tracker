package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

import static com.backend.wealth_tracker.helper.Constants.*;

@Service
public class PdfRenderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PdfRenderService.class);

    private final PdfRendererBuilder builder = new PdfRendererBuilder();

    public PdfRenderService() {
        builder.useFastMode();
        builder.useFont(() -> getClass().getResourceAsStream(REGULAR_FONT_LOCATION), FONT_FAMILY, 400, BaseRendererBuilder.FontStyle.NORMAL, true);
        builder.useFont(() -> getClass().getResourceAsStream(REGULAR_ITALIC_FONT_LOCATION), FONT_FAMILY, 400, BaseRendererBuilder.FontStyle.ITALIC, true);
        builder.useFont(() -> getClass().getResourceAsStream(BOLD_FONT_LOCATION), FONT_FAMILY, 700, BaseRendererBuilder.FontStyle.NORMAL, true);
        builder.useFont(() -> getClass().getResourceAsStream(BOLD_ITALIC_FONT_LOCATION), FONT_FAMILY, 700, BaseRendererBuilder.FontStyle.ITALIC, true);
    }

    public void render(String html, OutputStream os) throws Exception {
        builder.withHtmlContent(html, null);
        builder.toStream(os);
        builder.run();
    }

    public byte[] renderToBytes(String html) throws Exception {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            render(html, byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch (Exception ex) {
            LOGGER.atError().log("Error while rendering PDF: {}", ex.getMessage(), ex);
            throw new PdfGenerationException("Error while rendering PDF", ex);
        }
    }
}

