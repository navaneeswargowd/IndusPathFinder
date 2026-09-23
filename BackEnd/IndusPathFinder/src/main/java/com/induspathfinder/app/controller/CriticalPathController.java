package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.response.CriticalPathDTO;
import com.induspathfinder.app.service.CriticalPathService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/critical-path")
@RequiredArgsConstructor
public class CriticalPathController {

    private final CriticalPathService criticalPathService;

    @GetMapping("/{projectId}")
    public List<CriticalPathDTO> getCriticalPath(
            @PathVariable Long projectId){

        return criticalPathService.getCriticalPath(projectId);

    }

}