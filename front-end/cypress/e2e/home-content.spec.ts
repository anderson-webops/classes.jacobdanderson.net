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
						window.document.documentElement.style.scrollBehavior =
							"auto";
					}
				});
				cy.contains("header button", "Log in", {
					timeout: 15000
				}).should("exist");
				cy.get(".home-subject").should("have.length", 4);
				cy.get(".home-page > section").should("have.length", 3);
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
					.first()
					.should("have.attr", "href", "/privacy");
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
					const view = document.defaultView!;
					const home = document.querySelector(".home-page")!;
					const steps = document.querySelector(
						".home-session__steps"
					)!;
					const rem = parseFloat(
						view.getComputedStyle(document.documentElement).fontSize
					);
					const margin = parseFloat(
						view.getComputedStyle(home).marginBottom
					);
					expect(margin).to.be.at.least(3 * rem);
					expect(margin).to.be.at.most(6 * rem);
					expect(document.documentElement.scrollWidth).to.be.at.most(
						viewport.width
					);
					const footer = document.querySelector("footer")!;
					const footerRow = footer
						.querySelector(".site-footer__bottom")!
						.getBoundingClientRect();
					const links = footer
						.querySelector("nav")!
						.getBoundingClientRect();
					const themeButton = footer
						.querySelector(".site-footer__theme-toggle")!
						.getBoundingClientRect();
					expect(
						Math.abs(
							(links.left + links.right) / 2 -
								(footerRow.left + footerRow.right) / 2
						)
					).to.be.lessThan(1);
					expect(
						Math.abs(themeButton.right - footerRow.right)
					).to.be.lessThan(1);
					expect(
						footer.getBoundingClientRect().top -
							steps.getBoundingClientRect().bottom
					).to.be.at.least(5 * rem);
					for (const control of footer.querySelectorAll(
						"a, button"
					)) {
						const bounds = control.getBoundingClientRect();
						expect(bounds.left).to.be.at.least(0);
						expect(bounds.right).to.be.at.most(viewport.width);
					}
				});
				cy.get("footer").screenshot(
					`footer-layout-${viewport.name}-${theme}`
				);
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
