import pathlib
import unittest
from unittest.mock import patch


class TurtleInputBoxTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (
            pathlib.Path(__file__).resolve().parents[1]
            / "front-end/src/modules/pythonIdeRuntime.ts"
        ).read_text()
        methods = "    def textinput" + source.split("    def textinput", 1)[1].split(
            "    def bye", 1
        )[0]
        namespace = {}
        exec("class PromptScreen:\n" + methods, namespace)
        cls.screen = namespace["PromptScreen"]()

    def test_text_and_explicit_cancellation(self):
        with patch("builtins.input", side_effect=["Learner", ":cancel", "\\:cancel", ""]):
            self.assertEqual(self.screen.textinput("Title", "Name?"), "Learner")
            self.assertIsNone(self.screen.textinput("Title", "Cancel?"))
            self.assertEqual(self.screen.textinput("Title", "Literal?"), ":cancel")
            self.assertEqual(self.screen.textinput("Title", "Blank?"), "")

    def test_numeric_default_range_and_cancellation(self):
        with patch("builtins.input", side_effect=["4", "", "0", "6", "not a number", ":cancel"]):
            self.assertEqual(self.screen.numinput("Title", "Count?", minval=1, maxval=5), 4)
            self.assertEqual(self.screen.numinput("Title", "Count?", default=3), 3)
            for _ in range(4):
                self.assertIsNone(self.screen.numinput("Title", "Count?", minval=1, maxval=5))

    def test_exhausted_input_is_not_silently_cancelled(self):
        with patch("builtins.input", side_effect=EOFError("Input panel exhausted")):
            with self.assertRaises(EOFError):
                self.screen.textinput("Title", "Name?")


if __name__ == "__main__":
    unittest.main()
