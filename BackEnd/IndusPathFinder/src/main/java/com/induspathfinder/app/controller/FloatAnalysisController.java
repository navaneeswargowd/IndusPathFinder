package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.FloatRequestDTO;
import com.induspathfinder.app.dto.response.FloatAnalysisDTO;
import com.induspathfinder.app.service.FloatAnalysisService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/float")
@RequiredArgsConstructor
public class FloatAnalysisController {

    private final FloatAnalysisService floatAnalysisService;

    /**
     * Run Float Analysis
     */
    @PostMapping("/run")
    public ResponseEntity<List<FloatAnalysisDTO>> runFloatAnalysis(
            @RequestBody FloatRequestDTO request){

        List<FloatAnalysisDTO> response =
                floatAnalysisService.runFloatAnalysis(
                        request.getProjectId());

        return ResponseEntity.ok(response);

    }

}