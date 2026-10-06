/// <reference types="cypress" />

// Observe the parsed static header and every client update, not just the final
// hydrated page. All identities and API responses here are synthetic.
context("Session navigation without guest flashes", () => {
	for (const role of ["Admin", "Tutor", "User", "CourseLearner"] as const) {
		it(`keeps ${role} navigation honest across a fresh IDE document`, () => {
			const observed: string[] = [];
			let documents = 0;
			cy.on("window:before:load", win => {
				documents += 1;
				new win.MutationObserver(() => {
					const nav = win.document.querySelector(".site-nav");
					if (nav) observed.push(nav.textContent ?? "");
				}).observe(win.document, {
					childList: true,
					subtree: true,
					characterData: true
				});
			});
			const accountRole =
				role === "CourseLearner" ? null : role.toLowerCase();
			cy.intercept("GET", "**/api/accounts/me", {
				delay: 350,
				body: accountRole ? { [`${accountRole}ID`]: "synthetic-1" } : {}
			}).as("session");
			cy.intercept("GET", "**/api/accounts/oauth/providers", {
				body: { google: false, apple: false }
			});
			cy.intercept(
				"GET",
				accountRole
					? `**/api/${accountRole}s/loggedin`
					: "**/api/course-access/me",
				{
					delay: 350,
					body: {
						[`current${role}`]: {
							_id: "synthetic-1",
							name: "Synthetic learner",
							username: "Synthetic learner",
							courseAccess: [],
							courseStatus: {},
							courseProgress: [],
							coursePermissions: [],
							tutors: []
						}
					}
				}
			).as("identity");
			cy.viewport(1440, 900);
			cy.visit("/courses");
			cy.wait(["@session", "@identity"]);
			const accountLabel =
				role === "CourseLearner" ? "Classroom" : "Account";
			cy.get(".site-account-menu summary").should(
				"contain.text",
				accountLabel
			);
			cy.get(".site-nav").contains("a:visible", /^IDE$/).click();
			cy.location("pathname").should("match", /^\/ide\/?$/);
			cy.wait(["@session", "@identity"]);
			cy.get(".site-account-menu summary").should(
				"contain.text",
				accountLabel
			);
			cy.then(() => {
				expect(observed.length).to.be.greaterThan(0);
				expect(documents).to.be.at.least(2);
				for (const text of observed) {
					expect(text).not.to.match(/Log in|About/);
					if (role === "Admin")
						expect(text).not.to.contain("Book a Class");
				}
			});
			cy.intercept("DELETE", "**/api/accounts/logout", { body: {} });
			cy.get(".site-account-menu summary").click();
			cy.get(".site-nav").contains("button", "Log out").click();
			cy.get(".site-nav")
				.contains("button", "Log in")
				.should("be.visible");
		});
	}

	it("renders guest controls after an anonymous or unavailable session resolves", () => {
		cy.viewport(1440, 900);
		cy.intercept("GET", "**/api/accounts/me", {
			delay: 350,
			statusCode: 503,
			body: {}
		});
		cy.visit("/courses");
		cy.get(".site-nav").contains("button", "Log in").should("be.visible");
		cy.get(".site-nav").contains("a", "About").should("be.visible");
	});
});
