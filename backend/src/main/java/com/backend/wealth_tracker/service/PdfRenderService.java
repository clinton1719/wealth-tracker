package com.backend.wealth_tracker.service;

import static com.backend.wealth_tracker.helper.Constants.*;

import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.openhtmltopdf.outputdevice.helper.BaseRendererBuilder;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PdfRenderService {
  private static final Logger LOGGER = LoggerFactory.getLogger(PdfRenderService.class);

  private final PdfRendererBuilder builder = new PdfRendererBuilder();

  public PdfRenderService() {
    builder.useFastMode();
    builder.useFont(
        () -> getClass().getResourceAsStream(REGULAR_FONT_LOCATION),
        FONT_FAMILY,
        400,
        BaseRendererBuilder.FontStyle.NORMAL,
        true);
    builder.useFont(
        () -> getClass().getResourceAsStream(REGULAR_ITALIC_FONT_LOCATION),
        FONT_FAMILY,
        400,
        BaseRendererBuilder.FontStyle.ITALIC,
        true);
    builder.useFont(
        () -> getClass().getResourceAsStream(BOLD_FONT_LOCATION),
        FONT_FAMILY,
        700,
        BaseRendererBuilder.FontStyle.NORMAL,
        true);
    builder.useFont(
        () -> getClass().getResourceAsStream(BOLD_ITALIC_FONT_LOCATION),
        FONT_FAMILY,
        700,
        BaseRendererBuilder.FontStyle.ITALIC,
        true);
  }

  public void render(String html, OutputStream os) throws PdfGenerationException {
    builder.withHtmlContent(html, null);
    builder.toStream(os);
    try {
      builder.run();
    } catch (IOException e) {
      LOGGER.atError().log("Error while XHTML/XML to PDF conversion: {}", e.getMessage(), e);
      throw new PdfGenerationException("Error while XHTML/XML to PDF conversion", e);
    }
  }

  public byte[] renderToBytes(String html) throws PdfGenerationException {
    try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
      render(html, byteArrayOutputStream);
      return byteArrayOutputStream.toByteArray();
    } catch (IOException e) {
      LOGGER.atError().log("Error while rendering PDF: {}", e.getMessage(), e);
      throw new PdfGenerationException("Error while rendering PDF", e);
    }
  }
}
