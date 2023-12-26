 import java.util.*;

public class NearestSmallestValues {
    public static int[] nearestSmallestValues(int[] arr) {
        Stack<Integer> stack = new Stack<>();
        int[] result = new int[arr.length];

        for (int i = 0; i < arr.length; i++) {
            while (!stack.empty() && stack.peek() >= arr[i]) {
                stack.pop();
            }

            if (stack.empty()) {
                result[i] = -1;
            } else {
                result[i] = stack.peek();
            }

            stack.push(arr[i]);
        }
        return result;
    }
    public static void main(String[] args) {
        int[] arr = {5, 3, 1, 9, 7, 3, 4, 1};
        int[] result = nearestSmallestValues(arr);
        System.out.println(Arrays.toString(result)); // Output: [-1, -1, -1, 1, 1, 1, 3, 1]
    }
}