import XCTest

final class TrackerUITests: XCTestCase {
    @MainActor
    private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
        for _ in 0..<20 {
            if element.exists && element.isHittable { return }
            app.swipeUp()
        }
        XCTAssertTrue(element.isHittable)
    }

    @MainActor
    private func replace(_ field: XCUIElement, with value: String) {
        field.tap()
        field.typeKey("a", modifierFlags: .command)
        field.typeText(XCUIKeyboardKey.delete.rawValue + value)
        if !value.isEmpty { XCTAssertEqual(field.value as? String, value) }
    }

    @MainActor
    func testTrackerWorkflow() throws {
        continueAfterFailure = false
        let reference = ROLE
        let persistence = SWIFT_DATA
        let longText = LONG_TEXT
        let app = XCUIApplication()
        app.launch()
        if OPEN_FAILURE {
            verifyUnavailableStorage(in: app)
            return
        }
        if READ_ONLY {
            verifyReadOnlyStorage(in: app, reference: reference)
            return
        }
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        if persistence { XCTAssertTrue(app.staticTexts["No items"].exists) }
        let addButton = app.buttons["Add"]
        let field = app.textFields["New tracker item"]
        XCTAssertTrue(field.isHittable)
        XCTAssertFalse(addButton.isEnabled)
        let title = longText
            ? "LONG_TITLE_BEGIN " + String(repeating: "Readable tracker titles wrap across lines. ", count: 3) + "LONG_TITLE_END"
            : "Native tracker observation"
        field.tap()
        field.typeText("  " + title + "  ")
        XCTAssertTrue(addButton.isEnabled)
        addButton.tap()
        let toggle = app.buttons["Mark " + title + " complete"]
        XCTAssertTrue(toggle.waitForExistence(timeout: 5))
        reveal(toggle, in: app)
        toggle.tap()
        XCTAssertTrue(app.buttons["Mark " + title + " incomplete"].exists)
        var savedTitle = title
        if reference {
            let edit = app.buttons["Edit " + title]
            reveal(edit, in: app)
            edit.tap()
            XCTAssertTrue(app.navigationBars["Edit item"].waitForExistence(timeout: 5))
            let editor = app.textFields["Item title"]
            XCTAssertEqual(editor.value as? String, title)
            replace(editor, with: "")
            XCTAssertFalse(app.buttons["Save"].isEnabled)
            savedTitle = title + " revised"
            editor.typeText(savedTitle)
            XCTAssertTrue(app.buttons["Save"].isEnabled)
            app.buttons["Save"].tap()
            XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 5))
            XCTAssertTrue(app.buttons["Mark " + savedTitle + " incomplete"].exists)
            let updated = app.buttons["Edit " + savedTitle]
            reveal(updated, in: app)
            updated.tap()
            XCTAssertTrue(app.navigationBars["Edit item"].waitForExistence(timeout: 5))
            replace(app.textFields["Item title"], with: "Discard this draft")
            XCTAssertTrue(app.buttons["Cancel"].isHittable)
            app.buttons["Cancel"].tap()
            XCTAssertTrue(app.buttons["Edit " + savedTitle].waitForExistence(timeout: 5))
            XCTAssertFalse(app.buttons["Edit Discard this draft"].exists)
            if persistence {
                app.terminate()
                app.launch()
                XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
                XCTAssertTrue(app.buttons["Edit " + savedTitle].waitForExistence(timeout: 5))
                XCTAssertTrue(app.buttons["Mark " + savedTitle + " incomplete"].exists)
            }
        } else {
            XCTAssertFalse(app.buttons["Edit " + title].exists)
        }
        let list = XCTAttachment(screenshot: app.screenshot())
        list.name = longText ? "Tracker long title at largest text" : "Tracker saved state"
        list.lifetime = .keepAlways
        add(list)
        if reference {
            let row = app.buttons["Edit " + savedTitle]
            reveal(row, in: app)
            row.swipeLeft()
            let delete = app.buttons["Delete"]
            if delete.waitForExistence(timeout: 2) { delete.tap() }
            XCTAssertFalse(app.buttons["Edit " + savedTitle].exists)
            if persistence { XCTAssertTrue(app.staticTexts["No items"].waitForExistence(timeout: 5)) }
        }
        app.terminate()
        app.launch()
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        XCTAssertFalse(app.buttons["Mark " + savedTitle + " incomplete"].exists)
        XCTAssertFalse(app.buttons["Edit " + savedTitle].exists)
        if persistence { XCTAssertTrue(app.staticTexts["No items"].waitForExistence(timeout: 5)) }
        let fresh = XCTAttachment(screenshot: app.screenshot())
        fresh.name = "Tracker after controlled relaunch"
        fresh.lifetime = .keepAlways
        add(fresh)
    }
}
