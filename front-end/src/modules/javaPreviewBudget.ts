export class JavaPreviewLimitError extends Error {}

export class JavaPreviewBudget {
	private operations = 0;
	private values = 0;
	private characters = 0;
	private expressionDepth = 0;

	step() {
		this.operations += 1;
		if (this.operations > 25000) {
			throw new JavaPreviewLimitError(
				"Java/Karel preview stopped at its total execution limit. Run larger programs in a desktop IDE."
			);
		}
	}

	allocateValues(count: number) {
		if (!Number.isSafeInteger(count) || count < 0 || count > 10000) {
			throw new JavaPreviewLimitError(
				"Java preview requires a collection size between 0 and 10,000."
			);
		}
		this.values += count;
		if (this.values > 100000) {
			throw new JavaPreviewLimitError(
				"Java preview stopped at its total allocation limit."
			);
		}
	}

	allocateText(count: number) {
		if (!Number.isSafeInteger(count) || count < 0 || count > 200000) {
			throw new JavaPreviewLimitError(
				"Java preview stopped at its string size limit."
			);
		}
		this.characters += count;
		if (this.characters > 16000000) {
			throw new JavaPreviewLimitError(
				"Java preview stopped at its total text allocation limit."
			);
		}
	}

	enterExpression() {
		this.step();
		this.expressionDepth += 1;
		if (this.expressionDepth > 64) {
			throw new JavaPreviewLimitError(
				"Java preview stopped at its expression nesting limit."
			);
		}
	}

	leaveExpression() {
		this.expressionDepth -= 1;
	}
}
