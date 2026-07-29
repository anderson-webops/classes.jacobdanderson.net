# Intro to Swift App Development Verification Guide

Use this guide after the learner has preserved an independent attempt. It describes evidence to inspect, not one mandatory visual design.

## Shared module rubric

Score each dimension from 0 to 2:

| Dimension          | 0                         | 1                        | 2                                                     |
| ------------------ | ------------------------- | ------------------------ | ----------------------------------------------------- |
| Build or model     | absent                    | partial or fragile       | coherent and appropriate                              |
| Evidence           | assertion only            | some observable evidence | reproducible, labeled evidence                        |
| State and failure  | success path only         | one alternate state      | ordinary, empty, and relevant failure/recovery states |
| Explanation        | describes output          | names some mechanism     | connects ownership, API, or workflow to behavior      |
| Access and privacy | creates avoidable barrier | fallback is incomplete   | equivalent fallback and no sensitive data             |
| Reflection         | no next step              | generic next step        | bounded limitation and specific revision              |

Core readiness is 9 of 12 with no zero in evidence or access/privacy. A project may still need revision before release even when it meets module readiness.

## Mac Setup and First Launch Key

- Correct order begins with compatibility and installation, then project creation, destination selection, build, run, and evidence.
- Preview and simulator are separate processes. A stale simulator result can come from launching the wrong scheme/destination, running an older build, or editing a file outside the active target.
- Evidence names the visible text and the environment; “it worked” alone is insufficient.
- Paid membership is not part of this key.

## Xcode Project Anatomy Key

- `FirstLaunchApp.swift` contains the app entry point, `WindowGroup` supplies the scene content, and `ContentView` is the root view in the supplied trace.
- A source file without target membership is not compiled into that target.
- Asset names are exact identifiers; correcting the source reference or catalog name is narrower than changing the target or reinstalling Xcode.
- Project, target, scheme, and destination receive distinct labels.

## SwiftUI Views Layout and Modifiers Key

- The stack contains two text children; stack modifiers apply to the produced stack value.
- Padding before background expands the background's painted region around padded content. Background before padding paints behind the unpadded value and the later padding remains outside it.
- A reusable section accepts values rather than reading hidden global state.
- Adaptation evidence includes a narrow frame and large text route rather than a single screenshot.

## Swift Basics in App Context Key

- `displayName` and `interests` are immutable; `completedLessons` is mutable only if the app changes it.
- `optionalTagline` is `String?`; absence receives explicit fallback handling.
- Empty arrays produce a deliberate empty state.
- Force unwrap, arbitrary type conversion, and mutation without a product reason lose evidence credit.

## Functions Structs and Enums Key

- The item model has stable identity and groups title, detail, and status coherently.
- The status enum represents planned, active progress, and completed date without contradictory flags.
- The switch is exhaustive and each case produces an intentional visible representation.
- Model behavior can be tested without creating a SwiftUI view.

## App Structure and Lifecycle Key

- The launch trace is `@main App` → scene/`WindowGroup` → root view → reusable child.
- Model and sample data remain separate concepts even if a tiny project keeps them nearby.
- A good file boundary has a change or testing reason; more files alone do not earn credit.
- Assets remain resources referenced by stable names rather than embedded personal files.

## State and Data Flow Key

- `draftNote` belongs to the editor, and `favoriteCount` remains derived.
- Shared favorite state has one source of truth; a child receives a binding or calls an observable model boundary.
- `selectedItem` ownership follows the navigation/presentation container that controls selection.
- Observation requires an iOS 17-era deployment target; an older target can use `ObservableObject`/`@StateObject` intentionally.

## Media Maps and Permissions Key

- All images and coordinates come from the supplied fictional pack.
- Image descriptions convey useful content rather than file names.
- Static map and gallery behavior work with every permission denied.
- A permission request follows an initiated feature and includes denied, restricted, and unavailable handling; requesting permission at launch without need does not pass.

## Navigation and Multi Screen Key

- Hobbies and Favorites are peer tabs.
- Hobby detail is stack drill-down; Edit hobby is a focused sheet with Save and Cancel.
- Save commits intended changes; Cancel discards the draft; Back preserves the expected model; tab changes do not erase shared app state.
- Hidden global selected IDs and unrelated state duplication do not pass the ownership gate.

## Lists Forms and CRUD Key

- Stable IDs, not array positions or titles, identify records.
- Whitespace-only drafts fail validation.
- Add, edit, toggle, and delete affect the intended item and preserve deterministic ordering.
- Empty state offers a clear add action; destructive behavior is understandable and recoverable where practical.

## SwiftData Persistence Key

- After the first relaunch, `A1` and completed `A2` remain. After deleting `A1` and relaunching, only completed `A2` remains.
- `@Model` defines the stored model, the container configures storage, the context mutates/fetches, and `@Query` drives fetched presentation.
- Tests use an in-memory configuration.
- Renaming a stored property requires a migration/preservation decision; silently replacing the schema risks data loss.

## Networking and Data Loading Key

- Local fixture decoding is the deterministic baseline.
- HTTP 503, malformed JSON, cancellation, and empty success produce distinct state outcomes.
- Cancellation returns to a nonfailure state unless product requirements say otherwise.
- No state remains loading forever, and no secret is required.

## Debugging and Swift Testing Key

- The minimum reproduction is an all-whitespace draft producing a visible blank row.
- The narrow correction trims input and rejects an empty normalized value at the model boundary.
- Tests cover normal, padded, whitespace-only, and empty strings.
- UI keyboard, focus, layout, and form-presentation behavior remain outside the pure model test and need different evidence.

## Design and Accessibility Key

- The icon-only control gains an accurate accessible name.
- Completion uses text, symbol, or shape in addition to color.
- Text supports Dynamic Type and wrapping; reading order follows task order.
- Delete gains confirmation or undo where appropriate.
- A single pass supports an improvement claim, not universal accessibility compliance.

## Simulator and Device Validation Key

- Supported claims: both simulators launch, core task passes on the large profile except title adaptation, and the static permission fallback works.
- Unsupported claims: device performance, real-device permissions, hardware behavior, and device launch.
- The clipping defect is a layout/Dynamic Type investigation, not evidence that all devices fail.
- The smoke record names destination and configuration.

## Apple Development and Distribution Map Key

- Xcode simulator work is the complete free core.
- A free Apple Account can support personal-device testing subject to Apple's current conditions.
- TestFlight and App Store distribution require enrolled-team and role access.
- App Store Connect manages records, builds, testers, metadata, privacy, and submission state; it is not the compiler.

## Signing Teams and Bundle IDs Key

- Case 1 is an app identifier/profile mismatch.
- Case 2 is a capability/entitlement configuration mismatch.
- Case 3 is a role/authorization boundary, not a coding defect.
- Case 4 requires archive/distribution-signing evidence even though simulator execution passed.
- No correction asks a learner to transmit credentials or private signing material.

## App Store Connect and TestFlight Key

- Correct flow includes upload and processing before tester assignment.
- Internal and external testers have different role/review conditions; the first external build may require beta review.
- Test information and feedback route are part of the release packet.
- A TestFlight build has a limited testing lifetime; the current first-party reference governs the exact operational value.

## Capstone Build and User Testing Key

Twenty-four-point capstone rubric:

| Area                                           | Points |
| ---------------------------------------------- | -----: |
| Scope and primary flow                         |      4 |
| Model ownership and architecture               |      4 |
| Ordinary, empty, and failure/recovery behavior |      4 |
| Test and simulator evidence                    |      4 |
| Accessibility and privacy                      |      4 |
| Explanation, limitations, and revision         |      4 |

Readiness is 18 of 24, no zero-point area, and a complete primary flow. Extra features cannot compensate for a broken core task or unsafe data practice.

## Final Publishing Walkthrough Key

- The supplied packet receives a hold decision.
- Screenshots and description must match build 8, or the intended feature must return in a newly validated build.
- Privacy answers account for third-party SDK behavior and remain accurate.
- Reviewer notes explain sample-data mode and any access needed.
- Placeholder, privacy, crash, access, or metadata blockers remain release blockers.

## Shapes and Legacy Reference Key

- Shape points derive from the supplied `rect` dimensions and scale across square, wide, and narrow frames.
- A reduced-motion or static representation preserves meaning.
- Transferable concepts can include coordinate reasoning, path segments, composition, and parameterization.
- Fixed screen coordinates, obsolete APIs, and old project ordering remain legacy details rather than required practice.
