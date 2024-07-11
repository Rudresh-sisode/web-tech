package com.shubhambhvatu.kundlimatching.util;

import com.shubhambhvatu.kundlimatching.BirthDetails;
import lombok.extern.slf4j.Slf4j;

import static java.lang.Math.*;
import static java.lang.String.format;

@Slf4j
public class CalculationUtil {
    public static double[] plnt = new double[26];
    public static double[] jupc = new double[4];
    public static double[] satc = new double[4];
    public static double[] tt = new double[4];
    public static double[] f2 = new double[12];
    public static double[] f3 = new double[12];
    public static double[] abc = new double[12];
    public static double tzg;
    public static double ps;
    public static double pt;
    public static double z2;
    public static double z3;
    public static double b6;
    public static double s1;
    public static double lat;
    public static double longt;
    public static double aya;
    public static double obliq;
    public static double sidtime;
    public static double h6;
    public static int ret = 0;
    public static int page = 1;
    public static int line;
    public static int[] r3 = new int[13];
    public static int[] s3 = new int[13];
    public static int[][] varga = new int[13][7];

    public static double timediffg; //new line
    public static double timediffgh;
    public static double ftimediffgh;
    public static double itimediffgh;
    public static double timediffgmt;
    public static double ftimediffgmt;
    public static double itimediffgmt;
    public static double timediffgs;
    public static double ftimediffgs;
    public static double itimediffgs;
    public static double timediffb;
    public static double tdg; //new line
    public static double tdgh;
    public static double ftdgh;
    public static double itdgh;
    public static double tdgmt;
    public static double ftdgmt;
    public static double itdgmt;
    public static double tdgs;
    public static double ftdgs;
    public static double itdgs;
    public static double tdb;
    public static double longtzg;
    public static int j;
    public static int h;
    public static int mt;
    public static int latdeg, latmt, longdeg, longmt;
    public static String ns, ew;
    public static int longdegtzg, longdegtzb, longmttzg, longmttzb;

    public static int yvs;
    public static int mvs;
    public static int dvs;
    public static int yss;

    public static int p, q, r;

    public static String[] day = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

    public static String[] ras = {"Mesh", "Vrishabh", "Mithun", "Karka", "Sinha", "Kanya", "Tula", "Vruchik", "Dhanu", "Makar", "Kumbha", "Meen"};
    public static String[] rassw = {"Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"};

    public static String[] tit = {"Pratipada", "Dwitiya", "Trutiya", "Chaturthi", "Panchami", "Shasti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Pratipada", "Dwitiya", "Trutiya", "Chaturthi", "Panchami", "Shasti", "Saptami", "Ashtami", "Nnavami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavsya"};

    public static String[] nak = {"Ashwini", "Bharani", "Kritika", "Rohini", "Mrug", "Adra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva", "Uttara", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jeshtha", "Mula", "Purvashada", "Uttarashala", "Shravan", "Dhanishtha", "Shattarka", "Purvabhadra", "Uttarabhadra", "Revati"};
    public static String[] naksw = {"Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"};

    public static String[] yog = {"Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda", "Sukarma", "Dhriti", "Sula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipada", "Variyan", "Parigha", "Siva", "Siddha", "Sadhya", "Subha", "Sukla", "Brahma", "Indra", "Vaidhriti"};

    public static String[] x1 = {"KETU    ", "VENUS   ", "SUN     ", "MOON    ", "MARS    ", "RAHU    ", "JUPITER ", "SATURN  ", "MERCURY "};

    public static double[] y10 = {7, 20, 6, 10, 7, 18, 16, 19, 17};

    public static String[] graha = {"Lagn", " Sun", "Merc", "Venu", "Mars", "Jupt", "Satn", "Moon", "Rahu", "Ketu", "Uran", "Nept", "Plut"};

    public static String[] div = {" Rasi ", "  Drekkana", " Sapthamsa", "  Navamsa", "  Dashamsa", "Dwadasamsa", "Shodasamsa"};

    public static char[] yonii = {0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1};

    public static String[] tara10 = {"janma", "sampat", "vipat", "kshem", "pratyari", "sadhak", "vadh", "mitra", "atimitra", "janma", "sampatti", "vipatti", "kshem", "pratyari", "sadhak", "vadh", "mitra", "atimitra", "janma", "sampatti", "vipatti", "kshem", "pratyari", "sadhak", "vadh", "mitra", "atimitra", "janma"};

    public static double z1 = 3.14159265359;

    public static char[] varnn = {1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0};

    public static char[] vaishyaa = {0, 0, 1, 2, 3, 1, 1, 4, 1, 2, 1, 2};

    public static String[] gun1 = {"brahmin", "kshatriya", "vaishya", "shudra"};
    public static String[] gun2 = {"chatushpad", "manav", "jalchar", "vanchar", "kitak"};

    public static int[] gun3 = {0, 1, 2, 3, 4, 5, 6, 7, 8};
    public static String[] gun4 = {"ashwa", "gaj", "mesh", "sarp", "shwan", "marjar", "mushak", "gau", "mahishi", "vyaghra", "mrug", "vanar", "mungus", "sinh"};
    public static String[] gun5 = {"mangal", "shukra", "budh", "chandra", "surya", "budh", "shukra", "mangal", "guru", "shani", "shani", "guru"};
    public static String[] gun6 = {"dev", "manush", "rakshas"};
    public static String[] gun7 = {"mesh", "vrushabh", "mithun", "kark", "sinh", "kanya", "tula", "vruchik", "dhanu", "makar", "kumbh", "meen"};
    public static String[] gun8 = {"aadya", "madhya", "antya"};

    public static char[] gann = {0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0};

    public static char[] nadii = {0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2};

    public static float[][] varn =
            {
                    {1F, 0F, 0F, 0F},
                    {1F, 1F, 0F, 0F},
                    {1F, 1F, 1F, 0F},
                    {1F, 1F, 1F, 1F}
            };

    public static float[][] vaishya =
            {
                    {2.0F, 0.5F, 1.0F, 0.0F, 2.0F},
                    {0.5F, 2.0F, 0.0F, 0.0F, 0.0F},
                    {1.0F, 0.0F, 2.0F, 2.0F, 2.0F},
                    {0.0F, 0.0F, 2.0F, 2.0F, 0.0F},
                    {2.0F, 0.0F, 2.0F, 0.0F, 2.0F}
            };

    public static float[][] tara =
            {
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F},
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F},
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F},
                    {1.5F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 1.5F},
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F},
                    {1.5F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 1.5F},
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F},
                    {1.5F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 0.0F, 1.5F, 1.5F},
                    {3.0F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 1.5F, 3.0F, 3.0F}
            };

    public static float[][] yoni =
            {
                    {4.0F, 2.0F, 2.0F, 3.0F, 2.0F, 2.0F, 2.0F, 1.0F, 0.0F, 1.0F, 3.0F, 3.0F, 2.0F, 1.0F},
                    {2.0F, 4.0F, 3.0F, 3.0F, 2.0F, 2.0F, 2.0F, 2.0F, 3.0F, 1.0F, 2.0F, 3.0F, 2.0F, 0.0F},
                    {2.0F, 3.0F, 4.0F, 2.0F, 1.0F, 2.0F, 1.0F, 3.0F, 3.0F, 1.0F, 2.0F, 0.0F, 3.0F, 1.0F},
                    {3.0F, 3.0F, 2.0F, 4.0F, 2.0F, 1.0F, 1.0F, 1.0F, 1.0F, 2.0F, 2.0F, 2.0F, 0.0F, 2.0F},
                    {2.0F, 2.0F, 1.0F, 2.0F, 4.0F, 2.0F, 1.0F, 2.0F, 2.0F, 1.0F, 0.0F, 2.0F, 1.0F, 1.0F},
                    {2.0F, 2.0F, 2.0F, 1.0F, 2.0F, 4.0F, 0.0F, 2.0F, 2.0F, 1.0F, 3.0F, 3.0F, 2.0F, 1.0F},
                    {2.0F, 2.0F, 1.0F, 1.0F, 1.0F, 0.0F, 4.0F, 2.0F, 2.0F, 2.0F, 2.0F, 2.0F, 1.0F, 2.0F},
                    {1.0F, 2.0F, 3.0F, 1.0F, 2.0F, 2.0F, 2.0F, 4.0F, 3.0F, 0.0F, 3.0F, 2.0F, 2.0F, 1.0F},
                    {0.0F, 3.0F, 3.0F, 1.0F, 2.0F, 2.0F, 2.0F, 3.0F, 4.0F, 1.0F, 2.0F, 2.0F, 2.0F, 1.0F},
                    {1.0F, 1.0F, 1.0F, 2.0F, 1.0F, 1.0F, 2.0F, 0.0F, 1.0F, 4.0F, 1.0F, 1.0F, 2.0F, 1.0F},
                    {3.0F, 2.0F, 2.0F, 2.0F, 0.0F, 3.0F, 2.0F, 3.0F, 2.0F, 1.0F, 4.0F, 2.0F, 2.0F, 1.0F},
                    {3.0F, 3.0F, 0.0F, 2.0F, 2.0F, 3.0F, 2.0F, 2.0F, 2.0F, 1.0F, 2.0F, 4.0F, 3.0F, 2.0F},
                    {2.0F, 2.0F, 3.0F, 0.0F, 1.0F, 2.0F, 1.0F, 2.0F, 2.0F, 2.0F, 2.0F, 3.0F, 4.0F, 2.0F},
                    {1.0F, 0.0F, 1.0F, 2.0F, 1.0F, 1.0F, 2.0F, 1.0F, 1.0F, 1.0F, 1.0F, 2.0F, 2.0F, 4.0F}
            };

    public static float[][] grah =
            {
                    {5.0F, 3.0F, 0.5F, 4.0F, 5.0F, 0.5F, 3.0F, 5.0F, 5.0F, 0.5F, 0.5F, 5.0F},
                    {3.0F, 5.0F, 5.0F, 0.5F, 0.0F, 5.0F, 5.0F, 3.0F, 0.5F, 5.0F, 5.0F, 0.5F},
                    {0.5F, 5.0F, 5.0F, 1.0F, 4.0F, 5.0F, 5.0F, 0.5F, 0.5F, 4.0F, 4.0F, 0.5F},
                    {4.0F, 0.5F, 1.0F, 5.0F, 5.0F, 1.0F, 0.5F, 4.0F, 4.0F, 0.5F, 0.5F, 4.0F},
                    {5.0F, 0.0F, 4.0F, 5.0F, 5.0F, 4.0F, 0.0F, 5.0F, 5.0F, 0.0F, 0.0F, 5.0F},
                    {0.5F, 5.0F, 5.0F, 1.0F, 4.0F, 5.0F, 5.0F, 0.5F, 0.5F, 4.0F, 4.0F, 0.5F},
                    {3.0F, 5.0F, 5.0F, 0.5F, 0.0F, 5.0F, 5.0F, 3.0F, 0.5F, 5.0F, 5.0F, 0.5F},
                    {5.0F, 3.0F, 0.5F, 4.0F, 5.0F, 0.5F, 3.0F, 5.0F, 5.0F, 0.5F, 0.5F, 5.0F},
                    {5.0F, 0.5F, 0.5F, 4.0F, 5.0F, 0.5F, 0.5F, 5.0F, 5.0F, 3.0F, 3.0F, 5.0F},
                    {0.5F, 5.0F, 4.0F, 0.5F, 0.0F, 4.0F, 5.0F, 0.5F, 3.0F, 5.0F, 5.0F, 3.0F},
                    {0.5F, 5.0F, 4.0F, 0.5F, 0.0F, 4.0F, 5.0F, 0.5F, 3.0F, 5.0F, 5.0F, 3.0F},
                    {5.0F, 0.5F, 0.5F, 4.0F, 5.0F, 0.5F, 0.5F, 5.0F, 5.0F, 3.0F, 3.0F, 5.0F}
            };

    public static float[][] gan =
            {
                    {6.0F, 5.0F, 1.0F},
                    {6.0F, 6.0F, 0.0F},
                    {1.0F, 0.0F, 6.0F}
            };

    public static float[][] kut =
            {
                    {7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F},
                    {0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F},
                    {7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F},
                    {7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F},
                    {0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F},
                    {0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F},
                    {7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F, 0.0F},
                    {0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F, 0.0F},
                    {0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F, 7.0F},
                    {7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F, 7.0F},
                    {7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F, 0.0F},
                    {0.0F, 7.0F, 7.0F, 0.0F, 0.0F, 7.0F, 0.0F, 0.0F, 7.0F, 7.0F, 0.0F, 7.0F}
            };

    public static float[][] nadi =
            {
                    {0.0F, 8.0F, 8.0F},
                    {8.0F, 0.0F, 8.0F},
                    {8.0F, 8.0F, 0.0F}
            };

    public static String[][] akshar =
            {
                    {"chu", "che", "cho", "la"},
                    {"li", "lu", "le", "lo"},
                    {"aa", "ee", "u", "a"},
                    {"ao", "va", "vi", "vu"},
                    {"ve", "vo", "ka", "ki"},
                    {"ku", "hg", "d", "chha"},
                    {"ke", "ko", "ha", "hi"},
                    {"hu", "he", "ho", "da"},
                    {"di", "du", "de", "do"},
                    {"ma", "mi", "mu", "me"},
                    {"mo", "ta", "ti", "tu"},
                    {"te", "to", "pa", "pi"},
                    {"pu", "sha", "ana", "tha"},
                    {"pe", "po", "ra", "ri"},
                    {"ru", "re", "ro", "ta"},
                    {"ti", "tu", "te", "to"},
                    {"na", "ni", "nu", "ne"},
                    {"no", "ya", "yi", "yu"},
                    {"ye", "yo", "bha", "bhi"},
                    {"bhu", "ddha", "pha", "dhha"},
                    {"bhe", "bho", "ja", "ji"},
                    {"khi", "khu", "khe", "kho"},
                    {"ga", "gi", "gu", "ge"},
                    {"go", "sa", "si", "su"},
                    {"se", "so", "daa", "dee"},
                    {"du", "zha", "aaa", "thha"},
                    {"de", "do", "cha", "chi"}
            };


    public static void initVariables(BirthDetails birthDetails1, BirthDetails birthDetails2) {
        init(birthDetails1);
        ayan();
        sun();
        mer();
        ven();
        mars();
        jup();
        sat();
        moon();
        ura();
        nep();
        plu();
        ret = 1;
        b6 += 1.0 / 24 / 36535;
        sun();
        mer();
        ven();
        mars();
        jup();
        sat();
        moon();
        ura();
        nep();
        plu();
        b6 += 1.0 / 24 / 36535;

    }

    public static void calculateVikramSanvat(BirthDetails birthDetails) {
        int yvs, mvs, dvs, yss;
        yvs = Integer.parseInt(birthDetails.getYear()) + 56;
        mvs = Integer.parseInt(birthDetails.getMonth()) + 8;
        dvs = Integer.parseInt(birthDetails.getDate()) + 14;
        if (mvs > 12) {
            yvs = yvs + 1;
            mvs = mvs - 12;
        }
        if (dvs > 30) {
            mvs = mvs + 12;
            dvs = dvs - 30;
        }
        yss = yvs - 135;
        System.out.println(format(" Shak savant     : %d-%d", (yss - 1), yss));
        System.out.println(format(" Vikram savant   : %d-%d", (yvs - 1), yvs));
    }

    public static void calculateVarna(BirthDetails birthDetails) {
        double varnaMax = 1.0;
    }

    public static void init(BirthDetails birthDetails) {
        double v0, p0, q0, s0, v1, c0, z0, v2, v3, v4, v5, y1, y2, y3, y4, y5, y6;
        double q1, q2, q3, q4, q5, q6, w2, r1, r2, r3, r4, s1, s2, s3, s4;

        ps = 0.0;
        pt = 0.0;
        z1 = 3.14159265359;
        z2 = z1 / 180;
        z3 = 180 / z1;
        s1 = 99.99826;

        latdeg = Integer.parseInt(birthDetails.getLatitude().split("\\.")[0]);
        latmt = Integer.parseInt(birthDetails.getLatitude().split("\\.")[1]);
        ns = birthDetails.getLatitude().split("\\.")[2];

        /*log.info("latdeg = {} [values are matching]", latdeg);
        log.info("latmt = {} [values are matching]", latmt);
        log.info("ns = {} [values are matching]", ns);*/

        longdeg = Integer.parseInt(birthDetails.getLongitude().split("\\.")[0]);
        longmt = Integer.parseInt(birthDetails.getLongitude().split("\\.")[1]);
        ew = birthDetails.getLongitude().split("\\.")[2];

        /*log.info("longdeg = {} [values are matching]", longdeg);
        log.info("longmt = {} [values are matching]", longmt);
        log.info("ew = {} [values are matching]", ew);*/

        lat = (double) latdeg + (double) latmt / 60;
        if ("S".equalsIgnoreCase(ns)) {
            lat = -lat;
        }
        longt = (double) longdeg + (double) longmt / 60;
        if ("W".equalsIgnoreCase(ew)) {
            longt = -longt;
        }

        longdegtzg = Integer.parseInt(birthDetails.getTimezone().split("\\.")[0]);
        longmttzg = Integer.parseInt(birthDetails.getTimezone().split("\\.")[1]);
        h = Integer.parseInt(birthDetails.getBirthTime().split("\\.")[0]);
        mt = Integer.parseInt(birthDetails.getBirthTime().split("\\.")[1]);
        longtzg = (double) longdegtzg + (double) longmttzg / 60;

        log.info("lat = {} [values are matching]",lat);
        log.info("longt {} [values are matching]",longt);
        log.info("longtzg = {} [values are matching]",longtzg);

        tzg = 12.00 + longtzg;

        tdg = (longt - longtzg * 15) * 4;
        tdgh = tdg / 60;

        ftdgh = tdgh % 1;
        tdgmt = ftdgh * 60;
        ftdgmt = tdgmt % 1;
        tdgs = ftdgmt * 60;
        ftdgs = tdgs % 1;

        log.info("tzg = {} [values are matching]",tzg);
        log.info("tdg = {} [values are matching]",tdg);
        log.info("tdgh = {} [values are matching] ",tdgh);
        log.info("ftdgh = {} [values are matching]",ftdgh);
        log.info("tdgmt = {} [values are matching]",tdgmt);
        log.info("ftdgmt = {} [values are matching]",ftdgmt);
        log.info("ftdgs = {} [values are matching]",ftdgs);
        log.info("tdgs = {} [values are matching]",tdgs);

        p = (int) tdgh;
        q = (int) tdgmt;
        r = (int) tdgs;
        log.info(" p = {}   q = {}  r = {} ", p,q,r);

        j = (int) calculateJ(birthDetails);
        h6 = ((double) h + ((double) mt / 60) - tzg) / 24;
        b6 = (j - 694025 + h6) / 36525;
        j = (j + 4) % 7;
        log.info("Values of z1, b6 and h6 are: {} {} {} ", z1, b6, h6);
        v0 = b6 / 5 + 0.1;
        p0 = 2 * z1 * fract(0.65965 + 8.43029 * b6);
        q0 = 2 * z1 * fract(0.73866 + 3.39476 * b6);
        s0 = 2 * z1 * fract(0.67644 + 1.19019 * b6);
        log.info(" Values of p0, q0 and s0 are {} {} {}", p0, q0, s0);
        v1 = 5 * q0 - 2 * p0;
        c0 = s0 - q0;
        z0 = q0 - p0;
        v2 = sin(v1);
        v3 = sin(2 * v1);
        v4 = cos(v1);
        v5 = cos(2 * v1);
        y1 = sin(z0);
        y2 = sin(2 * z0);
        y3 = sin(3 * z0);
        y4 = cos(z0);
        y5 = cos(2 * z0);
        y6 = cos(3 * z0);
        q1 = sin(q0);
        q2 = sin(2 * q0);
        q3 = sin(3 * q0);
        q4 = cos(q0);
        q5 = cos(2 * q0);
        q6 = cos(3 * q0);
        w2 = sin(3 * c0);
        r1 = (0.331 - 0.01 * v0) * v2 - 0.064 * v0 * v4 + 0.014 * y1;
        r1 += 0.018 * y2 - 0.034 * y4 * q1 - 0.036 * y1 * q4;
        r2 = 0.007 * v2 - 0.02 * v4 + q1 * (0.007 * y1 + 0.034 * y4 + 0.006 * y5);
        r2 += q4 * (0.038 * y1 + 0.006 * y2 - 0.007 * y4);
        r2 += q2 * (-0.005 * y1 + 0.004 * y4) + q5 * (0.004 * y1 + 0.006 * y4);
        r3 = 3606 * v2 + (1289 - 580 * v0) * v4 + q1 * (-6764 * y1 - 1110 * y2 - 204 + 1284 * y4);
        r3 += q4 * (1460 * y1 - 817 + 6074 * y4 + 992 * y5 + 508 * y6);
        r3 += q2 * (-956 * y1 - 997 * y4 + 480 * y5);
        r3 += q5 * (-956 * y1 + 490 * y2 + 179 + 1024 * y4 - 437 * y5);
        r3 *= 1e-7;
        r4 = -263 * v4 + 205 * y4 + 693 * y5 + 312 * y6;
        r4 += q1 * (299 * y1 + 181 * y5) + q4 * (204 * y2 + 111 * y3 - 337 * y4 - 111 * y5);
        r4 *= 1e-6;
        s1 = (-0.814 + 0.018 * v0 - 0.017 * v0 * v0) * v2;
        s1 += (-0.01 + 0.161 * v0) * v4 - 0.149 * y1 - 0.041 * y2 - 0.015 * y3;
        s1 += q1 * (-0.006 - 0.017 * y2 + 0.081 * y4 + 0.015 * y5);
        s1 += q4 * (0.086 * y1 + 0.025 * y4 + 0.014 * y5 + 0.006 * y6);
        s2 = (0.077 + 0.007 * v0) * v2 + (0.046 - 0.015 * v0) * v4 - 0.007 * y1;
        s2 -= q1 * (0.076 * y1 + 0.025 * y2 + 0.009 * y3);
        s2 += q4 * (-0.073 - 0.15 * y4 + 0.027 * y5 + 0.01 * y6);
        s2 += q6 * (-0.014 * y1 - 0.008 * y4 + 0.014 * y5);
        s2 += q5 * (-0.014 * y1 + 0.012 * y2 + 0.015 * y4 - 0.013 * y5);
        s3 = (-7927 + 2584 * v0) * v2 + (13381 + 1226 * v0) * v4;
        s3 += 248 * v3 - 305 * v5 + 412 * y2;
        s3 += q1 * (12415 + (390 - 617 * v0) * y1 + 26599 * y4 - 4687 * y5 - 1870 * y6 - 821 * cos(4 * z0));
        s3 += q4 * (163 - 611 * v0 - 12696 * y1 - 4200 * y2 - 1503 * y3 - 619 * sin(4 * z0) - (282 + 1306 * v0) * y4);
        s3 += q2 * (-350 + 2211 * y1 - 2208 * y2 - 568 * y3 - 2780 * y4 + 2022 * y5);
        s3 += q5 * (-490 - 2842 * y1 - 1594 * y4 + 2162 * y5 + 561 * y6 + 469 * w2);
        s3 *= 1e-7;
        s4 = 572 * v2 + 2933 * v4 + 33629 * y4 - 3081 * y5 - 1423 * y6 - 671 * cos(4 * z0);
        s4 += q1 * (1098 - 2812 * y1 + 688 * y2 - 393 * y3 + 2138 * y4 - 999 * y5 - 642 * y6);
        s4 += q4 * (-890 + 2206 * y1 - 1590 * y2 - 647 * y3 + 2285 * y4 + 2172 * y5 + 296 * y6);
        s4 += q2 * (-267 * y2 - 778 * y4 + 495 * y5 + 250 * y6);
        s4 += q5 * (-856 * y1 + 441 * y2 + 296 * y5 + 211 * y6);
        s4 += q3 * (-427 * y1 + 398 * y3) + q6 * (344 * y4 - 427 * y6);
        s4 *= 1e-6;
        jupc[0] = r1;
        jupc[1] = r2;
        jupc[2] = r3;
        jupc[3] = r4;
        satc[0] = s1;
        satc[1] = s2;
        satc[2] = s3;
        satc[3] = s4;
    }

    public static long calculateJ(BirthDetails birthDetails) {
        long a, j, l;
        int month = Integer.parseInt(birthDetails.getMonth());
        int year = Integer.parseInt(birthDetails.getYear());
        int day = Integer.parseInt(birthDetails.getDate());
        if (month < 3) {
            month += 12;
            year--;
        }
        a = year / 100;
        double b = 30.6 * (float) (month + 1);
        j = (long) (365 * year + year / 4 + b + 2 - a + a / 4 + day);
        System.out.println("Value of J is : " + j);
        return j;
    }

    static double fract(double x) {
        long i;
        double y;
        i = (long) x;
        y = x - i;
        //log.info("Respective values of i, x and y are {} {} {}", i, x, y);
        return y;
    }

    public static void ayan() {
        plnt[0] = 22.460148 + 1.396042 * b6 + 3.08e-4 * b6 * b6;
        log.info("plnt[0] = {}", plnt[0]);
    }

    public static int sun() {

        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.71455 + 99.99826 * b6);
        h0 = 258.76 + 0.323 * b6;
        p0 = 0.0;
        e0 = 0.016751 - 0.000042 * b6;
        q0 = 0.0;
        a0 = 1.0;
        pno = 1;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
        System.out.println("Test Fail");
        return (int) plnt[pno];
    }

    public static void mer() {

        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.43255 + 415.20187 * b6); /* mean longitude */
        h0 = 53.44 + 0.159 * b6; /* longitude of perihelion */
        p0 = 24.69 - 0.211 * b6; /* longitude of ascending node */
        e0 = 0.20561421 + 0.00002046 * b6 - 0.00000003 * b6 * b6; /* value and sign changed, e = eccentricity of the orbit */
        q0 = 7.002881 + 0.0018608 * b6 - 0.0000183 * b6 * b6; /* value changed, i = inclination on the plane of the ecliptic */
        a0 = 0.3870986; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 2;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void ven() {
        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.88974 + 162.54949 * b6);
        h0 = 107.70 + 0.012 * b6;
        p0 = 53.22 - 0.496 * b6;
        e0 = 0.00682069 - 0.00004774 * b6 + 0.000000091 * b6 * b6; /* value changed, e = eccentricity of the orbit */
        q0 = 3.393631 + 0.0010058 * b6 - 0.000001 * b6 * b6; /* value changed, i = inclination on the plane of the ecliptic */
        a0 = 0.7233316; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 3;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void mars() {
        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.75358 + 53.16751 * b6);
        h0 = 311.76 + 0.445 * b6;
        p0 = 26.33 - 0.625 * b6;
        e0 = 0.09331290 + 0.000092064 * b6 - 0.000000077 * b6 * b6; /* value and sign changed, e = eccentricity of the orbit */
        q0 = 1.850333 - 0.000675 * b6 + 0.0000126 * b6 * b6; /* value and sign changed, i = inclination on the plane of the ecliptic */
        a0 = 1.5236883; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 4;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void jup() {
        double g0, h0, p0, e0, q0, a0, a1, y1; /*unused variable*/
        int pno;

        g0 = 360 * fract(0.59886 + 8.43029 * b6) + jupc[0];
        e0 = 0.04833475 + 0.000164180 * b6 - 0.0000004676 * b6 * b6 - 0.0000000017 * b6 * b6 * b6 + jupc[2]; /* value and sign changed, e = eccentricity of the orbit */
        h0 = 350.26 + 0.214 * b6 + jupc[1] / e0;
        p0 = 76.98 - 0.386 * b6;
        q0 = 1.308736 - 0.0056961 * b6 + 0.0000039 * b6 * b6; /* value changed, i = inclination on the plane of the ecliptic */
        a0 = 5.202561 + jupc[3]; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 5;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void sat() {
        double g0, h0, p0, e0, q0, a0, a1, y1; /*unused variable*/
        int pno;

        g0 = 360 * fract(0.67807 + 3.39476 * b6) + satc[0];
        e0 = 0.05589232 - 0.00034550 * b6 - 0.000000728 * b6 * b6 + 0.00000000074 * b6 * b6 * b6 + satc[2]; /* value changed, e = eccentricity of the orbit */
        h0 = 68.64 + 0.562 * b6 + satc[1] / e0;
        p0 = 90.33 - 0.523 * b6;
        q0 = 2.492519 - 0.0039189 * b6 - 0.00001549 * b6 * b6 + 0.00000004 * b6 * b6 * b6; /* value and sign changed, i = inclination on the plane of the ecliptic */
        a0 = 9.554747 + satc[3]; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 6;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void moon() {
        double g1, h1, a0, b0, c0, g0, e0, d0, f0, l0;
        double r0, d3, d4, d5;

        g1 = 360 * fract(0.71455 + 99.99826 * b6);
        h1 = 258.76 + 0.323 * b6;
        a0 = 360 * fract(0.68882 + 1336.851353 * b6);
        b0 = 360 * fract(0.8663 + 11.298994 * b6 - 3.0e-5 * b6 * b6);
        c0 = 360 * fract(0.65756 - 5.376495 * b6);
        if (c0 < 0.0)
            c0 += 360.0;
        g0 = z2 * (a0 - b0);
        e0 = z2 * (g1 - h1);
        d0 = z2 * (a0 - g1);
        f0 = z2 * (a0 - c0);
        l0 = a0 + 6.2888 * sin(1 * g0) + 0.2136 * sin(2 * g0) + 0.01 * sin(3 * g0) + 1.274 * sin(2 * d0 - g0) + 0.0085 * sin(4 * d0 - 2 * g0);
        l0 = l0 - 0.0347 * sin(1 * d0) + 0.6583 * sin(2 * d0) + 0.0039 * sin(4 * d0) - 0.1856 * sin(e0) - 0.0021 * sin(2 * e0) + 0.0052 * sin(g0 - d0);
        l0 = l0 - 0.0588 * sin(2 * g0 - 2 * d0) + 0.0572 * sin(2 * d0 - g0 - e0) + 0.0533 * sin(g0 + 2 * d0) + 0.0458 * sin(2 * d0 - e0) + 0.041 * sin(g0 - e0) - 0.0305 * sin(g0 + e0);
        l0 = l0 - 0.0237 * sin(2 * f0 - g0) - 0.0153 * sin(2 * f0 - 2 * d0) + 0.0107 * sin(4 * d0 - g0) - 0.0079 * sin(-g0 + e0 + 2 * d0) - 0.0068 * sin(e0 + 2 * d0) + 0.005 * sin(e0 + d0);
        l0 = l0 - 0.0023 * sin(g0 + d0) + 0.004 * sin(2 * g0 + 2 * d0) + 0.004 * sin(g0 - e0 + 2 * d0) - 0.0037 * sin(3 * g0 - 2 * d0) - 0.0026 * sin(g0 - 2 * d0 + 2 * f0) + 0.0027 * sin(2 * g0 - e0);
        l0 = l0 - 0.0024 * sin(2 * g0 + e0 - 2 * d0) + 0.0022 * sin(2 * d0 - 2 * e0) - 0.0021 * sin(2 * g0 + e0) + 0.0021 * sin(c0 * z2) + 0.0021 * sin(2 * d0 - g0 - 2 * e0);
        l0 = l0 - 0.0018 * sin(g0 + 2 * d0 - 2 * f0) + 0.0012 * sin(4 * d0 - g0 - e0) - 0.0008 * sin(3 * d0 - g0);
        r0 = z2 * 2 * (l0 - c0);
        d3 = l0 - 0.1143 * sin(r0) + 0.004;
        if (d3 >= 360.0)
            d3 -= 360.0;
        if (d3 < 0.0)
            d3 += 360.0;
        if (ret == 0)
            plnt[7] = d3;
        else
            plnt[20] = d3;
        d4 = c0;
        if (ret == 0)
            plnt[8] = d4;
        else
            plnt[21] = d4;
        d5 = c0 + 180.0;
        if (d5 >= 360.0)
            d5 -= 360.0;
        if (ret == 0)
            plnt[9] = d5;
        else
            plnt[22] = d5;
    }

    public static void ura() {
        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.61372 + 1.19019 * b6);
        g0 = g0 - 0.166 * sin((g0 + 50.0 + plnt[0]) * z2);
        h0 = 149.09 + 0.088 * b6;
        p0 = 51.02 - 0.897 * b6;
        e0 = 0.0463444 - 0.00002658 * b6 + 0.000000077 * b6 * b6; /* value changed, e = eccentricity of the orbit */
        q0 = 0.772464 + 0.0006253 * b6 + 0.0000395 * b6 * b6; /* value changed, i = inclination on the plane of the ecliptic */
        a0 = 19.21814; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 10;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void nep() {
        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.17361 + 0.60692 * b6);
        g0 += 0.1 - 0.1 * sin((g0 / 2 - 90.0 + plnt[0]) * z2) + 0.166 * sin(b6 - 1.0);
        h0 = 24.27 + 0.028 * b6;
        p0 = 108.22 - 0.297 * b6;
        e0 = 0.00899704 + 0.000006330 * b6 - 0.000000002 * b6 * b6; /* value changed, e = eccentricity of the orbit */
        q0 = 1.779242 - 0.0095436 * b6 - 0.0000091 * b6 * b6; /* value changed, i = inclination on the plane of the ecliptic */
        a0 = 30.10957; /* value changed, a = semi major axis of the orbit, constant for each planet*/
        pno = 11;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }

    public static void plu() {
        double g0, h0, p0, e0, q0, a0;
        int pno;

        g0 = 360 * fract(0.19434 + 0.40254 * b6);
        g0 -= 0.1 * sin((g0 + plnt[0]) * z2);
        h0 = 200.02 + 0.002 * b6;
        p0 = 86.49 - 0.038 * b6;
        e0 = 0.248644;
        q0 = 17.146778 - 0.005531 * b6;
        a0 = 39.52;
        pno = 12;
        if (ret == 0)
            plnt[pno] = planet(g0, h0, p0, e0, q0, a0, pno);
        else
            plnt[pno + 13] = planet(g0, h0, p0, e0, q0, a0, pno);
    }


    private static double planet(double pg, double ph, double pp, double pe, double pq, double pa, int pno) {
        double pm, pb, pf, pc, pd, pr, e1, e2, e3, e4, v1, pv, pj, pk, pl, px, py;
        pm = pg - ph;
        if (pm < 0)
            pm += 360.0;
        pb = pm * z2;
        pf = pb + pe * sin(pb);
        do {
            pc = pf - pe * sin(pf) - pb;
            pd = 1.0 - pe * cos(pf);
            pf = pf - pc / pd;
        } while (abs(pc / pd) > 0.01);
        pr = pa * (1.0 - pe * cos(pf));
        e1 = atan(pe / sqrt(1.0 - pe * pe));
        e2 = z1 / 4 - e1 / 2;
        e3 = tan(e2);
        e4 = tan(pf / 2);
        v1 = atan(e4 / e3);
        if (v1 < 0.0)
            v1 += z1;
        pv = 2 * v1;
        pc = ph * z2;
        pd = pp * z2;
        pb = pq * z2;
        pj = pv + pc;
        pk = pj - pd;
        pl = 1.0 - cos(pb);
        px = (cos(pj) + sin(pk) * sin(pd) * pl) * pr;
        py = (sin(pj) - sin(pk) * cos(pd) * pl) * pr;
        if (pno == 1) {
            ps = px;
            pt = py;
        }
        pc = ps + px;
        pd = pt + py;
        pm = atan(pd / pc) / z2;
        if (pc < 0.0)
            pm += 180.0;
        else if (pd < 0.0)
            pm += 360.0;
        return pm;
    }

    public static void bhav(BirthDetails birthDetails) {
        double a0, b0, c0, d0, j0, k0;
        int i, k;

        aya = plnt[0];
        obliq = 23.452294 - 0.0130125 * b6 + 0.00426 * cos(plnt[0] + plnt[8]);
        a0 = 24 * fract(0.2769 + 100.00214 * b6);
        b0 = h6 * 24 + 12;
        c0 = longt / 15;
        sidtime = 24 * fract((a0 + b0 + c0) / 24);
        if (sidtime < 0)
            sidtime += 24.0;
        a0 = bhavspl(sidtime, lat);
        b0 = bhavspl(sidtime - 6.0, 0.0);
        c0 = (180 + b0 - a0) / 3;
        if (b0 > a0)
            c0 -= 120;
        d0 = 60.0 - c0;
        bhavgnl(a0, c0, 1);
        bhavgnl(b0 + 180, d0, 4);
        bhavgnl(a0 + 180, d0, 7);
        bhavgnl(b0, d0, 10);
        f3[0] = (f2[11] + f2[0]) / 2;
        if (f2[0] < f2[11]) f3[0] += 180.0;
        if (f3[0] >= 360.0) f3[0] += 360.0;
        for (i = 1; i < 12; i++) {
            f3[i] = (f2[i - 1] + f2[i]) / 2;
            if (f2[i] < f2[i - 1])
                f3[i] += 180.0;
            if (f3[i] > 360.0)
                f3[i] -= 360.0;
        }

        k = (int) f2[0] / 30;
        System.out.println(format(" lagna rasi      : %2s ", ras[k]));
        System.out.println(format(" Lagna swami     : %s", rassw[k]));

        misc(birthDetails);

        System.out.println(format("  Ayanamsa        :%7.2f", plnt[0]));
        System.out.println(format(" Obliquity       :%7.2f", obliq));
        System.out.println(format(" Sideral time    :%7.2f", sidtime));

        System.out.println("            Bhav position");
        System.out.println(" ----------------------------------");
        System.out.println(" Bhav No    Bhav begin     Mid bhav");
        System.out.println(" ----------------------------------");
        for (i = 0; i < 12; i++)
            System.out.println(format("  %2d        %7.2f       %7.2f  ", i + 1, f3[i], f2[i]));
        System.out.println(" ----------------------------------");

        page++;
        System.out.println(format(" %-35s       page: %d", birthDetails.getName(), page));
    }

    private static double bhavspl(double a0, double c0) {
        double r0, w0, b0, g0;

        r0 = aya;
        w0 = obliq * z2;
        b0 = a0 * 15 + 90.0;
        if (b0 >= 360.0)
            b0 -= 360.0;
        a0 *= z1 / 12;
        c0 *= z2;
        if (a0 == 0.0 && c0 == 0.0)
            return 90.0;
        g0 = atan(-cos(a0) / (sin(c0) * sin(w0) / cos(c0) + sin(a0) * cos(w0)));
        g0 /= z2;
        if (g0 < 0.0)
            g0 += 180.0;
        if (b0 - g0 > 75.0)
            g0 += 180.0;
        g0 -= r0;
        if (g0 < 0.0)
            g0 += 360.0;
        if (g0 > 360.0)
            g0 -= 360.0;
        return g0;
    }

    private static void bhavgnl(double j0, double k0, int u) {
        int l, v;
        double m0;

        for (l = 0; l < 3; l++) {
            m0 = j0 + k0 * (double) l;
            if (m0 >= 360.0)
                m0 -= 360.0;
            v = u + l - 1;
            f2[v] = m0;
        }
    }

    public static void printResults(BirthDetails birthDetails1, BirthDetails birthDetails2) {
        System.out.println("                       Murli Narkhede ");
        System.out.println("            9, Second floor, Trimurti Prasad CHS ");
        System.out.println("             Rambaug Lane 9, Kalyan West 421301 ");
        System.out.println(" ----------------------------------------------------------");
        System.out.println("                      yeSMatch Horoscope ");

        System.out.println(" ----------------------------------------------------------");
        System.out.println("                 :  girl                    boy             ");
        System.out.println(" ----------------------------------------------------------");

        System.out.println(format(" Name            : %s \t\t %s  ", birthDetails1.getName(), birthDetails2.getName()));
        System.out.println(format(" Date of Birth   : %s.%s.%s \t\t %s.%s.%s", birthDetails1.getDate(), birthDetails1.getMonth(), birthDetails1.getYear(), birthDetails2.getDate(), birthDetails2.getMonth(), birthDetails2.getYear()));
        System.out.println(format(" Day of Birth    : %s", day[j]));
        System.out.println(format(" Time of Birth   : %02d:%02d IST \t\t %02d:%02d IST", h, mt, h, mt));
        System.out.println(format(" Place of Birth  : %s \t\t %s", birthDetails1.getBirthPlace(), birthDetails2.getBirthPlace()));
        System.out.println(format(" Latitude        : %03d:%02d %s \t\t %03d:%02d %s", latdeg, latmt, ns, latdeg, latmt, ns));
        System.out.println(format(" Longitude       : %03d:%02d %s \t\t %03d:%02d %s", longdeg, longmt, ew, longdeg, longmt, ew));
        System.out.println(format(" Std time zone   : %02d:%02d \t\t %02d:%02d ", longdegtzg, longmttzg, longdegtzg, longmttzg));

        int mt3 = 0, h3 = 0;
        double mtbirth = 0.0;

        if (tdg > 0) {
            System.out.println(format(" Local time dif  : %02d:%02d", p, q));
            System.out.println(format(" Local time      : %02d:%02d", h3, mt3));
        } else {
            mtbirth = h * 60 + mt;
        }
        mt3 = (int) mtbirth + q;
        h3 = mt3 / 60;
        mt3 = mt3 % 60;

        System.out.println(format(" Local time dif  : -%02d:%02d", abs(p), abs(q)));
        System.out.println(format(" Local time      : %02d:%02d", h3, mt3));
        bhav(birthDetails1);
        System.out.println();
        System.out.println();
        System.out.println("                    Planetary Position ");
        System.out.println(" ----------------------------------------------------------");
        System.out.println(" Planet   Rasi     Longitude  Nakshatra  Charan Direct/Ret ");
        System.out.println(" ----------------------------------------------------------");
        prplnt();
        System.out.println(" ----------------------------------------------------------");

        saptavg();
        vgprint(birthDetails1);
        ashtak(birthDetails1);
        vimst( birthDetails1);
    }

    private static void vimst(BirthDetails birthDetails) {
        double a0 = Double.parseDouble(birthDetails.getDate());
        double b0 = Double.parseDouble(birthDetails.getMonth());
        double c0 = Double.parseDouble(birthDetails.getYear());
        double d0, n0, p0, e0;
        int q, c, d, e, n, g, p, r, t, f;

        d0 = plnt[7];
        d0 = 9.0 * fract(d0 / 120);
        n0 = fract(d0);
        q = (int) d0;
        p0 = n0 * y10[q];
        a0 = c0 + b0/12 + a0/360;
        e0 = a0 + 75.0;
        b0 = a0 - p0;
        System.out.println("           Vimsottari Dasa          ");
        System.out.println(" -----------------------------------");
        System.out.println(" Dasa     Bhukti    Date Month Year ");
        System.out.println(" -----------------------------------");
        line = 6;
        for (c = q; c <= q+8; c++){
            if (c > 8)
                c -= 9;
            for (d = 0; d <= 8; d++){
                n = c + d;
                if (n > 8)
                    n -= 9; /*lines deleted here*/
                b0 += y10[c] * y10[n] / 120; /*b0 += y10[c] * y10[n] * y10[g] / 14400;*/
                if (b0 < a0)
                    continue;
                p = (int) b0;
                r = (int) (12 * fract(b0));
                t = (int) (30 * fract(12 * fract(b0)) + 1);
                if (r == 0){
                    p--;
                    r = 12;
                }
                else if (r == 2 && t > 28){
                    t -= 28;
                    r = 3;
                }
                System.out.println(format(" %s %s  %3d  %3d  %5d", x1[c], x1[n], t, r, p));
                line++;
                if (line > 60){
                    System.out.println(" -----------------------------------");
                    page++;
                    System.out.println(format(" %-35s        Page  :   %2d", birthDetails.getName(),   page));

                    System.out.println("           Vimsottari Dasa          ");
                    System.out.println(" -----------------------------------");
                    System.out.println(" Dasa     Bhukti    Date Month Year ");
                    System.out.println(" -----------------------------------");
                    line = 6;
                }
            }
            f = c + 1;
            if (f > 8)
                f -= 9;
            System.out.println(format(" ----- %10s  Dasa Ends ------ ", x1[c]));
            line++;
            if (b0 > e0)
                break;
            System.out.println(format(" ----- %10s  Dasa Starts ---- ", x1[f]));
            line++;
        }
        System.out.println(" ----------------------------------");
        System.out.println(" Note:    The dates given are for DASA ending dates.  ");
        System.out.println(" Note:    The dates given are nothing to do with the longevity of native.  ");

    }

    private static void ashtak(BirthDetails birthDetails) {
        int c, d, e, f, g, h, i, j, k;

        c = (int) (plnt[1]/30 +1);
        d = (int) (plnt[7]/30 +1);
        e = (int) (plnt[4]/30 +1);
        f = (int) (plnt[2]/30 +1);
        g = (int) (plnt[5]/30 +1);
        h = (int) (plnt[3]/30 +1);
        i = (int) (plnt[6]/30 +1);
        j = (int) (f2[0]/30 +1);
        System.out.println("");
        System.out.println("                   Ashtavarga Table                   ");
        System.out.println(" -------------------------------------------------------");
        System.out.println(" Rasi      1   2   3   4   5   6   7   8   9  10  11  12");
        System.out.println(" -------------------------------------------------------");
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, c);
        ashcomp(0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, d);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, e);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, f);
        ashcomp(0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, g);
        ashcomp(0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, h);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, i);
        ashcomp(0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, j);
        ashprint(" Sun    ");
        ashaccu();
        ashcomp(0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, c);
        ashcomp(1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, d);
        ashcomp(0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, e);
        ashcomp(1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, f);
        ashcomp(1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, g);
        ashcomp(0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, h);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, i);
        ashcomp(0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, j);
        ashprint(" Moon   ");
        ashaccu();
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, c);
        ashcomp(0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, d);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, e);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, f);
        ashcomp(0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, g);
        ashcomp(0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, h);
        ashcomp(1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, i);
        ashcomp(1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, j);
        ashprint(" Mars   ");
        ashaccu();
        ashcomp(0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, c);
        ashcomp(0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, d);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, e);
        ashcomp(1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, f);
        ashcomp(0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, g);
        ashcomp(1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, h);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, i);
        ashcomp(1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, j);
        ashprint(" Mercury");
        ashaccu();
        ashcomp(1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, c);
        ashcomp(0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, d);
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, e);
        ashcomp(1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, f);
        ashcomp(1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, g);
        ashcomp(0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, h);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, i);
        ashcomp(1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, j);
        ashprint(" Jupiter");
        ashaccu();
        ashcomp(0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, c);
        ashcomp(1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, d);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, e);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, f);
        ashcomp(0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, g);
        ashcomp(1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, h);
        ashcomp(0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, i);
        ashcomp(1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, j);
        ashprint(" Venus  ");
        ashaccu();
        ashcomp(1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, c);
        ashcomp(0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, d);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, e);
        ashcomp(0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, f);
        ashcomp(0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, g);
        ashcomp(0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, h);
        ashcomp(0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, i);
        ashcomp(1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, j);
        ashprint(" Saturn ");
        ashaccu();
        System.out.println(" -------------------------------------------------------");
        System.out.print(format("%s", " Total  "));
        for (k = 1; k <= 12; k++)
            System.out.print (format("  %2d", s3[k]));
        System.out.println ();
        System.out.println(" -------------------------------------------------------");
        System.out.println("^L");
        page++;
        System.out.println(format("%-35s     Page : %2d", birthDetails.getName(), page));

    }

    private static void ashaccu() {
        int q;

        for (q = 1; q <= 12; q++) {
            s3[q] += r3[q];
            r3[q] = 0;
        }
    }

    private static void ashprint(String x1) {
        int i;

        System.out.print(format("%s", x1));
        for (i = 1; i <= 12; i++)
            System.out.print(format("  %2d", r3[i]));
        System.out.println();
    }

    private static void ashcomp(int a, int b, int c, int d, int e, int f, int g, int h, int i, int j, int k, int l, int n) {
        int p, q;
        int[] k2 = new int[13];

        k2[1] = a;
        k2[2] = b;
        k2[3] = c;
        k2[4] = d;
        k2[5] = e;
        k2[6] = f;
        k2[7] = g;
        k2[8] = h;
        k2[9] = i;
        k2[10] = j;
        k2[11] = k;
        k2[12] = l;
        for (q = 1; q <= 12; q++){
            p = n+q-1; /* check ouotput by l or 1*/
            if (p > 12)
                p -= 12;
            r3[p] += k2[q];
        }
    }

    private static void vgprint(BirthDetails birthDetails) {
        vgcalc(0, birthDetails); /*int m;*/
        vgcalc(3, birthDetails); /*extra line*/
    /*for (m = 0; m <= 6; m++)
        vgcalc(m);*/
    }

    private static void vgcalc(int m, BirthDetails birthDetails) {
        /*char tz[33][8][5];
        int i, j, z, s, p, q, r, u, v;

        for (i = 0; i < 33; i++)
            for (j = 0; j < 8; j++)
                strcpy(tz[i][j],  "    ");
        for (i = 0; i < 13; i++){
            s = varga[i][m];
            if (s < 4)
                r = s+1;
            else if (s < 7)
                r = (s-2)*4;
            else if (s < 10)
                r = 22-s;
            else
                r = (12-s)*4 + 1;
            p = (r-1)/4 + 1;
            q = r - (p-1)*4;
            u = (p-1)*8 + 2 + i/2;
            v = (q-1)*2 + i % 2;
            strcpy(tz[u][v], graha[i]);
        }
        for (z = 1; z <= 33; z++){
            if (z % 8 == 1 && z != 17)
                System.out.println(" ---------------------------------------------------");
            else if (z == 17)
                System.out.println(format(" --------------    %10s         --------------", div[m]));
            else if (z < 9 || z > 25)
                System.out.println(format(" |  %s %s | %s %s | %s %s | %s %s  |", tz[z][0], tz[z][1], tz[z][2], tz[z][3], tz[z][4], tz[z][5], tz[z][6], tz[z][7]));
            else
                System.out.println(format(" |  %s %s |                       |  %s %s |", tz[z][0], tz[z][1], tz[z][6], tz[z][7]));
        }
        if (m==3) /*if (m%2 == 1)*/
        /*    System.out.println("");
        else{
            System.out.println("^L");
            page++;
            System.out.println(format("%-35s   Page  : %d", birthDetails.getName(), page));
        } */
    }

    public static void misc(BirthDetails birthDetails) {

        int ti, na, yo, ra, part;
        double tithi, nakshatra, yoga, rasi;

        tithi = (plnt[7] - plnt[1]) / 12;
        if (tithi < 0.0)
            tithi += 30.0;
        tt[0] = tithi;
        nakshatra = plnt[7] * 3 / 40;
        tt[1] = nakshatra;
        part = (int) (4 * fract(tt[1]) + 1);
        yoga = (plnt[7] + plnt[1]) * 3 / 40;
        if (yoga > 27.0)
            yoga -= 27.0;
        tt[2] = yoga;
        ti = (int) tt[0] + 1;
        if (ti == 30)
            ti = 15;
        else
            ti = ti % 15 - 1;
        if (ti == -1)
            ti = 14;
        na = (int) tt[1];
        yo = (int) tt[2];
        rasi = plnt[7] / 30;
        ra = (int) rasi;
        tt[3] = rasi;

        /*---------------------------------------*/

        System.out.println(format(" Rasi Name       : %s", ras[ra]));
        System.out.println(format(" Rasi swami      : %s", rassw[ra]));

        System.out.println(format(" Nakshatra       : %s - %d", nak[na], part));
        int charan = part - 1;
        System.out.println(format(" Nakshatra swami : %s", naksw[na]));
        // System.out.println(format(" Adyakshar       : %s", akshar[na][charan]));

        if (ti < 14)
            System.out.println(format(" Tithi paksh     : %s", "Krishn"));
        else
            System.out.println(format(" Tithi paksh     : %s", "Shukl"));
        System.out.println(format(" Tithi Name      : %s", tit[ti]));

        System.out.println(format(" Yoga Name       : %s", yog[yo]));

        calculateVikramSanvat(birthDetails);


        double n1, in1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16;
        double fpart, ipart;
        double risem, riseh, fhrise, ihrise, risem1, fmrise, imrise;
        double setm, seth, fhset, ihset, setm1, fmset, imset;
        double timezone = 5.5;

        n1 = (280.46646 + (b6 - 1) * (36000.76983 + (b6 - 1) * 0.0003032));
        in1 = n1 / 360;

        //fpart = modf(in1, &ipart);
        fpart = in1 % 1;
        ipart = (int) in1;
        n1 = 360 + (in1 - ipart) * 360;
        n2 = 357.52911 + (b6 - 1) * (35999.05029 - 0.0001537 * (b6 - 1));
        n3 = 0.016708634 - (b6 - 1) * (0.000042037 + 0.0000001267 * (b6 - 1));
        n4 = sin(n2 * z2) * (1.914602 - (b6 - 1) * (0.004817 + 0.000014 * (b6 - 1))) + sin(2 * n2 * z2) * (0.019993 - 0.000101 * (b6 - 1)) + sin(3 * n2 * z2) * 0.000289;
        n5 = n1 + n4;
        n6 = n2 + n4;
        n7 = (1.000001018 * (1 - n3 * n3)) / (1 + n3 * cos(n6 * z2));
        n8 = n5 - 0.00569 - 0.00478 * sin(125.04 - 1934.136 * (b6 - 1)) * z2;
        n9 = 23 + (26 + ((21.448 - (b6 - 1) * (46.815 + (b6 - 1) * (0.00059 - (b6 - 1) * 0.001813)))) / 60) / 60;
        n10 = n9 + 0.00256 * cos(125.04 - 1934.136 * (b6 - 1)) * z2;
        n11 = z3 * (atan2(cos(n10 * z2) * sin(n8 * z2), cos(n8 * z2)));
        n12 = z3 * (asin(sin(n10 * z2)) * sin(n8 * z2));
        n13 = tan((n10 / 2) * z2) * tan((n10 / 2) * z2);
        n14 = 4 * z3 * (n13 * sin(2 * n1 * z2) - 2 * n3 * sin(n2 * z2) + 4 * n3 * n13 * sin(n2 * z2) * cos(2 * n1 * z2) - 0.5 * n13 * n13 * sin(4 * n1 * z2) - 1.25 * n3 * n3 * sin(2 * n2 * z2));
        n15 = z3 * (acos(cos(90.833 * z2) / (cos(lat * z2) * cos(n12 * z2)) - tan(lat * z2) * tan(n12 * z2)));
        n16 = (720 - 4 * longt - n14 + timezone * 60) / 1440;

        risem = (n16 * 1440 - n15 * 4);
        riseh = risem / 60;

        fhrise = riseh % 1;

        risem1 = fhrise * 60;
        fmrise = risem1 % 1;
        int m = (int) riseh;
        int n = (int) risem1;
        int u = (int) tdgh;
        int v = (int) tdgmt;

        int riseh3, risemt3, seth3, setmt3;
        double mtrise = 0, mtset = 0;

        if (tdg > 0) {
            System.out.println(format(" sunrise (local) : %02d:%02d", m + u, n + v));
        } else {
            mtrise = m * 60 + n;
        }
        risemt3 = (int) (mtrise + v);
        riseh3 = risemt3 / 60;
        risemt3 = risemt3 % 60;

        System.out.println(format(" sunrise (local) : %02d:%02d", riseh3, risemt3));

        setm = (n16 * 1440 + n15 * 4);
        seth = setm / 60;
        fhset = seth % 1;
        setm1 = fhset * 60;
        fmset = setm1 % 1;
        int o = (int) seth;
        int p = (int) setm1;


        if (tdg > 0) {
            System.out.println(format(" sunset (local)  : %02d:%02d", o + u, p + v));
        } else {
            mtset = o * 60 + p;
        }
        setmt3 = (int) (mtset + v);
        seth3 = setmt3 / 60;
        setmt3 = setmt3 % 60;

        System.out.println(format(" sunset (local)  : %02d:%02d", seth3, setmt3));

        System.out.println(format(" sunrise (std)   : %02d:%02d", m, n));
        System.out.println(format(" sunset  (std)   : %02d:%02d", o, p));

        int mp0, mp4, mp;

        System.out.println(format(" lagna        : %2f", f2[0]));
        System.out.println(format(" mangal       : %2f", plnt[4]));

        mp0 = (int) (f2[0] / 30 + 1);
        mp4 = (int) (plnt[4] / 30 + 1);

        if (mp0 <= mp4) {
            mp = (mp4 - mp0 + 1);
        } else {
            mp = (12 - mp0 + mp4 + 1);
        }

        if (mp == 1 || mp == 4 || mp == 7 || mp == 8 || mp == 12) {
            System.out.println(format(" mangalik        : %2s", "Yes"));
        } else {
            System.out.println(format(" mangalik        : %2s", "No"));
        }

        int i, j;
        float z1, z2, z3, z4, z5, z6, z7, z8;

        System.out.println(format(" sex     girl       |  boy          gun    max"));

        i = varnn[ra];
        j = 1;
        System.out.println(format(" varn    %-10s |  %-10s   %.1f    1.0", gun1[i], gun1[j], varn[i][j]));
        z1 = varn[i][j];

        i = vaishyaa[ra];
        j = 4;
        System.out.println(format(" vaishya %-10s |  %-10s   %.1f    2.0", gun2[i], gun2[j], vaishya[i][j]));
        z2 = z1 + vaishya[i][j];


        // tara calculations
        i = 0;
        j = 7;
        int a, b, c, d;
        b = 17;
        a = na + 1;

        if (a >= b) {
            c = (27 - a) + 1 + b;
            d = (a - b) + 1;
        } else {
            c = (b - a) + 1;
            d = (27 - b) + 1 + a;
        }

        System.out.println(format(" tara    %-10s |  %-10s   %.1f    3.0", tara10[c], tara10[d], tara[i][j]));
        z3 = z2 + tara[i][j];

        i = yonii[na];
        j = 11;
        System.out.println(format(" yoni    %-10s |  %-10s   %.1f    4.0 ", gun4[i], gun4[j], yoni[i][j]));
        z4 = z3 + yoni[i][j];

        i = ra;
        j = 1;
        System.out.println(format(" grah    %-10s |  %-10s   %.1f    5.0", gun5[i], gun5[j], grah[i][j]));
        z5 = z4 + grah[i][j];

        i = gann[na];
        j = 2;
        System.out.println(format(" gan     %-10s |  %-10s   %.1f    6.0", gun6[i], gun6[j], gan[i][j]));
        z6 = z5 + gan[i][j];

        i = ra;
        j = 8;
        System.out.println(format(" kut     %-10s |  %-10s   %.1f    7.0 ", gun7[i], gun7[j], kut[i][j]));
        z7 = z6 + kut[i][j];

        i = nadii[na];
        j = 1;
        System.out.println(format(" nadi    %-10s |  %-10s   %.1f    8.0", gun8[i], gun8[j], nadi[i][j]));
        z8 = z7 + nadi[i][j];

        System.out.println(format("                                    ___   ____"));
        System.out.println(format("                         total gun  %.1f   36.0", z8));

    }

    private static void prplnt() {

        int i, a, b, c;
        double aa, bb, mangal, mangal1;
        String pp;

        for (i = 1; i <= 12; i++) {
            aa = plnt[i];

            double numpart = aa / 30;
            int aaintpart = (int) numpart;
            double depart = numpart - aaintpart;
            double aadepart = depart * 30;

            a = (int) (aa / 30 + 1);
            b = (int) (aa * 3 / 40);
            c = (int) (4 * fract(aa * 3.0 / 40) + 1);
            bb = plnt[i + 13];
            if (bb < aa)
                pp= "Ret";
            else
                pp = "Dir";
            System.out.println(format("  %s   %-7s   %7.2f    %-11s   %d      %s", graha[i], ras[a - 1], aadepart, nak[b], c, pp));
        }
    }

    private static void saptavg()
    {
        System.out.println("");
        System.out.println("                  Saptavargas Table (in rashi)              ");
        System.out.println(" ----------------------------------------------------------------------");
        System.out.println(" Planet      Div1     Div3      Div7    Div9    Div10    Div12    Div16");
        System.out.println(" ----------------------------------------------------------------------");
        vgcomp(" Lagna   ",f2[0],0);
        vgcomp(" Sun     ",plnt[1],1);
        vgcomp(" Mercury ",plnt[2],2);
        vgcomp(" Venus   ",plnt[3],3);
        vgcomp(" Mars    ",plnt[4],4);
        vgcomp(" Jupiter ",plnt[5],5);
        vgcomp(" Saturn  ",plnt[6],6);
        vgcomp(" Moon    ",plnt[7],7);
        vgcomp(" Rahu    ",plnt[8],8);
        vgcomp(" Ketu    ",plnt[9],9);
        vgcomp(" Uranus  ",plnt[10],10);
        vgcomp(" Neptune ",plnt[11],11);
        vgcomp(" Pluto   ",plnt[12],12);
        System.out.println(" ----------------------------------------------------------------------");
        System.out.println("");

    }

    private static void vgcomp(String y1, double x0, int t) {
        int q, z, m, r, i;
        int[] j = new int[8];
        double r0;

        q = (int) (x0 / 30);
        z = q+1;
        j[1] = z - 12*(z / 12);
        r0 = 30 * fract(x0 / 30);
        if (r0 >= 0 && r0 < 10)
            m = 1;
        else if (r0 >= 10 && r0 < 20)
            m = 5;
        else
            m = 9;
        z = q + m;
        j[2] = z - 12*(z / 12);
        z = (int) (x0*7.0/30 + 1);
        j[3] = z - 12*(z/12);
        z = (int) (x0 * 9.0 /30 + 1);
        j[4] = z - 12*(z/12);
        r = (int) (10 * fract(x0 / 30));
        if (q%2 == 0)
            m = 1;
        else
            m = 9;
        z = q+r+m;
        j[5] = z - 12*(z/12);
        r = (int) (12 * fract(x0 / 30));
        z = q+r+1;
        j[6] = z - 12*(z/12);
        z = (int) (x0 * 16.0 /30 + 1);
        j[7] = z - 12*(z/12);
        for (i = 1; i <= 7; i++)
            if (j[i] == 0)
                j[i] = 12;
        System.out.print(format("%s", y1));
        for (i = 1; i <= 7; i++){
            varga[t][i-1] = j[i];
            if (i == 1)
                System.out.print ("     ");
            else
                System.out.print ("       ");
            System.out.print(format("%2d", j[i]));
        }
        System.out.println();
    }

}

