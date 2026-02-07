package com.backend.wealth_tracker.pdf;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfReportRegistry {
  private final Map<String, PdfReportGenerator<P>> generators = new HashMap<>();

  public PdfReportRegistry(List<PdfReportGenerator<P>> generators) {
    for (PdfReportGenerator<P> g : generators) {
      this.generators.put(g.reportName(), g);
    }
  }

  public PdfReportGenerator<P> get(String name) {
    return generators.get(name);
  }
}
