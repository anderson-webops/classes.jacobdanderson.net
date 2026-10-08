const viewports = [
	{ width: 320, height: 780, name: "small-phone" },
	{ width: 768, height: 1024, name: "tablet" },
	{ width: 1440, height: 900, name: "desktop" }
];

context("Useful homepage and single compact footer", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/api/**", { body: {} });
		cy.intercept("POST", "**/api/**", { statusCode: 403, body: {} });
	});

	for (const viewport of viewports) {
		for (const theme of ["light", "dark"]) {
			it(`keeps useful content and footer visible at ${viewport.name} in ${theme} mode`, () => {
				cy.viewport(viewport.width, viewport.height);
				cy.visit("/", {
					onBeforeLoad(window) {
						window.localStorage.setItem(
							"vueuse-color-scheme",
							theme
						);
					}
				});
				cy.contains("header button", "Log in", {
					timeout: 15000
				}).should("exist");
				cy.get(".home-subject").should("have.length", 4);
				cy.get(".home-session__steps > li").should("have.length", 3);
				cy.get('.home-page a[href="/pathways"]')
					.should("have.length", 1)
					.and("be.visible");
				cy.get(".home-page details, .home-page button").should(
					"not.exist"
				);
				cy.get("footer").should("have.length", 1).scrollIntoView();
				cy.get("footer h2, footer h3, .site-footer__inner").should(
					"not.exist"
				);
				cy.get("footer nav a")
					.last()
					.should("have.attr", "href")
					.and("match", /^mailto:/);
				cy.get("footer").then(footer => {
					expect(
						footer[0].getBoundingClientRect().height
					).to.be.lessThan(viewport.width > 700 ? 100 : 160);
				});
				cy.document().then(document => {
					expect(document.documentElement.scrollWidth).to.be.at.most(
						viewport.width
					);
					const footer = document.querySelector("footer")!;
					for (const control of footer.querySelectorAll(
						"a, button"
					)) {
						const bounds = control.getBoundingClientRect();
						expect(bounds.left).to.be.at.least(0);
						expect(bounds.right).to.be.at.most(viewport.width);
					}
				});
				cy.get(".site-footer__theme-toggle")
					.should(
						"have.attr",
						"aria-pressed",
						String(theme === "dark")
					)
					.click();
				cy.get(".site-footer__theme-toggle").should(
					"have.attr",
					"aria-pressed",
					String(theme !== "dark")
				);
			});
		}
	}
});
