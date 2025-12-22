package com.backend.wealth_tracker.dto.request_dto;

import java.util.Map;

public record ExpenseReportRequest(
    String startDate, String endDate, Map<String, byte[]> chartImagesMap) {}
