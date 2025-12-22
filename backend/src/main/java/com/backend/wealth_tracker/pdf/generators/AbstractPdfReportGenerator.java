package com.backend.wealth_tracker.pdf.generators;

import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.backend.wealth_tracker.pdf.PdfReportGenerator;
import com.backend.wealth_tracker.service.PdfRenderService;
import org.springframework.stereotype.Component;

@Component
public abstract class AbstractPdfReportGenerator<P, M> implements PdfReportGenerator<P> {
  private final PdfRenderService pdfRenderService;

  public AbstractPdfReportGenerator(PdfRenderService pdfRenderService) {
    this.pdfRenderService = pdfRenderService;
  }

  @Override
  public byte[] generate(P params) throws PdfGenerationException {
    M model = loadData(params);
    String html = renderHtml(model);
    return renderPdf(html);
  }

  protected abstract M loadData(P params) throws PdfGenerationException;

  protected abstract String renderHtml(M model) throws PdfGenerationException;

  protected byte[] renderPdf(String html) throws PdfGenerationException {
    return pdfRenderService.renderToBytes(html);
  }
}
