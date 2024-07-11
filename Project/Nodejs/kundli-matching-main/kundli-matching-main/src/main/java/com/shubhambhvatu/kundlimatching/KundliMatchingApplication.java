package com.shubhambhvatu.kundlimatching;

import com.shubhambhvatu.kundlimatching.util.CalculationUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.time.LocalDate;
import java.util.Date;

import static com.shubhambhvatu.kundlimatching.util.CalculationUtil.*;

@SpringBootApplication
public class KundliMatchingApplication {

	public static void main(String[] args) throws FileNotFoundException {
		BirthDetails birthDetails1 = getBirthDetails2();
		BirthDetails birthDetails2 = getBirthDetails2();
		initVariables(birthDetails1, birthDetails2);

		printResults(birthDetails1, birthDetails2);

		SpringApplication.run(KundliMatchingApplication.class, args);
	}

	private static BirthDetails getBirthDetails(){
		return new BirthDetails().toBuilder()
				.date("12")
				.month("01")
				.year("1989")
				.latitude("19.99.N")
				.longitude("73.78.E")
				.name("Sonali")
				.birthPlace("Nashik")
				.birthDate(LocalDate.of(1989, 1, 12))
				.timezone("5.30")
				.birthTime("7.30")
				.build();
	}

	private static BirthDetails getBirthDetails2(){
		return new BirthDetails().toBuilder()
				.date("10")
				.month("10")
				.year("1982")
				.latitude("19.14.N")
				.longitude("73.02.E")
				.name("Ketan")
				.birthPlace("Thane")
				.birthDate(LocalDate.of(1982, 10, 10))
				.timezone("5.30")
				.birthTime("01.22")
				.build();
	}


}
