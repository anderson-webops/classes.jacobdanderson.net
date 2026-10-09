import java.util.ArrayList;
import java.util.List;

// Native JDK 17+ reference. Export from the site IDE before compiling.
public class Main {
    record Score(String label, int points, List<String> tags) {
        Score {
            if (label == null || label.isBlank() || points < 0) {
                throw new IllegalArgumentException("Invalid score");
            }
            label = label.trim();
            tags = List.copyOf(tags);
        }
    }

    // A final component reference alone does not freeze a mutable list.
    record OpenBag(List<String> tags) {}

    public static void main(String[] args) {
        var original = new ArrayList<>(List.of("ready"));
        var first = new Score(" Oak ", 8, original);
        var second = new Score("Pine", 5, List.of());
        var bag = new OpenBag(original);
        original.add("changed");
        System.out.println(first.label() + ": " + first.points());
        System.out.println(second.label() + ": " + second.points());
        System.out.println("Copied tags: " + first.tags());
        System.out.println("Shared tags: " + bag.tags());
        try {
            new Score("Invalid", -1, List.of());
            throw new AssertionError("Negative score was accepted");
        } catch (IllegalArgumentException expected) {
            System.out.println("Negative score rejected");
        }
    }
}
