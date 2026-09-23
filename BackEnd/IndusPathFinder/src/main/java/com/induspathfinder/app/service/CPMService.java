package com.induspathfinder.app.service;
import com.induspathfinder.app.service.CPMService;

import java.util.List;

import com.induspathfinder.app.dto.response.CPMResultDTO;

public interface CPMService {

    List<CPMResultDTO> calculateCPM(Long projectId);

}