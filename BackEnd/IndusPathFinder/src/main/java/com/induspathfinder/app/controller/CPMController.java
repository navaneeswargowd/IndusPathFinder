package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.CPMRequestDTO;
import com.induspathfinder.app.dto.response.CPMResultDTO;
import com.induspathfinder.app.service.CPMService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/cpm")
@RequiredArgsConstructor
public class CPMController {

    private final CPMService cpmService;

//    @GetMapping("/{projectId}")
//    public List<CPMResultDTO> calculate(@PathVariable Long projectId){
//
//        return cpmService.calculateCPM(projectId);
//
//    }
    
    /**
     * Run CPM Analysis
     */
    @PostMapping("/run")
    public ResponseEntity<List<CPMResultDTO>> runCPM(
            @RequestBody CPMRequestDTO request){

        List<CPMResultDTO> response =
                cpmService.calculateCPM(request.getProjectId());

        return ResponseEntity.ok(response);
    }

}