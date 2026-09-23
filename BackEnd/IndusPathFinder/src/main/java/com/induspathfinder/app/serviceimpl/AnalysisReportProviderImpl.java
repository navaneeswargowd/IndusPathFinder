package com.induspathfinder.app.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.induspathfinder.app.dto.response.CPMResultDTO;
import com.induspathfinder.app.dto.response.CpmReportData;
import com.induspathfinder.app.dto.response.CpmReportRow;
import com.induspathfinder.app.dto.response.FloatAnalysisDTO;
import com.induspathfinder.app.dto.response.FloatReportData;
import com.induspathfinder.app.dto.response.FloatReportRow;
import com.induspathfinder.app.entity.Project;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.ProjectRepository;
import com.induspathfinder.app.service.AnalysisReportProvider;
import com.induspathfinder.app.service.CPMService;
import com.induspathfinder.app.service.FloatAnalysisService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalysisReportProviderImpl
        implements AnalysisReportProvider {

    private final CPMService cpmService;

    private final FloatAnalysisService floatAnalysisService;

    private final ProjectRepository projectRepository;

    // =====================================================
    // CPM REPORT DATA
    // =====================================================

    @Override
    public CpmReportData getCpmReportData(
            Long projectId) {

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found with ID: "
                                                + projectId));

        List<CPMResultDTO> cpmResults =
                cpmService.calculateCPM(
                        projectId);

        if (cpmResults == null
                || cpmResults.isEmpty()) {

            throw new ResourceNotFoundException(
                    "CPM analysis data not found for Project ID: "
                            + projectId);
        }

        List<CpmReportRow> rows =
                cpmResults.stream()
                        .map(this::mapCpmRow)
                        .toList();

        Integer projectDuration =
                cpmResults.stream()
                        .map(CPMResultDTO::getEarlyFinish)
                        .filter(value -> value != null)
                        .max(Integer::compareTo)
                        .orElse(0);

        List<String> criticalPath =
                cpmResults.stream()
                        .filter(result ->
                                Boolean.TRUE.equals(
                                        result.getCritical()))
                        .map(CPMResultDTO::getActivityCode)
                        .toList();

        return CpmReportData.builder()
                .projectId(
                        project.getProjectId())
                .projectCode(
                        project.getProjectCode())
                .projectName(
                        project.getProjectName())
                .projectDuration(
                        projectDuration)
                .criticalPath(
                        criticalPath)
                .activities(
                        rows)
                .build();
    }

    private CpmReportRow mapCpmRow(
            CPMResultDTO result) {

        return CpmReportRow.builder()
                .activityId(
                        result.getActivityId())
                .activityCode(
                        result.getActivityCode())
                .activityName(
                        result.getActivityName())
                .duration(
                        result.getDuration())

                // Forward Pass
                .earliestStart(
                        result.getEarlyStart())
                .earliestFinish(
                        result.getEarlyFinish())

                // Backward Pass
                .latestStart(
                        result.getLateStart())
                .latestFinish(
                        result.getLateFinish())

                .critical(
                        result.getCritical())
                .build();
    }

    // =====================================================
    // FLOAT REPORT DATA
    // =====================================================

    @Override
    public FloatReportData getFloatReportData(
            Long projectId) {

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found with ID: "
                                                + projectId));

        List<FloatAnalysisDTO> floatResults =
                floatAnalysisService
                        .runFloatAnalysis(
                                projectId);

        if (floatResults == null
                || floatResults.isEmpty()) {

            throw new ResourceNotFoundException(
                    "Float analysis data not found for Project ID: "
                            + projectId);
        }

        List<FloatReportRow> rows =
                floatResults.stream()
                        .map(this::mapFloatRow)
                        .toList();

        return FloatReportData.builder()
                .projectId(
                        project.getProjectId())
                .projectCode(
                        project.getProjectCode())
                .projectName(
                        project.getProjectName())
                .activities(
                        rows)
                .build();
    }

    private FloatReportRow mapFloatRow(
            FloatAnalysisDTO result) {

        return FloatReportRow.builder()
                .activityId(
                        result.getActivityId())
                .activityCode(
                        result.getActivityCode())
                .activityName(
                        result.getActivityName())
                .totalFloat(
                        result.getTotalFloat())
                .freeFloat(
                        result.getFreeFloat())
                .independentFloat(
                        result.getIndependentFloat())
                .critical(
                        result.getCritical())
                .build();
    }
}