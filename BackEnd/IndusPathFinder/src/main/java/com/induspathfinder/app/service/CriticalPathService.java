package com.induspathfinder.app.service;

import java.util.List;

import com.induspathfinder.app.dto.response.CriticalPathDTO;

public interface CriticalPathService {

    List<CriticalPathDTO> getCriticalPath(Long projectId);

}