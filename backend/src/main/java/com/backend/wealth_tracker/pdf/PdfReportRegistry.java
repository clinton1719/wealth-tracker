package com.backend.wealth_tracker.pdf;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfReportRegistry {
    private final Map<String, PdfReportGenerator<?>> generators = new HashMap<>();

    public PdfReportRegistry(List<PdfReportGenerator<?>> generators) {
        for (PdfReportGenerator<?> g : generators) {
            this.generators.put(g.reportName(), g);
        }
    }

    public PdfReportGenerator<?> get(String name) {
        return generators.get(name);
    }
}
