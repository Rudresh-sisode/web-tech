package com.shubhambhvatu.kundlimatching;


import org.apache.commons.io.FileUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.Assert;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.time.LocalDate;

import static com.shubhambhvatu.kundlimatching.util.CalculationUtil.initVariables;
import static com.shubhambhvatu.kundlimatching.util.CalculationUtil.printResults;

@SpringBootTest
class KundliMatchingApplicationTests {

	@Test
	void contextLoads() throws IOException {

		File actualOutputFile = new File("./src/test/resources/test_files/Ketan.txt");

		BirthDetails birthDetails1 = getBirthDetails2();
		BirthDetails birthDetails2 = getBirthDetails2();
		initVariables(birthDetails1, birthDetails2);
		PrintStream o = new PrintStream(actualOutputFile);
		PrintStream console = System.out;
		System.setOut(o);
		printResults(birthDetails1, birthDetails2);
		File expectedOutputFile = new File("./src/test/resources/test_files/KetanExpected.txt");
		boolean compare1and2 = FileUtils.contentEquals(expectedOutputFile, actualOutputFile);
		System.setOut(console);
		Assert.isTrue(compare1and2,"File must be equals");
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
