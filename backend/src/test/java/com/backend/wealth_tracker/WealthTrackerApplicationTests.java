package com.backend.wealth_tracker;

import com.backend.wealth_tracker.pdf.PdfRenderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class WealthTrackerApplicationTests {

    @Autowired
    private PdfRenderService pdfRenderService;

  @Test
  @DisplayName("Check application start up")
  void contextLoads() {
      assertNotNull(pdfRenderService);
  }
}
