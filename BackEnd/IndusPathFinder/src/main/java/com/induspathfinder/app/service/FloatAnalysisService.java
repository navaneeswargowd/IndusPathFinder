package com.induspathfinder.app.service;

import java.util.List;

import com.induspathfinder.app.dto.response.FloatAnalysisDTO;

public interface FloatAnalysisService {

    List<FloatAnalysisDTO> runFloatAnalysis(Long projectId);

}