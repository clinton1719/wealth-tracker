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
        try {
            return renderPdf(html);
        } catch (Exception ex) {
            throw new PdfGenerationException("PDF generation failed!", ex);
        }
    }

    protected abstract M loadData(P params);

    protected abstract String renderHtml(M model) throws PdfGenerationException;

    protected byte[] renderPdf(String html) throws Exception {
        return pdfRenderService.renderToBytes(html);
    }
}
