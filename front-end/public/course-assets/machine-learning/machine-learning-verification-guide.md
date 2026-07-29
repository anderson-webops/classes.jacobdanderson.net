# Machine Learning Verification Guide

Open this guide only after recording an independent attempt. The entries describe defensible evidence, not one mandatory code listing.

## Environment and Data Card Key

A complete record names Python 3.14, scikit-learn 1.9, the other imported package versions, and whether execution used local Jupyter or VS Code. Colab is optional and should be labeled separately.

The unit of observation is one fictional garden plot after six weeks. `growth_cm` is the target; `plot_id` is an identifier and should not become a predictive feature. The source is course supplied, the data contains no people, and the intended use is learning a regression workflow—not agricultural advice. A valid run reloads 120 rows and the expected columns after restart without hidden variables.

## Evaluation Contract Key

Use a stratified held-out split and training-only cross-validation. A defensible baseline predicts according to the training distribution or the most frequent class. Macro F1 is a useful primary metric because each ticket class matters; accuracy can remain secondary.

`CountVectorizer` belongs inside a pipeline and is fitted only on training folds. The test set opens only after the metric, baseline, candidate set, preprocessing, and selection rule are frozen. A simpler model wins when its cross-validated performance is practically similar and its operational or explanatory cost is lower.

## Clustering Stability Key

The manual loop needs all three protections:

- stop when maximum centroid movement falls below a tolerance;
- stop at a maximum iteration count;
- reseed an empty centroid from a documented point, such as the point farthest from its assigned centroid.

Scale visits and spend before Euclidean clustering. Record `random_state` and explicit `n_init`. A reasonable conclusion compares stability and multiple k values without claiming that one numeric cluster label reveals a true customer identity. Silhouette score is supporting evidence, not an automatic answer.

## Distance Classification Key

Integer category codes invent order and equal spacing. One-hot encoding avoids those unsupported distances, and `handle_unknown="ignore"` gives a predictable path for a new category.

The correct sequence is raw split, training-fitted encoder inside `ColumnTransformer`, then KNN in one `Pipeline`. Tune k on training evidence. The final report compares against a dummy baseline and includes balanced accuracy, macro F1, and a confusion matrix. Any weak class must remain visible.

## Probabilistic Classification Key

`GaussianNB` is the appropriate course default for continuous Iris measurements because it models a Gaussian distribution per feature and class. The historical `MultinomialNB` Iris source is worth auditing, but not copying as the current route.

For text, split raw messages first and keep `CountVectorizer` plus `MultinomialNB` in one pipeline. No runtime stopword download is necessary. Precision, recall, F1, and the confusion matrix expose different spam/ham costs. Only fictional or redacted examples should appear in evidence.

## Interpretable Tree Key

Depth selection belongs on training-only validation evidence. An unrestricted tree commonly raises training performance while validation performance stalls or falls. Prefer the shallowest model that achieves comparable validation evidence.

The explanation should translate one or two split rules into plain language, then state that the rule reflects the supplied sample and target. Inspectability does not prove fairness, causation, or correctness outside the observed distribution.

## Regression Baseline Key

The median dummy baseline establishes whether a learned model improves typical absolute error. MAE remains in target units and is therefore a clear primary measure; RMSE or `R^2` may be secondary.

Fit preprocessing only on training data. Compare candidates on the same split. Residual slices should show whether rainy hours or a target range behave differently. An out-of-range temperature prediction is extrapolation and should be labeled unsupported even if the method returns a number.

Country-year life expectancy is aggregate data. It cannot predict one person's lifespan, and correlation among aggregate variables does not establish an intervention's causal effect.

## Neural Network Audit Key

The weighted sum is `0*1 + 1*2 + 1 = 3`; sigmoid gives approximately `0.953`. A correct transparent simulation prints each hidden value before the output.

A trained network is acceptable only with fixed seeds, stated sample and architecture bounds, early stopping, and runtime evidence. It must be compared with dummy and simpler learned baselines. If performance is not materially better, the simpler model is the stronger conclusion. The historical diabetes dataset can support a dataset/model audit only, never a diagnosis.

## Neural Regression Key

The complete offline route uses the synthetic fixture. California housing is acceptable when cached and its source is recorded. Boston Housing is optional ethics history, not the benchmark; its `B` variable encodes a racially derived assumption that scikit-learn explicitly warns against.

Fit the scaler on training data only. Select epochs from validation evidence, then evaluate once on held-out data. Report MAE, RMSE, residual slices, runtime, and the exact resource cap. Prefer the linear model when the neural model does not earn its complexity.

## Model Comparison Capstone Key

A defensible capstone includes all of the following:

1. Low-stakes source and license, unit of observation, target, intended use, and non-goals.
2. Held-out test boundary, fixed random state, and training-only preprocessing.
3. Task-appropriate dummy baseline and two justified candidate pipelines.
4. One primary and one secondary metric chosen before model selection.
5. Error slices plus confusion, residual, or stability evidence.
6. Dataset identity, environment versions, resource budget, expected/observed run, and clean restart proof.
7. Model card naming uncertainty, distribution limits, likely failures, and human review.

The presentation should say what the model may support, what it cannot establish, and what new evidence would change the choice. A strong capstone may conclude that the baseline or simpler model is preferable.
