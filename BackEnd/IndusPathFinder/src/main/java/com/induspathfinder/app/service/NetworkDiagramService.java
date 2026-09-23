//package com.induspathfinder.app.service;
//
//import com.induspathfinder.app.dto.response.NetworkDiagramDTO;
//
//public interface NetworkDiagramService {
//
//    NetworkDiagramDTO generate(Long projectId);
//
//}

package com.induspathfinder.app.service;

import java.util.List;

import com.induspathfinder.app.dto.response.NetworkDiagramDTO;

public interface NetworkDiagramService {

    List<NetworkDiagramDTO> generateNetworkDiagram(Long projectId);
    NetworkDiagramDTO generate(Long projectId);

}