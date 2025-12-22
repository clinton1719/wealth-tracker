package com.backend.wealth_tracker.pdf;

import com.backend.wealth_tracker.exception.PdfGenerationException;

public interface PdfReportGenerator<P> {
  String reportName();

  byte[] generate(P params) throws PdfGenerationException;
}
