package com.induspathfinder.app.model;

import java.util.ArrayList;
import java.util.List;

import com.induspathfinder.app.entity.Activity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityNode {

    private Activity activity;

    private int earlyStart;
    private int earlyFinish;
    private int lateStart;
    private int lateFinish;

    private int totalFloat;
    private int freeFloat;
    private int independentFloat;

    private boolean critical;
    

    // Required by GraphBuilder
    private int incoming = 0;

    private List<Edge> incomingEdges = new ArrayList<>();

    private List<Edge> outgoingEdges = new ArrayList<>();

    public ActivityNode(Activity activity){
        this.activity = activity;
    }

//    public int getDuration(){
//        return activity.getDuration()==null ? 0 : activity.getDuration();
//    }
    

    // Returns activity duration
    public int getDuration() {
        return activity.getDuration() == null ? 0 : activity.getDuration();
    }

    // Returns Activity ID
    public Long getActivityId() {
        return activity.getActId();
    }

    // Returns Activity Code
    public String getActivityCode() {
        return activity.getActCode();
    }

    // Returns Activity Name
    public String getActivityName() {
        return activity.getActName();
    }
}