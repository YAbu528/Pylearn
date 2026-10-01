/* PyLearn Python worker
   Pyodide runs here so Python code cannot block the main page.
   The worker is intentionally a tiny bridge: the lesson UI stays in script.js. */
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

let pyodide = null;

function send(type, payload={}) {
  self.postMessage({type, ...payload});
}

async function init() {
  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/"
    });
    send("ready");
  } catch (error) {
    send("error", {error: String(error)});
  }
}

function inputPrelude(inputs) {
  const safe = JSON.stringify(Array.isArray(inputs) ? inputs : []);
  return `
import builtins as _pylearn_builtins
_pylearn_inputs = ${safe}
_pylearn_index = 0

def _pylearn_input(prompt=""):
    global _pylearn_index
    if _pylearn_index >= len(_pylearn_inputs):
        raise EOFError("No more input lines. Add one line in Program Input for each input() call.")
    value = str(_pylearn_inputs[_pylearn_index])
    _pylearn_index += 1
    if prompt:
        print(prompt, end="")
    print(value)
    return value

_pylearn_builtins.input = _pylearn_input
`;
}

async function runCode(code, inputs) {
  let output = "";
  pyodide.setStdout({batched: text => {
    output += String(text);
    send("stdout", {text: String(text)});
  }});
  pyodide.setStderr({batched: text => {
    output += String(text);
    send("stdout", {text: String(text)});
  }});

  const wrapped = `${inputPrelude(inputs)}\n_pylearn_ns = {"__name__":"__main__"}\nexec(compile(${JSON.stringify(String(code))}, "<playground>", "exec"), _pylearn_ns)`;
  const result = await pyodide.runPythonAsync(wrapped);
  if (result !== undefined && result !== null) output += String(result) + "\n";
  return output;
}

const validators = [
  `valid = isinstance(ns.get("name"), str) and bool(ns.get("name", "").strip()) and f"hello, {ns['name']}".lower() in output.lower()`,
  `valid = isinstance(ns.get("name"), str) and isinstance(ns.get("age"), int) and isinstance(ns.get("height"), (int, float)) and all(str(v) in output for v in [ns.get("name"), ns.get("age"), ns.get("height")])`,
  `valid = ns.get("age") == 15 and "16" in output`,
  `valid = ns.get("score") == 65 and "passed" in output.lower()`,
  `valid = output_lines == ["1", "2", "3", "4", "5"]`,
  `valid = callable(ns.get("double")) and ns["double"](6) == 12 and "12" in output`,
  `valid = ns.get("numbers") == [2, 4, 6] and "12" in output`,
  `valid = ("7.0" in output or "7" in output) and "math" in ns and abs(ns["math"].sqrt(49) - 7) < 1e-9`,
  `valid = isinstance(ns.get("name"), str) and ns.get("name") == "Alex" and "Alex" in output`,
  `valid = isinstance(ns.get("values"), set) and ns.get("values") == {1, 2, 3}`,
  `valid = ns.get("squares") == [1, 4, 9, 16, 25] and "1" in output and "25" in output`,
  `valid = "note.txt" in __import__("os").listdir() and open("note.txt").read() == "Hello Python"`,
  `valid = isinstance(ns.get("Person"), type) and hasattr(ns.get("Person"), "__init__") and hasattr(ns.get("person"), "name") and ns["person"].name == "Alex" and "Alex" in output`,
  `valid = ns.get("data", {}).get("score") == 95 and "95" in output and "json" in ns`
];

async function check(code, validatorIndex) {
  const validator = validators[Number(validatorIndex)] || "valid = True";
  const py = `
import io, contextlib, json
_buf = io.StringIO()
ns = {"__name__":"__main__"}
try:
    with contextlib.redirect_stdout(_buf):
        exec(compile(${JSON.stringify(String(code))}, "<challenge>", "exec"), ns)
    output = _buf.getvalue().strip()
    output_lines = [line.strip() for line in output.splitlines() if line.strip()]
    ${validator}
    result = {"ok": bool(valid), "output": output}
except Exception as e:
    result = {"ok": False, "output": "ERROR: " + str(e)}
json.dumps(result)
`;
  return JSON.parse(String(await pyodide.runPythonAsync(py)));
}

self.onmessage = async event => {
  const m = event.data || {};
  if (m.type === "init") return init();
  if (!pyodide) return send("error", {error: "Python engine is not ready."});
  try {
    if (m.type === "run") {
      const output = await runCode(m.code || "", m.inputs || []);
      send("run-result", {output});
    } else if (m.type === "check") {
      const result = await check(m.code || "", m.validatorIndex);
      send("check-result", {result});
    }
  } catch (error) {
    send(m.type === "check" ? "check-result" : "run-error", {
      ...(m.type === "check" ? {result:{ok:false, output:"ERROR: "+String(error)}} : {error:String(error)})
    });
  }
};
