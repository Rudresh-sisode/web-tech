/**
 * In his publication Liber Abaci Leonardo Bonacci, aka Fibonacci, posed a problem involving a population of idealized rabbits. These rabbits bred at a fixed rate, matured over the course of one month, had unlimited resources, and were immortal.

Create a function that determines the number of pairs of mature rabbits after n months, beginning with one immature pair of these idealized rabbits that produce b pairs of offspring at the end of each month.

To illustrate the problem, consider the following example:

n = 5 months
b = 3 births
-> 19 mature rabbit pairs

 */

function fib_rabbits(n, b) {
    let [mature, immature] = [0, 1];
    for (let i = 0; i < n; i++) {
      [mature, immature] = [immature + mature, mature * b];
    }
    return mature;
  }