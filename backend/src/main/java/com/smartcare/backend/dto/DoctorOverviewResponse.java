package com.smartcare.backend.dto;

/**
 * Aggregated view of a single doctor's current queue state,
 * returned by GET /api/admin/overview.
 */
public class DoctorOverviewResponse {

    private Long doctorId;
    private String doctorName;
    private String speciality;
    private Integer avgConsultationTime;

    /** Number of PENDING appointments today. */
    private int waiting;

    /** Name of the current IN_PROGRESS patient, or null if none. */
    private String currentPatientName;

    /** Queue number of the current IN_PROGRESS patient, or null if none. */
    private Integer currentQueueNumber;

    /**
     * Seconds elapsed since the current patient's consultation started.
     * Null if there is no IN_PROGRESS appointment.
     */
    private Long elapsedSeconds;

    public DoctorOverviewResponse(Long doctorId, String doctorName, String speciality,
                                   Integer avgConsultationTime, int waiting,
                                   String currentPatientName, Integer currentQueueNumber,
                                   Long elapsedSeconds) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.speciality = speciality;
        this.avgConsultationTime = avgConsultationTime;
        this.waiting = waiting;
        this.currentPatientName = currentPatientName;
        this.currentQueueNumber = currentQueueNumber;
        this.elapsedSeconds = elapsedSeconds;
    }

    public Long getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }
    public String getSpeciality() { return speciality; }
    public Integer getAvgConsultationTime() { return avgConsultationTime; }
    public int getWaiting() { return waiting; }
    public String getCurrentPatientName() { return currentPatientName; }
    public Integer getCurrentQueueNumber() { return currentQueueNumber; }
    public Long getElapsedSeconds() { return elapsedSeconds; }
}
