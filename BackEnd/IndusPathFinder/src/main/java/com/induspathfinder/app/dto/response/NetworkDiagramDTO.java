package com.induspathfinder.app.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class NetworkDiagramDTO {

    private List<NetworkNodeDTO> nodes;

    private List<NetworkEdgeDTO> edges;

}