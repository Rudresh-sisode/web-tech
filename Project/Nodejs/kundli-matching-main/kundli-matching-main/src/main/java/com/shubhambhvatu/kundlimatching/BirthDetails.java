package com.shubhambhvatu.kundlimatching;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class BirthDetails {
    private String name;
    private LocalDate birthDate;
    private String month;
    private String date;
    private String year;
    private String latitude;
    private String longitude;
    private String birthPlace;
    private String timezone;
    private String birthTime;
}
