This is a:

<!-- Tick one category - if more than one applies, it should be split up -->

- [ ] ✨ **New feature** - new behaviour has been implemented
- [ ] 🐛 **Bug fix** - existing behaviour has been made to behave
- [ ] ♻️ **Refactor** - the behaviour has not changed, just the implementation
- [ ] ✅ **Test backfill** - tests for existing behaviour were added but the behaviour itself hasn't changed
- [ ] ⚙️ **Chore** - maintenance task, behaviour and implementation haven't changed

<!-- adapted from https://gitmoji.dev/ -->

### Description

<!-- Describe what merging this pull request will do -->

- **Purpose** - <!-- Allow astronauts to perform a case-insensitive search for their spaceship. -->

<!-- Describe how the reviewer should check it works -->

- **How to check** - <!-- Log in as an astronaut, go to the Spaceships tab and type "saturn" into the search box. Previously Saturn V would not have appeared, due to the capital S, but now it does. -->

### Links

<!-- links to other issues/PRs/tickets, e.g. user/repo#123 -->

### Author checklist

<!-- All PRs -->

- [ ] I have written a title that reflects the relevant ticket
- [ ] I have written a description that says what the PR does and how to validate it
- [ ] I have linked to the project board ticket (and any related PRs/issues) in the Links section
- [ ] I have added a link to this PR to the ticket
- [ ] I have made the PR to `staging` from a branch named `<category>/<name>`, e.g. `feature/edit-spaceships` or `bugfix/restore-oxygen`
- [ ] I have completed the manual tests [described here](https://github.com/CodeYourFuture/tech-team/wiki/Manual-Test-Procedures)
- [ ] I have requested reviewers here and in my team chat channel
<!-- depending on the task, the following may be optional -->
- [ ] I have spoken with my PM or TL about any parts of this task that may have become out-of-scope, or any additional improvements that I now realise may benefit my project
- [ ] I have added tests, or new tests were not required
- [ ] I have updated any documentation (e.g. diagrams, schemas), or documentation updates were not required
<!-- if new endpoints were introduced -->
- [ ] I have updated the Swagger API documentation in `src/swagger/routes/`
- [ ] I have explicitly tested the access rights for _at least_ unauthenticated, admin and non-admin cases

### Reviewer checklist
Remember that asking questions helps everyone understand why decisions have been made, so the next person can see too!
- **Pull request** - read the content of the PR itself (_Conversation_ tab) and consider the following questions:
    - Is the user story/ticket linked?
    - Does the description match the linked item?
    - Does the description tell you how to validate the work?
    - Does the build still work (_Checks_ tab)?
    - What approach would you take to meet this goal?
- **Code changes** - read through the changeset (_Files changed_ tab) and consider the following questions:
    - Do the code changes match the description?
    - Are there any changes that should not be part of this pull request (e.g. layout changes in files not related to the functionality)?
    - Do you understand what the changes are doing, how they meet the goal of the PR?
    - Does the approach to meeting those goals seem sensible? If it's not the one you thought of, is it significantly better or worse?
    - Is this well-structured code (consistent layout, comprehensible variable names, relatively small files)?
- **Software** - check out the PR branch, run the software and consider the following questions:
    - Does the product still start and run correctly?
    - Is the goal of the pull request met (i.e. new behaviour for a new feature, changed behaviour for a bug fix, identical behaviour for a refactor)?
    - In the parts of the product this PR touched:
        - Is the spelling, punctuation and grammar for user-facing text correct?
        - Does the layout/UI match the designs?
- **Project progress**
    - Have new tickets been created to cover any additional actions that have appeared during this review?
