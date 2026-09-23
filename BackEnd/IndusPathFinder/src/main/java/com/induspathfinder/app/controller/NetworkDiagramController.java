package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.NetworkDiagramRequestDTO;
import com.induspathfinder.app.dto.response.NetworkDiagramDTO;
import com.induspathfinder.app.service.NetworkDiagramService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/network")
@RequiredArgsConstructor
public class NetworkDiagramController {

    private final NetworkDiagramService networkDiagramService;

//    @GetMapping("/{projectId}")
//    public NetworkDiagramDTO generate(@PathVariable Long projectId){
//
//        return networkDiagramService.generate(projectId);
//
//    }
//    @PostMapping("/generate")
//    public ResponseEntity<List<NetworkDiagramDTO>> generateNetworkDiagram(
//            @RequestBody NetworkDiagramRequestDTO request){
//
//        List<NetworkDiagramDTO> response =
//                networkDiagramService.generateNetworkDiagram(
//                        request.getProjectId());
//
//        return ResponseEntity.ok(response);
//    }
    
    @PostMapping("/generate")
    public ResponseEntity<NetworkDiagramDTO> generateNetworkDiagram(
            @RequestBody NetworkDiagramRequestDTO request) {

        NetworkDiagramDTO response =
                networkDiagramService.generate(
                        request.getProjectId());

        return ResponseEntity.ok(response);
    }
}