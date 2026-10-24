import CoreGraphics
import XCTest

final class CanonicalCourseUITests: XCTestCase {
    @MainActor
    private func button(_ title: String, in app: XCUIApplication) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label CONTAINS %@", title)).firstMatch
    }

    @MainActor
    private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
        for attempt in 0..<16 {
            if element.exists && element.isHittable { return }
            let list = app.collectionViews.firstMatch
            let scroll = list.exists ? list : app.scrollViews.firstMatch
            let viewport = scroll.exists ? scroll.frame : app.frame
            let target = element.exists ? element.frame : .zero
            let down = !target.isEmpty ? target.midY < viewport.midY : attempt >= 8
            if scroll.exists {
                let start = scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5))
                let distance = max(12, min(200, viewport.height * 0.35))
                start.press(forDuration: 0.05, thenDragTo: start.withOffset(
                    CGVector(dx: 0, dy: down ? distance : -distance)))
            } else if down {
                app.swipeDown()
            } else {
                app.swipeUp()
            }
        }
        XCTAssertTrue(element.isHittable, app.debugDescription)
    }

    @MainActor
    private func retain(_ name: String, in app: XCUIApplication) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    @MainActor
    private func gallery(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Gallery"].waitForExistence(timeout: 15))
        let photo = app.segmentedControls.buttons["Photo"]
        XCTAssertTrue(photo.isHittable)
        photo.tap()
        XCTAssertTrue(button("Sunset Poster", in: app).waitForExistence(timeout: 5))
        XCTAssertFalse(button("Studio Desk", in: app).exists)
        let workspace = app.segmentedControls.buttons["Workspace"]
        XCTAssertTrue(workspace.isHittable)
        workspace.tap()
        let desk = button("Studio Desk", in: app)
        reveal(desk, in: app)
        XCTAssertFalse(button("Sunset Poster", in: app).exists)
        retain("Filtered gallery", in: app)
        desk.tap()
        XCTAssertTrue(app.navigationBars["Studio Desk"].waitForExistence(timeout: 5))
        let detail = reference
            ? "This entry works well for discussing composition and app branding."
            : "A clean desk setup for editing and sketching."
        reveal(app.staticTexts[detail], in: app)
        if reference {
            let favorite = button("Add Favorite", in: app)
            reveal(favorite, in: app)
            favorite.tap()
            XCTAssertTrue(button("Remove Favorite", in: app).waitForExistence(timeout: 5))
        }
        retain("Gallery detail and favorite", in: app)
        app.navigationBars.buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Gallery"].waitForExistence(timeout: 5))
        if reference { XCTAssertTrue(app.staticTexts["1 favorites"].exists) }
        XCTAssertTrue(app.segmentedControls.buttons["Workspace"].isSelected)
        app.segmentedControls.buttons["All"].tap()
        reveal(button("Sunset Poster", in: app), in: app)
    }

    @MainActor
    private func hobby(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        app.tabBars.buttons["Schedule"].tap()
        XCTAssertTrue(app.navigationBars["Schedule"].waitForExistence(timeout: 5))
        reveal(app.staticTexts["Tuesday"], in: app)
        app.tabBars.buttons["Favorites"].tap()
        let empty = reference ? "No Favorites Yet" : "Favorites Coming Soon"
        XCTAssertTrue(app.staticTexts[empty].waitForExistence(timeout: 5))
        retain("Hobby empty favorites", in: app)
        app.tabBars.buttons["Home"].tap()
        if !reference { return }
        let activity = button("Photo Walk", in: app)
        reveal(activity, in: app)
        activity.tap()
        XCTAssertTrue(app.navigationBars["Photo Walk"].waitForExistence(timeout: 5))
        reveal(app.staticTexts["Scout a neighborhood and collect strong compositions."], in: app)
        let save = button("Save Favorite", in: app)
        reveal(save, in: app)
        save.tap()
        XCTAssertTrue(button("Remove Favorite", in: app).waitForExistence(timeout: 5))
        retain("Hobby saved detail", in: app)
        app.navigationBars.buttons.firstMatch.tap()
        app.tabBars.buttons["Favorites"].tap()
        XCTAssertTrue(app.staticTexts["Photo Walk"].waitForExistence(timeout: 5))
        retain("Hobby shared favorite state", in: app)
        app.terminate()
        app.launch()
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        app.tabBars.buttons["Favorites"].tap()
        XCTAssertTrue(app.staticTexts[empty].waitForExistence(timeout: 5))
    }

    @MainActor
    private func map(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Places"].waitForExistence(timeout: 15))
        let cafe = app.buttons.matching(
            NSPredicate(format: "label CONTAINS %@", "Neighborhood Cafe")).firstMatch
        reveal(cafe, in: app)
        cafe.tap()
        let detail = reference
            ? "Useful for practicing map annotations, category tags, and place metadata."
            : "TODO: Add a stronger detail card with visit notes and a callout style."
        reveal(app.staticTexts[detail], in: app)
        retain("Selected local place", in: app)
        if reference {
            let harbor = app.buttons.matching(
                NSPredicate(format: "label CONTAINS %@", "Harbor Overlook")).firstMatch
            reveal(harbor, in: app)
            harbor.tap()
            reveal(app.staticTexts["This stop works well for combining a scenic map card with a compact planning note."], in: app)
            XCTAssertFalse(app.staticTexts[detail].exists)
            retain("Changed selected place", in: app)
        }
    }

    @MainActor
    private func capstone(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        if reference {
            let task = app.switches["Prepare TestFlight build"]
            reveal(task, in: app)
            XCTAssertEqual(task.value as? String, "0")
            task.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
            let checked = NSPredicate(format: "value == %@", "1")
            expectation(for: checked, evaluatedWith: task)
            waitForExpectations(timeout: 5)
            XCTAssertEqual(task.value as? String, "1")
        } else {
            reveal(app.staticTexts["Prepare TestFlight build"], in: app)
        }
        retain("Capstone checklist", in: app)
        app.tabBars.buttons["Explore"].tap()
        XCTAssertTrue(app.navigationBars["Explore"].waitForExistence(timeout: 5))
        let explore = reference ? "Dashboard summary" : "Explore Screen Placeholder"
        reveal(app.staticTexts[explore], in: app)
        app.tabBars.buttons["Settings"].tap()
        XCTAssertTrue(app.navigationBars["Settings"].waitForExistence(timeout: 5))
        reveal(app.staticTexts[reference ? "Internal TestFlight" : "Settings Placeholder"], in: app)
        retain("Capstone informational metadata", in: app)
        app.tabBars.buttons["Home"].tap()
        if reference {
            let task = app.switches["Prepare TestFlight build"]
            reveal(task, in: app)
            XCTAssertEqual(task.value as? String, "1")
            app.terminate()
            app.launch()
            XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
            reveal(app.switches["Prepare TestFlight build"], in: app)
            XCTAssertEqual(app.switches["Prepare TestFlight build"].value as? String, "0")
        }
    }

    @MainActor
    func testCourseWorkflow() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        let reference = ROLE
        switch COURSE {
        case 0: gallery(in: app, reference: reference)
        case 1: hobby(in: app, reference: reference)
        case 2: map(in: app, reference: reference)
        case 3: capstone(in: app, reference: reference)
        default: XCTFail("Unknown pinned Swift course")
        }
    }
}
