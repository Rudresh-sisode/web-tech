package com.shubhambhvatu.kundlimatching.util;

import static com.shubhambhvatu.kundlimatching.util.CalculationUtil.b6;
import static com.shubhambhvatu.kundlimatching.util.CalculationUtil.fract;

public class Sun {
    double g0, h0, p0, e0, q0, a0;
    int pno;

    public void sun() {
        g0 = 360 * fract(0.71455 + 99.99826 * b6);
        h0 = 258.76 + 0.323 * b6;
        p0 = 0.0;
        e0 = 0.016751 - 0.000042 * b6;
        q0 = 0.0;
        a0 = 1.0;
        pno = 1;
    }
}
