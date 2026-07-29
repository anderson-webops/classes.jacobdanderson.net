# Machine Learning Practice Pack

Use these supplied, fictional, and low-stakes cases when a remote dataset, notebook host, account, or accelerator is unavailable. Record your own decisions before opening the verification guide. Unless a case says otherwise, use `random_state=42`, keep the final test set closed during model selection, and fit learned preprocessing on training data only.

## Environment and Data Card Case

You receive `garden_growth.csv`, a fictional 120-row table with:

- `plot_id`: stable row identifier
- `sun_hours`: numeric hours per day
- `water_liters`: numeric weekly amount
- `soil_type`: `clay`, `loam`, or `sand`
- `growth_cm`: numeric target measured after six weeks

Create an environment record with Python, scikit-learn, pandas, NumPy, and notebook versions. Write a data-and-problem card naming the unit of observation, target, prediction-time features, source, license assumption, intended classroom use, non-goals, missing-value check, likely leakage, and privacy boundary.

Then:

1. Load the fixture description into a small local DataFrame or create equivalent synthetic rows.
2. Reserve 20% as a held-out test set.
3. Restart the kernel or process.
4. Rerun from the first cell without relying on hidden state.
5. Record expected and observed row counts and columns.

Do not train a model yet.

## Evaluation Contract Case

A fictional support desk has 240 supplied ticket summaries labeled `question`, `bug`, or `request`. The classes occur in a 120/80/40 ratio.

Before training, write:

- the unit of observation and target;
- a stratified train/test split and validation or cross-validation plan;
- a `DummyClassifier` strategy;
- one primary and one secondary metric;
- the exact point where vectorization is fitted;
- two error slices, such as short versus long messages and messages containing an error code;
- the rule for preferring a simpler model;
- the condition that permits opening the test set.

Explain why raw accuracy could hide weak performance on `request`, and why fitting a vectorizer before the split would leak vocabulary information.

## Clustering Stability Case

Use these eight fictional shop points:

| ID | visits | spend |
| --- | ---: | ---: |
| A | 1 | 12 |
| B | 2 | 15 |
| C | 2 | 18 |
| D | 8 | 78 |
| E | 9 | 82 |
| F | 10 | 76 |
| G | 5 | 43 |
| H | 5 | 47 |

First, trace one assignment and centroid-update iteration by hand for `k=3`. Then inspect a supplied manual-loop design with three defects: exact floating-point equality as the only stop rule, no maximum iteration count, and division by zero when a cluster becomes empty.

Write repairs using a tolerance, maximum iteration count, and explicit empty-cluster reseeding rule. Compare standardized `KMeans` runs for `k=2`, `k=3`, and `k=4` across at least three seeds. Record `n_init`, inertia, silhouette score when valid, and whether assignments remain stable. Do not name a cluster as a fact about a person.

## Distance Classification Case

A fictional product dataset contains:

- `material`: `paper`, `plastic`, `metal`
- `size`: `small`, `medium`, `large`
- `fragile`: `yes`, `no`
- `shipping_class`: `standard`, `careful`, `special`

Compare two proposals:

1. Map each category to `0`, `1`, or `2`, then calculate Euclidean distance.
2. Split raw rows first, then use `OneHotEncoder(handle_unknown="ignore")` and `KNeighborsClassifier` in a `Pipeline`.

Explain which proposal invents unsupported ordering and spacing. Build the second design with stratification, compare at least two values of `k` using training evidence, and evaluate it against `DummyClassifier`. Report balanced accuracy, macro F1, and a confusion matrix. Test one row containing an unseen material and record the result.

## Probabilistic Classification Case

Complete two related tasks:

### Continuous measurements

Use four continuous flower measurements and species labels. Explain why `GaussianNB` matches continuous feature distributions better than `MultinomialNB`. Compare with a stratified dummy baseline and report accuracy, macro F1, and a confusion matrix.

### Fictional text

Use twelve supplied-style messages such as “meeting moved to three,” “claim fictional prize now,” and “project notes attached.” Split raw text before fitting `CountVectorizer`. Place vectorization and `MultinomialNB` in one pipeline. Do not download stopword lists during the run.

Report precision, recall, F1, and a confusion matrix. Inspect only fictional messages. Name one failure caused by word independence or unseen vocabulary and explain why the result is not a production spam filter.

## Interpretable Tree Case

A fictional greenhouse table contains temperature band, humidity band, soil type, and a label indicating whether a supplied plant needed extra water.

Fit `DecisionTreeClassifier` candidates with maximum depths 1, 2, 3, and unrestricted. Use training-only cross-validation or a validation split to choose depth, then evaluate once on the held-out test set. Compare with `DummyClassifier`.

Produce:

- a depth-versus-training/validation table;
- a readable shallow tree or written rule trace;
- primary and secondary metrics;
- one error slice by soil type;
- one reason not to grow the tree further;
- one statement explaining why an interpretable rule is not automatically correct, fair, or causal.

## Regression Baseline Case

Use a fictional bicycle-rental table with temperature, rain flag, weekday flag, and hourly rental count.

Before fitting:

- name the unit of observation and target;
- reserve the held-out test set;
- choose MAE as the primary metric;
- fit `DummyRegressor(strategy="median")`.

Compare linear regression with one justified nonlinear candidate on the same split. Keep encoding or scaling inside pipelines. Plot or tabulate residuals for rainy and dry hours. Test one extrapolation outside the training temperature range and explain why it is unsupported.

Optional audit: describe how a country-year life-expectancy table differs from individual-level data and why aggregate association is not an individual or causal conclusion.

## Neural Network Audit Case

Trace this neuron by hand:

- inputs: `x1=0`, `x2=1`
- weights: `w1=1`, `w2=2`
- bias: `1`
- activation: sigmoid

Record the weighted sum and output. Then trace a two-neuron hidden layer and one output neuron using supplied small numeric weights. Verify the same intermediate values in transparent Python code.

For an optional trained comparison, use only a supplied low-stakes binary fixture. Set:

- fixed seeds;
- at most 500 rows;
- at most two hidden layers;
- at most 30 epochs;
- an explicit batch size;
- early stopping;
- a local CPU-time budget.

Compare against a dummy and logistic-regression baseline. Record precision, recall, F1, confusion matrix, runtime, two error slices, and whether the network earned its complexity. Do not make a health or individual-risk claim.

## Neural Regression Case

Use a supplied synthetic housing table, or scikit-learn California housing only when already cached locally. Do not require a network download.

Compare:

1. `DummyRegressor`;
2. a linear-regression pipeline;
3. a small neural-network regressor.

Reserve the test set before fitting a scaler. Fix seeds and cap rows, layers, epochs, batch size, and CPU time. Select the stopping point using validation evidence only.

Report held-out MAE and RMSE, a residual plot or table, and error slices by target range and one geographic or synthetic region field. Explain whether the network materially improves the result and why the output is an educational estimate rather than an appraisal.

Optional legacy audit: identify the ethically problematic `B` variable in the historical Boston Housing dataset and explain why that dataset is not the required benchmark.

## Model Comparison Capstone Case

Choose one supplied low-stakes route:

- fictional support-ticket classification;
- plant-species classification;
- synthetic bicycle-demand or energy-use regression;
- non-personal clustering with a stability question.

Freeze a one-page problem card before modeling. It must include source and license, unit of observation, target or clustering goal, prediction-time features, intended use, non-goals, sensitive fields, likely leakage, sampling limits, and a resource budget.

Build a dummy baseline and two candidate pipelines. Use one fixed split or cross-validation plan, one primary and one secondary metric, and at least two meaningful error slices. Open the held-out test set once after selection.

Submit:

- environment and dataset identity;
- expected and observed run record;
- baseline and candidate comparison;
- confusion, residual, or stability evidence;
- resource use;
- model card;
- known limitations and human-review boundary;
- restart-and-rerun proof;
- a three-minute presentation outline.

Do not use the capstone for medical, financial, employment, discipline, admissions, identity, biometric, surveillance, or other consequential decisions.
